"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";

interface Props {
  price: string;
}

export default function CommissionCheckoutForm({ price }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/commission/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement options={{ layout: "tabs", paymentMethodOrder: ["card"] }} />

      {errorMessage && (
        <div className="text-red-400 font-body text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-body font-semibold py-4 rounded-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Lock className="w-4 h-4" />
        {loading ? "Processing…" : `Pay ${price}`}
      </button>

      <p className="text-text-subtle font-body text-[10px] text-center flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" />
        Secured by Stripe. Your card info never touches our servers.
      </p>
    </form>
  );
}
