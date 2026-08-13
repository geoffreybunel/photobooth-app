"use client";

import { useRef, useState } from "react";

export default function Booth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  // Capture a photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData); // Save the photo as a data URL
      }
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <h1 className="font-display text-4xl font-bold text-center">Photobooth</h1>
      <p className="font-mono text-sm text-neutral-content/70 text-center max-w-xs">
        Use your camera to take a photo!
      </p>

      {/* Video Stream */}
      {!photo && (
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
        </div>
      )}

      {/* Capture Button */}
      {!photo && (
        <button
          onClick={capturePhoto}
          className="bg-secondary text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          📸 Capture Photo
        </button>
      )}

      {/* Display Photo */}
      {photo && (
        <div className="flex flex-col items-center gap-4">
          <img src={photo} alt="Captured" className="rounded-lg shadow-md max-w-xs"/>
          <div className="flex gap-4">
            <a
              href={photo}
              download="photo.png"
              className="bg-primary text-white px-4 py-2 rounded-md shadow-md"
            >
              Download
            </a>
            <button
              onClick={() => {
                setPhoto(null);
                stopCamera();
              }}
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