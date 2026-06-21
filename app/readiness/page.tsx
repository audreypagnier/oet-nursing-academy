import type { Metadata } from "next";
import ReadinessClient from "./ReadinessClient";

export const metadata: Metadata = {
  title: "Score de préparation OET — OET Nursing Academy",
  description:
    "Évaluez votre niveau de préparation à l'OET Nursing : score estimé, points forts, points faibles et délai estimé avant l'examen.",
};

export default function ReadinessPage() {
  return <ReadinessClient />;
}
