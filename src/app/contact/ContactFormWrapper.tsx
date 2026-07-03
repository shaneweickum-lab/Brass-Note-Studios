"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";

function FormWithParams() {
  const params = useSearchParams();
  return (
    <ContactForm
      defaultService={params.get("service") ?? ""}
      packageName={params.get("package") ?? ""}
      checkoutUrl={params.get("checkout") ?? ""}
      defaultName={params.get("name") ?? ""}
      defaultEmail={params.get("email") ?? ""}
      defaultWhoFor={params.get("whoFor") ?? ""}
      defaultStory={params.get("story") ?? ""}
      defaultGenre={params.get("genre") ?? ""}
      defaultLength={params.get("length") ?? ""}
      defaultVocalType={params.get("vocalType") ?? ""}
      defaultVocalStyle={params.get("vocalStyle") ?? ""}
    />
  );
}

export default function ContactFormWrapper() {
  return (
    <Suspense fallback={<ContactForm defaultService="" packageName="" checkoutUrl="" />}>
      <FormWithParams />
    </Suspense>
  );
}
