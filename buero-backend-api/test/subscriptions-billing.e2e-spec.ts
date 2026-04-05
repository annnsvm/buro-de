import { INestApplication } from "@nestjs/common";
import request from "supertest";
import Stripe from "stripe";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function cookieFromRegister(headers: { "set-cookie"?: string | string[] }): string {
  return getSetCookieHeaders(headers)
    .map((c) => c.split(";")[0])
    .join("; ");
}

function email(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
}

describe("Subscriptions & Billing (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error("E2E: DATABASE_URL не задано.");
    }
    app = await createE2eApp();
  });

  afterAll(async () => {
    const prisma = app.get(PrismaService);
    await prisma.$disconnect();
    await app.close();
  });

  it("GET /api/subscriptions/me та GET /api/payments/me — 200 (масиви)", async () => {
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email("sub_me"),
        password: "SubE2ePass1",
        role: "student",
        language: "en",
      })
      .expect(201);

    const cookie = cookieFromRegister(reg.headers);

    const sub = await request(app.getHttpServer())
      .get("/api/subscriptions/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(Array.isArray(sub.body)).toBe(true);

    const pay = await request(app.getHttpServer())
      .get("/api/payments/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(Array.isArray(pay.body)).toBe(true);
  });

  it("POST /api/subscriptions/portal — 400 без Stripe customer", async () => {
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email("portal"),
        password: "SubE2ePass1",
        role: "student",
        language: "en",
      })
      .expect(201);

    await request(app.getHttpServer())
      .post("/api/subscriptions/portal")
      .set("Cookie", cookieFromRegister(reg.headers))
      .expect(400);
  });

  it("POST /api/subscriptions/checkout — 200 з url при налаштованому Stripe і курсі з ціною", async () => {
    if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
      return;
    }

    const teacherReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email("t_checkout"),
        password: "SubE2ePass1",
        role: "teacher",
        language: "en",
      })
      .expect(201);
    const teacherCookie = cookieFromRegister(teacherReg.headers);

    const courseRes = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: "E2E paid course",
        language: "de",
        is_published: false,
      })
      .expect(201);
    const courseId = courseRes.body.id as string;

    await request(app.getHttpServer())
      .patch(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .send({ is_published: true, price: 19.99 })
      .expect(200);

    const studentReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email("s_checkout"),
        password: "SubE2ePass1",
        role: "student",
        language: "en",
      })
      .expect(201);
    const studentCookie = cookieFromRegister(studentReg.headers);

    const checkout = await request(app.getHttpServer())
      .post("/api/subscriptions/checkout")
      .set("Cookie", studentCookie)
      .send({
        course_id: courseId,
        success_url: "https://example.com/purchase/success",
        cancel_url: "https://example.com/purchase/cancel",
      })
      .expect(200);

    expect(typeof checkout.body.url).toBe("string");
    expect(checkout.body.url).toMatch(/^https:\/\//);
  });

  it("POST /api/subscriptions/portal — 200 з url після checkout (є Stripe customer)", async () => {
    if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
      return;
    }

    const teacherReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email("t_portal"),
        password: "SubE2ePass1",
        role: "teacher",
        language: "en",
      })
      .expect(201);
    const teacherCookie = cookieFromRegister(teacherReg.headers);

    const courseRes = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: "E2E portal course",
        language: "de",
        is_published: false,
      })
      .expect(201);
    const courseId = courseRes.body.id as string;

    await request(app.getHttpServer())
      .patch(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .send({ is_published: true, price: 9.99 })
      .expect(200);

    const studentReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email("s_portal"),
        password: "SubE2ePass1",
        role: "student",
        language: "en",
      })
      .expect(201);
    const studentCookie = cookieFromRegister(studentReg.headers);

    await request(app.getHttpServer())
      .post("/api/subscriptions/checkout")
      .set("Cookie", studentCookie)
      .send({
        course_id: courseId,
        success_url: "https://example.com/purchase/success",
        cancel_url: "https://example.com/purchase/cancel",
      })
      .expect(200);

    const portal = await request(app.getHttpServer())
      .post("/api/subscriptions/portal")
      .set("Cookie", studentCookie)
      .expect(200);

    expect(typeof portal.body.url).toBe("string");
    expect(portal.body.url).toMatch(/^https:\/\//);
  });

  it("POST /api/webhooks/stripe — 200, подія з тим самим id не зберігається двічі", async () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret?.startsWith("whsec_")) {
      return;
    }

    const eventId = `evt_e2e_idem_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const payload = JSON.stringify({
      id: eventId,
      object: "event",
      api_version: "2024-11-20.acacia",
      type: "charge.succeeded",
      data: { object: { id: "ch_1" } },
    });

    const stripeSignature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });

    const prisma = app.get(PrismaService);

    const postOnce = () =>
      request(app.getHttpServer())
        .post("/api/webhooks/stripe")
        .set("Stripe-Signature", stripeSignature)
        .set("Content-Type", "application/json")
        .send(payload);

    await postOnce().expect(200);
    const count1 = await prisma.stripeWebhookEvent.count({
      where: { stripeEventId: eventId },
    });
    expect(count1).toBe(1);

    await postOnce().expect(200);
    const count2 = await prisma.stripeWebhookEvent.count({
      where: { stripeEventId: eventId },
    });
    expect(count2).toBe(1);

    await prisma.stripeWebhookEvent.deleteMany({ where: { stripeEventId: eventId } });
  });
});
