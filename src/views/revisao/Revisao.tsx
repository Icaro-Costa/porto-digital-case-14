"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Loader, Home, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { useProgressStore } from "@/stores/progress";

interface Topic {
  title: string;
  explanation: string;
  tips: string[];
}

interface Props {
  lessonId: string;
}

export function Revisao({ lessonId }: Props) {
  const router = useRouter();
  const wrongAnswers = useProgressStore((s) => s.wrongAnswers(lessonId));
  const [topics, setTopics] = useState<Topic[]>([]);
  const [summary, setSummary] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateReview({
        lessonId,
        wrongAnswers: wrongAnswers.map((w) => ({ question: w.question, answer: w.answer })),
      });
      setTopics(data.topics ?? []);
      setSummary(data.summary ?? "");
      setExpanded(Object.fromEntries((data.topics ?? []).map((_, i) => [i, true])));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar revisão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen neuromentor p-8" style={{ background: "var(--nm-bg-base)", color: "var(--nm-text)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
            <BookOpenCheck size={18} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Revisão Guiada</h1>
            <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
              O Mentor preparou uma revisão focada nas suas lacunas.
            </p>
          </div>
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={32} className="animate-spin mb-4" style={{ color: "var(--nm-purple-light)" }} />
            <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>Analisando suas respostas...</p>
          </div>
        ) : (
          <>
            {summary && (
              <div className="mb-6 p-4 rounded-xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--nm-purple-light)" }}>📋 RESUMO</p>
                <p className="text-sm text-white leading-relaxed">{summary}</p>
              </div>
            )}

            {topics.length === 0 && (
              <div className="p-6 rounded-2xl text-sm text-white" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                Nenhum erro registrado. Faça exercícios para receber revisão personalizada.
              </div>
            )}

            <div className="space-y-4 mb-8">
              {topics.map((topic, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-4"
                    onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                  >
                    <span className="font-semibold text-white text-sm text-left">{topic.title}</span>
                    {expanded[i] ? <ChevronUp size={16} style={{ color: "var(--nm-purple-light)" }} /> : <ChevronDown size={16} style={{ color: "var(--nm-text-muted)" }} />}
                  </button>
                  {expanded[i] && (
                    <div className="px-5 pb-5 space-y-3">
                      <p className="text-sm leading-relaxed" style={{ color: "var(--nm-text)" }}>{topic.explanation}</p>
                      {topic.tips && topic.tips.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-2" style={{ color: "var(--nm-purple-light)" }}>💡 DICAS</p>
                          <ul className="space-y-1">
                            {topic.tips.map((tip, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "var(--nm-text-muted)" }}>
                                <span className="text-purple-400 flex-shrink-0">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: "var(--nm-border)", color: "var(--nm-text)" }}
              >
                <Home size={14} /> Voltar ao Dashboard
              </button>
              <button
                onClick={load}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "var(--nm-purple)" }}
              >
                Gerar nova revisão
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
