import { SectionProps } from "@/types/components/layout/Section.types";

const Section = ({
  children,
}: SectionProps) => {
  return (
    <section className="py-16 tablet: py-28">
        {children}
    </section>
  );
};

export default Section;
