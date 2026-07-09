import Link from "next/link";

type Props = {
  requiredPlan: "pro" | "elite";
  currentPlan: string;
  featureName: string;
  children: React.ReactNode;
};

const PLAN_PRICE: Record<string, string> = {
  pro: "₦4,500/mo",
  elite: "₦9,000/mo",
};

export default function PlanGate({ requiredPlan, currentPlan, featureName, children }: Props) {
  const hasAccess =
    currentPlan === requiredPlan ||
    currentPlan === "elite" ||
    (requiredPlan === "pro" && currentPlan === "elite");

  if (hasAccess) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass rounded-3xl p-8 text-center max-w-md w-full">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/15">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-mint" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white">{featureName}</h2>
        <p className="mt-2 text-slate-400 text-sm">
          This feature is available on the{" "}
          <span className="text-mint font-bold capitalize">{requiredPlan}</span> plan
          ({PLAN_PRICE[requiredPlan]}).
        </p>
        <p className="mt-1 text-slate-500 text-xs">
          You're currently on the <span className="capitalize">{currentPlan}</span> plan.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3.5 text-base font-black text-ink hover:opacity-90 transition-opacity"
        >
          Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
        </Link>
        <Link href="/dashboard" className="mt-3 block text-sm text-slate-500 hover:text-white">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
