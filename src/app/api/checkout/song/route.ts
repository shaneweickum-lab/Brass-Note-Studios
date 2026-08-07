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

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(song.downloadPrice * 100),
            product_data: {
              name: song.title,
              description: `Personal-use MP3 license — ${song.title} by Brass Note Studios`,
              metadata: {
                songId: song.id,
                downloadFileKey: song.downloadFileKey,
              },
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        songId: song.id,
        downloadFileKey: song.downloadFileKey,
      },
      success_url: `${origin}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/music`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout/song]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
