"use client";

import { useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is on screen to select by hand
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
    >
      {copied ? <MdCheck size={16} className="text-green-600" /> : <MdContentCopy size={15} />}
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
