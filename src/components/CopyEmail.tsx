"use client";

import { useState } from "react";

export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard refused: fall back to the mail app.
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" className={`copy-email ${className}`} onClick={copy}>
      <span className="copy-email__address">{email}</span>
      <span className="copy-email__state" aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
