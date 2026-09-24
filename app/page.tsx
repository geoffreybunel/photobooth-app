import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { FILTERS } from "@/src/lib/photobooth";
import HeroBoothDemo from "@/src/components/home/HeroBoothDemo";

export const metadata: Metadata = {
  title: "Strike a pose, it's time",
  description:
    "Open the photobooth, let the countdown do its magic, and leave with your photo strip. No app, no account — just your camera.",
};

const FILTER_TAGLINES: Record<string, string> = {
  original: "True to life",
  bw: "Timeless contrast",
  sepia: "Warm & nostalgic",
  vintage: "Grainy & faded",
};

const HOW_IT_WORKS = [
  {
    n: "01",
    dot: "bg-primary/12 text-primary",
    title: "Pick your look",
    desc: "Four filters, previewed live on your own camera before you commit.",
  },
  {
    n: "02",
    dot: "bg-secondary/20 text-[#8A5B00]",
    title: "Pose on the beep",
    desc: "A 3, 5, or 10 second countdown between shots — plenty of time to regroup.",
  },
  {
    n: "03",
    dot: "bg-accent/18 text-[#0B5F58]",
    title: "Keep the strip",
    desc: "Download the full strip in HD, ready to keep or print.",
  },
];

const BENTO = [
  {
    kind: "dark" as const,
    eyebrow: "Private by default",
    title: "Your camera stays on your device. Nothing is uploaded until you ask.",
    pills: ["No sign-up", "No tracking", "No cookies"],
  },
  {
    kind: "light" as const,
    iconBg: "bg-accent/16",
    iconColor: "text-[#0B5F58]",
    icon: <span className="w-[18px] h-[18px] rounded-[4px] border-2 border-current" />,
    title: "Your printed strip",
    desc: "Every shot lands in a clean vertical strip, framed and dated, ready to download.",
  },
  {
    kind: "light" as const,
    iconBg: "bg-primary/12",
    iconColor: "text-primary",
    icon: <span className="font-mono font-bold text-[11px]">CAM</span>,
    title: "Pick your camera",
    desc: "Switch between any connected webcam right from the booth — no setup required.",
  },
  {
    kind: "light" as const,
    iconBg: "bg-secondary/20",
    iconColor: "text-[#8A5B00]",
    icon: <span className="font-mono font-bold text-[12px]">5s</span>,
    title: "Your pace",
    desc: "Set the gap between shots, mirror the preview, or go fullscreen for an event.",
  },
  {
    kind: "light" as const,
    iconBg: "bg-base-300",
    iconColor: "text-base-content",
    icon: <span className="font-mono font-bold text-[12px]">HD</span>,
    title: "Print-ready files",
    desc: "Full-resolution export with a real date stamp, ready for the fridge door.",
  },
];

