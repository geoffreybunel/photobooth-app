"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePhotoSession } from "@/src/hooks/usePhotoSession";
import {
  captureFrame,
  composeStrip,
  formatDateStamp,
  FILTERS,
  FRAMES,
  type PhotoFilter,
  type StripFrame,
} from "@/src/lib/photobooth";
import {
  getCameraDevicesServerSnapshot,
  getCameraDevicesSnapshot,
  refreshCameraDevices,
  subscribeToCameraDevices,
} from "@/src/lib/cameraDevices";
import {
  enterFullscreen,
  exitFullscreen,
  getFullscreenServerSnapshot,
  getFullscreenSnapshot,
  subscribeToFullscreen,
} from "@/src/lib/fullscreen";

const SHOT_OPTIONS = [1, 2, 3, 4];

const COUNTDOWN_OPTIONS = [
  { label: "Quick", seconds: 3 },
  { label: "Standard", seconds: 5 },
  { label: "Relaxed", seconds: 10 },
];

const SWATCH_BG =
  "linear-gradient(150deg, rgba(255,255,255,.14) 0 6px, transparent 6px 12px), linear-gradient(155deg, #7A5C6E, #33212C)";

function describeCameraError(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  switch (name) {
    case "NotAllowedError":
      return "Camera access was denied. Allow it for this site in your browser's settings, then try again.";
    case "NotFoundError":
      return "No camera was found on this device.";
    case "NotReadableError":
      return "The camera couldn't be started — it may already be in use by another app or tab.";
    case "OverconstrainedError":
      return "That camera isn't available right now. Try a different one.";
    default:
      return "Couldn't access the camera.";
  }
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/85 bg-black/32 backdrop-blur-[6px] px-2.5 py-1.5 rounded-lg flex items-center">
      {children}
    </span>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={onChange}
        aria-pressed={checked}
        className={`relative w-[42px] h-6 rounded-full shrink-0 transition-colors ${
          checked ? "bg-accent" : "bg-base-300"
        }`}
      >
        <span
          className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-[left] ${
            checked ? "left-[21px]" : "left-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

export default function Booth() {
  const boothRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>(FILTERS[0]);
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [deviceIdOverride, setDeviceIdOverride] = useState<string | null>(null);
  const [totalShots, setTotalShots] = useState(4);
  const [countdownSeconds, setCountdownSeconds] = useState(COUNTDOWN_OPTIONS[0].seconds);
  const [mirror, setMirror] = useState(true);
  const [frame, setFrame] = useState<StripFrame>(FRAMES[0]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Camera list and fullscreen state are external browser state (labels arrive
  // later, devices/fullscreen can change from outside our control), so both are
  // read from stores rather than fetched in an effect.
  const devices = useSyncExternalStore(
    subscribeToCameraDevices,
    getCameraDevicesSnapshot,
    getCameraDevicesServerSnapshot
  );
  const selectedDeviceId = deviceIdOverride ?? devices[0]?.deviceId ?? null;

  const isFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenSnapshot,
    getFullscreenServerSnapshot
  );

  // Camera device access stays local to this component: refs must be read
  // inside the event handlers that use them, not returned from a shared hook.
  const startCamera = async (deviceId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
      setCameraError(null);
      refreshCameraDevices();
    } catch (error) {
      console.error("Error accessing the camera:", error);
      setCameraError(describeCameraError(error));
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Release the camera when leaving the page — reading refs in an effect's
  // cleanup (rather than in its body) is the sanctioned place to do this.
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const switchCamera = (deviceId: string) => {
    setDeviceIdOverride(deviceId);
    if (streamRef.current) {
      stopCamera();
      startCamera(deviceId);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else if (boothRef.current) {
      enterFullscreen(boothRef.current);
    }
  };

  const session = usePhotoSession({
    totalShots,
    countdownSeconds,
    captureShot: () => {
      if (!videoRef.current || !canvasRef.current) return null;
      return captureFrame(videoRef.current, canvasRef.current, selectedFilter, mirror);
    },
    onComplete: (photos) => {
      composeStrip(photos, frame).then(setStripUrl);
    },
  });

  const changeTotalShots = (n: number) => {
    setTotalShots(n);
    session.retake();
    setStripUrl(null);
  };

  const chooseFrame = (f: StripFrame) => {
    setFrame(f);
    if (session.sessionComplete) {
      composeStrip(session.photos, f).then(setStripUrl);
    }
  };

  const reset = () => {
    session.retake();
    setStripUrl(null);
  };

  const subtitle = session.sessionComplete
    ? "All done — download your strip on the right."
    : isCameraOn
      ? `Pick a filter, then hit start. ${countdownSeconds}s between shots.`
      : "Start your camera to begin.";

  const statusLabel = session.isCapturing ? "Shooting" : session.sessionComplete ? "Complete" : "Ready";
  const statusColorClass = session.isCapturing
    ? "bg-primary"
    : session.sessionComplete
      ? "bg-accent"
      : "bg-white/70";

  return (
    <div ref={boothRef} className="w-full bg-base-100 p-1">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)_252px] gap-6 items-start">
        {/* LEFT: options + filters */}
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          <div className="bg-white border border-base-300 rounded-[18px] p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
                Camera
              </span>
              {devices.length > 1 ? (
                <select
                  value={selectedDeviceId ?? ""}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="bg-base-200 border border-base-300 rounded-[11px] px-3.5 py-2.5 text-sm font-medium"
                >
                  {devices.map((d, index) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${index + 1}`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center justify-between bg-base-200 border border-base-300 rounded-[11px] px-3.5 py-2.5 text-sm font-medium">
                  <span>{devices[0]?.label || (isCameraOn ? "Camera" : "Not started")}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
                Number of shots
              </span>
              <div className="flex gap-1.5">
                {SHOT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => changeTotalShots(n)}
                    className={`flex-1 py-2.5 rounded-[10px] border text-sm font-semibold transition-colors ${
                      totalShots === n
                        ? "bg-neutral text-neutral-content border-neutral"
                        : "bg-white text-base-content border-base-300 hover:bg-base-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
                Countdown
              </span>
              <div className="flex gap-1.5">
                {COUNTDOWN_OPTIONS.map((option) => (
                  <button
                    key={option.seconds}
                    onClick={() => setCountdownSeconds(option.seconds)}
                    className={`flex-1 py-2.5 rounded-[10px] border text-sm font-medium transition-colors ${
                      countdownSeconds === option.seconds
                        ? "bg-neutral text-neutral-content border-neutral"
                        : "bg-white text-base-content border-base-300 hover:bg-base-200"
                    }`}
                  >
                    {option.seconds}s
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3.5 pt-4 border-t border-base-200">
              <ToggleSwitch label="Mirror my camera" checked={mirror} onChange={() => setMirror(!mirror)} />
              <ToggleSwitch label="Fullscreen booth" checked={isFullscreen} onChange={toggleFullscreen} />
            </div>
          </div>

          <div className="bg-white border border-base-300 rounded-[18px] p-5 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
              Filter
            </span>
            <div className="grid grid-cols-2 gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f)}
                  className={`relative border rounded-[13px] p-1.5 flex flex-col gap-1.5 text-left bg-white ${
                    selectedFilter.id === f.id ? "ring-2 ring-primary border-transparent" : "border-base-300"
                  }`}
                >
                  <span className="aspect-square rounded-lg block" style={{ backgroundImage: SWATCH_BG, filter: f.css }} />
                  <span className="text-xs font-medium pl-0.5">{f.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-base-content/55 m-0">
              Previews show a sample look. The filter is baked into each photo you take.
            </p>
          </div>
        </div>

        {/* CENTER: camera */}
        <div className="flex flex-col gap-3.5 order-1 lg:order-2">
          <div className="flex items-end justify-between gap-4 px-0.5">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-semibold tracking-tight m-0">Booth</h1>
              <p className="text-sm text-base-content/55 m-0">{subtitle}</p>
            </div>
            <span className="font-mono text-[11px] text-base-content/55 shrink-0 whitespace-nowrap">
              {session.photos.length} / {totalShots}
            </span>
          </div>

          {cameraError && (
            <div className="bg-primary/10 border border-primary/30 text-primary text-sm rounded-xl px-4 py-3">
              {cameraError}
            </div>
          )}

          <div className="relative rounded-[20px] overflow-hidden bg-neutral shadow-[0_18px_44px_-22px_rgba(31,26,29,0.5)] aspect-4/3">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: selectedFilter.css, transform: mirror ? "scaleX(-1)" : "none" }}
              autoPlay
              playsInline
            />

            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/35">
                  Camera feed
                </span>
              </div>
            )}

            {session.countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-8xl font-semibold tracking-tight [text-shadow:0_2px_30px_rgba(0,0,0,.35)]">
                  {session.countdown}
                </span>
              </div>
            )}

            {isCameraOn && (
              <span className="absolute top-3.5 left-3.5 flex gap-1.5">
                <Badge>{selectedFilter.label}</Badge>
                <Badge>{mirror ? "Mirrored" : "As shot"}</Badge>
              </span>
            )}

            <span className="absolute top-3.5 right-3.5">
              <Badge>
                <span className={`inline-block w-[5px] h-[5px] rounded-full mr-1.5 ${statusColorClass}`} />
                {statusLabel}
              </Badge>
            </span>

            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15">
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${(session.photos.length / totalShots) * 100}%` }}
              />
            </div>

            {!isCameraOn && (
              <button
                onClick={() => startCamera(selectedDeviceId ?? undefined)}
                className="absolute top-3.5 left-3.5 bg-primary text-primary-content text-sm font-medium px-4 py-2 rounded-md shadow-md"
              >
                Start Camera
              </button>
            )}

            <div
              className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ${
                session.flash ? "opacity-90" : "opacity-0"
              }`}
            />
            {selectedFilter.id === "vintage" && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 60px 20px rgba(0,0,0,0.45)" }}
              />
            )}
          </div>

          <div className="flex items-center gap-3 bg-white border border-base-300 rounded-2xl p-3">
            {!session.sessionComplete && !session.isCapturing && (
              <button
                onClick={session.start}
                disabled={!isCameraOn}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-content font-semibold text-[15px] py-3.5 rounded-[11px] disabled:opacity-50"
              >
                <span className="w-3 h-3 rounded-full border-2 border-white/90" />
                Take {totalShots} Photo{totalShots > 1 ? "s" : ""}
              </button>
            )}
            {session.isCapturing && (
              <div className="flex-1 flex items-center justify-center gap-2.5 py-2">
                <span className="loading loading-spinner loading-sm text-primary" />
                <span className="font-mono text-sm text-base-content/70">
                  {session.countdown !== null
                    ? `Get ready — photo ${session.photos.length + 1}/${totalShots}`
                    : "Capturing..."}
                </span>
              </div>
            )}
            {session.sessionComplete && (
              <div className="flex-1 text-center text-accent font-medium text-sm py-3.5">
                Strip complete — grab it on the right
              </div>
            )}
            <button
              onClick={reset}
              disabled={session.isCapturing}
              className="bg-white border border-base-300 text-base-content/70 text-sm font-medium px-5 py-3.5 rounded-[11px] disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT: live strip */}
        <div className="flex flex-col gap-4 order-3">
          <div className="bg-white border border-base-300 rounded-[18px] p-4.5 flex flex-col gap-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
                Your strip
              </span>
              <span className="font-mono text-[10px] text-base-content/35">
                {session.photos.length} / {totalShots}
              </span>
            </div>

            <div
              className="rounded-[10px] p-2.5 pb-4 flex flex-col gap-1.5 shadow-[0_6px_18px_-10px_rgba(31,26,29,0.28)]"
              style={{ background: frame.color }}
            >
              {Array.from({ length: totalShots }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-4/3 rounded-[5px] overflow-hidden bg-[#f1ede9] flex items-center justify-center"
                >
                  {session.photos[i] ? (
                    <Image src={session.photos[i]} alt={`Photo ${i + 1}`} fill className="object-cover" />
                  ) : (
                    <span className="font-mono text-xs text-[#c0b9bd]">{i + 1}</span>
                  )}
                </div>
              ))}
              <p
                className="font-mono text-[8px] tracking-[0.1em] text-center m-0"
                style={{ color: frame.captionColor }}
              >
                {formatDateStamp(new Date())}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-3.5 border-t border-base-200">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
                Frame
              </span>
              <div className="flex gap-1.5">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => chooseFrame(f)}
                    aria-label={f.label}
                    aria-pressed={frame.id === f.id}
                    className={`w-7 h-7 rounded-lg border ${
                      f.id === "white" ? "border-base-300" : "border-transparent"
                    } ${frame.id === f.id ? "ring-2 ring-neutral ring-offset-2 ring-offset-white" : ""}`}
                    style={{ background: f.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-base-300 rounded-[18px] p-4.5 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-base-content/55">
              Download
            </span>
            <p className="text-[11px] leading-relaxed text-base-content/55 m-0">
              {session.sessionComplete
                ? "Your strip is ready."
                : `Finish all ${totalShots} shot${totalShots > 1 ? "s" : ""} to unlock the download.`}
            </p>
            <a
              href={stripUrl ?? undefined}
              download="photobooth-strip.png"
              aria-disabled={!stripUrl}
              className="bg-neutral text-neutral-content text-sm font-medium py-2.5 rounded-[10px] text-center aria-disabled:opacity-50 aria-disabled:pointer-events-none"
            >
              Download Strip
            </a>
          </div>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
