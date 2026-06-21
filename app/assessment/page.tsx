import type { Metadata } from "next";
import AssessmentClient from "./AssessmentClient";

export const metadata: Metadata = {
  title: "Évaluation de niveau — OET Nursing Academy",
  description:
    "Testez votre niveau d'anglais médical en 20 questions. Vocabulaire, compréhension et grammaire adaptés aux infirmiers.",
};

export default function AssessmentPage() {
  return <AssessmentClient />;
}
