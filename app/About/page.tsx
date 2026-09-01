import Link from "next/link";

const FEATURES = [
  {
    dot: "bg-primary",
    title: "Pick your camera",
    desc: "Switch between any connected webcam right from the booth — no setup required.",
  },
  {
    dot: "bg-secondary",
    title: "1 to 4 shots",
    desc: "A solo portrait or a full strip. You choose how many photos make the cut.",
  },
  {
    dot: "bg-accent",
    title: "Three paces",
    desc: "Quick, Standard, or Relaxed countdowns — 3, 5, or 10 seconds between shots.",
  },
  {
    dot: "bg-primary",
    title: "Four real filters",
    desc: "Original, Black & White, Sepia, and a grainy Vintage look — baked into every photo, not just the preview.",
  },
  {
    dot: "bg-secondary",
    title: "Mirror & fullscreen",
    desc: "Preview flipped like a mirror, or go fullscreen for an event-kiosk feel.",
  },
  {
    dot: "bg-accent",
    title: "Your strip, your colors",
    desc: "Pick a frame color and download a strip stamped with the date — ready to share.",
  },
];

const ROADMAP = [
  {
    n: "01",
    title: "Solo Booth",
    status: "Live now",
    statusClass: "text-accent",
    desc: "One person or a group, one device — the booth you can use today.",
  },
  {
    n: "02",
    title: "Paired Booth",
    status: "In the works",
    statusClass: "text-secondary",
    desc: "Two people on two devices, synced by one countdown — built for long-distance.",
  },
  {
    n: "03",
    title: "Event Booth",
    status: "Planned",
    statusClass: "text-base-content/45",
    desc: "A QR code at your wedding or party. Guests shoot, you get every photo afterward.",
  },
];

export default function About() {
  return (
    <div className="w-full">
      {/* INTRO */}
      <div className="max-w-2xl mb-20">
        <p className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2 text-primary">
          <span className="w-4 h-0.5 inline-block bg-primary" />
          About Joysnap
        </p>

        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-5">
          A photobooth that lives in your browser.
        </h1>

        <p className="text-base leading-relaxed text-base-content/70">
          No booth to rent, no app to install, no account to make. Open the page, hit
          start, and walk away with a strip — Joysnap runs entirely on your own camera,
          right where you already are.
        </p>
      </div>

      {/* WHAT'S INSIDE */}
      <p className="font-mono text-xs tracking-widest uppercase mb-5 flex items-center gap-3 text-primary">
        What&apos;s inside
        <span
          className="flex-1 h-0.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, hsl(var(--color-base-content)/0.25) 0, hsl(var(--color-base-content)/0.25) 6px, transparent 6px, transparent 12px)",
          }}
        />
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="card bg-[#FFFDF8] rounded-2xl shadow-md hover:-translate-y-1.5 transition-transform"
          >
            <div className="card-body p-5 gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${feature.dot}`} />
              <p className="font-display font-semibold text-base mt-1">{feature.title}</p>
              <p className="text-sm leading-relaxed text-base-content/70">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ROADMAP */}
      <p className="font-mono text-xs tracking-widest uppercase mb-5 flex items-center gap-3 text-primary">
        Where it&apos;s headed
        <span
          className="flex-1 h-0.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, hsl(var(--color-base-content)/0.25) 0, hsl(var(--color-base-content)/0.25) 6px, transparent 6px, transparent 12px)",
          }}
        />
      </p>

      <div className="flex flex-col mb-20 border-t-2 border-dashed border-base-content/15">
        {ROADMAP.map((step) => (
          <div
            key={step.n}
            className="flex items-start gap-6 py-6 border-b-2 border-dashed border-base-content/15"
          >
            <span className="font-mono font-bold text-3xl text-base-content/15 shrink-0 w-12">
              {step.n}
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <p className="font-display font-semibold text-lg">{step.title}</p>
                <span className={`font-mono text-[10px] uppercase tracking-wider ${step.statusClass}`}>
                  {step.status}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-base-content/70 max-w-lg">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center text-center gap-5 py-4">
        <p className="font-display font-semibold text-xl">Ready when you are.</p>
        <Link
          href="/Booth"
          className="bg-primary border-none font-display font-semibold text-white rounded-full shadow-[0_6px_0_hsl(8_70%_52%)] py-4 px-7.5 transition-transform duration-150 ease-in-out hover:-translate-y-1"
        >
          📸 Open the photobooth
        </Link>
      </div>
    </div>
  );
}
