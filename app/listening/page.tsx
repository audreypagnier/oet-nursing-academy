import type { Metadata } from "next";
import ListeningClient from "./ListeningClient";

export const metadata: Metadata = {
  title: "Listening OET — Transcriptions cliniques | OET Nursing Academy",
  description:
    "Entraînez-vous à la compréhension orale OET Nursing : 10 transcriptions cliniques originales avec questions à choix multiples et explications.",
};

export default function ListeningPage() {
  return <ListeningClient />;
}
