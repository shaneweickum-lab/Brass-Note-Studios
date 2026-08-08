import type { Metadata } from "next";
import CommissionSuccessClient from "./CommissionSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmed | Brass Note Studios",
  description: "Your commission payment was received. We'll be in touch within 1–2 business days.",
};

interface Props {
  searchParams: Promise<{ payment_intent?: string }>;
}

export default async function CommissionSuccessPage({ searchParams }: Props) {
  const { payment_intent } = await searchParams;
  return <CommissionSuccessClient paymentIntentId={payment_intent ?? null} />;
}
