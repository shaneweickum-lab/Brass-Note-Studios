import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

// Signed URL valid for 24 hours
const SIGNED_URL_TTL = 60 * 60 * 24;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    // Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const songId = session.metadata?.songId;
    const downloadFileKey = session.metadata?.downloadFileKey;

    if (!songId || !downloadFileKey) {
      return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Record the purchase (upsert on session_id so duplicate clicks are safe)
    await supabase.from("song_purchases").upsert(
      {
        stripe_session_id: sessionId,
        song_id: songId,
        customer_email: session.customer_details?.email ?? null,
        amount_total: session.amount_total,
        currency: session.currency ?? "usd",
        download_file_key: downloadFileKey,
      },
      { onConflict: "stripe_session_id" }
    );

    // Generate a signed URL from Supabase Storage
    const { data, error } = await supabase.storage
      .from("songs")
      .createSignedUrl(downloadFileKey.replace(/^songs\//, ""), SIGNED_URL_TTL, {
        download: true,
      });

    if (error || !data?.signedUrl) {
      console.error("[download] signed URL error", error);
      return NextResponse.json({ error: "Could not generate download link" }, { status: 500 });
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    console.error("[download]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
