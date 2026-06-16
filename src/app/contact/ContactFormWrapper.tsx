"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";

function FormWithParams() {
  const params = useSearchParams();
  const service = params.get("service") ?? "";
  return <ContactForm defaultService={service} />;
}

export default function ContactFormWrapper() {
  return (
    <Suspense fallback={<ContactForm defaultService="" />}>
      <FormWithParams />
    </Suspense>
  );
}
