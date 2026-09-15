import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fcfbf9",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 9999,
            background: "#e8624c",
            boxShadow: "0 0 0 18px rgba(232,98,76,0.18)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
