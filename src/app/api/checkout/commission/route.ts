import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import servicesDataRaw from "@/data/services.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

function parsePriceCents(priceStr: string): number | null {
  const match = priceStr.match(/\$?([\d,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(",", ""), 10) * 100;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    serviceName?: string;
    packageName?: string;
    customerEmail?: string;
    customerName?: string;
    songTitle?: string;
  };

  const { serviceName, packageName, customerEmail, customerName, songTitle } = body;

  if (!serviceName || !packageName) {
    return NextResponse.json({ error: "serviceName and packageName required" }, { status: 400 });
  }

  const category = (servicesDataRaw.categories as Array<{
    id: string;
    name: string;
    packages: Array<{ name: string; price: string; description: string }>;
  }>).find((c) => c.name === serviceName);

  const pkg = category?.packages.find((p) => p.name === packageName);

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const amountCents = parsePriceCents(pkg.price);
  if (!amountCents) {
    return NextResponse.json({ error: "Invalid package price" }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? "https://brassnotestudios.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `${serviceName} — ${packageName}`,
              description: pkg.description,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      metadata: {
        serviceName,
        packageName,
        customerName: customerName ?? "",
        songTitle: songTitle ?? "",
      },
      success_url: `${origin}/commission/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/services`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[commission checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
