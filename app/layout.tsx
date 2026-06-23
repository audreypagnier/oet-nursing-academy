import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";
import { AuthBar } from "./lib/AuthBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://oetnursingacademy.com",
  ),
  title: "Prepare Your OET Nursing Exam | OET Nursing Academy",
  description:
    "Interactive OET Nursing preparation platform. Vocabulary, Listening, Reading, Speaking, Writing, AI feedback and daily study plans.",
  openGraph: {
    title: "Prepare Your OET Nursing Exam",
    description:
      "Train every day with guided OET Nursing practice, AI Writing evaluation, Listening, Reading, Speaking and Vocabulary modules.",
    siteName: "OET Nursing Academy",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepare Your OET Nursing Exam",
    description: "Your complete OET Nursing Academy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AuthBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
