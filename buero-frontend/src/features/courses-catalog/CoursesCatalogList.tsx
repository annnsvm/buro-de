import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import type { CoursesCatalogListProps } from '@/types/features/courses-catalog/CoursesCatalogList.types';

const CoursesCatalogList = ({ courses }: CoursesCatalogListProps) => {
  return (
    <Section className="bg-white pb-28">
      <Container className="md:px-0">    
      <ul className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(303px,1fr))] justify-items-center">

        {/* <ul className="grid grid-cols-1 justify-centr sm:gap-x-4 md:gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-3"> */}
        {/* <ul className="flex flex-wrap justify-center sm:gap-x-4 md:gap-x-8 gap-y-16 "> */}
          {courses.map((course) => (
            <li key={course.id}> 
              <CourseCard {...course} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};

export default CoursesCatalogList;