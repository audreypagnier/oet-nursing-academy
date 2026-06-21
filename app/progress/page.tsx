import type { Metadata } from "next";
import ProgressClient from "./ProgressClient";

export const metadata: Metadata = {
  title: "Ma progression OET — OET Nursing Academy",
  description:
    "Tableau de bord complet de votre progression OET : score de préparation, résultats du mock exam, avancement par compétence et pratique quotidienne.",
};

export default function ProgressPage() {
  return <ProgressClient />;
}
