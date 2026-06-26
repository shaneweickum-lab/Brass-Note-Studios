"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";

function FormWithParams() {
  const params = useSearchParams();
  const service     = params.get("service")  ?? "";
  const packageName = params.get("package")  ?? "";
  const checkoutUrl = params.get("checkout") ?? "";
  return <ContactForm defaultService={service} packageName={packageName} checkoutUrl={checkoutUrl} />;
}

export default function ContactFormWrapper() {
  return (
    <Suspense fallback={<ContactForm defaultService="" packageName="" checkoutUrl="" />}>
      <FormWithParams />
    </Suspense>
  );
}
