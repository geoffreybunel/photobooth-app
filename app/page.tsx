import Image from "next/image";
import Link from "next/link";
import { FILTERS } from "@/src/lib/photobooth";

const FILTER_TAGLINES: Record<string, string> = {
  original: "True to life",
  bw: "Timeless contrast",
  sepia: "Warm & nostalgic",
  vintage: "Grainy & faded",
};

const STRIP_COLORS = [
  "linear-gradient(135deg, hsl(var(--color-accent)), hsl(172 60% 32%))",
  "linear-gradient(135deg, hsl(var(--color-primary)), hsl(8 70% 48%))",
  "linear-gradient(135deg, hsl(var(--color-secondary)), hsl(40 80% 45%))",
];

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO */}
      <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2 text-primary">
            <span className="w-4 h-0.5 inline-block bg-primary" />
            No account needed
          </p>

          <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-5">
          Strike a pose,
            <br />
            <span className="relative inline-block">
              it&apos;s <span className="text-primary">time</span>
              <svg viewBox="0 0 220 14" preserveAspectRatio="none">
                <path d="M2 10 C 40 2, 180 2, 218 10" stroke="#FFC145" strokeWidth="6" fill="none" strokeLinecap="round"></path>
              </svg>
            </span>
          </h1>

          <p className="text-base leading-relaxed mb-8 max-w-md text-base-content/70">
            Open the photobooth, let the countdown do its magic, and leave with your photo strip.
          </p>

          <div className="flex items-center gap-4 mb-10">
            <Link href="/Booth" className="bg-primary border-none font-display font-semibold text-bas text-white rounded-full shadow-[0_6px_0_hsl(8_70%_52%)] py-4 px-7.5 transition-transform duration-150 ease-in-out hover:-translate-y-1">
              📸 Open the photobooth
            </Link>
            <span className="font-mono text-xs text-base-content/55">
              3 photos · 12 sec
            </span>
          </div>

          {/* STATS */}
          <div className="stats stats-vertical sm:stats-horizontal shadow-none bg-transparent border-t-2 border-dashed border-base-content/15">
            <div className="stat py-3 px-0 pr-6">
              <div className="stat-value font-display font-bold text-2xl">
                FREE
              </div>
              <div className="stat-desc font-mono uppercase text-[10px] tracking-wider">
                No accout needed
              </div>
            </div>
            <div className="stat py-3 px-6">
              <div className="stat-value font-display font-bold text-2xl">
                4
              </div>
              <div className="stat-desc font-mono uppercase text-[10px] tracking-wider">
                Filters available
              </div>
            </div>
            <div className="stat py-3 px-6">
              <div className="stat-value font-display font-bold text-2xl">
                HD
              </div>
              <div className="stat-desc font-mono uppercase text-[10px] tracking-wider">
                High-quality export
              </div>
            </div>
          </div>
        </div>

        {/* CAMERA / STRIP */}
        <div className="relative flex justify-center">
          <div className="card w-72 bg-neutral rounded-3xl shadow-xl">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[11px] flex items-center gap-2 text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  READY
                </span>
                <span className="font-mono text-[11px] text-neutral-content/50">
                  02 / 03
                </span>
              </div>

              <div
                className="rounded-2xl aspect-4/5 flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(160deg, hsl(315 30% 32%), hsl(315 40% 18%))",
                }}
              >
                <span
                  className="font-display font-bold text-7xl text-secondary"
                  style={{ textShadow: "0 6px 0 rgba(0,0,0,0.15)" }}
                >
                  3
                </span>
              </div>

              <div className="flex justify-center items-center gap-4">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-content/20" />
                <div className="w-14 h-14 rounded-full bg-secondary border-4 border-neutral-content/85 shadow-[0_4px_0_hsl(40_80%_45%)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-content/20" />
              </div>
            </div>
          </div>

          {/* Photo strip */}
          <div
            className="absolute -right-4 top-1 rounded-md shadow-xl p-2.5 pb-4 bg-[#FFFDF8]"
            style={{ width: "104px", transform: "rotate(8deg)" }}
          >
            <div
              className="absolute -top-2.5 left-1/2 w-11 h-5 rounded-sm bg-secondary/85"
              style={{ transform: "translateX(-50%) rotate(-4deg)" }}
            />
            {STRIP_COLORS.map((gradient, i) => (
              <div
                key={i}
                className="aspect-square rounded-[3px] mb-2"
                style={{ background: gradient }}
              />
            ))}
            <p className="font-mono text-center text-[9px] text-base-content/55">
              04.08.26
            </p>
          </div>
        </div>
      </div>

      {/* CADRES DISPONIBLES */}
      <p className="font-mono text-xs tracking-widest uppercase mb-5 flex items-center gap-3 text-primary">
        Available filters
        <span
          className="flex-1 h-0.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, hsl(var(--color-base-content)/0.25) 0, hsl(var(--color-base-content)/0.25) 6px, transparent 6px, transparent 12px)",
          }}
        />
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {FILTERS.map((filter) => (
          <div
            key={filter.id}
            className="card bg-[#FFFDF8] rounded-2xl shadow-md hover:-translate-y-1.5 transition-transform"
          >
            <div className="card-body p-4">
              <div className="relative aspect-3/4 rounded-xl mb-3 overflow-hidden bg-neutral">
                <Image
                  src="/filter-preview-camera.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                  style={{ filter: filter.css }}
                />
                {filter.id === "vintage" && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 24px 10px rgba(0,0,0,0.45)" }}
                  />
                )}
              </div>
              <p className="font-display font-semibold text-sm">
                {filter.label}
              </p>
              <p className="font-mono text-[10px] uppercase mt-1 text-base-content/55">
                {FILTER_TAGLINES[filter.id]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}