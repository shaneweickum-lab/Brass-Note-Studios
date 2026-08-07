import { notFound } from "next/navigation";
import songsData from "@/data/songs.json";
import type { Song } from "@/types";
import CheckoutShell from "./CheckoutShell";

interface Props {
  params: Promise<{ songId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { songId } = await params;
  const song = (songsData.songs as Song[]).find((s) => s.id === songId);
  if (!song) return {};
  return {
    title: `Buy ${song.title} — Brass Note Studios`,
    description: `Purchase a personal-use MP3 of "${song.title}" — $${song.downloadPrice?.toFixed(2)}`,
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { songId } = await params;
  const song = (songsData.songs as Song[]).find(
    (s) => s.id === songId && s.purchasable && s.downloadPrice
  );

  if (!song) notFound();

  return <CheckoutShell song={song} />;
}
