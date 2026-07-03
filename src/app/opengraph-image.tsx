import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Brass Note Studios — Custom Songwriting & Production";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const bgBuffer = fs.readFileSync(
    path.join(process.cwd(), "public/images/IMG_5110.png")
  );

  const bgSrc = `data:image/png;base64,${bgBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0A0A0A",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Background photo */}
        <img
          src={bgSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Dark overlay — heavier at bottom to anchor the text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(170deg, rgba(8,6,7,0.45) 0%, rgba(8,6,7,0.78) 55%, rgba(8,6,7,0.92) 100%)",
            display: "flex",
          }}
        />

        {/* Border frame */}
        <div
          style={{
            position: "absolute",
            inset: "40px",
            border: "1px solid rgba(201,146,26,0.40)",
            display: "flex",
          }}
        />

        {/* Corner bracket — top-left */}
        <div style={{ position: "absolute", top: 26, left: 26, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 26, height: 2, background: "rgba(201,146,26,0.9)", display: "flex" }} />
          <div style={{ width: 2, height: 24, background: "rgba(201,146,26,0.9)", display: "flex" }} />
        </div>
        {/* Corner bracket — top-right */}
        <div style={{ position: "absolute", top: 26, right: 26, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ width: 26, height: 2, background: "rgba(201,146,26,0.9)", display: "flex" }} />
          <div style={{ width: 2, height: 24, background: "rgba(201,146,26,0.9)", display: "flex", alignSelf: "flex-end" }} />
        </div>
        {/* Corner bracket — bottom-left */}
        <div style={{ position: "absolute", bottom: 26, left: 26, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ width: 2, height: 24, background: "rgba(201,146,26,0.9)", display: "flex" }} />
          <div style={{ width: 26, height: 2, background: "rgba(201,146,26,0.9)", display: "flex" }} />
        </div>
        {/* Corner bracket — bottom-right */}
        <div style={{ position: "absolute", bottom: 26, right: 26, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
          <div style={{ width: 2, height: 24, background: "rgba(201,146,26,0.9)", display: "flex", alignSelf: "flex-end" }} />
          <div style={{ width: 26, height: 2, background: "rgba(201,146,26,0.9)", display: "flex" }} />
        </div>

        {/* Business card content — bottom-left anchor */}
        <div
          style={{
            position: "absolute",
            bottom: 76,
            left: 80,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Atelier eyebrow */}
          <div
            style={{
              color: "#C9921A",
              fontSize: 14,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              marginBottom: 16,
              opacity: 0.9,
            }}
          >
            Atelier
          </div>

          {/* Studio name */}
          <div
            style={{
              color: "#F5F0E8",
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              marginBottom: 20,
              textShadow: "0 2px 24px rgba(0,0,0,0.8)",
            }}
          >
            Brass Note Studios
          </div>

          {/* Divider rule */}
          <div
            style={{
              width: 80,
              height: 1,
              background: "rgba(201,146,26,0.65)",
              marginBottom: 20,
              display: "flex",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              color: "rgba(245,240,232,0.65)",
              fontSize: 20,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            Custom Songwriting &amp; Production
          </div>
        </div>

        {/* URL — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 84,
            right: 80,
            color: "rgba(201,146,26,0.60)",
            fontSize: 15,
            letterSpacing: "0.12em",
          }}
        >
          brassnotestudios.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
