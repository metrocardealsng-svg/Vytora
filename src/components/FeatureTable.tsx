import { FEATURE_KEYS, VYTORA_FEATURES, type Competitor } from "@/lib/seo-data";

function Mark({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-mint/15 text-mint">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-600">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </span>
  );
}

export default function FeatureTable({ competitor }: { competitor: Competitor }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 px-5 py-4 text-sm font-bold">
        <div className="text-slate-300">Feature</div>
        <div className="text-center text-mint">Vytora</div>
        <div className="text-center text-slate-300">{competitor.name}</div>
      </div>
      {FEATURE_KEYS.map((key, i) => (
        <div
          key={key}
          className={`grid grid-cols-3 items-center px-5 py-3.5 text-sm ${
            i % 2 === 0 ? "" : "bg-white/[0.02]"
          }`}
        >
          <div className="pr-2 text-slate-300">{key}</div>
          <div className="flex justify-center">
            <Mark on={VYTORA_FEATURES[key]} />
          </div>
          <div className="flex justify-center">
            <Mark on={Boolean(competitor.features[key])} />
          </div>
        </div>
      ))}
    </div>
  );
}
