import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import songsData from "@/data/songs.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { songId } = (await req.json()) as { songId?: string };

    if (!songId) {
      return NextResponse.json({ error: "songId required" }, { status: 400 });
    }

    const song = songsData.songs.find((s) => s.id === songId);

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    if (!song.purchasable || !song.downloadPrice || !song.downloadFileKey) {
      return NextResponse.json({ error: "Song is not available for purchase" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(song.downloadPrice * 100),
      currency: "usd",
      statement_descriptor: "BRASS NOTE STUDIOS",
      metadata: {
        songId: song.id,
        songTitle: song.title,
        downloadFileKey: song.downloadFileKey,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      song: {
        id: song.id,
        title: song.title,
        clientName: song.clientName,
        genre: song.genre ?? null,
        description: song.description ?? null,
        downloadPrice: song.downloadPrice,
      },
    });
  } catch (err) {
    console.error("[checkout/song]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
