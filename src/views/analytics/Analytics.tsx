"use client";
import { useMemo } from "react";
import { BookOpen, Target, Zap, TrendingUp, CheckCircle2, XCircle, Flame } from "lucide-react";
import { StudentLayout } from "@/views/student/StudentLayout";
import { useProgressStore } from "@/stores/progress";
import { useLessonStore } from "@/stores/lesson";

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className="text-sm" style={{ color: "var(--nm-text-muted)" }}>{label}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {sub && <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{sub}</p>}
    </div>
  );
}

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-white truncate max-w-[60%]">{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>{value} <span style={{ color: "var(--nm-text-muted)" }}>({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--nm-bg-elevated)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function Analytics() {
  const { xp, level, streak, attempts } = useProgressStore();
  const lessons = useLessonStore((s) => s.lessons);

  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Per-lesson breakdown
  const byLesson = useMemo(() => {
    const map: Record<string, { title: string; correct: number; wrong: number }> = {};
    for (const a of attempts) {
      if (!map[a.lessonId]) {
        const lesson = lessons.find((l) => l.id === a.lessonId);
        map[a.lessonId] = { title: lesson?.title ?? a.lessonId.slice(0, 12), correct: 0, wrong: 0 };
      }
      if (a.correct) map[a.lessonId].correct++; else map[a.lessonId].wrong++;
    }
    return Object.values(map);
  }, [attempts, lessons]);

  // XP over last 7 sessions (group by lesson attempt batch)
  const xpTimeline = useMemo(() => {
    if (attempts.length === 0) return [];
    const sorted = [...attempts].sort((a, b) => a.createdAt - b.createdAt);
    const buckets: { label: string; xp: number }[] = [];
    let running = 0;
    sorted.forEach((a, i) => {
      running += a.correct ? 50 : 10;
      if (i % Math.max(1, Math.floor(sorted.length / 7)) === 0 || i === sorted.length - 1) {
        buckets.push({ label: `#${i + 1}`, xp: running });
      }
    });
    return buckets.slice(-7);
  }, [attempts]);

  const maxXP = xpTimeline.length > 0 ? Math.max(...xpTimeline.map((b) => b.xp)) : 1;

  return (
    <StudentLayout>
      <header className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
        <div>
          <h2 className="text-lg font-semibold text-white">Analytics</h2>
          <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>Seu desempenho de aprendizado</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={<Zap size={18} />} label="XP Total" value={xp} sub={`Nível ${level}`} color="#7c3aed" />
          <StatCard icon={<Target size={18} />} label="Exercícios" value={total} sub={`${correct} corretos`} color="#3b82f6" />
          <StatCard icon={<TrendingUp size={18} />} label="Acurácia" value={`${accuracy}%`} sub={total > 0 ? "taxa de acertos" : "sem dados ainda"} color="#22c55e" />
          <StatCard icon={<Flame size={18} />} label="Streak" value={streak} sub="dias consecutivos" color="#f97316" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Acertos x Erros */}
          <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
            <h3 className="font-semibold text-white mb-4">Acertos vs Erros</h3>
            {total === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--nm-text-muted)" }}>Responda exercícios para ver seus dados.</p>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  {/* Donut-style via two half-bars */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="4" />
                      <circle
                        cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="4"
                        strokeDasharray={`${accuracy * 0.879} 87.9`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{accuracy}%</span>
                      <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>acertos</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white">Corretos</span>
                          <span className="text-sm font-bold text-green-400">{correct}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "var(--nm-bg-elevated)" }}>
                          <div className="h-full rounded-full bg-green-400" style={{ width: `${accuracy}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <XCircle size={16} className="text-red-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white">Errados</span>
                          <span className="text-sm font-bold text-red-400">{wrong}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "var(--nm-bg-elevated)" }}>
                          <div className="h-full rounded-full bg-red-400" style={{ width: `${100 - accuracy}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center" style={{ color: "var(--nm-text-muted)" }}>
                  {correct} corretos · {wrong} errados · {total} total
                </p>
              </>
            )}
          </div>

          {/* XP Timeline */}
          <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
            <h3 className="font-semibold text-white mb-4">Evolução de XP</h3>
            {xpTimeline.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--nm-text-muted)" }}>Complete exercícios para ver sua evolução.</p>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {xpTimeline.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg"
                      style={{
                        height: `${Math.max(8, Math.round((b.xp / maxXP) * 100))}%`,
                        background: i === xpTimeline.length - 1
                          ? "linear-gradient(180deg, #a855f7, #7c3aed)"
                          : "rgba(124,58,237,0.35)",
                      }}
                    />
                    <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs mt-3 text-center" style={{ color: "var(--nm-text-muted)" }}>
              XP acumulado por sessão
            </p>
          </div>
        </div>

        {/* Por aula */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={16} style={{ color: "var(--nm-purple-light)" }} />
            <h3 className="font-semibold text-white">Desempenho por Aula</h3>
          </div>
          {byLesson.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--nm-text-muted)" }}>Nenhum exercício respondido ainda.</p>
          ) : (
            <div className="space-y-6">
              {byLesson.map((l) => {
                const tot = l.correct + l.wrong;
                return (
                  <div key={l.title}>
                    <p className="text-sm font-semibold text-white mb-3">{l.title}</p>
                    <HBar label="Corretos" value={l.correct} max={tot} color="#22c55e" />
                    <HBar label="Errados" value={l.wrong} max={tot} color="#ef4444" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimas respostas */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
          <h3 className="font-semibold text-white mb-4">Últimas Respostas</h3>
          {attempts.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--nm-text-muted)" }}>Nenhuma resposta ainda.</p>
          ) : (
            <div className="space-y-3">
              {[...attempts].reverse().slice(0, 10).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "var(--nm-bg-elevated)" }}>
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: a.correct ? "#22c55e" : "#ef4444" }}>
                    {a.correct
                      ? <CheckCircle2 size={12} color="white" />
                      : <XCircle size={12} color="white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{a.question}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--nm-text-muted)" }}>{a.feedback}</p>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: a.correct ? "#22c55e" : "#ef4444" }}>
                    {a.correct ? "+50" : "+10"} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </StudentLayout>
  );
}
