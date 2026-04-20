"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Dumbbell,
  BarChart2,
  Trophy,
  Bell,
  Play,
  MessageSquare,
  MoreVertical,
  Star,
  Flame,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useLessonStore } from "@/stores/lesson";
import { useProgressStore } from "@/stores/progress";
import { useClassStore } from "@/stores/class";
import { ProfileModal } from "@/views/profile/ProfileModal";
import { JoinClassModal } from "@/views/turmas/JoinClassModal";

const XP_PER_LEVEL = 500;

export function StudentDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const lessons = useLessonStore((s) => s.lessons);
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const { xp, level, streak, attempts, syncFromServer } = useProgressStore();
  const [activityTab, setActivityTab] = useState<"all" | "insights">("all");
  const [showProfile, setShowProfile] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const loadStudentClasses = useClassStore((s) => s.loadStudentClasses);
  const loadStudentLessons = useLessonStore((s) => s.loadStudentLessons);

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role === "teacher") { router.replace("/lesson-builder/upload"); return; }
    loadStudentClasses();
    loadStudentLessons();
    syncFromServer();
  }, [user, router, loadStudentClasses, loadStudentLessons, syncFromServer]);

  if (!user || user.role === "teacher") return null;

  const xpForNextLevel = level * XP_PER_LEVEL;
  const xpProgressPct = Math.min(100, Math.round((xp / xpForNextLevel) * 100));
  const userName = user.name;
  const userInitial = userName.charAt(0).toUpperCase();

  const visibleLessons = lessons;
  const approvedModules = currentLesson?.modules.filter((m) => m.status === "approved") ?? [];
  const currentModule = approvedModules[0];
  const recent = attempts.slice(-5).reverse();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex h-screen neuromentor" style={{ background: "var(--nm-bg-base)", color: "var(--nm-text)" }}>
      <aside
        className="w-56 flex flex-col py-5 px-3 flex-shrink-0"
        style={{ background: "var(--nm-sidebar)", borderRight: "1px solid var(--nm-border)" }}
      >
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-white">NeuroMentor</span>
        </div>

        <p className="text-xs font-semibold px-3 mb-3 tracking-wider" style={{ color: "var(--nm-text-muted)" }}>MENU</p>
        <nav className="space-y-1 mb-6">
          <button
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm"
            style={{ background: "rgba(124,58,237,0.2)", color: "var(--nm-purple-light)" }}
          >
            <Home size={16} /> Dashboard
          </button>
          {currentLesson && currentModule && (
            <Link
              href={`/aula/${currentLesson.id}?module=${encodeURIComponent(currentModule.title)}`}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm"
              style={{ color: "var(--nm-text-muted)" }}
            >
              <BookOpen size={16} /> Aula Simulada
            </Link>
          )}
          {currentLesson && (
            <>
              <Link
                href={`/exercicios/${currentLesson.id}?module=${encodeURIComponent(currentModule?.title ?? "Módulo")}`}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm"
                style={{ color: "var(--nm-text-muted)" }}
              >
                <Dumbbell size={16} /> Exercícios
              </Link>
              <Link
                href={`/revisao/${currentLesson.id}`}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm"
                style={{ color: "var(--nm-text-muted)" }}
              >
                <Sparkles size={16} /> Revisão Guiada
              </Link>
            </>
          )}
        </nav>

        <p className="text-xs font-semibold px-3 mb-3 tracking-wider" style={{ color: "var(--nm-text-muted)" }}>MENU</p>
        <nav className="space-y-1 flex-1">
          <Link href="/chat" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm" style={{ color: "var(--nm-text-muted)" }}>
            <MessageSquare size={16} /> Chat IA
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm" style={{ color: "var(--nm-text-muted)" }}>
            <BarChart2 size={16} /> Analytics
          </Link>
          <Link href="/conquistas" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm" style={{ color: "var(--nm-text-muted)" }}>
            <Trophy size={16} /> Conquistas
          </Link>
        </nav>

        <div className="flex items-center gap-2 px-3 pt-4 border-t" style={{ borderColor: "var(--nm-border)" }}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{userName}</p>
            <p className="text-xs" style={{ color: "var(--nm-purple-light)" }}>Nível {level} · Aluno</p>
          </div>
          <button onClick={handleLogout} style={{ color: "var(--nm-text-muted)" }} title="Sair">
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--nm-border)" }}
        >
          <h2 className="text-lg font-semibold text-white">Olá, {userName.split(" ")[0]}</h2>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg"
              style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
            >
              <Bell size={16} style={{ color: "var(--nm-text-muted)" }} />
              {attempts.length > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--nm-purple)" }} />
              )}
            </button>
            <button onClick={() => setShowProfile(true)} style={{ color: "var(--nm-text-muted)" }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-6">
              {/* Hero card */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))",
                  border: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3"
                      style={{ background: "rgba(124,58,237,0.3)", color: "var(--nm-purple-light)" }}
                    >
                      {currentLesson ? "⚡ Em andamento" : "🎯 Começar"}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {currentLesson?.title ?? "Sua primeira aula"}
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "var(--nm-text-muted)", maxWidth: 420 }}>
                      {currentLesson
                        ? currentModule
                          ? `Módulo atual: "${currentModule.title}". Continue de onde parou.`
                          : "Aguardando aprovação de módulos pelo professor."
                        : "Peça ao seu professor um código de acesso, ou explore os materiais disponíveis."}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {currentLesson && currentModule ? (
                        <>
                          <button
                            onClick={() => router.push(`/aula/${currentLesson.id}?module=${encodeURIComponent(currentModule.title)}`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
                            style={{ background: "var(--nm-purple)" }}
                          >
                            <Play size={12} fill="currentColor" /> Continuar aula
                          </button>
                          <button
                            onClick={() => router.push(`/exercicios/${currentLesson.id}?module=${encodeURIComponent(currentModule.title)}`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                            style={{ borderColor: "var(--nm-border)", color: "var(--nm-text)" }}
                          >
                            <Dumbbell size={12} /> Praticar
                          </button>
                          <button
                            onClick={() => router.push(`/revisao/${currentLesson.id}`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                            style={{ borderColor: "var(--nm-border)", color: "var(--nm-text)" }}
                          >
                            <MessageSquare size={12} /> Revisão guiada
                          </button>
                        </>
                      ) : (
                        <span className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
                          Nenhuma aula disponível no momento.
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="ml-6 p-4 rounded-xl flex-shrink-0 w-52"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--nm-border)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white">Progresso dos módulos</span>
                      <span className="text-sm font-bold text-white">
                        {approvedModules.length}/{currentLesson?.modules.length ?? 0}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${currentLesson && currentLesson.modules.length > 0 ? (approvedModules.length / currentLesson.modules.length) * 100 : 0}%`,
                          background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
                        }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
                      {currentLesson ? `${currentLesson.modules.length} módulos gerados` : "Nenhuma aula ativa"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Aulas disponíveis */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Aulas disponíveis</h3>
                  <button
                    onClick={() => setShowJoinClass(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: "rgba(124,58,237,0.15)", color: "var(--nm-purple-light)", border: "1px solid rgba(124,58,237,0.3)" }}
                  >
                    + Entrar em turma
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {visibleLessons.length === 0 && (
                    <div
                      className="col-span-2 p-6 rounded-xl text-center"
                      style={{ background: "var(--nm-bg-surface)", border: "1px dashed var(--nm-border)" }}
                    >
                      <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
                        Entre em uma turma para ver as aulas do seu professor.
                      </p>
                    </div>
                  )}
                  {visibleLessons.map((l) => {
                    const approved = l.modules.filter((m) => m.status === "approved");
                    const firstApproved = approved[0];
                    return (
                      <div
                        key={l.id}
                        className="p-4 rounded-xl"
                        style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "var(--nm-bg-elevated)" }}>
                          <BookOpen size={18} style={{ color: "var(--nm-purple-light)" }} />
                        </div>
                        <h4 className="font-semibold text-white mb-1 text-sm truncate">{l.title}</h4>
                        <p className="text-xs mb-3" style={{ color: "var(--nm-text-muted)" }}>
                          {approved.length} módulos aprovados
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--nm-bg-elevated)", color: "var(--nm-text-muted)" }}>
                            {approved.length > 0 ? `${approved.length} módulos` : "Pendente"}
                          </span>
                          {firstApproved ? (
                            <button
                              onClick={() => router.push(`/aula/${l.id}?module=${encodeURIComponent(firstApproved.title)}`)}
                              className="flex items-center gap-1 text-xs"
                              style={{ color: "var(--nm-purple-light)" }}
                            >
                              Iniciar <ChevronRight size={10} />
                            </button>
                          ) : (
                            <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>Indisponível</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Atividade recente */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Atividade recente</h3>
                  <div className="flex gap-1">
                    {(["all", "insights"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActivityTab(t)}
                        className="px-3 py-1 rounded-lg text-xs"
                        style={{
                          background: activityTab === t ? "var(--nm-bg-elevated)" : "transparent",
                          color: activityTab === t ? "white" : "var(--nm-text-muted)",
                        }}
                      >
                        {t === "all" ? "Todas" : "Insights"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {recent.length === 0 && (
                    <div className="p-4 rounded-xl text-center" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                      <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
                        Nenhuma atividade ainda. Responda exercícios para ganhar XP.
                      </p>
                    </div>
                  )}
                  {recent.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 py-3 px-3 rounded-xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                      <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" style={{ background: a.correct ? "#22c55e" : "#ef4444" }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white truncate">{a.question.slice(0, 80)}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={{ background: a.correct ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: a.correct ? "#22c55e" : "#ef4444" }}
                          >
                            {a.correct ? "+50 XP" : "+10 XP"}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--nm-text-muted)" }}>{a.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — XP + ações de aluno */}
            <div className="w-72 flex-shrink-0 space-y-4">
              <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--nm-bg-deep)", border: "3px solid var(--nm-purple)" }}>
                      <span className="text-2xl font-bold text-white">{level}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--nm-purple)", color: "white" }}>NÍVEL</div>
                  </div>
                </div>
                <h3 className="text-center text-lg font-bold text-white mt-4">Mentor XP</h3>
                <p className="text-center text-xs mb-3" style={{ color: "var(--nm-text-muted)" }}>
                  {xp} / {xpForNextLevel} XP para o nível {level + 1}
                </p>
                <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "var(--nm-bg-elevated)" }}>
                  <div className="h-full rounded-full" style={{ width: `${xpProgressPct}%`, background: "linear-gradient(90deg, #7c3aed, #3b82f6)" }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl text-center" style={{ background: "var(--nm-bg-elevated)" }}>
                    <Flame size={18} className="mx-auto mb-1 text-orange-400" />
                    <p className="text-lg font-bold text-white">{streak}</p>
                    <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>DIAS STREAK</p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: "var(--nm-bg-elevated)" }}>
                    <Star size={18} className="mx-auto mb-1 text-yellow-400" />
                    <p className="text-lg font-bold text-white">{xp}</p>
                    <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>XP TOTAL</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                <h3 className="font-semibold text-white mb-3">Ações do aluno</h3>
                <div className="space-y-2">
                  {currentLesson && currentModule && (
                    <>
                      <button
                        onClick={() => router.push(`/aula/${currentLesson.id}?module=${encodeURIComponent(currentModule.title)}`)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-left"
                        style={{ background: "var(--nm-bg-elevated)", color: "white" }}
                      >
                        <Play size={14} style={{ color: "var(--nm-purple-light)" }} fill="currentColor" /> Iniciar aula simulada
                      </button>
                      <button
                        onClick={() => router.push(`/exercicios/${currentLesson.id}?module=${encodeURIComponent(currentModule.title)}`)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-left"
                        style={{ background: "var(--nm-bg-elevated)", color: "white" }}
                      >
                        <Dumbbell size={14} style={{ color: "var(--nm-purple-light)" }} /> Fazer exercícios
                      </button>
                      <button
                        onClick={() => router.push(`/revisao/${currentLesson.id}`)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-left"
                        style={{ background: "var(--nm-bg-elevated)", color: "white" }}
                      >
                        <Sparkles size={14} style={{ color: "var(--nm-purple-light)" }} /> Revisão guiada
                      </button>
                    </>
                  )}
                  {!currentLesson && (
                    <p className="text-xs text-center py-2" style={{ color: "var(--nm-text-muted)" }}>
                      Aguarde o professor disponibilizar uma aula.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}
    </div>
  );
}
