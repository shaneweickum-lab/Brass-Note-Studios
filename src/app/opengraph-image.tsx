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
  const logoBuffer = fs.readFileSync(
    path.join(process.cwd(), "public/images/0B0ACD04-F24F-42EE-B65E-4B07CB4ADC11.png")
  );

  const bgSrc = `data:image/png;base64,${bgBuffer.toString("base64")}`;
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0A0A0A",
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

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(160deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.72) 100%)",
          }}
        />

        {/* Atelier logo — bottom left */}
        <img
          src={logoSrc}
          width={380}
          height={108}
          style={{
            position: "absolute",
            bottom: 48,
            left: 56,
            objectFit: "contain",
            objectPosition: "left center",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
