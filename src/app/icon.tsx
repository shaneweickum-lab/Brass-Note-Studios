import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const logoBuffer = fs.readFileSync(
    path.join(process.cwd(), "public/images/B6E31839-3169-4CE4-A5D6-A45D2ED27628.png")
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
          width={28}
          height={28}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { width: 32, height: 32 }
  );
}
