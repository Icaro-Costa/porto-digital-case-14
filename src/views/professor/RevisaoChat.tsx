"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2, MessageSquare, User, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface PendingReview {
  id: string;
  question: string;
  answer: string;
  isCorrect: boolean;
  feedback: string;
  teacherExplanation?: string;
  xpGained: number;
  createdAt: string;
  studentName: string;
  studentEmail: string;
}

function ReviewCard({ item, onDecision }: { item: PendingReview; onDecision: (id: string, status: "accepted" | "rejected") => void }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function decide(status: "accepted" | "rejected") {
    setLoading(true);
    await onDecision(item.id, status);
    setLoading(false);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
          style={{ background: "var(--nm-purple)" }}
        >
          {item.studentName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{item.studentName}</span>
            <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{item.studentEmail}</span>
          </div>
          <p className="text-sm text-white">{item.question}</p>
          <p className="text-xs mt-1 italic" style={{ color: "var(--nm-text-muted)" }}>
            Resposta: "{item.answer}"
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs px-2 py-1 rounded-full font-semibold"
            style={{
              background: item.isCorrect ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: item.isCorrect ? "#22c55e" : "#ef4444",
            }}
          >
            {item.isCorrect ? "IA: Correta" : "IA: Incorreta"}
          </span>
          <button onClick={() => setExpanded((v) => !v)} style={{ color: "var(--nm-text-muted)" }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable: feedbacks */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--nm-border)" }}>
          {/* Student feedback */}
          <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--nm-bg-elevated)" }}>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={12} style={{ color: "var(--nm-purple-light)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--nm-purple-light)" }}>
                Feedback enviado ao aluno
              </span>
            </div>
            <p className="text-sm text-white leading-relaxed">{item.feedback}</p>
          </div>

          {/* Teacher explanation */}
          {item.teacherExplanation && (
            <div className="p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <div className="flex items-center gap-2 mb-1">
                <User size={12} style={{ color: "#a78bfa" }} />
                <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>
                  Análise técnica (somente você vê)
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#e9d5ff" }}>{item.teacherExplanation}</p>
            </div>
          )}

          {/* Rejection note */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--nm-text-muted)" }}>
              Observação ao rejeitar (opcional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: A resposta está incompleta porque..."
              className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: "var(--nm-bg-base)", border: "1px solid var(--nm-border)" }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => decide("accepted")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Aceitar nota da IA
            </button>
            <button
              onClick={() => decide("rejected")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Rejeitar e marcar errado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function RevisaoChat() {
  const [items, setItems] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    api.getPendingReviews()
      .then(setItems)
      .catch(() => setError("Não foi possível carregar as revisões."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDecision(id: string, status: "accepted" | "rejected") {
    try {
      await api.reviewAttempt(id, status);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setReviewed((n) => n + 1);
    } catch {
      alert("Erro ao salvar decisão. Tente novamente.");
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--nm-border)" }}
      >
        <div>
          <h2 className="text-lg font-semibold text-white">Revisão de Exercícios do Chat</h2>
          <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
            Respostas dos alunos corrigidas pela IA aguardando sua aprovação
          </p>
        </div>
        {reviewed > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-sm font-semibold text-green-400">{reviewed} revisadas hoje</span>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--nm-purple-light)" }} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 size={40} className="mb-4" style={{ color: "var(--nm-text-muted)" }} />
            <p className="font-semibold text-white">Nenhuma revisão pendente</p>
            <p className="text-sm mt-1" style={{ color: "var(--nm-text-muted)" }}>
              Quando seus alunos responderem exercícios no chat, eles aparecerão aqui.
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-4 max-w-3xl">
            <p className="text-sm mb-4" style={{ color: "var(--nm-text-muted)" }}>
              {items.length} resposta{items.length !== 1 ? "s" : ""} aguardando revisão
            </p>
            {items.map((item) => (
              <ReviewCard key={item.id} item={item} onDecision={handleDecision} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
