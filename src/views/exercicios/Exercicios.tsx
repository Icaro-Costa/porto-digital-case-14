"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useProgressStore } from "@/stores/progress";

interface Exercise {
  id: string;
  question: string;
  type: "open" | "multiple_choice";
  options?: string[];
}

interface Props {
  lessonId: string;
  moduleTitle: string;
}

export function Exercicios({ lessonId, moduleTitle }: Props) {
  const router = useRouter();
  const { addAttempt } = useProgressStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; feedback: string; score?: number }>>({});
  const [loading, setLoading] = useState(true);
  const [correcting, setCorrecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadExercises() {
    setLoading(true);
    setError(null);
    try {
      const { exercises } = await api.generateExercises({
        lessonId,
        moduleId: moduleTitle,
        moduleTitle,
      });
      setExercises(exercises);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar exercícios");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(ex: Exercise) {
    const answer = answers[ex.id]?.trim();
    if (!answer) return;
    setCorrecting(ex.id);
    try {
      const result = await api.correctAnswer({
        question: ex.question,
        answer,
        context: moduleTitle,
      });
      setFeedback((f) => ({ ...f, [ex.id]: result }));
      addAttempt({
        lessonId,
        moduleId: moduleTitle,
        question: ex.question,
        answer,
        correct: result.correct,
        feedback: result.feedback,
      });
      api.recordAttempt({
        lessonId: lessonId || undefined,
        moduleId: moduleTitle,
        question: ex.question,
        answer,
        isCorrect: result.correct,
        feedback: result.feedback,
      }).catch(() => {});
    } catch (e) {
      setFeedback((f) => ({
        ...f,
        [ex.id]: { correct: false, score: 0, feedback: "Erro ao corrigir. Tente novamente." },
      }));
    } finally {
      setCorrecting(null);
    }
  }

  const allAnswered = exercises.length > 0 && exercises.every((e) => feedback[e.id]);

  return (
    <div className="min-h-screen neuromentor p-8" style={{ background: "var(--nm-bg-base)", color: "var(--nm-text)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Exercícios — {moduleTitle}</h1>
            <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
              Responda no seu ritmo. O Mentor corrige e dá feedback personalizado.
            </p>
          </div>
          <button
            onClick={loadExercises}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border disabled:opacity-50"
            style={{ borderColor: "var(--nm-border)", color: "var(--nm-text)" }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Gerar novos
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 text-sm">Erro</p>
              <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader size={28} className="animate-spin" style={{ color: "var(--nm-purple-light)" }} />
          </div>
        )}

        <div className="space-y-4">
          {exercises.map((ex, idx) => {
            const fb = feedback[ex.id];
            const borderColor = fb ? (fb.correct ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)") : "var(--nm-border)";
            return (
              <div
                key={ex.id}
                className="rounded-2xl p-5"
                style={{ background: "var(--nm-bg-surface)", border: `1px solid ${borderColor}` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--nm-purple)" }}>
                    {idx + 1}
                  </span>
                  <p className="text-sm text-white leading-relaxed">{ex.question}</p>
                </div>

                {ex.type === "multiple_choice" && ex.options ? (
                  <div className="space-y-2 mb-4 ml-10">
                    {ex.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                        style={{
                          background: answers[ex.id] === opt ? "rgba(124,58,237,0.15)" : "var(--nm-bg-elevated)",
                          border: `1px solid ${answers[ex.id] === opt ? "var(--nm-purple)" : "transparent"}`,
                        }}
                      >
                        <input
                          type="radio"
                          name={ex.id}
                          value={opt}
                          checked={answers[ex.id] === opt}
                          onChange={() => setAnswers((a) => ({ ...a, [ex.id]: opt }))}
                          disabled={!!fb}
                          className="accent-purple-600"
                        />
                        <span className="text-sm text-white">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[ex.id] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))}
                    disabled={!!fb}
                    placeholder="Digite sua resposta..."
                    className="w-full ml-10 p-3 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)", width: "calc(100% - 2.5rem)" }}
                    rows={3}
                  />
                )}

                {fb ? (
                  <div
                    className="ml-10 mt-4 p-4 rounded-lg flex gap-3"
                    style={{
                      background: fb.correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${fb.correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: fb.correct ? "#22c55e" : "#ef4444" }}
                    >
                      {fb.correct ? <Check size={12} color="white" /> : <X size={12} color="white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1">
                        {fb.correct ? "Correto!" : "Quase lá"}{fb.score !== undefined && <span className="text-xs font-normal" style={{ color: "var(--nm-text-muted)" }}> ({fb.score}/100)</span>}
                      </p>
                      <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--nm-text-muted)" }}>{fb.feedback}</p>
                    </div>
                  </div>
                ) : (
                  <div className="ml-10 mt-4 flex justify-end">
                    <button
                      onClick={() => submitAnswer(ex)}
                      disabled={!answers[ex.id]?.trim() || correcting === ex.id}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 flex items-center gap-2"
                      style={{ background: "var(--nm-purple)" }}
                    >
                      {correcting === ex.id ? <Loader size={12} className="animate-spin" /> : null}
                      Enviar resposta
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {allAnswered && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => router.push(`/revisao/${lessonId}`)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--nm-purple)" }}
            >
              Ver revisão guiada <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
