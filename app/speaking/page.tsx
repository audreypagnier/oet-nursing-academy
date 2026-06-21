import type { Metadata } from "next";
import SpeakingClient from "./SpeakingClient";

export const metadata: Metadata = {
  title: "Speaking OET — Simulations de consultation | OET Nursing Academy",
  description:
    "Entraînez-vous aux jeux de rôle OET Nursing : 5 scénarios infirmier-patient avec phrases clés et réponses suggérées.",
};

export default function SpeakingPage() {
  return <SpeakingClient />;
}
