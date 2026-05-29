"use client";
import { useState } from "react";
import { X, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useClassStore } from "@/stores/class";

interface Props { onClose: () => void }

export function JoinClassModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const joinClass = useClassStore((s) => s.joinClass);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!code.trim() || !user) return;
    setLoading(true);
    const result = await joinClass(code);
    setLoading(false);
    if (result.ok) {
      setMsg({ type: "ok", text: "Turma encontrada! Aulas liberadas no seu dashboard." });
      setTimeout(onClose, 1800);
    } else {
      setMsg({ type: "err", text: result.error ?? "Erro ao entrar na turma." });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="w-full max-w-sm p-6 rounded-2xl"
        style={{ background: "var(--nm-bg-deep)", border: "1px solid var(--nm-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
              <Users size={15} style={{ color: "var(--nm-purple-light)" }} />
            </div>
            <h2 className="text-base font-semibold text-white">Entrar em uma turma</h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--nm-text-muted)" }}><X size={16} /></button>
        </div>

        <p className="text-xs mb-4" style={{ color: "var(--nm-text-muted)" }}>
          Peça o código de 6 caracteres ao seu professor e cole abaixo.
        </p>

        <label className="block text-xs font-medium text-white mb-1.5">Código da turma</label>
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          placeholder="Ex: AB12CD"
          className="w-full px-3 py-2.5 rounded-xl text-sm text-white text-center tracking-widest font-bold outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)", fontSize: "1.1rem", letterSpacing: "0.2em" }}
        />

        {msg && (
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-3 ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}
            style={{ background: msg.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
            {msg.type === "ok" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            {msg.text}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={code.trim().length < 4 || loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--nm-purple)" }}
        >
          {loading ? "Entrando..." : "Entrar na turma"}
        </button>
      </div>
    </div>
  );
}
