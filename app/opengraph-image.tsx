import { ImageResponse } from "next/og";

export const alt = "Joysnap — Photobooth in your browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(180deg, #fff9f2 0%, #fcfbf9 34%, #f8faf9 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: "#e8624c",
            }}
          />
          <div
            style={{
              fontSize: 108,
              fontWeight: 700,
              color: "#1f1a1d",
              letterSpacing: "-0.03em",
            }}
          >
            Joysnap
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            color: "#6b6469",
          }}
        >
          A photobooth that lives in your browser
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 14,
          }}
        >
          {["#e8624c", "#f0b429", "#2ec4b6", "#26191f"].map((color) => (
            <div
              key={color}
              style={{
                width: 64,
                height: 48,
                borderRadius: 6,
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
