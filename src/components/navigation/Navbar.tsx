import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="mb-14 flex">
        <div className="flex-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--color-primary)/0.25)]" />
            <Link href="/" className="font-display font-bold text-2xl tracking-tight">
                Joysnap
            </Link>
        </div>
        <div className="flex gap-10 text-primary-content font-mono font-bold text-sm uppercase tracking-wide">
            <Link href="/About">
                About
            </Link>
            <Link href="/Contact">
                Contact
            </Link>
        </div>
    </nav>
  );
}