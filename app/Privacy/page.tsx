import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Joysnap does and doesn't do with your data — camera, photos, the contact form, and why there are no cookies.",
};

const SECTIONS = [
  {
    title: "Camera & photos",
    body: "Everything happens on your own device. When you take a photo, it's captured and processed directly in your browser using canvas — it's never uploaded, streamed, or stored on any server. Photos exist only in memory for as long as the tab stays open, and disappear the moment you refresh, navigate away, or close it. The only way a photo leaves your device is if you click Download.",
  },
  {
    title: "The contact form",
    body: "If you send a message through the Contact page, your name, email, message, and the reason you selected are sent to Web3Forms, a third-party form service, which forwards it to Geoffrey Bunel's email inbox. Joysnap doesn't store that submission anywhere itself.",
  },
  {
    title: "Cookies & tracking",
    body: "Joysnap does not use cookies, analytics, or any kind of tracking. There's no account system and no session to maintain — so there was nothing that needed one. If that ever changes, this page will be updated first, and any tool used will be chosen to avoid unnecessary cookies.",
  },
  {
    title: "Changes & questions",
    body: "This page will be updated if what Joysnap does with data ever changes. If anything here is unclear, reach out on the Contact page.",
  },
];

export default function Privacy() {
  return (
    <div className="w-full">
      {/* INTRO */}
      <div className="max-w-2xl mb-16">
        <p className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2 text-primary">
          <span className="w-4 h-0.5 inline-block bg-primary" />
          Privacy
        </p>

        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-5">
          Your data, in plain language.
        </h1>

        <p className="text-base leading-relaxed text-base-content/70">
          Joysnap is built to need as little from you as possible. Here&apos;s exactly what
          happens — and doesn&apos;t happen — when you use it.
        </p>
      </div>

      {/* SECTIONS */}
      <div className="flex flex-col border-t-2 border-dashed border-base-content/15 mb-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="py-6 border-b-2 border-dashed border-base-content/15">
            <p className="font-display font-semibold text-lg mb-2">{section.title}</p>
            <p className="text-sm leading-relaxed text-base-content/70 max-w-2xl">{section.body}</p>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-base-content/45">
        Questions? <Link href="/Contact" className="text-primary hover:underline">Get in touch</Link>.
      </p>
    </div>
  );
}
