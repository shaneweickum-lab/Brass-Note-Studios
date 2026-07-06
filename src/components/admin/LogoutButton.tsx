"use client";

import { useTransition } from "react";

interface Props {
  onLogout: () => Promise<void>;
}

export default function LogoutButton({ onLogout }: Props) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => onLogout())}
      disabled={pending}
      className="shrink-0 font-body text-xs text-text-subtle hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {pending ? "…" : "Sign out"}
    </button>
  );
}
