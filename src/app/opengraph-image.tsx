import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "MyCasePrep - AI Case Interview Practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/newlogomcp.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

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
            "linear-gradient(135deg, #ded6fb 0%, #fbe0d6 45%, #d6f7e6 75%, #cdeaf9 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logoSrc} width={140} height={140} />
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#1e1b2e",
          }}
        >
          mycaseprep
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 32,
            fontWeight: 500,
            color: "#4b4560",
          }}
        >
          Ace your consulting case interview
        </div>
      </div>
    ),
    { ...size }
  );
}
