import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";

export const alt = `CV Show: an interactive interview with ${profile.name}, ${profile.role.toLowerCase()}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bungee = await readFile(join(process.cwd(), "assets/Bungee-Regular.ttf"));
const face = await readFile(join(process.cwd(), "src/app/icon.png"));
const faceSrc = `data:image/png;base64,${face.toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 80px",
          color: "#fff8e7",
          background:
            "radial-gradient(circle at 30% 20%, #2a1aa8 0%, #170f5c 70%)",
          border: "14px solid #ffc93c",
        }}
      >
        <img src={faceSrc} width={380} height={380} alt="" />
        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          <div
            style={{
              fontFamily: "Bungee",
              fontSize: 26,
              letterSpacing: 6,
              color: "#2de2e6",
            }}
          >
            Tonight&apos;s episode
          </div>
          <div
            style={{
              fontFamily: "Bungee",
              fontSize: 112,
              lineHeight: 1,
              marginTop: 8,
              textShadow: "5px 5px 0 #ff3e8a",
            }}
          >
            CV Show
          </div>
          <div style={{ fontSize: 40, marginTop: 28 }}>{profile.name}</div>
          <div style={{ fontSize: 24, marginTop: 10, color: "#d9d4f5" }}>
            {profile.role}
          </div>
          <div style={{ fontSize: 20, marginTop: 6, color: "#2de2e6" }}>
            {profile.headlineStack.join(" · ")}
          </div>
          <div style={{ display: "flex", marginTop: 32 }}>
            <div
              style={{
                fontFamily: "Bungee",
                fontSize: 22,
                padding: "12px 22px",
                borderRadius: 16,
                background: "#ffc93c",
                color: "#170f5c",
              }}
            >
              Interview me instead of reading my CV
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bungee", data: bungee, style: "normal", weight: 400 }],
    },
  );
}
