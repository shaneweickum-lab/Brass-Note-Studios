import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

const SIGNED_URL_TTL = 60 * 60 * 24; // 24 hours

export async function GET(req: NextRequest) {
  const paymentIntentId = req.nextUrl.searchParams.get("payment_intent");

  if (!paymentIntentId) {
    return NextResponse.json({ error: "payment_intent required" }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const songId = paymentIntent.metadata?.songId;
    const downloadFileKey = paymentIntent.metadata?.downloadFileKey;

    if (!songId || !downloadFileKey) {
      return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Record the purchase (upsert so duplicate download clicks are safe)
    await supabase.from("song_purchases").upsert(
      {
        stripe_session_id: paymentIntentId,
        song_id: songId,
        customer_email: paymentIntent.receipt_email ?? null,
        amount_total: paymentIntent.amount,
        currency: paymentIntent.currency,
        download_file_key: downloadFileKey,
      },
      { onConflict: "stripe_session_id" }
    );

    // Generate Supabase Storage signed URL
    const { data, error } = await supabase.storage
      .from("songs")
      .createSignedUrl(downloadFileKey.replace(/^songs\//, ""), SIGNED_URL_TTL, {
        download: true,
      });

    if (error || !data?.signedUrl) {
      console.error("[download] signed URL error", error);
      return NextResponse.json({ error: "Could not generate download link" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    console.error("[download]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
