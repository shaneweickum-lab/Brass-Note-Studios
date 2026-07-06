export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { kvGetClient, getMessages, markMessagesRead } from "@/lib/supabase/queries";
import AdminMessageThread from "@/components/admin/AdminMessageThread";

interface PageProps {
  params: Promise<{ permanentId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { permanentId } = await params;
  return { title: `Messages · ${permanentId}` };
}

export default async function AdminMessageThreadPage({ params }: PageProps) {
  const { permanentId } = await params;

  const [client, messages] = await Promise.all([
    kvGetClient(permanentId),
    getMessages(permanentId),
  ]);

  if (!client) notFound();

  // Mark client messages as read on page load
  await markMessagesRead(permanentId, "admin");

  const initialMessages = messages.map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt,
  }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/portal/messages"
          className="inline-flex items-center gap-1.5 font-body text-sm text-text-subtle hover:text-text-muted transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Messages
        </Link>
      </div>

      <AdminMessageThread
        permanentId={permanentId}
        clientName={client.clientName}
        initialMessages={initialMessages}
      />

      <div className="bg-surface border border-white/10 rounded-lg px-5 py-3">
        <p className="font-body text-xs text-text-subtle">
          Client portal ID:{" "}
          <span className="font-mono text-gold">{permanentId}</span>
        </p>
        <Link
          href={`/admin/portal/commissions?q=${permanentId}`}
          className="font-body text-xs text-text-subtle hover:text-gold transition-colors mt-0.5 block"
        >
          View commissions →
        </Link>
      </div>
    </div>
  );
}
