import type { Metadata } from "next";
import WritingClient from "./WritingClient";

export const metadata: Metadata = {
  title: "Writing OET — Lettres de transfert | OET Nursing Academy",
  description:
    "Entraînez-vous à la rédaction de lettres de référence OET Nursing : 5 scénarios originaux avec tâches, points clés et lettres modèles.",
};

export default function WritingPage() {
  return <WritingClient />;
}
