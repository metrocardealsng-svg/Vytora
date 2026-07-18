interface Props {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export default function TestimonialCard({
  name,
  location,
  rating,
  text,
}: Props) {
  return (
    <div className="glass rounded-3xl p-6 transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(52,224,161,0.15)]">
      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-mint to-teal text-xl font-black text-ink">
          {name.charAt(0)}
        </div>

        <div>
          <h3 className="font-bold text-white">
            {name}
          </h3>

          <p className="text-sm text-slate-400">
            {location}
          </p>
        </div>

      </div>

      <div className="mt-5 text-yellow-400">
        {"⭐".repeat(rating)}
      </div>

      <p className="mt-4 leading-relaxed text-slate-300">
        "{text}"
      </p>
    </div>
  );
}
