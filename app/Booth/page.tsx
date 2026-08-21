"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { usePhotoSession } from "@/src/hooks/usePhotoSession";
import { captureFrame, composeStrip, FILTERS, type PhotoFilter } from "@/src/lib/photobooth";

const TOTAL_SHOTS = 4;
const COUNTDOWN_SECONDS = 3;

export default function Booth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>(FILTERS[0]);
  const [stripUrl, setStripUrl] = useState<string | null>(null);

  // Camera device access stays local to this component: refs must be read
  // inside the event handlers that use them, not returned from a shared hook.
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const session = usePhotoSession({
    totalShots: TOTAL_SHOTS,
    countdownSeconds: COUNTDOWN_SECONDS,
    captureShot: () => {
      if (!videoRef.current || !canvasRef.current) return null;
      return captureFrame(videoRef.current, canvasRef.current, selectedFilter);
    },
    onComplete: (photos) => {
      stopCamera();
      composeStrip(photos).then(setStripUrl);
    },
  });

  const retake = () => {
    session.retake();
    setStripUrl(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <h1 className="font-display text-4xl font-bold text-center">Photobooth</h1>
      <p className="font-mono text-sm text-neutral-content/70 text-center max-w-xs">
        Use your camera to take a strip of 4 photos!
      </p>

      {/* Video Stream */}
      {!session.sessionComplete && (
        <div className="relative">
          <video
            ref={videoRef}
            className="rounded-lg shadow-md"
            style={{ filter: selectedFilter.css }}
            autoPlay
            playsInline
          />
          <button
            onClick={startCamera}
            className="absolute top-2 left-2 bg-primary text-white px-4 py-2 rounded-md shadow-md"
          >
            Start Camera
          </button>
          <div
            className={`absolute inset-0 rounded-lg bg-white pointer-events-none transition-opacity duration-150 ${
              session.flash ? "opacity-90" : "opacity-0"
            }`}
          />
          {selectedFilter.id === "vintage" && (
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                boxShadow: "inset 0 0 60px 20px rgba(0,0,0,0.45)",
              }}
            />
          )}
        </div>
      )}

      {/* Filter Picker */}
      {!session.sessionComplete && !session.isCapturing && (
        <div className="flex gap-2 flex-wrap justify-center">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-mono shadow-md transition-colors ${
                selectedFilter.id === f.id
                  ? "bg-secondary text-white"
                  : "bg-white text-neutral-content hover:bg-neutral-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Capture Button */}
      {!session.sessionComplete && !session.isCapturing && (
        <button
          onClick={session.start}
          className="bg-secondary text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          📸 Take {TOTAL_SHOTS} Photos
        </button>
      )}

      {/* Capture Progress */}
      {session.isCapturing && (
        <div className="flex flex-col items-center gap-2">
          {session.countdown !== null ? (
            <span className="font-display text-6xl font-bold text-secondary">
              {session.countdown}
            </span>
          ) : (
            <span className="loading loading-spinner loading-lg text-primary-content" />
          )}
          <span className="font-mono text-sm text-primary-content">
            {session.countdown !== null
              ? `Get ready! Photo ${session.photos.length + 1}/${TOTAL_SHOTS}`
              : `Taking photo ${session.photos.length + 1}/${TOTAL_SHOTS}...`}
          </span>
        </div>
      )}

      {/* Photo Strip */}
      {session.sessionComplete && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow-md">
            {session.photos.map((src, index) => (
              <div key={index} className="relative w-56 aspect-4/3">
                <Image
                  src={src}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="rounded object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href={stripUrl ?? undefined}
              download="photobooth-strip.png"
              aria-disabled={!stripUrl}
              className="bg-primary text-white px-4 py-2 rounded-md shadow-md aria-disabled:opacity-60 aria-disabled:pointer-events-none"
            >
              Download Strip
            </a>
            <button
              onClick={retake}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
