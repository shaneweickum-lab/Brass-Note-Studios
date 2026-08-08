import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

interface IntakeData {
  name?: string;
  email?: string;
  serviceType?: string;
  packageName?: string;
  songTitle?: string;
  genreOrReference?: string;
  whoIsItFor?: string;
  storyOrLyrics?: string;
  songLength?: string;
  vocalType?: string;
  vocalStyle?: string;
  requestedDate?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, intake } = (await req.json()) as {
      paymentIntentId?: string;
      intake?: IntakeData;
    };

    if (!paymentIntentId) {
      return NextResponse.json({ error: "paymentIntentId required" }, { status: 400 });
    }

    // Verify payment succeeded before sending the notification
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
    }

    const amountDollars = (pi.amount / 100).toFixed(2);
    const addons = pi.metadata?.addons ?? "";

    const res = await fetch("https://formspree.io/f/xkoljkey", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        // intake fields
        name:             intake?.name ?? pi.metadata?.customerName ?? "",
        email:            intake?.email ?? pi.receipt_email ?? "",
        serviceType:      intake?.serviceType ?? pi.metadata?.serviceName ?? "",
        packageName:      intake?.packageName ?? pi.metadata?.packageName ?? "",
        songTitle:        intake?.songTitle ?? pi.metadata?.songTitle ?? "",
        genreOrReference: intake?.genreOrReference ?? "",
        whoIsItFor:       intake?.whoIsItFor ?? "",
        storyOrLyrics:    intake?.storyOrLyrics ?? "",
        songLength:       intake?.songLength ?? "",
        vocalType:        intake?.vocalType ?? "",
        vocalStyle:       intake?.vocalStyle ?? "",
        requestedDate:    intake?.requestedDate ?? "",
        // payment confirmation
        _subject:         `New commission paid — ${intake?.packageName ?? pi.metadata?.packageName ?? "BNS"}`,
        paymentConfirmed: "YES",
        paymentIntentId,
        amountPaid:       `$${amountDollars}`,
        addons:           addons || "None",
      }),
    });

    if (!res.ok) {
      console.error("[commission/notify] Formspree error", res.status);
      return NextResponse.json({ error: "Notification failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[commission/notify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
