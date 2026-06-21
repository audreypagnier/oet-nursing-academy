import type { Metadata } from "next";
import DailyPracticeClient from "./DailyPracticeClient";

export const metadata: Metadata = {
  title: "Pratique quotidienne — OET Nursing Academy",
  description:
    "Votre session OET du jour : 20 minutes de pratique ciblée pour progresser chaque jour vers l'examen.",
};

export default function DailyPracticePage() {
  return <DailyPracticeClient />;
}
