"use client";

import Link from "next/link";
import AnnualProgressCalendar from "../components/AnnualProgressCalendar";

export default function AnnualProgressClient() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-500">
          <Link href="/daily-practice" className="hover:text-[#0B1E4B] transition-colors">Routine du jour</Link>
          <Link href="/progress" className="hover:text-[#0B1E4B] transition-colors">Progression</Link>
          <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/progress"
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#0B1E4B] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Progression
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-lg font-bold text-[#0B1E4B]">Progression annuelle {year}</h1>
          </div>

          {/* Calendar */}
          <AnnualProgressCalendar />

          {/* Footer links */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/daily-practice"
              className="flex-1 text-center bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              Commencer la session du jour →
            </Link>
            <Link
              href="/progress"
              className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              ← Ma progression détaillée
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
