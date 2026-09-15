import type { Metadata } from "next";
import BoothClient from "./BoothClient";

export const metadata: Metadata = {
  title: "Photobooth",
  description:
    "Take 1 to 4 photos with live filters, a countdown timer, and a downloadable strip — right from your browser camera.",
};

export default function Page() {
  return <BoothClient />;
}
