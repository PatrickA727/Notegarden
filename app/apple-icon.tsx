import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

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
          background: "#09090b",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
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
      </div>
    ),
    size,
  )
}
