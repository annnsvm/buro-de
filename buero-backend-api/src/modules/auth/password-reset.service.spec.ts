import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { createHash } from "crypto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { PasswordResetService } from "./password-reset.service";

/**
 * Getting back into an account after forgetting the password.
 *
 * Two things are being tested. One is that a student who asks for a code can use it. The
 * other is that each way this can fail says which way it was: for a long time every
 * refusal here answered with one sentence, on the theory that a frank "no such user" would
 * turn the endpoint into a way of learning who had paid. It would not - `POST
 * /auth/register` answers that question openly with a 409 - and the silence fell entirely
 * on the student who had mistyped their address and was told a code was on its way.
 */

/** The machine-readable name on a coded failure, which is what the client branches on. */
const codeOf = (error: unknown): string | undefined => {
  if (!(error instanceof HttpException)) return undefined;
  const body = error.getResponse();
  return typeof body === "object" && body !== null
    ? (body as { code?: string }).code
    : undefined;
};
const EMAIL = "anna@example.com";
const CODE = "482915";
const NEW_PASSWORD = "NewSecure2";

describe("PasswordResetService", () => {
  let service: PasswordResetService;
  let prisma: {
    user: { findFirst: jest.Mock; update: jest.Mock };
    passwordReset: {
      findUnique: jest.Mock;
      upsert: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    refreshToken: { updateMany: jest.Mock };
    $transaction: jest.Mock;
  };
  let mailer: { send: jest.Mock; resolveLogo: jest.Mock; getSiteUrl: jest.Mock };

  const hashOf = (code: string) =>
    createHash("sha256").update(code).digest("hex");

  const pending = (over: Record<string, unknown> = {}) => ({
    id: "reset-1",
    email: EMAIL,
    codeHash: hashOf(CODE),
    expiresAt: new Date(Date.now() + 10 * 60_000),
    attempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 5 * 60_000),
    ...over,
  });

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn().mockResolvedValue({ id: "u1", name: "Anna" }),
        update: jest.fn(),
      },
      passwordReset: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      refreshToken: { updateMany: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([]),
    };
    mailer = {
      send: jest.fn().mockResolvedValue(undefined),
      resolveLogo: jest.fn().mockReturnValue({ logoUrl: "https://x/logo.png" }),
      getSiteUrl: jest.fn().mockReturnValue("https://buero.de"),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: MailerService, useValue: mailer as unknown as MailerService },
      ],
    }).compile();
    service = mod.get(PasswordResetService);
  });

  describe("asking for a code", () => {
    it("sends one to an address that has an account", async () => {
      await expect(service.request(EMAIL)).resolves.toEqual({ status: "code_sent" });

      expect(mailer.send).toHaveBeenCalledTimes(1);
      expect(mailer.send.mock.calls[0][0].to).toBe(EMAIL);
    });

    /**
     * The case that used to answer "code sent" and send nothing, leaving the student
     * watching an inbox that would never get anything. It names itself now, so the screen
     * can offer the one thing that helps: signing up.
     */
    it("says there is no account, and still sends nothing", async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.request(EMAIL)).rejects.toBeInstanceOf(NotFoundException);
      expect(mailer.send).not.toHaveBeenCalled();
      expect(prisma.passwordReset.upsert).not.toHaveBeenCalled();
    });

    it("names that failure ACCOUNT_NOT_FOUND", async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      const error = await service.request(EMAIL).catch((e: unknown) => e);
      expect(codeOf(error)).toBe("ACCOUNT_NOT_FOUND");
    });

    it("stores only the hash of the code, never the code", async () => {
      await service.request(EMAIL);

      const written = prisma.passwordReset.upsert.mock.calls[0][0];
      const sent = (mailer.send.mock.calls[0][0].text as string).match(/\d{6}/)?.[0];
      expect(sent).toMatch(/^\d{6}$/);
      expect(written.create.codeHash).toBe(hashOf(sent as string));
      expect(JSON.stringify(written)).not.toContain(sent as string);
    });

    /**
     * A second ask within the minute still sends nothing - but saying "code sent" to it
     * left the student pressing a button that did nothing, when the answer was already in
     * their inbox. Now it says which.
     */
    it("refuses a second ask inside the minute, and says why", async () => {
      prisma.passwordReset.findUnique.mockResolvedValue(
        pending({ updatedAt: new Date() }),
      );

      const error = await service.request(EMAIL).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(codeOf(error)).toBe("CODE_TOO_SOON");
      expect(mailer.send).not.toHaveBeenCalled();
    });

    it("treats the address the way the login does, whatever the typing", async () => {
      await service.request("  Anna@Example.COM  ");

      expect(prisma.user.findFirst.mock.calls[0][0].where.email).toBe(EMAIL);
    });
  });

  describe("using the code", () => {
    beforeEach(() => {
      prisma.passwordReset.findUnique.mockResolvedValue(pending());
    });

    it("sets the new password", async () => {
      await expect(service.reset(EMAIL, CODE, NEW_PASSWORD)).resolves.toEqual({
        status: "password_changed",
      });

      const update = prisma.user.update.mock.calls[0][0];
      expect(update.where).toEqual({ id: "u1" });
      await expect(
        bcrypt.compare(NEW_PASSWORD, update.data.passwordHash as string),
      ).resolves.toBe(true);
    });

    /**
     * Someone resetting a password may be doing it because another person has their
     * account. Leaving that person's session alive hands the account straight back.
     */
    it("revokes every session the account had", async () => {
      await service.reset(EMAIL, CODE, NEW_PASSWORD);

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: "u1", revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it("spends the code, so it cannot be used twice", async () => {
      await service.reset(EMAIL, CODE, NEW_PASSWORD);

      expect(prisma.passwordReset.delete).toHaveBeenCalledWith({
        where: { email: EMAIL },
      });
    });

    it("changes the password and the sessions together or not at all", async () => {
      await service.reset(EMAIL, CODE, NEW_PASSWORD);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("refuses a wrong code and counts the guess", async () => {
      await expect(service.reset(EMAIL, "000000", NEW_PASSWORD)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.passwordReset.update).toHaveBeenCalledWith({
        where: { email: EMAIL },
        data: { attempts: { increment: 1 } },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("burns the code after too many guesses", async () => {
      prisma.passwordReset.findUnique.mockResolvedValue(pending({ attempts: 5 }));

      await expect(service.reset(EMAIL, CODE, NEW_PASSWORD)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.passwordReset.delete).toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("refuses a code that has run out of time", async () => {
      prisma.passwordReset.findUnique.mockResolvedValue(
        pending({ expiresAt: new Date(Date.now() - 1000) }),
      );

      await expect(service.reset(EMAIL, CODE, NEW_PASSWORD)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("refuses when no code was ever asked for", async () => {
      prisma.passwordReset.findUnique.mockResolvedValue(null);

      await expect(service.reset(EMAIL, CODE, NEW_PASSWORD)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    /**
     * The point of the codes. A code that sat too long wants the button that asks for a new
     * one; a code with a typo in it wants the digits read again; no code at all means the
     * student is on the wrong screen. One sentence for all three could not tell them apart,
     * so the screen could not either.
     */
    it("names each refusal, so they can be told apart", async () => {
      const codes: Array<string | undefined> = [];
      const collect = async (arrange: () => void) => {
        arrange();
        const error = await service
          .reset(EMAIL, CODE, NEW_PASSWORD)
          .catch((e: unknown) => e);
        codes.push(codeOf(error));
      };

      await collect(() => prisma.passwordReset.findUnique.mockResolvedValue(null));
      await collect(() =>
        prisma.passwordReset.findUnique.mockResolvedValue(
          pending({ expiresAt: new Date(Date.now() - 1) }),
        ),
      );
      await collect(() =>
        prisma.passwordReset.findUnique.mockResolvedValue(pending({ attempts: 5 })),
      );
      await collect(() => {
        prisma.passwordReset.findUnique.mockResolvedValue(pending());
        prisma.user.findFirst.mockResolvedValue(null);
      });

      expect(codes).toEqual([
        "CODE_NOT_REQUESTED",
        "CODE_EXPIRED",
        "CODE_ATTEMPTS_SPENT",
        "ACCOUNT_NOT_FOUND",
      ]);
    });

    it("names a wrong code CODE_WRONG, apart from an expired one", async () => {
      const error = await service
        .reset(EMAIL, "000000", NEW_PASSWORD)
        .catch((e: unknown) => e);

      expect(codeOf(error)).toBe("CODE_WRONG");
    });
  });
});
