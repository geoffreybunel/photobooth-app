import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 pt-6 border-t-2 border-dashed border-base-content/15 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="font-display font-bold text-sm">Joysnap</span>
      </div>

      <nav className="flex gap-6 font-mono text-xs uppercase tracking-wide text-base-content/60">
        <Link href="/About" className="hover:text-base-content">
          About
        </Link>
        <Link href="/Contact" className="hover:text-base-content">
          Contact
        </Link>
        <Link href="/Privacy" className="hover:text-base-content">
          Privacy
        </Link>
      </nav>

      <p className="font-mono text-[11px] text-base-content/40">© {year} Joysnap</p>
    </footer>
  );
}
