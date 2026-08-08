import type { Metadata } from "next";
import { Fredoka, Space_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/navigation/Navbar";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "photobooth-app — Prends la pose, c'est parti",
  description: "Le photobooth en ligne, sans borne ni compte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="photobooth-warm"
      className={`${fredoka.variable} ${spaceMono.variable} ${workSans.variable}`}
    >
      <body className="font-sans bg-base-100 text-base-content min-h-screen">
        <div className="max-w-275 mx-auto pt-8 px-6 pb-20">
          <Navbar />
          <div className="flex flex-col flex-1 items-center justify-center">
            {children}
          </div>
        </div>


      </body>
    </html>
  );
}