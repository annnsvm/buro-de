import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { createHash, randomInt } from "crypto";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { buildPasswordResetEmail } from "./auth-email.templates";
import { AUTH_ERROR, badRequest, notFound } from "./auth-error-codes";

const SALT_ROUNDS = 10;
const CODE_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

/**
 * Getting back into an account after forgetting the password.
 *
 * Until this existed there was no way back at all: a student who had paid for a course and
 * mistyped their password into a password manager could only be let in by hand, from the
 * database. For a paid product that is the first thing to break and the worst thing to
 * explain.
 *
 * Built from the registration flow rather than beside it - a six-digit code, hashed, good
 * for fifteen minutes, five guesses - because the student has already met that flow once
 * and should not have to learn a second one to get back in.
 */
@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  private hashCode(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }

  private generateCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  private emailLocale(locale?: string): "uk" | "en" {
    return locale === "uk" ? "uk" : "en";
  }

  private normalise(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Asks for a code, and says plainly when there is nobody to send one to.
   *
   * This used to answer "code sent" whichever way it went, so that the endpoint could not
   * be used to find out who had bought the course. That protected nothing: `POST
   * /auth/register` answers 409 "User with this email already exists" for exactly the same
   * question, openly, and has from the start. The secrecy here only ever cost the one
   * person it was not aimed at - someone who mistyped their address, or signed up with a
   * different one, and was told a code was on its way to an inbox that would never get it.
   *
   * So the two endpoints now agree, and the student is told which of the two things is
   * true. What keeps this from becoming a cannon is the rate limit on the route (3 a
   * minute), not a vague answer.
   *
   * The cooldown is kept on the row rather than per address in memory, so restarting the
   * server does not hand anyone a fresh allowance of emails.
   */
  async request(
    email: string,
    locale?: string,
  ): Promise<{ status: "code_sent" }> {
    const address = this.normalise(email);

    const user = await this.prisma.user.findFirst({
      where: { email: address, deletedAt: null },
      select: { name: true },
    });

    if (!user) {
      this.logger.log(`Password reset asked for an unknown address`);
      throw notFound(
        AUTH_ERROR.accountNotFound,
        "No account uses this email address",
      );
    }

    const existing = await this.prisma.passwordReset.findUnique({
      where: { email: address },
      select: { updatedAt: true },
    });
    if (
      existing &&
      Date.now() - existing.updatedAt.getTime() < RESEND_COOLDOWN_MS
    ) {
      /**
       * Too soon. This also used to answer "code sent", which left the student pressing a
       * button that did nothing and watching an inbox that already had the answer in it.
       * Now it says so, and the screen can point at the code that is already there.
       */
      throw badRequest(
        AUTH_ERROR.codeTooSoon,
        "A code was sent less than a minute ago",
      );
    }

    const code = this.generateCode();
    const data = {
      codeHash: this.hashCode(code),
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
      attempts: 0,
    };
    await this.prisma.passwordReset.upsert({
      where: { email: address },
      create: { email: address, ...data },
      update: data,
    });

    const { logoUrl } = this.mailer.resolveLogo();
    const mail = buildPasswordResetEmail({
      name: user.name,
      code,
      locale: this.emailLocale(locale),
      logoUrl,
      siteUrl: this.mailer.getSiteUrl(),
    });
    await this.mailer.send({
      to: address,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    return { status: "code_sent" };
  }

  /**
   * Sets the new password, and only then throws the code away.
   *
   * Every refusal here used to read the same - "invalid or expired" - whatever had gone
   * wrong, so a code that had sat too long and a code with a typo in it were impossible to
   * tell apart. The two need different things done about them: one wants the button that
   * asks for a new code, the other wants the digits read again. Each refusal now names
   * itself, and the screen can say which.
   *
   * The wrong-guess count lives next to the code because six digits is a small space: five
   * tries against a fifteen-minute window is the same ceiling registration uses.
   */
  async reset(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ status: "password_changed" }> {
    const address = this.normalise(email);

    const pending = await this.prisma.passwordReset.findUnique({
      where: { email: address },
    });
    if (!pending) {
      throw badRequest(
        AUTH_ERROR.codeNotRequested,
        "No reset code was issued for this address",
      );
    }

    if (pending.expiresAt.getTime() < Date.now()) {
      await this.prisma.passwordReset.delete({ where: { email: address } });
      throw badRequest(AUTH_ERROR.codeExpired, "The reset code has expired");
    }

    if (pending.attempts >= MAX_ATTEMPTS) {
      await this.prisma.passwordReset.delete({ where: { email: address } });
      throw badRequest(
        AUTH_ERROR.codeAttemptsSpent,
        "Too many wrong guesses - the code is spent",
      );
    }

    if (pending.codeHash !== this.hashCode(code)) {
      await this.prisma.passwordReset.update({
        where: { email: address },
        data: { attempts: { increment: 1 } },
      });
      throw badRequest(AUTH_ERROR.codeWrong, "The reset code does not match");
    }

    const user = await this.prisma.user.findFirst({
      where: { email: address, deletedAt: null },
      select: { id: true },
    });
    /** The account went away between asking and answering. */
    if (!user) {
      await this.prisma.passwordReset.delete({ where: { email: address } });
      throw notFound(
        AUTH_ERROR.accountNotFound,
        "No account uses this email address",
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      /**
       * And every session with it.
       *
       * Someone resetting a password may be doing it because another person has their
       * account. Leaving that person's refresh token alive would hand the account back to
       * them the moment the new password was set.
       */
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      /** One code, one use. */
      this.prisma.passwordReset.delete({ where: { email: address } }),
    ]);

    this.logger.log(`Password reset completed for user ${user.id}`);
    return { status: "password_changed" };
  }
}
