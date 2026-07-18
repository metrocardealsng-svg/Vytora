import SectionTitle from "../ui/SectionTitle";
import TestimonialCard from "../ui/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="Loved by Early Users"
          title="Real Nigerians. Real Results."
          subtitle="Join the growing community using Vytora to build healthier habits every day."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((user) => (
            <TestimonialCard
              key={`${user.name}-${user.location}`}
              {...user}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
