"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Monitor, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

function strengthLevel(pw: string): number {
  if (pw.length < 4) return 0;
  if (pw.length < 8) return 1;
  const has = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  return 2 + Math.min(has, 2);
}

const STRENGTH_COLORS = ["var(--nm-bg-surface)", "#ef4444", "#f97316", "#22c55e", "#22c55e"];
const STRENGTH_LABELS = ["", "Muito fraca", "Fraca", "Boa", "Forte"];

export function SignUpPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = strengthLevel(password);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 8) {
      setError("Senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!agreed) {
      setError("Você precisa aceitar os termos.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await register({ name, email, password, role });
    setLoading(false);
    if (!result.ok) { setError(result.error ?? "Erro ao criar conta."); return; }
    router.push(role === "teacher" ? "/lesson-builder/upload" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex neuromentor" style={{ background: "var(--nm-bg-base)" }}>
      {/* Left — Form */}
      <div className="w-full md:w-1/2 flex flex-col px-10 md:px-16 py-10 overflow-y-auto" style={{ background: "var(--nm-bg-deep)" }}>
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">NeuroMentor</span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-white mb-2">Criar conta</h1>
          <p className="mb-8" style={{ color: "var(--nm-text-muted)" }}>
            Comece sua jornada de aprendizado personalizado hoje.
          </p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">Sou um...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "student", label: "Aluno", icon: <GraduationCap size={28} /> },
                { id: "teacher", label: "Professor", icon: <Monitor size={28} /> },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as "student" | "teacher")}
                  className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
                  style={{
                    background: role === r.id ? "rgba(124,58,237,0.2)" : "var(--nm-bg-surface)",
                    border: `1px solid ${role === r.id ? "var(--nm-purple)" : "var(--nm-border)"}`,
                  }}
                >
                  <span style={{ color: role === r.id ? "var(--nm-purple-light)" : "var(--nm-text-muted)" }}>{r.icon}</span>
                  <span className="text-sm font-medium" style={{ color: role === r.id ? "white" : "var(--nm-text-muted)" }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Nome completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-colors" style={{ background: i <= strength ? STRENGTH_COLORS[strength] : "var(--nm-bg-surface)" }} />
                ))}
              </div>
              {password.length > 0 && (
                <p className="text-xs mt-1" style={{ color: STRENGTH_COLORS[strength] }}>{STRENGTH_LABELS[strength]}</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded accent-purple-600" />
              <span className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
                Concordo com os{" "}
                <Link href="#" style={{ color: "var(--nm-purple-light)" }}>Termos de Uso</Link>
                {" "}e{" "}
                <Link href="#" style={{ color: "var(--nm-purple-light)" }}>Política de Privacidade</Link>.
              </span>
            </label>

            {error && (
              <p className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {error}
              </p>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--nm-purple)" }}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            <p className="text-center text-sm" style={{ color: "var(--nm-text-muted)" }}>
              Já tem conta?{" "}
              <Link href="/login" style={{ color: "var(--nm-purple-light)" }}>Entrar</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right — Promo */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center px-16 py-10 relative overflow-hidden" style={{ background: "var(--nm-bg-base)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.12), transparent 70%)" }} />
        <div className="relative w-72 p-6 rounded-2xl mb-8" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--nm-purple)" }}>
            <span className="text-white text-xl">✦</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aprendizado Personalizado</h3>
          <p className="text-sm mb-4" style={{ color: "var(--nm-text-muted)" }}>
            A IA analisa seu progresso e adapta o conteúdo ao seu ritmo e nível de conhecimento.
          </p>
          <div className="space-y-2">
            {["Aulas Simuladas por IA", "Exercícios Adaptativos"].map((item) => (
              <div key={item} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "var(--nm-bg-elevated)" }}>
                <span className="text-purple-400 text-xs">✓</span>
                <span className="text-xs text-white">{item}</span>
                <div className="flex-1 h-1.5 rounded-full ml-auto" style={{ background: "var(--nm-bg-deep)" }}>
                  <div className="h-full rounded-full" style={{ width: "65%", background: "var(--nm-purple)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: "var(--nm-purple)" }}>🤖</div>
          <div>
            <p className="text-xs font-semibold text-white">Mentor IA 24/7</p>
            <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>Sempre pronto para ajudar</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-4">Comece a aprender hoje</h2>
        <p className="text-center text-sm max-w-sm" style={{ color: "var(--nm-text-muted)" }}>
          Junte-se a milhares de alunos e professores que já transformam materiais em experiências de aprendizado personalizadas.
        </p>
      </div>
    </div>
  );
}
