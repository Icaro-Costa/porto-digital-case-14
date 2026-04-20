"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

export function LoginPage() {
  const router = useRouter();
  const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Informe email e senha.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await loginWithCredentials(email.trim(), password);
    setLoading(false);
    if (!result.ok) { setError(result.error ?? "Erro ao entrar."); return; }
    const role = useAuthStore.getState().user?.role ?? "student";
    router.push(role === "teacher" ? "/lesson-builder/upload" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex neuromentor" style={{ background: "var(--nm-bg-base)" }}>
      <div className="w-1/2 flex flex-col px-16 py-10" style={{ background: "var(--nm-bg-deep)" }}>
        <div className="flex items-center gap-3 mb-16">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">NeuroMentor</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="mb-8" style={{ color: "var(--nm-text-muted)" }}>
            Continue sua jornada com seu mentor de IA.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Senha</label>
                <Link href="#" className="text-sm" style={{ color: "var(--nm-purple-light)" }}>
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: `1px solid ${error ? "#ef4444" : "var(--nm-border)"}` }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--nm-text-muted)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="flex items-center gap-1 mt-2 text-xs text-red-400">
                  <AlertCircle size={12} /> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--nm-purple)" }}
            >
              {loading ? "Entrando..." : "Entrar no Dashboard"}
            </button>

            <p className="text-center text-sm" style={{ color: "var(--nm-text-muted)" }}>
              Não tem conta?{" "}
              <Link href="/signup" style={{ color: "var(--nm-purple-light)" }}>
                Criar conta grátis
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center px-16 py-10 relative overflow-hidden" style={{ background: "var(--nm-bg-base)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.15), transparent 70%)" }} />
        <h2 className="text-3xl font-bold text-white text-center mb-4">Acelere seu aprendizado</h2>
        <p className="text-center text-sm max-w-sm" style={{ color: "var(--nm-text-muted)" }}>
          Milhares de estudantes dominando habilidades complexas com mentoria personalizada por IA.
        </p>
      </div>
    </div>
  );
}
