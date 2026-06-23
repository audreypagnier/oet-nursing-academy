import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "Prepare Your OET Nursing Exam — OET Nursing Academy";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B1E4B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "40px" }}>
          <span style={{ fontSize: "80px", fontWeight: 900, color: "#00C2C7", letterSpacing: "-3px", lineHeight: 1 }}>
            OET
          </span>
          <span style={{ fontSize: "40px", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.5px", lineHeight: 1 }}>
            Nursing Academy
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "28px",
            maxWidth: "960px",
          }}
        >
          Prepare Your OET Nursing Exam
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "820px",
          }}
        >
          Vocabulary · Listening · Reading · Speaking · Writing · AI Feedback
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#00C2C7",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
