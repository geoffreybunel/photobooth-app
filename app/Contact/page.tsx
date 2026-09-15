import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Got a question, a bug, or an idea for Joysnap? Send a message, or find Geoffrey Bunel on GitHub and LinkedIn.",
};

export default function Page() {
  return <ContactForm />;
}
