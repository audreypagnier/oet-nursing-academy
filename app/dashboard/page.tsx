import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Mon tableau de bord — OET Nursing Academy",
  description: "Consultez votre résultat d'évaluation et suivez votre progression vers l'OET Nursing.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
