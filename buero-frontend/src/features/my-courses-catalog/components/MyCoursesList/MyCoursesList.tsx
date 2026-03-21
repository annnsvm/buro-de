import { Container, Section } from '@/components/layout';
import { CourseCard } from '@/features/courses-catalog';
import { MyCoursesListProp } from '@/types/features/my-course-catalog/MyCourseList.types';
import React from 'react';

const MyCoursesList: React.FC<MyCoursesListProp> = ({ courses }) => {
  return (
    <Section className="bg-white pb-28">
      <Container className="md:px-20">
        {courses?.length > 0 ? (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(303px,1fr))] gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16">
            {courses.map((course) => (
              <li key={course.id}>
                <CourseCard {...course} variant="my-learning" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-2xl font-bold">Not found courses</p>
        )}
      </Container>
    </Section>
  );
};

export default MyCoursesList;
