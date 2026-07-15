import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-9 flex-shrink-0">
        <Image
          src="/icon-192.png"
          alt="Vytora"
          width={36}
          height={36}
          className="rounded-xl"
          priority
        />
      </div>
      <span className="text-xl font-extrabold tracking-tight text-white">
        Vytora
      </span>
    </Link>
  );
}
