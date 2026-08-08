import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import servicesDataRaw from "@/data/services.json";
import type { ServiceCategory } from "@/types";

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
    addons?: string[];
  };

  const { serviceName, packageName, customerEmail, customerName, songTitle, addons = [] } = body;

  if (!serviceName || !packageName) {
    return NextResponse.json({ error: "serviceName and packageName required" }, { status: 400 });
  }

  const category = (servicesDataRaw.categories as ServiceCategory[]).find(
    (c) => c.name === serviceName
  );
  const pkg = category?.packages.find((p) => p.name === packageName);

  if (!category || !pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const baseCents = parsePriceCents(pkg.price);
  if (!baseCents) {
    return NextResponse.json({ error: "Invalid package price" }, { status: 500 });
  }

  // Resolve add-on prices from services.json
  const allAddons = servicesDataRaw.addons as Array<{ name: string; price: string; notes: string; comingSoon?: boolean }>;
  let addonCents = 0;
  const resolvedAddons: string[] = [];

  for (const addonName of addons) {
    const match = allAddons.find((a) => a.name === addonName && a.price && !a.comingSoon);
    if (match) {
      const cents = parsePriceCents(match.price);
      if (cents) {
        addonCents += cents;
        resolvedAddons.push(`${addonName} (${match.price})`);
      }
    }
  }

  const totalCents = baseCents + addonCents;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      receipt_email: customerEmail || undefined,
      metadata: {
        serviceName,
        packageName,
        customerName: customerName ?? "",
        songTitle: songTitle ?? "",
        addons: resolvedAddons.join(", "),
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      packageInfo: {
        serviceName,
        packageName: pkg.name,
        price: pkg.price,
        description: pkg.description,
        included: category.included,
        delivery: category.delivery,
        addons: resolvedAddons,
        totalCents,
      },
    });
  } catch (err) {
    console.error("[commission checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
