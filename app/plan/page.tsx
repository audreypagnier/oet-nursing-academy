import type { Metadata } from "next";
import PlanClient from "./PlanClient";

export const metadata: Metadata = {
  title: "Mon plan de préparation OET — OET Nursing Academy",
  description:
    "Votre programme de préparation OET personnalisé, semaine par semaine, basé sur votre niveau évalué.",
};

export default function PlanPage() {
  return <PlanClient />;
}
