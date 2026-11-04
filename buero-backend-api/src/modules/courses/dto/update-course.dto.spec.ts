import { ValidationPipe } from "@nestjs/common";
import { UpdateCourseDto } from "./update-course.dto";

/**
 * The shape the editor's save actually sends, run through the pipe the app runs.
 *
 * `forbidNonWhitelisted` is on, which makes an undeclared property a 400 rather than a
 * harmlessly ignored key - and because the whole course form is saved in one request, that
 * 400 takes every other edit on the form down with it. That is exactly what happened when
 * `trial_module_count` reached a server still running the DTO that did not declare it, so it
 * is worth a test that fails loudly rather than a field that is quietly dropped.
 */
describe("UpdateCourseDto through the app's validation pipe", () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
  const metadata = {
    type: "body" as const,
    metatype: UpdateCourseDto,
  };

  const run = (body: Record<string, unknown>) => pipe.transform(body, metadata);

  it("accepts how many modules a trial opens", async () => {
    await expect(run({ trial_module_count: 1 })).resolves.toMatchObject({
      trial_module_count: 1,
    });
  });

  it("accepts zero free modules", async () => {
    await expect(run({ trial_module_count: 0 })).resolves.toMatchObject({
      trial_module_count: 0,
    });
  });

  it("refuses a negative count, a fraction and anything past the cap", async () => {
    await expect(run({ trial_module_count: -1 })).rejects.toThrow();
    await expect(run({ trial_module_count: 1.5 })).rejects.toThrow();
    await expect(run({ trial_module_count: 100 })).rejects.toThrow();
  });

  it("still carries the rest of the form in the same request", async () => {
    await expect(
      run({
        title: "Deutsch A2.1",
        price: 30,
        level: "A2",
        trial_module_count: 1,
      }),
    ).resolves.toMatchObject({ title: "Deutsch A2.1", trial_module_count: 1 });
  });
});
