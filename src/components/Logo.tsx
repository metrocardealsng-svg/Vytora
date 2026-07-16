import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-9 flex-shrink-0">
        <div className="h-9 w-9 rounded-[10px] bg-[#34e0a1] flex items-center justify-center shadow-lg shadow-mint/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#06080c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h4l2 6 4-14 2 8h6" />
          </svg>
        </div>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-white">
        Vytora
      </span>
    </Link>
  );
}
