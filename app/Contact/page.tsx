const CHANNELS = [
  {
    dot: "bg-primary",
    label: "Email",
    value: "geoffreybunel1999@gmail.com",
    href: "mailto:geoffreybunel1999@gmail.com",
    hint: "Best for bugs, questions, or event bookings.",
  },
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

export default function Contact() {
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
          Joysnap doesn&apos;t have a support form yet — it&apos;s a one-person project.
          Reach out directly on whichever channel fits, and I&apos;ll get back to you.
        </p>
      </div>

      {/* CHANNELS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="card bg-[#FFFDF8] rounded-2xl shadow-md hover:-translate-y-1.5 transition-transform"
          >
            <div className="card-body p-5 gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${channel.dot}`} />
              <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/55 mt-1">
                {channel.label}
              </p>
              <p className="font-display font-semibold text-base wrap-break-word">
                {channel.value}
              </p>
              <p className="text-sm leading-relaxed text-base-content/70">{channel.hint}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="font-mono text-xs text-base-content/45">
        Usually reply within a day or two.
      </p>
    </div>
  );
}
