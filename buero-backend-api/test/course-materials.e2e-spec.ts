import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function cookieHeaderFromRegister(headers: { "set-cookie"?: string | string[] }): string {
  return getSetCookieHeaders(headers)
    .map((c) => c.split(";")[0])
    .join("; ");
}

/** Реальний шлях API: /api/courses/:courseId/modules/:moduleId/materials (не /courses/:courseId/materials). */
describe("Course materials (e2e)", () => {
  let app: INestApplication;

  const email = () =>
    `cm_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
  const password = "CmE2ePass1";

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "E2E: DATABASE_URL не задано. Вкажи .env з робочою PostgreSQL.",
      );
    }
    app = await createE2eApp();
  });

  afterAll(async () => {
    const prisma = app.get(PrismaService);
    await prisma.$disconnect();
    await app.close();
  });

  async function teacherCookie(): Promise<string> {
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email(),
        password,
        role: "teacher",
        language: "en",
      })
      .expect(201);
    return cookieHeaderFromRegister(reg.headers);
  }

  it("GET/POST/PATCH/DELETE; 404 для неіснуючого курсу, модуля або матеріалу", async () => {
    const cookie = await teacherCookie();

    const courseRes = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", cookie)
      .send({
        title: "Course for materials e2e",
        language: "de",
        is_published: true,
      })
      .expect(201);
    const courseId = courseRes.body.id as string;

    const modRes = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules`)
      .set("Cookie", cookie)
      .send({ title: "Module 1", order_index: 0 })
      .expect(201);
    const moduleId = modRes.body.id as string;

    const base = `/api/courses/${courseId}/modules/${moduleId}/materials`;

    const listEmpty = await request(app.getHttpServer())
      .get(base)
      .set("Cookie", cookie)
      .expect(200);
    expect(Array.isArray(listEmpty.body)).toBe(true);
    expect(listEmpty.body).toHaveLength(0);

    const createRes = await request(app.getHttpServer())
      .post(base)
      .set("Cookie", cookie)
      .send({
        type: "video",
        title: "Intro",
        content: { youtube_video_id: "dQw4w9WgXcQ" },
        order_index: 0,
      })
      .expect(201);

    const matId = createRes.body.id as string;
    expect(createRes.body.moduleId).toBe(moduleId);

    await request(app.getHttpServer())
      .get(base)
      .set("Cookie", cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      });

    await request(app.getHttpServer())
      .get(`${base}/${matId}`)
      .set("Cookie", cookie)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`${base}/${matId}`)
      .set("Cookie", cookie)
      .send({ title: "Intro updated" })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`${base}/${matId}`)
      .set("Cookie", cookie)
      .expect(200);

    const fakeCourse = "00000000-0000-0000-0000-00000000aa01";
    await request(app.getHttpServer())
      .get(`/api/courses/${fakeCourse}/modules/${moduleId}/materials`)
      .set("Cookie", cookie)
      .expect(404);

    const fakeModule = "00000000-0000-0000-0000-00000000aa03";
    await request(app.getHttpServer())
      .get(`/api/courses/${courseId}/modules/${fakeModule}/materials`)
      .set("Cookie", cookie)
      .expect(404);

    await request(app.getHttpServer())
      .get(`${base}/00000000-0000-0000-0000-00000000aa02`)
      .set("Cookie", cookie)
      .expect(404);
  });
});
