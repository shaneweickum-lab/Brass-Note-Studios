import { notFound } from "next/navigation";
import type { Metadata } from "next";
import servicesDataRaw from "@/data/services.json";
import type { ServiceCategory } from "@/types";
import CommissionCheckoutShell from "./CommissionCheckoutShell";

interface Props {
  searchParams: Promise<{ service?: string; package?: string; email?: string; name?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { service, package: pkg } = await searchParams;
  if (!service || !pkg) return {};
  return {
    title: `${pkg} — ${service} | Brass Note Studios`,
    description: `Secure checkout for your ${service} commission — ${pkg}`,
  };
}

export default async function CommissionCheckoutPage({ searchParams }: Props) {
  const { service, package: packageName, email, name } = await searchParams;

  if (!service || !packageName) notFound();

  const category = (servicesDataRaw.categories as ServiceCategory[]).find(
    (c) => c.name === service
  );
  const pkg = category?.packages.find((p) => p.name === packageName);

  if (!category || !pkg) notFound();

  return (
    <CommissionCheckoutShell
      serviceName={service}
      packageName={pkg.name}
      price={pkg.price}
      description={pkg.description}
      included={category.included}
      delivery={category.delivery}
      customerEmail={email ?? ""}
      customerName={name ?? ""}
    />
  );
}
