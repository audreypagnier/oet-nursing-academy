import type { Metadata } from "next";
import MockExamClient from "./MockExamClient";

export const metadata: Metadata = {
  title: "Mini Examen Blanc OET — OET Nursing Academy",
  description:
    "Simulez un examen OET Nursing en conditions réelles : 10 questions Reading, 10 questions Vocabulaire, 1 scénario Speaking et 1 lettre Writing.",
};

export default function MockExamPage() {
  return <MockExamClient />;
}
