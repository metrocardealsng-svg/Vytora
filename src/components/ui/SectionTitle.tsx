interface Props {
  badge?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {badge && (
        <span className="mb-4 inline-flex rounded-full bg-mint/10 px-4 py-1 text-sm font-semibold text-mint">
          {badge}
        </span>
      )}

      <h2 className="text-4xl font-black tracking-tight text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-lg text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
