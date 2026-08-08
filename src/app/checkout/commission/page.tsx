import { notFound } from "next/navigation";
import type { Metadata } from "next";
import servicesDataRaw from "@/data/services.json";
import type { ServiceCategory } from "@/types";
import CommissionCheckoutShell from "./CommissionCheckoutShell";

export interface AddonOption {
  name: string;
  price: string;
  notes: string;
}

interface Props {
  searchParams: Promise<{ service?: string; package?: string; email?: string; name?: string }>;
}

// Map package name to the right expedited delivery tier
function getExpeditedTierName(packageName: string): string | null {
  const n = packageName.toLowerCase();
  if (n.includes("album"))  return "Expedited Delivery — Full Album";
  if (n.includes("lp"))     return "Expedited Delivery — LP";
  if (n.includes("ep"))     return "Expedited Delivery — EP";
  if (n.includes("single") || n.includes("anthem") || n.includes("track"))
    return "Expedited Delivery — Single";
  return null;
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

  const allAddons = servicesDataRaw.addons as Array<{ name: string; price: string; notes: string; comingSoon?: boolean }>;

  // Always offer revision round + stems; add the correct expedited tier
  const expeditedName = getExpeditedTierName(pkg.name);
  const availableAddons: AddonOption[] = [
    allAddons.find((a) => a.name === "Additional revision round"),
    allAddons.find((a) => a.name === "Stems / separated tracks"),
    expeditedName ? allAddons.find((a) => a.name === expeditedName) : undefined,
  ].filter((a): a is AddonOption => Boolean(a && a.price && !("comingSoon" in a)));

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
      availableAddons={availableAddons}
    />
  );
}
