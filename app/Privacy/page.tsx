import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Joysnap does and doesn't do with your data — camera, photos, the contact form, and why there are no cookies.",
};

const SECTIONS = [
  {
    title: "Who's behind Joysnap",
    body: "Joysnap is made and run by Geoffrey Bunel, based in France. I'm responsible for how your data is handled here, and you can reach me anytime through the Contact page.",
  },
  {
    title: "Camera & photos",
    body: "Everything happens on your own device. When you take a photo, it's captured and processed directly in your browser — it's never uploaded, streamed, or stored on any server. Photos exist only in memory while the tab is open, and disappear the moment you refresh, navigate away, or close it. The only way a photo leaves your device is if you click Download, and then it goes straight to your device. Your browser will ask for camera permission the first time. You can revoke it anytime in your browser settings.",
  },
  {
    title: "Hosting",
    body: "Joysnap is hosted by Vercel. Like any website, the host's servers automatically receive technical information when you load a page, such as your IP address and browser type, to deliver the site and protect it from abuse. Joysnap doesn't use this information to identify or track you. Vercel keeps these logs for a limited time under its own privacy policy: vercel.com/legal/privacy-notice.",
  },
  {
    title: "The contact form",
    body: "If you send a message through the Contact page, your name, email, message, and the reason you selected are sent to Web3Forms, a third-party form service, which forwards it to my email inbox. Joysnap doesn't store that submission anywhere itself. I use it only to reply to you, and I delete messages once the conversation is over (or after 12 months) and they're no longer needed. Web3Forms handles data under its own privacy policy: web3forms.com/privacy.",
  },
  {
    title: "Cookies & tracking",
    body: "Joysnap does not use cookies, analytics, or any kind of tracking. There's no account system and no session to maintain — so there was nothing that needed one. If that ever changes, this page will be updated first, and any tool used will be chosen to avoid unnecessary cookies.",
  },
  {
    title: "Your rights",
    body: "TUnder the GDPR, you can ask to access, correct, or delete any personal data I hold about you (in practice, only contact form messages). Just write to me at geoffreybunel1999@gmail.com. If you feel your data hasn't been handled properly, you can also file a complaint with the CNIL, the French data protection authority (cnil.fr).",
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
          happens, and doesn&apos;t happen, when you use it.
        </p>

        <p className="text-base leading-relaxed text-base-content/70 mt-4"><i>Last updated: 24/09/2026</i></p>
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
