import SectionTitle from "../ui/SectionTitle";
import TestimonialCard from "../ui/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-5">

        <SectionTitle
          title="Loved by Early Beta Users"
          subtitle="Real feedback from Nigerians testing Vytora before launch."
        />

        <div className="grid gap-6 md:grid-cols-3">

          {testimonials.map((user) => (

            <TestimonialCard
              key={user.id}
              {...user}
            />

          ))}

        </div>

        <div className="mt-14 text-center">

          <div className="inline-flex items-center rounded-full bg-mint/10 px-6 py-3 text-mint font-bold">

            ⭐⭐⭐⭐⭐ Trusted by Early Beta Users

          </div>

          <p className="mt-4 text-slate-400">

            Join hundreds of Nigerians preparing for launch.

          </p>

        </div>

      </div>

    </section>
  );
}
