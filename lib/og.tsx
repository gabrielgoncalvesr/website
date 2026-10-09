import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card. Design branches restyle this. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fafaf9",
          color: "#1a1a18",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#6b6b66" }}>{eyebrow}</div>
        <div style={{ fontSize: title.length > 50 ? 64 : 80, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#6b6b66" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