const MARQUEE_PHOTOS = ["/photobooth-pinup.jpg", "/filter-preview-camera.jpg"];
const MARQUEE_TILES = [0, 1].flatMap((round) =>
  FILTERS.flatMap((filter) =>
    MARQUEE_PHOTOS.map((photo) => ({
      key: `${round}-${photo}-${filter.id}`,
      photo,
      css: filter.css,
    }))
  )
);

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-6 pt-6 pb-4 overflow-hidden">
        <div
          className="absolute -top-[220px] -left-40 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(240,180,41,0.34), transparent 66%)" }}
        />
        <div
          className="absolute top-[340px] -right-[220px] w-[680px] h-[680px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(46,196,182,0.22), transparent 66%)" }}
        />

        <div className="relative max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="flex flex-col gap-7 min-w-0">
            <span className="inline-flex items-center gap-2.5 self-start bg-primary/10 border border-primary/25 text-primary font-mono text-[11px] tracking-[0.14em] uppercase px-3.5 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              No account · nothing to install
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.96] tracking-tight text-balance m-0">
              Four seconds.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">One strip</span>
                <span className="absolute left-[-4px] right-[-4px] bottom-0 h-3.5 bg-secondary rounded-full -z-0" />
              </span>
              <br />
              you&apos;ll keep.
            </h1>

            <p className="text-lg leading-relaxed text-base-content/70 max-w-[430px] m-0">
              Pick a look, hit start, and pose. Joysnap counts you down, snaps four frames,
              and prints them into a strip you can download in one tap.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/Booth"
                className="flex items-center gap-2.5 bg-primary text-primary-content font-display font-semibold text-base px-7 py-4 rounded-full shadow-[0_16px_34px_-16px_rgba(232,98,76,0.6)] hover:bg-primary/90"
              >
                <span className="w-3 h-3 rounded-full border-2 border-white/90" />
                Start the booth
              </Link>
              <Link
                href="/#how"
                className="flex items-center gap-2.5 bg-white border border-base-300 text-base px-6 py-4 rounded-full hover:border-base-content/30"
              >
                See how it works
              </Link>
            </div>

            <div className="flex flex-wrap gap-7 pt-1">
              <div className="flex flex-col gap-0.5">
                <span className="font-display font-bold text-2xl">4</span>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-base-content/55">
                  Filters
                </span>
              </div>
              <span className="w-px bg-base-300" />
              <div className="flex flex-col gap-0.5">
                <span className="font-display font-bold text-2xl">HD</span>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-base-content/55">
                  Export
                </span>
              </div>
              <span className="w-px bg-base-300" />
              <div className="flex flex-col gap-0.5">
                <span className="font-display font-bold text-2xl">Free</span>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-base-content/55">
                  Always
                </span>
              </div>
            </div>
          </div>

          <HeroBoothDemo />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] mt-10 py-6 bg-neutral overflow-hidden">
        <div className="flex gap-3.5 w-max animate-[marquee_34s_linear_infinite]">
          {MARQUEE_TILES.map((tile) => (
            <div key={tile.key} className="relative w-[110px] h-[110px] shrink-0 rounded-lg overflow-hidden">
              <Image
                src={tile.photo}
                alt=""
                fill
                sizes="110px"
                className="object-cover"
                style={{ filter: tile.css }}
              />
            </div>
          ))}
        </div>
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--color-neutral) 0%, transparent 12%, transparent 88%, var(--color-neutral) 100%)",
          }}
        />
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-[1180px] mx-auto px-0 pt-24 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
          <div className="flex flex-col gap-3 min-w-0">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary">
              How it works
            </span>
            <h2 className="font-display font-bold text-3xl md:text-[44px] leading-[1.06] tracking-tight text-balance m-0 max-w-[520px]">
              Three taps from curious to printed.
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-base-content/70 max-w-[300px] m-0">
            Everything happens in your browser. Your camera feed never leaves the device.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.n}
              className="bg-white border border-base-300 rounded-[24px] p-6.5 flex flex-col gap-4 hover:border-base-content/20"
            >
              <span
                className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center font-mono font-bold text-[13px] ${step.dot}`}
              >
                {step.n}
              </span>
              <h3 className="font-display font-semibold text-xl m-0">{step.title}</h3>
              <p className="text-sm leading-relaxed text-base-content/70 m-0">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTERS */}
      <section id="filters" className="max-w-[1180px] mx-auto px-0 pt-24 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
          <div className="flex flex-col gap-3 min-w-0">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary">
              Filters
            </span>
            <h2 className="font-display font-bold text-3xl md:text-[44px] leading-[1.06] tracking-tight text-balance m-0 max-w-[520px]">
              Four looks, no wrong answer.
            </h2>
          </div>
          <span className="font-mono text-[11px] tracking-[0.1em] text-base-content/55">
            Pick one when you&apos;re in the booth
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FILTERS.map((filter) => (
            <div
              key={filter.id}
              className="bg-white border border-base-300 rounded-[24px] p-3.5 flex flex-col gap-3.5"
            >
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
                <Image
                  src="/filter-preview-camera.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                  style={{ filter: filter.css }}
                />
                {filter.id === "vintage" && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 54px 18px rgba(0,0,0,0.45)" }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5 px-1 pb-1">
                <span className="font-display font-semibold text-base">{filter.label}</span>
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-base-content/55">
                  {FILTER_TAGLINES[filter.id]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENTO */}
      <section id="about" className="max-w-[1180px] mx-auto px-0 pt-24">
        <div className="flex flex-col gap-4">
          {BENTO.filter((card) => card.kind === "dark").map((card, index) => (
            <div
              key={index}
              className="min-w-0 w-full lg:w-3/4 bg-neutral text-neutral-content rounded-[28px] p-8 flex flex-col gap-4.5 justify-between"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-secondary">
                {card.eyebrow}
              </span>
              <h3 className="font-display font-bold text-2xl md:text-[34px] leading-[1.1] tracking-tight m-0">
                {card.title?.split(/(?<=\.) /).map((line, i, lines) => (
                  <Fragment key={i}>
                    {line}
                    {i < lines.length - 1 && <br />}
                  </Fragment>
                ))}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {card.pills?.map((pill) => (
                  <span
                    key={pill}
                    className="font-mono text-[10px] tracking-[0.1em] uppercase border border-neutral-content/25 rounded-full px-3.5 py-2"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENTO.filter((card) => card.kind === "light").map((card, index) => (
              <div
                key={index}
                className="min-w-0 bg-white border border-base-300 rounded-[28px] p-6 flex flex-col gap-3.5"
              >
                <span
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}
                >
                  {card.icon}
                </span>
                <h3 className="font-display font-semibold text-lg m-0">{card.title}</h3>
                <p className="text-sm leading-relaxed text-base-content/70 m-0">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-[1180px] mx-auto px-0 pt-24">
        <div className="relative bg-primary rounded-[34px] p-8 md:p-16 overflow-hidden flex flex-wrap items-center justify-between gap-8">
          <span
            className="absolute -top-[90px] -right-10 w-[320px] h-[320px] rounded-full pointer-events-none"
            style={{ background: "rgba(240,180,41,0.35)" }}
          />
          <div className="relative flex flex-col gap-4 min-w-0">
            <h2 className="font-display font-bold text-3xl md:text-5xl leading-[1.04] tracking-tight text-white text-balance m-0 max-w-[480px]">
              The booth is open. Go make a mess of it.
            </h2>
            <p className="text-base leading-relaxed text-white/90 m-0 max-w-[380px]">
              Takes about twelve seconds, start to strip.
            </p>
          </div>
          <Link
            href="/Booth"
            className="relative flex items-center gap-2.5 bg-neutral text-neutral-content font-display font-semibold text-base px-8 py-4.5 rounded-full shrink-0 hover:bg-[#1C0D14]"
          >
            <span className="w-3 h-3 rounded-full border-2 border-white/90" />
            Open the photobooth
          </Link>
        </div>
      </section>
    </div>
  );
}
