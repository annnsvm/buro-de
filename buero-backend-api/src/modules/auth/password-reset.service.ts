import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { createHash, randomInt } from "crypto";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { buildPasswordResetEmail } from "./auth-email.templates";

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
   * Asks for a code, and says the same thing whether or not the address has an account.
   *
   * Answering "no such user" would turn this endpoint into a way of finding out who has
   * bought the course - type an address, read the answer. So the reply never varies, and
   * the work that differs happens silently: an address we know gets an email, an address
   * we do not gets nothing at all.
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
      return { status: "code_sent" };
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
       * Too soon, and still the same answer. Saying "wait a minute" here would tell a
       * stranger that the address is real, which is the one thing this endpoint must not
       * do - and the person who really asked twice has the first code in their inbox.
       */
      return { status: "code_sent" };
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
   * Every refusal here reads the same - "invalid or expired" - whatever actually went
   * wrong. Telling a stranger that the code was right but the address has no account, or
   * that the code has expired rather than never existed, is the same leak the request
   * endpoint is careful to avoid.
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
    const refuse = () =>
      new BadRequestException("Невірний або прострочений код");

    const pending = await this.prisma.passwordReset.findUnique({
      where: { email: address },
    });
    if (!pending) throw refuse();

    if (pending.expiresAt.getTime() < Date.now()) {
      await this.prisma.passwordReset.delete({ where: { email: address } });
      throw refuse();
    }

    if (pending.attempts >= MAX_ATTEMPTS) {
      await this.prisma.passwordReset.delete({ where: { email: address } });
      throw refuse();
    }

    if (pending.codeHash !== this.hashCode(code)) {
      await this.prisma.passwordReset.update({
        where: { email: address },
        data: { attempts: { increment: 1 } },
      });
      throw refuse();
    }

    const user = await this.prisma.user.findFirst({
      where: { email: address, deletedAt: null },
      select: { id: true },
    });
    /** The account went away between asking and answering. Still the same refusal. */
    if (!user) {
      await this.prisma.passwordReset.delete({ where: { email: address } });
      throw refuse();
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
