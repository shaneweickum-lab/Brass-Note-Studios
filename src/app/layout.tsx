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
import AtelierConcierge from "@/components/chatbot/AtelierConcierge";
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
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Brass Note Studios",
    description:
      "Custom songs written and produced for life's meaningful moments, brands, and organizations. Professional quality, personal touch.",
    siteName: "Brass Note Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brass Note Studios",
    description:
      "Custom songs written and produced for life's meaningful moments, brands, and organizations. Professional quality, personal touch.",
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
        <PlayerProvider initialSongs={songs}>
          <Navbar />
          <main className="pt-14">{children}</main>
          <Footer />
          <PlaylistPlayer />
          <LabVisualizer />
          <WelcomeOverlay />
          <AtelierConcierge />
        </PlayerProvider>
      </body>
    </html>
  );
}
