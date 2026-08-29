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

export type StripFrame = { id: string; label: string; color: string; captionColor: string };

export const FRAMES: StripFrame[] = [
  { id: "white", label: "White", color: "#ffffff", captionColor: "#c0b9bd" },
  { id: "coral", label: "Coral", color: "#e8624c", captionColor: "rgba(255,255,255,0.85)" },
  { id: "gold", label: "Gold", color: "#f0b429", captionColor: "rgba(255,255,255,0.85)" },
  { id: "teal", label: "Teal", color: "#2ec4b6", captionColor: "rgba(255,255,255,0.85)" },
  { id: "ink", label: "Ink", color: "#26191f", captionColor: "rgba(255,255,255,0.55)" },
];

const GRAIN_INTENSITY = 18;
const STRIP_PADDING = 20;
const PHOTO_GAP = 16;
const CAPTION_HEIGHT = 28;

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

// Grab the current video frame, with the given filter (and optional mirror) baked in
export function captureFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  filter: PhotoFilter,
  mirror: boolean
): string | null {
  const context = canvas.getContext("2d");
  if (!context) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.filter = filter.css;

  if (mirror) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.setTransform(1, 0, 0, 1, 0, 0);

  if (filter.id === "vintage") {
    context.filter = "none";
    applyFilmGrain(context, canvas.width, canvas.height);
    applyVignette(context, canvas.width, canvas.height);
  }

  return canvas.toDataURL("image/png");
}

// DD.MM.YY, printed on the strip like a real photobooth's date stamp
export function formatDateStamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${String(date.getFullYear()).slice(-2)}`;
}

// Stack a set of shots into one vertical, printable strip with a colored frame + date stamp
export async function composeStrip(
  shots: string[],
  frame: StripFrame
): Promise<string> {
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
    STRIP_PADDING * 2 +
    photoHeight * images.length +
    PHOTO_GAP * (images.length - 1) +
    CAPTION_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) return "";

  context.fillStyle = frame.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  images.forEach((img, index) => {
    const y = STRIP_PADDING + index * (photoHeight + PHOTO_GAP);
    context.drawImage(img, STRIP_PADDING, y, photoWidth, photoHeight);
  });

  const captionY =
    STRIP_PADDING + photoHeight * images.length + PHOTO_GAP * (images.length - 1) + CAPTION_HEIGHT * 0.65;
  context.fillStyle = frame.captionColor;
  context.font = "11px 'Space Mono', monospace";
  context.textAlign = "center";
  context.fillText(formatDateStamp(new Date()), canvas.width / 2, captionY);

  return canvas.toDataURL("image/png");
}
