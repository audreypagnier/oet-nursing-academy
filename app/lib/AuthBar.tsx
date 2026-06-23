"use client";

import Link from "next/link";
import { useAuth } from "./auth-context";

export function AuthBar() {
  const { user, loading, configured, signOut } = useAuth();

  if (!configured) return null;
  if (loading) return null;

  if (!user) {
    return (
      <div className="bg-[#0B1E4B] text-white text-xs flex items-center justify-center gap-3 py-1.5 px-4">
        <span className="text-white/50">Synchronisation multi-appareils disponible.</span>
        <Link href="/login" className="font-semibold text-[#00C2C7] hover:text-white transition-colors">
          Se connecter →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1E4B] text-white text-xs flex items-center justify-center gap-3 py-1.5 px-4">
      <span className="text-white/60">Connecté(e) en tant que</span>
      <span className="font-medium text-white/90 truncate max-w-[200px]">{user.email}</span>
      <button
        onClick={signOut}
        className="font-semibold text-[#00C2C7] hover:text-white transition-colors ml-2"
      >
        Déconnexion
      </button>
    </div>
  );
}
