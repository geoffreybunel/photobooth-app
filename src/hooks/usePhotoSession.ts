import { useState } from "react";

const FLASH_MS = 150;

type UsePhotoSessionOptions = {
  totalShots: number;
  countdownSeconds: number;
  // Takes a single shot and returns its data URL; the hook doesn't care where it comes from.
  captureShot: () => string | null;
  onComplete?: (photos: string[]) => void;
};

// Drives a countdown-and-shoot sequence: when to count down, when to flash, when it's done.
// Knows nothing about cameras, filters, or storage — those are supplied by the caller.
export function usePhotoSession({
  totalShots,
  countdownSeconds,
  captureShot,
  onComplete,
}: UsePhotoSessionOptions) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const start = async () => {
    setPhotos([]);
    setIsCapturing(true);

    const captured: string[] = [];
    for (let shot = 0; shot < totalShots; shot++) {
      for (let s = countdownSeconds; s > 0; s--) {
        setCountdown(s);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setCountdown(null);

      setFlash(true);
      const dataUrl = captureShot();
      if (dataUrl) {
        captured.push(dataUrl);
        setPhotos((prev) => [...prev, dataUrl]);
      }
      await new Promise((resolve) => setTimeout(resolve, FLASH_MS));
      setFlash(false);
    }

    setIsCapturing(false);
    onComplete?.(captured);
  };

  const retake = () => {
    setPhotos([]);
  };

  return {
    photos,
    isCapturing,
    countdown,
    flash,
    sessionComplete: photos.length === totalShots,
    start,
    retake,
  };
}
