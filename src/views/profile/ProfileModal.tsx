"use client";
import { useRef, useState } from "react";
import { X, Camera, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

interface Props {
  onClose: () => void;
}

export function ProfileModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePasswordFn = useAuthStore((s) => s.changePassword);

  const [name, setName] = useState(user?.name ?? "");
  const [extra, setExtra] = useState(
    user?.role === "student" ? (user.matricula ?? "") : (user?.subject ?? "")
  );
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(user?.photo);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const photoRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const u = user;

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPhotoPreview(url);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function saveProfile() {
    if (!name.trim()) { setProfileMsg({ type: "err", text: "O nome não pode estar vazio." }); return; }
    const result = await updateProfile({
      name: name.trim(),
      photo: photoPreview,
      ...(u.role === "student" ? { matricula: extra } : { subject: extra }),
    });
    if (!result.ok) { setProfileMsg({ type: "err", text: result.error ?? "Erro." }); return; }
    setProfileMsg({ type: "ok", text: "Perfil atualizado com sucesso!" });
    setTimeout(() => setProfileMsg(null), 3000);
  }

  async function changePassword() {
    if (!currentPw) { setPwMsg({ type: "err", text: "Informe a senha atual." }); return; }
    if (newPw.length < 6) { setPwMsg({ type: "err", text: "A nova senha deve ter pelo menos 6 caracteres." }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: "err", text: "As senhas não coincidem." }); return; }
    const result = await changePasswordFn(currentPw, newPw);
    if (!result.ok) { setPwMsg({ type: "err", text: result.error ?? "Erro ao alterar senha." }); return; }
    setPwMsg({ type: "ok", text: "Senha alterada com sucesso!" });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwMsg(null), 3000);
  }

  function requestNewPassword() {
    setPwMsg({ type: "ok", text: `Link de redefinição enviado para ${u.email}.` });
    setTimeout(() => setPwMsg(null), 4000);
  }

  const initials = name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="h-full w-full max-w-md flex flex-col overflow-y-auto"
        style={{ background: "var(--nm-bg-deep)", borderLeft: "1px solid var(--nm-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
          <h2 className="text-base font-semibold text-white">Meu Perfil</h2>
          <button onClick={onClose} style={{ color: "var(--nm-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: photoPreview ? "transparent" : "linear-gradient(135deg, #7c3aed, #ec4899)", border: "3px solid var(--nm-purple)" }}
              >
                {photoPreview
                  ? <img src={photoPreview} alt="foto" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-white">{initials}</span>}
              </div>
              <button
                onClick={() => photoRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--nm-purple)", border: "2px solid var(--nm-bg-deep)" }}
              >
                <Camera size={13} color="white" />
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs" style={{ color: "var(--nm-purple-light)" }}>
                {user.role === "student" ? "Aluno" : "Professor"}
              </p>
            </div>
          </div>

          {/* Dados do perfil */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider" style={{ color: "var(--nm-text-muted)" }}>DADOS PESSOAIS</h3>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Nome completo</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-not-allowed"
                style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)", color: "var(--nm-text-muted)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                {user.role === "student" ? "Matrícula" : "Matéria que leciona"}
              </label>
              <input
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder={user.role === "student" ? "Ex: 2024001234" : "Ex: Matemática, Física…"}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
              />
            </div>

            {profileMsg && (
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${profileMsg.type === "ok" ? "text-green-400" : "text-red-400"}`}
                style={{ background: profileMsg.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
                {profileMsg.type === "ok" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                {profileMsg.text}
              </div>
            )}

            <button
              onClick={saveProfile}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--nm-purple)" }}
            >
              Salvar alterações
            </button>
          </div>

          {/* Senha */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider" style={{ color: "var(--nm-text-muted)" }}>SEGURANÇA</h3>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Senha atual</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 pr-10 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }}>
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Nova senha</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 pr-10 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
                />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nm-text-muted)" }}>
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
              />
            </div>

            {pwMsg && (
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${pwMsg.type === "ok" ? "text-green-400" : "text-red-400"}`}
                style={{ background: pwMsg.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
                {pwMsg.type === "ok" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                {pwMsg.text}
              </div>
            )}

            <button
              onClick={changePassword}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }}
            >
              Alterar senha
            </button>

            <button
              onClick={requestNewPassword}
              className="w-full py-2.5 rounded-xl text-sm text-center"
              style={{ color: "var(--nm-purple-light)" }}
            >
              Solicitar nova senha por e-mail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
