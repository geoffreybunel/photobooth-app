// Capture engine: turns a video frame into a filtered photo, and photos into a strip.
// Framework-agnostic on purpose — takes DOM elements/data URLs in, returns data URLs out,
// so it works the same whether the frame comes from a local camera or a remote peer.

export type PhotoFilter = { id: string; label: string; css: string };

export const FILTERS: PhotoFilter[] = [
  { id: "original", label: "Original", css: "none" },
  { id: "bw", label: "Black & White", css: "grayscale(1) contrast(1.1)" },
  { id: "sepia", label: "Sepia", css: "sepia(0.8) contrast(1.05)" },
  {
    id: "vintage",
    label: "Vintage",
    css: "grayscale(1) contrast(1.35) brightness(1.05)",
  },
];

const GRAIN_INTENSITY = 18;
const STRIP_PADDING = 20;
const PHOTO_GAP = 16;

// Film-grain noise, added pixel-by-pixel like an old strip photo
function applyFilmGrain(context: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * GRAIN_INTENSITY;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  context.putImageData(imageData, 0, 0);
}

// Darkened corners, like the lens falloff on a real photobooth camera
function applyVignette(context: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = context.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.3,
    width / 2,
    height / 2,
    width * 0.75
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.45)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

// Grab the current video frame, with the given filter baked in, as a data URL
export function captureFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  filter: PhotoFilter
): string | null {
  const context = canvas.getContext("2d");
  if (!context) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.filter = filter.css;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (filter.id === "vintage") {
    context.filter = "none";
    applyFilmGrain(context, canvas.width, canvas.height);
    applyVignette(context, canvas.width, canvas.height);
  }

  return canvas.toDataURL("image/png");
}

// Stack a set of shots into one vertical, printable strip
export async function composeStrip(shots: string[]): Promise<string> {
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
