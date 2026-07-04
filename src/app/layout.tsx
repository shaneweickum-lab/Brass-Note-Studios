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
  metadataBase: new URL("https://brassnotestudios.com"),
  title: {
    default: "Brass Note Studios — Bespoke Songwriting & Music Production",
    template: "%s | Brass Note Studios",
  },
  description:
    "Commission an original song crafted for your story. Brass Note Studios is a bespoke music atelier serving individuals, organizations, and content creators worldwide.",
  keywords: [
    "custom song",
    "commission a song",
    "bespoke music production",
    "custom songwriting service",
    "personalized song",
    "original music commission",
    "custom song gift",
    "professional songwriting",
    "commissioned music",
    "Brass Note Studios",
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Brass Note Studios — Bespoke Songwriting & Music Production",
    description:
      "Commission an original song crafted for your story. A bespoke music atelier for individuals, organizations, and content creators.",
    siteName: "Brass Note Studios",
    type: "website",
    url: "https://brassnotestudios.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brass Note Studios — Bespoke Songwriting & Music Production",
    description:
      "Commission an original song crafted for your story. A bespoke music atelier for individuals, organizations, and content creators.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const songs = songsData.songs as Song[];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Brass Note Studios",
    url: "https://brassnotestudios.com",
    logo: "https://brassnotestudios.com/favicon.png",
    description:
      "Bespoke songwriting and music production studio offering commissioned original songs for individuals, organizations, and content creators.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://brassnotestudios.com/contact",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Brass Note Studios",
    url: "https://brassnotestudios.com",
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${cormorantSC.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
        />
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
