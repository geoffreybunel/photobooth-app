import Link from "next/link";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 px-4 sm:px-6 py-4 flex justify-center backdrop-blur-[14px]">
      <nav className="w-full max-w-[1180px] flex flex-wrap items-center justify-center gap-x-5 gap-y-3 bg-white/85 border border-base-300 rounded-[28px] px-4 py-3 shadow-[0_10px_30px_-22px_rgba(42,21,32,0.4)]">
        <Link href="/" className="flex-1 flex items-center gap-2.5 font-display font-bold text-[19px] tracking-tight">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Joysnap
        </Link>

        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.12em] uppercase">
          <Link href="/#how" className="text-base-content/70 hover:text-primary">
            How it works
          </Link>
          <Link href="/#filters" className="text-base-content/70 hover:text-primary">
            Filters
          </Link>
          <Link href="/#about" className="text-base-content/70 hover:text-primary">
            About
          </Link>
        </div>

        <Link
          href="/Booth"
          className="flex items-center gap-2 bg-neutral text-neutral-content text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary"
        >
          <span className="w-[9px] h-[9px] rounded-full border-2 border-neutral-content/85" />
          Open booth
        </Link>
      </nav>
    </div>
  );
}
