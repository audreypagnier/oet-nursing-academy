import type { Metadata } from "next";
import ReadingClient from "./ReadingClient";

export const metadata: Metadata = {
  title: "Reading OET — Textes cliniques | OET Nursing Academy",
  description:
    "Entraînez-vous à la compréhension écrite OET Nursing : 10 textes cliniques originaux avec questions à choix multiples et explications.",
};

export default function ReadingPage() {
  return <ReadingClient />;
}
