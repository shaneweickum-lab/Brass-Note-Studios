import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlayerProvider from "@/components/music/PlayerProvider";
import PlaylistPlayer from "@/components/music/PlaylistPlayer";
import songsData from "@/data/songs.json";
import type { Song } from "@/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const songs = songsData.songs as Song[];

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <PlayerProvider initialSongs={songs}>
          <Navbar />
          <main className="pt-16 md:pt-20">{children}</main>
          <Footer />
          <PlaylistPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
