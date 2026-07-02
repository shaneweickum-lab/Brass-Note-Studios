import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const logoBuffer = fs.readFileSync(
    path.join(process.cwd(), "public/images/0B0ACD04-F24F-42EE-B65E-4B07CB4ADC11.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
        }}
      >
        <img
          src={logoSrc}
          style={{
            width: "160px",
            height: "107px",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { width: 180, height: 180 }
  );
}
