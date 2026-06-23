"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export function RegisterClient() {
  const { signUp, configured } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !confirm) { setError("Remplissez tous les champs."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    setError("");
    const { error: err } = await signUp(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#00C2C7] text-xl font-bold">OET</span>
            <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h1 className="text-xl font-bold text-[#0B1E4B] mb-2">Vérifiez votre e-mail</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Un lien de confirmation a été envoyé à <strong>{email}</strong>. Cliquez dessus pour activer votre compte.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Aller à la connexion →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {!configured ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-amber-800 font-semibold mb-2">Supabase non configuré</p>
              <p className="text-amber-700 text-sm leading-relaxed mb-4">
                Ajoutez <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
                <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans votre fichier <code className="bg-amber-100 px-1 rounded">.env.local</code>.
              </p>
              <Link href="/" className="text-sm font-semibold text-amber-700 underline underline-offset-2">
                ← Retour à l'accueil
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#0B1E4B] mb-2">Créer un compte</h1>
                <p className="text-sm text-gray-500">Sauvegardez votre progression et accédez-y depuis n'importe quel appareil.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="email">
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B1E4B] placeholder-gray-400 focus:outline-none focus:border-[#00C2C7] focus:ring-2 focus:ring-[#00C2C7]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="password">
                      Mot de passe <span className="text-gray-400 font-normal">(8 caractères minimum)</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B1E4B] placeholder-gray-400 focus:outline-none focus:border-[#00C2C7] focus:ring-2 focus:ring-[#00C2C7]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="confirm">
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B1E4B] placeholder-gray-400 focus:outline-none focus:border-[#00C2C7] focus:ring-2 focus:ring-[#00C2C7]/20 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00C2C7] hover:bg-[#009DA1] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all"
                  >
                    {loading ? "Création en cours…" : "Créer mon compte"}
                  </button>
                </form>
              </div>

              <p className="text-center text-sm text-gray-500 mt-5">
                Déjà un compte ?{" "}
                <Link href="/login" className="font-semibold text-[#009DA1] hover:text-[#007A7E] transition-colors">
                  Se connecter →
                </Link>
              </p>

              <p className="text-center text-xs text-gray-400 mt-3">
                <Link href="/" className="hover:text-gray-600 transition-colors">
                  ← Continuer sans compte
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
