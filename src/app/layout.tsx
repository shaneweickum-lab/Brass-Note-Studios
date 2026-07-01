import type { Metadata } from "next";
import { Cormorant_Garamond, Cormorant_SC, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlayerProvider from "@/components/music/PlayerProvider";
import PlaylistPlayer from "@/components/music/PlaylistPlayer";
import LabVisualizer from "@/components/music/LabVisualizer";
import WelcomeOverlay from "@/components/ui/WelcomeOverlay";
import ScoreCircuitBackground from "@/components/ui/ScoreCircuitBackground";
import CustomCursor from "@/components/ui/CustomCursor";
import songsData from "@/data/songs.json";
import type { Song } from "@/types";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  variable: "--font-cormorant-sc",
  weight: ["500"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brass Note Studios — Custom Songwriting & Production",
    template: "%s | Brass Note Studios",
  },
  description:
    "Custom songs written and produced for individuals, organizations, and brands. From personal milestones to brand anthems — every song crafted with heart.",
  openGraph: {
    siteName: "Brass Note Studios",
    type: "website",
    images: [{ url: "/images/IMG_5110.png", width: 1200, height: 400 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const songs = songsData.songs as Song[];

  return (
    <html lang="en" className={`${cormorant.variable} ${cormorantSC.variable} ${inter.variable}`}>
      <body>
        <ScoreCircuitBackground />
        <CustomCursor />
        <PlayerProvider initialSongs={songs}>
          <Navbar />
          <main className="pt-[150px] md:pt-[174px]">{children}</main>
          <Footer />
          <PlaylistPlayer />
          <LabVisualizer />
          <WelcomeOverlay />
        </PlayerProvider>
      </body>
    </html>
  );
}
