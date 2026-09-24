import Image from "next/image";
import { FILTERS, formatDateStamp } from "@/src/lib/photobooth";

const DEMO_PHOTOS = ["/Group-1.1.jpg", "/Group-1.2.jpg", "/Group-1.3.jpg", "/Group-1.4.jpg"];
// Fixed on purpose — this is a static hero visual, not wired to the filters
// showcase further down the page.
const DEMO_FILTER = FILTERS[0];
const TOTAL_SHOTS = 4;
const TAKEN = 1;
const PROGRESS = Math.round((TAKEN / TOTAL_SHOTS) * 100);

export default function HeroBoothDemo() {
  return (
    <div className="relative flex justify-center min-w-0 pb-10">
      <div className="relative w-full max-w-[352px] bg-neutral rounded-[32px] p-4 shadow-[0_40px_70px_-34px_rgba(42,21,32,0.68)]">
        <div className="flex items-center justify-between px-2 pb-3">
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-primary">
            <span className="w-[7px] h-[7px] rounded-full bg-primary" />
            Ready
          </span>
          <span className="font-mono text-[10px] text-neutral-content/50">
            {TAKEN} / {TOTAL_SHOTS}
          </span>
        </div>

        <div className="relative aspect-square rounded-[22px] overflow-hidden bg-[#3D2130]">
          <Image
            src={DEMO_PHOTOS[0]}
            alt=""
            fill
            sizes="640px"
            quality={90}
            className="object-cover object-[35%_center]"
            style={{ filter: DEMO_FILTER.css }}
            preload
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/[0.04] to-black/28" />
          <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.12em] uppercase text-white/90 bg-black/34 backdrop-blur-[6px] px-2.5 py-1.5 rounded-lg">
            {DEMO_FILTER.label}
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/18">
            <div className="h-full bg-secondary" style={{ width: `${PROGRESS}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4.5 pt-4.5 pb-1.5">
          <span className="w-[9px] h-[9px] rounded-full bg-neutral-content/20" />
          <span
            aria-hidden="true"
            className="w-[58px] h-[58px] shrink-0 rounded-full bg-secondary border-4 border-neutral-content/90"
          />
          <span className="w-[9px] h-[9px] rounded-full bg-neutral-content/20" />
        </div>
      </div>

      {/* printed strip */}
      <div
        className="absolute right-1 top-6 w-[104px] bg-white rounded-[4px] p-2.5 pb-3.5 flex flex-col gap-1.5 shadow-[0_26px_46px_-20px_rgba(42,21,32,0.55)]"
        style={{ transform: "rotate(6deg)" }}
      >
        <span
          className="absolute -top-2.5 left-1/2 w-11 h-[19px] rounded-sm bg-secondary/90"
          style={{ transform: "translateX(-50%) rotate(-6deg)" }}
        />
        {DEMO_PHOTOS.map((photo) => (
          <span key={photo} className="relative block w-full aspect-square rounded-[2px] overflow-hidden">
            <Image
              src={photo}
              alt=""
              fill
              sizes="160px"
              quality={90}
              className="object-cover object-[35%_center]"
            />
          </span>
        ))}
        <p className="font-mono text-[7px] tracking-[0.1em] text-center text-base-content/55 m-0">
          JOYSNAP · {formatDateStamp(new Date())}
        </p>
      </div>

      {/* floating chip */}
      <div className="absolute -left-2.5 bottom-3.5 flex items-center gap-2.5 bg-white border border-base-300 rounded-full pl-3 pr-4 py-2.5 shadow-[0_18px_34px_-20px_rgba(42,21,32,0.5)]">
        <span className="w-[26px] h-[26px] rounded-full bg-accent flex items-center justify-center text-white text-xs">
          ✓
        </span>
        <span className="flex flex-col">
          <span className="text-[13px] font-semibold">Strip ready</span>
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-base-content/55">
            Download in one tap
          </span>
        </span>
      </div>
    </div>
  );
}
