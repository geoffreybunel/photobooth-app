"use client";

import { useState, type FormEvent } from "react";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

const SOCIALS = [
  {
    dot: "bg-secondary",
    label: "GitHub",
    value: "@geoffreybunel",
    href: "https://github.com/geoffreybunel",
    hint: "Code, issues, and what I'm building.",
  },
  {
    dot: "bg-accent",
    label: "LinkedIn",
    value: "Geoffrey Bunel",
    href: "https://www.linkedin.com/in/geoffrey-bunel/",
    hint: "For work, not memes.",
  },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full">
      {/* INTRO */}
      <div className="max-w-2xl mb-16">
        <p className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2 text-primary">
          <span className="w-4 h-0.5 inline-block bg-primary" />
          Get in touch
        </p>

        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-5">
          Questions, bugs, or a wedding to shoot?
        </h1>

        <p className="text-base leading-relaxed text-base-content/70">
          Joysnap doesn&apos;t have a support team — it&apos;s a one-person project.
          Send a message below and I&apos;ll get back to you.
        </p>
      </div>

      {/* FORM */}
      <div className="card bg-[#FFFDF8] rounded-2xl shadow-md max-w-xl mb-16">
        <div className="card-body p-6 sm:p-8">
          {!WEB3FORMS_ACCESS_KEY ? (
            <p className="text-sm text-base-content/55">
              The contact form isn&apos;t configured yet — add
              <code className="mx-1 px-1.5 py-0.5 rounded bg-base-200 font-mono text-xs">
                NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
              </code>
              to your environment variables to enable it.
            </p>
          ) : status === "sent" ? (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <p className="font-display font-semibold text-lg">Message sent!</p>
              <p className="text-sm text-base-content/70">
                Thanks for reaching out — I&apos;ll reply as soon as I can.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
              <input type="hidden" name="subject" value="New message from Joysnap" />
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-base-content/55">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="bg-base-200 border border-base-300 rounded-[11px] px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-base-content/55">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-base-200 border border-base-300 rounded-[11px] px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-wider text-base-content/55">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="bg-base-200 border border-base-300 rounded-[11px] px-3.5 py-2.5 text-sm resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-primary">
                  Something went wrong — try again, or email me directly at geoffreybunel1999@gmail.com.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="self-start bg-primary border-none font-display font-semibold text-white rounded-full shadow-[0_6px_0_hsl(8_70%_52%)] py-3.5 px-7 transition-transform duration-150 ease-in-out hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* SOCIALS */}
      <p className="font-mono text-xs tracking-widest uppercase mb-5 flex items-center gap-3 text-primary">
        Or find me here
        <span
          className="flex-1 h-0.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, hsl(var(--color-base-content)/0.25) 0, hsl(var(--color-base-content)/0.25) 6px, transparent 6px, transparent 12px)",
          }}
        />
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SOCIALS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-[#FFFDF8] rounded-2xl shadow-md hover:-translate-y-1.5 transition-transform"
          >
            <div className="card-body p-5 gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${channel.dot}`} />
              <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/55 mt-1">
                {channel.label}
              </p>
              <p className="font-display font-semibold text-base">{channel.value}</p>
              <p className="text-sm leading-relaxed text-base-content/70">{channel.hint}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
