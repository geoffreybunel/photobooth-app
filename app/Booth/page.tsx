"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TOTAL_SHOTS = 4;
const COUNTDOWN_SECONDS = 3;
const STRIP_PADDING = 20;
const PHOTO_GAP = 16;

async function composeStrip(shots: string[]): Promise<string> {
  const images = await Promise.all(
    shots.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        })
    )
  );

  const photoWidth = Math.min(...images.map((img) => img.width));
  const photoHeight = (photoWidth * images[0].height) / images[0].width;

  const canvas = document.createElement("canvas");
  canvas.width = photoWidth + STRIP_PADDING * 2;
  canvas.height =
    STRIP_PADDING * 2 + photoHeight * images.length + PHOTO_GAP * (images.length - 1);

  const context = canvas.getContext("2d");
  if (!context) return "";

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  images.forEach((img, index) => {
    const y = STRIP_PADDING + index * (photoHeight + PHOTO_GAP);
    context.drawImage(img, STRIP_PADDING, y, photoWidth, photoHeight);
  });

  return canvas.toDataURL("image/png");
}

export default function Booth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [stripUrl, setStripUrl] = useState<string | null>(null);

  // Start the camera
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

  // Stop the camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Grab a single frame from the video stream
  const takeSnapshot = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return null;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  // Capture a full 4-shot photobooth session
  const startPhotoSession = async () => {
    setPhotos([]);
    setStripUrl(null);
    setIsCapturing(true);

    for (let shot = 0; shot < TOTAL_SHOTS; shot++) {
      for (let s = COUNTDOWN_SECONDS; s > 0; s--) {
        setCountdown(s);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setCountdown(null);

      setFlash(true);
      const dataUrl = takeSnapshot();
      if (dataUrl) {
        setPhotos((prev) => [...prev, dataUrl]);
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
      setFlash(false);
    }

    setIsCapturing(false);
  };

  const retake = () => {
    setPhotos([]);
    setStripUrl(null);
  };

  // Once all shots are in, stop the camera and compose the printable strip
  useEffect(() => {
    if (photos.length !== TOTAL_SHOTS) return;
    stopCamera();

    let cancelled = false;
    composeStrip(photos).then((url) => {
      if (!cancelled) setStripUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [photos]);

  const sessionComplete = photos.length === TOTAL_SHOTS;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <h1 className="font-display text-4xl font-bold text-center">Photobooth</h1>
      <p className="font-mono text-sm text-neutral-content/70 text-center max-w-xs">
        Use your camera to take a strip of 4 photos!
      </p>

      {/* Video Stream */}
      {!sessionComplete && (
        <div className="relative">
          <video
            ref={videoRef}
            className="rounded-lg shadow-md"
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
              flash ? "opacity-90" : "opacity-0"
            }`}
          />
        </div>
      )}

      {/* Capture Button */}
      {!sessionComplete && !isCapturing && (
        <button
          onClick={startPhotoSession}
          className="bg-secondary text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          📸 Take {TOTAL_SHOTS} Photos
        </button>
      )}

      {/* Capture Progress */}
      {isCapturing && (
        <div className="flex flex-col items-center gap-2">
          {countdown !== null ? (
            <span className="font-display text-6xl font-bold text-secondary">
              {countdown}
            </span>
          ) : (
            <span className="loading loading-spinner loading-lg text-primary-content" />
          )}
          <span className="font-mono text-sm text-primary-content">
            {countdown !== null
              ? `Get ready! Photo ${photos.length + 1}/${TOTAL_SHOTS}`
              : `Taking photo ${photos.length + 1}/${TOTAL_SHOTS}...`}
          </span>
        </div>
      )}

      {/* Photo Strip */}
      {sessionComplete && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow-md">
            {photos.map((src, index) => (
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
