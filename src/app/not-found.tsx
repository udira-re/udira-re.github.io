import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="wrap" style={{ paddingBlock: "120px" }}>
      <h1 style={{ fontSize: "var(--step-3)" }}>Page not found</h1>
      <p style={{ marginTop: 12, color: "var(--muted)" }}>
        <Link href="/">Go to Amshu Pokharel&apos;s portfolio</Link>
      </p>
    </main>
  );
}
