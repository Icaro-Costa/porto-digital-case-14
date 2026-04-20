"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, Lock, Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { StudentLayout } from "@/views/student/StudentLayout";
import { LessonBuilderLayout } from "@/views/lesson-builder/LessonBuilderLayout";

function Field({ label, value, onChange, readOnly, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nm-text-muted)" }}>{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: readOnly ? "var(--nm-bg-elevated)" : "var(--nm-bg-surface)",
          border: "1px solid var(--nm-border)",
          opacity: readOnly ? 0.7 : 1,
          cursor: readOnly ? "not-allowed" : "text",
        }}
      />
    </div>
  );
}

function ProfileContent() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const router = useRouter();
  const photoRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [matricula, setMatricula] = useState(user?.matricula ?? "");
  const [subject, setSubject] = useState(user?.subject ?? "");
  const [photo, setPhoto] = useState(user?.photo ?? "");
  const [saved, setSaved] = useState(false);

  const [pwMode, setPwMode] = useState<"none" | "change" | "request">("none");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!user) return null;
  const isStudent = user.role === "student";
  const initial = name.charAt(0).toUpperCase() || "?";

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhoto(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function saveProfile() {
    updateProfile({
      name: name.trim() || user!.name,
      photo: photo || undefined,
      ...(isStudent ? { matricula: matricula.trim() } : { subject: subject.trim() }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePasswordChange() {
    if (!newPw || newPw.length < 6) {
      setPwMsg({ ok: false, text: "A nova senha precisa ter ao menos 6 caracteres." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "As senhas não coincidem." });
      return;
    }
    // Demo: always succeeds
    setPwMsg({ ok: true, text: "Senha alterada com sucesso!" });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => { setPwMode("none"); setPwMsg(null); }, 2000);
  }

  function handlePasswordRequest() {
    setPwMsg({ ok: true, text: `Link de redefinição enviado para ${user!.email}` });
    setTimeout(() => { setPwMode("none"); setPwMsg(null); }, 2500);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{ color: "var(--nm-text-muted)" }}
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-3">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: photo ? "transparent" : "linear-gradient(135deg, #f97316, #ec4899)",
              border: "3px solid var(--nm-purple)",
            }}
          >
            {photo
              ? <img src={photo} alt="foto" className="w-full h-full object-cover" />
              : <span className="text-3xl font-bold text-white">{initial}</span>}
          </div>
          <button
            onClick={() => photoRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--nm-purple)", border: "2px solid var(--nm-bg-base)" }}
            title="Alterar foto"
          >
            <Camera size={12} color="white" />
          </button>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
        </div>
        <p className="text-lg font-bold text-white">{name || user.name}</p>
        <p className="text-xs" style={{ color: "var(--nm-purple-light)" }}>
          {isStudent ? "Aluno" : "Professor"}
        </p>
      </div>

      {/* Info */}
      <div className="p-5 rounded-2xl space-y-4 mb-4" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
        <h3 className="text-sm font-semibold text-white">Dados do perfil</h3>
        <Field label="Nome completo" value={name} onChange={setName} placeholder="Seu nome" />
        <Field label="Email" value={user.email} readOnly />
        {isStudent
          ? <Field label="Matrícula" value={matricula} onChange={setMatricula} placeholder="Ex: 2024001234" />
          : <Field label="Matéria que leciona" value={subject} onChange={setSubject} placeholder="Ex: Matemática, História..." />}

        <button
          onClick={saveProfile}
          className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: saved ? "#22c55e" : "var(--nm-purple)" }}
        >
          {saved ? <><CheckCircle2 size={14} /> Salvo!</> : <><Save size={14} /> Salvar alterações</>}
        </button>
      </div>

      {/* Password */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Lock size={14} /> Segurança</h3>

        {pwMode === "none" && (
          <div className="flex gap-3">
            <button
              onClick={() => { setPwMode("change"); setPwMsg(null); }}
              className="flex-1 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }}
            >
              Alterar senha
            </button>
            <button
              onClick={() => { setPwMode("request"); setPwMsg(null); }}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)", color: "var(--nm-text-muted)" }}
            >
              Solicitar nova senha
            </button>
          </div>
        )}

        {pwMode === "change" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nm-text-muted)" }}>Senha atual</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nm-text-muted)" }}>Nova senha</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                placeholder="Mínimo 6 caracteres" className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nm-text-muted)" }}>Confirmar nova senha</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repita a nova senha" className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }} />
            </div>
            {pwMsg && (
              <p className="flex items-center gap-1.5 text-xs" style={{ color: pwMsg.ok ? "#22c55e" : "#ef4444" }}>
                {pwMsg.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} {pwMsg.text}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setPwMode("none"); setPwMsg(null); }}
                className="flex-1 py-2 rounded-xl text-sm" style={{ background: "var(--nm-bg-elevated)", color: "var(--nm-text-muted)" }}>
                Cancelar
              </button>
              <button onClick={handlePasswordChange}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--nm-purple)" }}>
                Confirmar
              </button>
            </div>
          </div>
        )}

        {pwMode === "request" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--nm-bg-elevated)" }}>
              <Mail size={16} style={{ color: "var(--nm-purple-light)" }} />
              <div>
                <p className="text-sm text-white">Enviar link de redefinição</p>
                <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{user.email}</p>
              </div>
            </div>
            {pwMsg && (
              <p className="flex items-center gap-1.5 text-xs" style={{ color: pwMsg.ok ? "#22c55e" : "#ef4444" }}>
                {pwMsg.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} {pwMsg.text}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setPwMode("none"); setPwMsg(null); }}
                className="flex-1 py-2 rounded-xl text-sm" style={{ background: "var(--nm-bg-elevated)", color: "var(--nm-text-muted)" }}>
                Cancelar
              </button>
              <button onClick={handlePasswordRequest}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--nm-purple)" }}>
                Enviar email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  if (user.role === "teacher") {
    return (
      <LessonBuilderLayout>
        <div className="flex flex-col h-full">
          <header className="flex items-center px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
            <h2 className="text-lg font-semibold text-white">Meu Perfil</h2>
          </header>
          <ProfileContent />
        </div>
      </LessonBuilderLayout>
    );
  }

  return (
    <StudentLayout>
      <header className="flex items-center px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
        <h2 className="text-lg font-semibold text-white">Meu Perfil</h2>
      </header>
      <ProfileContent />
    </StudentLayout>
  );
}
