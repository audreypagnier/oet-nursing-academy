import type { Metadata } from "next";
import AnnualProgressClient from "./AnnualProgressClient";

export const metadata: Metadata = {
  title: "Progression annuelle | OET Nursing Academy",
  description: "Calendrier de progression annuelle — visualisez chaque jour de révision de l'année.",
};

export default function AnnualProgressPage() {
  return <AnnualProgressClient />;
}
