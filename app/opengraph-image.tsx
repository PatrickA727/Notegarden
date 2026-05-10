import { ImageResponse } from "next/og"

export const alt = "Notegarden — Guitar Fretboard Trainer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
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
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #1f1f23 0%, #09090b 75%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "64px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(82,82,91,0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
          }}
        >
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
            <line x1="17" y1="17" x2="83" y2="17" stroke="#f5f5f2" strokeWidth="3" />
            <line x1="17" y1="39" x2="83" y2="39" stroke="#f5f5f2" strokeWidth="1.2" />
            <line x1="17" y1="61" x2="83" y2="61" stroke="#f5f5f2" strokeWidth="1.2" />
            <line x1="17" y1="83" x2="83" y2="83" stroke="#f5f5f2" strokeWidth="1.2" />
            <line x1="17" y1="17" x2="17" y2="83" stroke="#f5f5f2" strokeWidth="1.2" />
            <line x1="39" y1="17" x2="39" y2="83" stroke="#f5f5f2" strokeWidth="1.2" />
            <line x1="61" y1="17" x2="61" y2="83" stroke="#f5f5f2" strokeWidth="1.2" />
            <line x1="83" y1="17" x2="83" y2="83" stroke="#f5f5f2" strokeWidth="1.2" />
            <circle cx="39" cy="50" r="5" fill="#f5f5f2" />
            <circle cx="61" cy="72" r="5" fill="#f5f5f2" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: "#fafafa",
              }}
            >
              Notegarden
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 500,
                color: "#a1a1aa",
                letterSpacing: "-0.01em",
              }}
            >
              Guitar Fretboard Trainer
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 24,
            color: "#71717a",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Adaptive · Free · In your browser
        </div>
      </div>
    ),
    size,
  )
}
