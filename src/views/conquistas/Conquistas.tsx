"use client";
import { useMemo } from "react";
import { Trophy, Star, Zap, Flame, Target, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { StudentLayout } from "@/views/student/StudentLayout";
import { useProgressStore } from "@/stores/progress";

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  unlocked: boolean;
  progress?: { current: number; max: number };
}

function AchievementCard({ a }: { a: Achievement }) {
  return (
    <div
      className="p-5 rounded-2xl flex items-start gap-4 transition-all"
      style={{
        background: "var(--nm-bg-surface)",
        border: `1px solid ${a.unlocked ? a.color + "40" : "var(--nm-border)"}`,
        opacity: a.unlocked ? 1 : 0.55,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: a.unlocked ? `${a.color}25` : "var(--nm-bg-elevated)" }}
      >
        <span style={{ color: a.unlocked ? a.color : "var(--nm-text-muted)" }}>
          {a.unlocked ? a.icon : <Lock size={20} />}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-white">{a.title}</p>
          {a.unlocked && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${a.color}25`, color: a.color }}>
              Desbloqueada
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{a.description}</p>
        {a.progress && !a.unlocked && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{a.progress.current}/{a.progress.max}</span>
              <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{Math.round((a.progress.current / a.progress.max) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nm-bg-elevated)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((a.progress.current / a.progress.max) * 100))}%`, background: a.color }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Conquistas() {
  const { xp, level, streak, attempts } = useProgressStore();

  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;

  const achievements: Achievement[] = useMemo(() => [
    {
      id: "first-step",
      icon: <Star size={22} />,
      title: "Primeiro Passo",
      description: "Responda seu primeiro exercício.",
      color: "#f59e0b",
      unlocked: total >= 1,
      progress: { current: Math.min(total, 1), max: 1 },
    },
    {
      id: "five-correct",
      icon: <CheckCircle2 size={22} />,
      title: "Em Ritmo",
      description: "Acerte 5 exercícios.",
      color: "#22c55e",
      unlocked: correct >= 5,
      progress: { current: Math.min(correct, 5), max: 5 },
    },
    {
      id: "ten-exercises",
      icon: <Target size={22} />,
      title: "Maratonista",
      description: "Responda 10 exercícios.",
      color: "#3b82f6",
      unlocked: total >= 10,
      progress: { current: Math.min(total, 10), max: 10 },
    },
    {
      id: "level2",
      icon: <Zap size={22} />,
      title: "Subindo de Nível",
      description: "Alcance o nível 2.",
      color: "#7c3aed",
      unlocked: level >= 2,
      progress: { current: Math.min(xp, 500), max: 500 },
    },
    {
      id: "streak3",
      icon: <Flame size={22} />,
      title: "Chama Viva",
      description: "Mantenha um streak de 3 dias.",
      color: "#f97316",
      unlocked: streak >= 3,
      progress: { current: Math.min(streak, 3), max: 3 },
    },
    {
      id: "fifty-correct",
      icon: <Trophy size={22} />,
      title: "Mestre do Conhecimento",
      description: "Acerte 50 exercícios.",
      color: "#eab308",
      unlocked: correct >= 50,
      progress: { current: Math.min(correct, 50), max: 50 },
    },
    {
      id: "perfect-session",
      icon: <Star size={22} />,
      title: "Sessão Perfeita",
      description: "Acerte 5 exercícios seguidos.",
      color: "#06b6d4",
      unlocked: (() => {
        let run = 0;
        for (const a of attempts) { if (a.correct) { run++; if (run >= 5) return true; } else run = 0; }
        return false;
      })(),
    },
    {
      id: "xp500",
      icon: <Zap size={22} />,
      title: "500 XP",
      description: "Acumule 500 XP.",
      color: "#a855f7",
      unlocked: xp >= 500,
      progress: { current: Math.min(xp, 500), max: 500 },
    },
    {
      id: "lessons3",
      icon: <BookOpen size={22} />,
      title: "Explorador",
      description: "Responda exercícios em 3 aulas diferentes.",
      color: "#10b981",
      unlocked: new Set(attempts.map((a) => a.lessonId)).size >= 3,
      progress: { current: Math.min(new Set(attempts.map((a) => a.lessonId)).size, 3), max: 3 },
    },
  ], [xp, level, streak, attempts, total, correct]);

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <StudentLayout>
      <header className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
        <div>
          <h2 className="text-lg font-semibold text-white">Conquistas</h2>
          <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>Suas medalhas e marcos de aprendizado</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
          <Trophy size={14} style={{ color: "#eab308" }} />
          <span className="text-sm font-semibold text-white">{unlocked}</span>
          <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>/ {achievements.length}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Progress bar */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Progresso Geral</p>
            <p className="text-sm font-bold" style={{ color: "var(--nm-purple-light)" }}>{unlocked}/{achievements.length} desbloqueadas</p>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--nm-bg-elevated)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.round((unlocked / achievements.length) * 100)}%`,
                background: "linear-gradient(90deg, #7c3aed, #a855f7)",
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--nm-text-muted)" }}>
            {achievements.length - unlocked} conquista{achievements.length - unlocked !== 1 ? "s" : ""} para desbloquear
          </p>
        </div>

        {/* Unlocked */}
        {unlocked > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--nm-text-muted)" }}>DESBLOQUEADAS</h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.filter((a) => a.unlocked).map((a) => <AchievementCard key={a.id} a={a} />)}
            </div>
          </div>
        )}

        {/* Locked */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--nm-text-muted)" }}>EM PROGRESSO</h3>
          <div className="grid grid-cols-2 gap-4">
            {achievements.filter((a) => !a.unlocked).map((a) => <AchievementCard key={a.id} a={a} />)}
          </div>
        </div>

        {achievements.filter((a) => !a.unlocked).length === 0 && (
          <div className="text-center py-8">
            <Trophy size={40} className="mx-auto mb-3" style={{ color: "#eab308" }} />
            <p className="font-semibold text-white">Parabéns! Todas as conquistas desbloqueadas!</p>
            <p className="text-sm mt-1" style={{ color: "var(--nm-text-muted)" }}>Você é um mestre do conhecimento.</p>
          </div>
        )}
      </main>
    </StudentLayout>
  );
}
