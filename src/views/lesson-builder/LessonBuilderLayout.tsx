"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Upload, Cpu, ListChecks, FileText, LogOut, BookOpen, MoreVertical, Users, ChevronDown, ClipboardCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useLessonStore } from "@/stores/lesson";
import { ProfileModal } from "@/views/profile/ProfileModal";

const WORKFLOW_ITEMS = [
  { to: "upload", label: "Upload de Materiais", icon: Upload },
  { to: "processing", label: "Processamento", icon: Cpu },
  { to: "review", label: "Revisão e Validação", icon: ListChecks },
  { to: "pdf-viewer", label: "Chat com Material", icon: FileText },
];

export function LessonBuilderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const lessons = useLessonStore((s) => s.lessons);
  const setCurrent = useLessonStore((s) => s.setCurrent);
  const loadTeacherLessons = useLessonStore((s) => s.loadTeacherLessons);

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role === "student") { router.replace("/dashboard"); return; }
    loadTeacherLessons();
  }, [user, router, loadTeacherLessons]);

  if (!user || user.role === "student") return null;

  const [showProfile, setShowProfile] = useState(false);
  const currentItem = WORKFLOW_ITEMS.find((i) => pathname?.endsWith(i.to));
  const userName = user.name;
  const userInitial = userName.charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex h-screen neuromentor" style={{ background: "var(--nm-bg-base)", color: "var(--nm-text)" }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col py-5 px-3 flex-shrink-0" style={{ background: "var(--nm-sidebar)", borderRight: "1px solid var(--nm-border)" }}>
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-white">NeuroMentor</span>
        </div>

        {lessons.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold px-3 mb-2 tracking-wider" style={{ color: "var(--nm-text-muted)" }}>AULA ATIVA</p>
            <div className="relative px-1">
              <select
                value={currentLesson?.id ?? ""}
                onChange={(e) => {
                  const l = lessons.find((x) => x.id === e.target.value);
                  if (l) setCurrent(l);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs appearance-none outline-none cursor-pointer pr-7"
                style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)", color: "white" }}
              >
                {lessons.map((l) => (
                  <option key={l.id} value={l.id} style={{ background: "#1a1a2e" }}>{l.title}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--nm-text-muted)" }} />
            </div>
          </div>
        )}

        <p className="text-xs font-semibold px-3 mb-3 tracking-wider" style={{ color: "var(--nm-text-muted)" }}>CRIAR AULA</p>
        <nav className="space-y-1 flex-1">
          {WORKFLOW_ITEMS.map((item) => {
            const isActive = pathname?.endsWith(item.to);
            return (
              <Link
                key={item.to}
                href={`/lesson-builder/${item.to}`}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  background: isActive ? "rgba(124,58,237,0.2)" : "transparent",
                  color: isActive ? "var(--nm-purple-light)" : "var(--nm-text-muted)",
                }}
              >
                <item.icon size={16} style={{ color: isActive ? "var(--nm-purple-light)" : "var(--nm-text-muted)" }} />
                {item.label}
              </Link>
            );
          })}

          <div className="h-px my-3" style={{ background: "var(--nm-border)" }} />
          <p className="text-xs font-semibold px-3 mb-2 tracking-wider" style={{ color: "var(--nm-text-muted)" }}>TURMAS</p>
          <Link
            href="/turmas"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: pathname === "/turmas" ? "rgba(124,58,237,0.2)" : "transparent",
              color: pathname === "/turmas" ? "var(--nm-purple-light)" : "var(--nm-text-muted)",
            }}
          >
            <Users size={16} /> Gerenciar turmas
          </Link>
          <Link
            href="/professor/revisoes"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: pathname === "/professor/revisoes" ? "rgba(124,58,237,0.2)" : "transparent",
              color: pathname === "/professor/revisoes" ? "var(--nm-purple-light)" : "var(--nm-text-muted)",
            }}
          >
            <ClipboardCheck size={16} /> Revisão do chat
          </Link>

          {/* Link rápido para aula se já tiver módulo aprovado */}
          {currentLesson && currentLesson.modules.some((m) => m.status === "approved") && (
            <>
              <div className="h-px my-3" style={{ background: "var(--nm-border)" }} />
              <p className="text-xs font-semibold px-3 mb-2 tracking-wider" style={{ color: "var(--nm-text-muted)" }}>TESTAR AULA</p>
              <Link
                href={`/aula/${currentLesson.id}?module=${encodeURIComponent(currentLesson.modules.find((m) => m.status === "approved")!.title)}`}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm"
                style={{ color: "var(--nm-text-muted)" }}
              >
                <BookOpen size={16} /> Prévia da aula
              </Link>
            </>
          )}
        </nav>

        {/* User */}
        <div className="flex items-center gap-2 px-3 pt-4 mt-2 border-t" style={{ borderColor: "var(--nm-border)" }}>
          <Link href="/perfil" className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 hover:opacity-80 transition-opacity">
            {userInitial}
          </Link>
          <Link href="/perfil" className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
            <p className="text-xs font-medium text-white truncate">{userName}</p>
            <p className="text-xs" style={{ color: "var(--nm-purple-light)" }}>Professor</p>
          </Link>
          <button onClick={handleLogout} style={{ color: "var(--nm-text-muted)" }} title="Sair">
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main outlet */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--nm-text-muted)" }}>
            <span>Professor</span>
            <span>/</span>
            {currentLesson && <><span className="truncate max-w-xs">{currentLesson.title}</span><span>/</span></>}
            <span className="text-white font-medium">{currentItem?.label ?? "Visão geral"}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/lesson-builder/upload"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "var(--nm-purple)" }}
            >
              + Nova aula
            </Link>
            <button onClick={() => setShowProfile(true)} style={{ color: "var(--nm-text-muted)" }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
