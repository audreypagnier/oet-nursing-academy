import type { Metadata } from "next";
import VocabularyClient from "./VocabularyClient";

export const metadata: Metadata = {
  title: "Vocabulaire médical OET — OET Nursing Academy",
  description:
    "Apprenez le vocabulaire médical essentiel pour l'OET Nursing : symptômes, médicaments, chirurgie, cardiologie et communication patient.",
};

export default function VocabularyPage() {
  return <VocabularyClient />;
}
