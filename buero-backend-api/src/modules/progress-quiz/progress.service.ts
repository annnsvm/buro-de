import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseMaterialService } from '../course-materials/course-material.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  async getMyProgress(userId: string) {
    const [progressRows, profile] = await Promise.all([
      this.prisma.courseProgress.findMany({
        where: { userId },
        include: {
          course: { select: { id: true, title: true, level: true } },
          courseMaterial: { select: { id: true } },
        },
      }),
      this.prisma.studentProfile.findUnique({
        where: { userId },
        select: { level: true },
      }),
    ]);
    const courseIds = [...new Set(progressRows.map((r) => r.courseId))];
    const moduleCounts = courseIds.length
      ? await this.prisma.courseModule.findMany({
          where: { courseId: { in: courseIds } },
          select: { courseId: true, _count: { select: { materials: true } } },
        })
      : [];

    const totalByCourse = new Map<string, number>();
    for (const m of moduleCounts) {
      totalByCourse.set(m.courseId, (totalByCourse.get(m.courseId) ?? 0) + m._count.materials);
    }

    const completedByCourse = new Map<string, { count: number; title: string }>();
    for (const p of progressRows) {
      if (!p.courseMaterialId) continue;
      const key = p.courseId;
      const prev = completedByCourse.get(key);
      const title = p.course.title;
      if (!prev) {
        completedByCourse.set(key, { count: 1, title });
      } else {
        prev.count += 1;
      }
    }

    const courseIdsSet = new Set(progressRows.map((r) => r.courseId));
    const courses = Array.from(courseIdsSet).map((courseId: string) => {
      const total = totalByCourse.get(courseId) ?? 0;
      const completed = completedByCourse.get(courseId)?.count ?? 0;
      const title = completedByCourse.get(courseId)?.title ?? '';
      const completion_percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        course_id: courseId,
        course_title: title,
        completion_percent,
        completed_materials_count: completed,
        total_materials_count: total,
      };
    });

    return {
      courses,
      level: profile?.level ?? null,
      resume: await this.resumeLesson(userId, progressRows),
    };
  }

  /**
   * The lesson to offer as "continue": the last one the student actually opened.
   *
   * It used to be worked out from `course_progress`, which records only what was *finished*.
   * That could not see reading in progress at all: open lesson 7, read half of it, close the
   * tab, and the card still pointed at the first lesson not completed - often one already
   * read past. Now every lesson a student opens writes a resume point, and that is the
   * answer when there is one.
   *
   * The old rule remains underneath, for a student who has finished lessons but not opened
   * one since this shipped, and for a resume point whose lesson has since been deleted.
   */
  /**
   * Remembers the lesson a student has just opened, so "continue" leads back to it.
   *
   * Progress records only what was *finished*, which cannot see a lesson opened and left
   * half-read - and that was the complaint: the card kept offering the first unfinished
   * lesson, often one already read past.
   *
   * The material is checked against the course before anything is written: a bookmark is
   * read back later and must never name a lesson of a course the student cannot open.
   */
  async markLessonOpened(
    userId: string,
    courseId: string,
    courseMaterialId: string,
  ): Promise<void> {
    const material = await this.prisma.courseMaterial.findFirst({
      where: { id: courseMaterialId, module: { courseId } },
      select: { id: true },
    });
    if (!material) {
      throw new NotFoundException(
        `Матеріал ${courseMaterialId} не належить курсу ${courseId}`,
      );
    }

    const access = await this.prisma.userCourseAccess.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { id: true },
    });
    if (!access) {
      throw new ForbiddenException("Немає доступу до цього курсу");
    }

    await this.prisma.courseResumePoint.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, courseMaterialId },
      update: { courseMaterialId, openedAt: new Date() },
    });
  }

  private async resumeLesson(
    userId: string,
    progressRows: {
      courseId: string;
      courseMaterialId: string | null;
      completedAt: Date;
      course: { title: string; level: string | null };
    }[],
  ) {
    /**
     * Which course, decided by the newest row of any kind.
     *
     * Some rows carry no material - they record that the student did something in the
     * course without naming what. Skipping them when choosing the course meant a course
     * worked in last week could lose to one finished the week before: the newest row said
     * A2.1 and the card sent the student back to an A1 lesson they had already done.
     *
     * They are still not treated as completed work; that is counted below, from the rows
     * that name a material.
     */
    const latest = progressRows
      .slice()
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())[0];

    /**
     * Where they were actually reading, which beats anything inferred from finished work.
     * Taken across every course, so it names the course as well as the lesson.
     */
    const bookmark = await this.prisma.courseResumePoint.findFirst({
      where: { userId },
      orderBy: { openedAt: "desc" },
      select: {
        courseId: true,
        courseMaterialId: true,
        course: { select: { title: true, level: true } },
      },
    });

    if (!latest && !bookmark) return null;

    const courseId = bookmark?.courseId ?? latest!.courseId;
    const courseTitle = bookmark?.course.title ?? latest!.course.title;
    const courseLevel = bookmark?.course.level ?? latest!.course.level;

    const modules = await this.prisma.courseModule.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
      select: {
        materials: {
          orderBy: { orderIndex: "asc" },
          select: { id: true, title: true },
        },
      },
    });
    const flat = modules.flatMap((mod) => mod.materials);
    if (flat.length === 0) return null;

    /**
     * The bookmarked lesson, when it is still in the course. A lesson deleted since it was
     * opened falls through to the old rule rather than leaving the card blank.
     */
    const bookmarked =
      bookmark && bookmark.courseId === courseId
        ? flat.findIndex((material) => material.id === bookmark.courseMaterialId)
        : -1;

    const completed = new Set(
      progressRows
        .filter((row) => row.courseId === courseId && row.courseMaterialId)
        .map((row) => row.courseMaterialId as string),
    );

    const firstUnfinished = flat.findIndex(
      (material) => !completed.has(material.id),
    );
    const at =
      bookmarked >= 0
        ? bookmarked
        : /** Nothing left undone: the course is finished, so point at where it ends. */
          firstUnfinished >= 0
          ? firstUnfinished
          : flat.length - 1;
    const material = flat[at];

    return {
      course_id: courseId,
      course_title: courseTitle,
      course_level: courseLevel,
      material_id: material.id,
      material_title: material.title,
      lesson_number: at + 1,
      lesson_total: flat.length,
    };
  }


  async getCourseProgress(userId: string, courseId: string) {
    const [course, progressList] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      }),
      this.prisma.courseProgress.findMany({
        where: { userId, courseId, courseMaterialId: { not: null } },
        select: {
          courseMaterialId: true,
          completedAt: true,
          score: true,
        },
        orderBy: { completedAt: 'desc' },
      }),
    ]);
    if (!course) {
      throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
    }

    const completed_materials = progressList.map((p) => ({
      course_material_id: p.courseMaterialId!,
      completed_at: p.completedAt.toISOString(),
      score: p.score != null ? Number(p.score) : null,
    }));

    return { completed_materials };
  }

  async completeMaterial(
    userId: string,
    role: Role,
    courseId: string,
    moduleId: string,
    materialId: string,
    score?: number,
  ) {
    /**
     * Structural checks below only prove the material belongs to the course. Without this
     * call any authenticated student could mark materials of a course they never bought,
     * inflating their own progress. Uses the module-level check so it matches what the
     * material listing allows - on trial that is the opening modules only.
     */
    await this.courseMaterialService.assertCanAccessModule(
      userId,
      role,
      courseId,
      moduleId,
    );

    const material = await this.prisma.courseMaterial.findFirst({
      where: { id: materialId, moduleId },
      include: { module: { select: { courseId: true } } },
    });
    if (!material) {
      throw new NotFoundException(
        `Матеріал з id ${materialId} не знайдено або не належить модулю`,
      );
    }
    if (material.module.courseId !== courseId) {
      throw new BadRequestException(
        'Модуль не належить вказаному курсу',
      );
    }

    const completedAt = new Date();
    const data = {
      userId,
      courseId,
      courseMaterialId: materialId,
      completedAt,
      ...(score != null && { score }),
    };

    await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId_courseMaterialId: {
          userId,
          courseId,
          courseMaterialId: materialId,
        },
      },
      create: data,
      update: { completedAt, ...(score != null && { score }) },
    });

    return {
      completed: true,
      course_material_id: materialId,
      completed_at: completedAt.toISOString(),
      score: score ?? null,
    };
  }

  async getRecommendedNext(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      select: { level: true },
    });
    const level = profile?.level ?? null;
    if (!level) {
      return null;
    }

    const completedCourseIds = await this.prisma.courseProgress
      .findMany({
        where: { userId },
        select: { courseId: true },
        distinct: ['courseId'],
      })
      .then((rows) => new Set(rows.map((r) => r.courseId)));

    const nextCourse = await this.prisma.course.findFirst({
      where: {
        isPublished: true,
        id: { notIn: Array.from(completedCourseIds) },
      },
      orderBy: { createdAt: 'asc' },
    });

    return nextCourse;
  }
}
