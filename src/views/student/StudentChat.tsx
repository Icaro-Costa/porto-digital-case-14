"use client";
import { useRef, useState, useCallback } from "react";
import { Send, Paperclip, Zap, X, FileText, Image as ImageIcon, Loader2, BookOpen } from "lucide-react";
import { StudentLayout } from "@/views/student/StudentLayout";
import { useProgressStore } from "@/stores/progress";
import { useLessonStore } from "@/stores/lesson";
import { api, BACKEND_URL } from "@/lib/api";

interface Attachment {
  name: string;
  type: "image" | "file";
  base64?: string;
  mimeType?: string;
  text?: string;
  preview?: string;
}

interface Exercise {
  id: string;
  question: string;
  type: "open" | "multiple_choice";
  options?: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment?: Attachment;
  exercises?: Exercise[];
  loading?: boolean;
}

function ExerciseCard({ ex, onAnswer }: { ex: Exercise; onAnswer: (q: string, a: string) => void }) {
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit(a: string) {
    if (submitted) return;
    setSubmitted(true);
    onAnswer(ex.question, a);
  }

  if (ex.type === "multiple_choice" && ex.options) {
    return (
      <div className="mt-2 p-3 rounded-xl" style={{ background: "var(--nm-bg-base)", border: "1px solid var(--nm-border)" }}>
        <p className="text-sm text-white font-medium mb-3">{ex.question}</p>
        <div className="space-y-2">
          {ex.options.map((opt, i) => (
            <button
              key={i}
              disabled={submitted}
              onClick={() => { setSelected(opt); submit(opt); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: selected === opt ? "rgba(124,58,237,0.3)" : "var(--nm-bg-elevated)",
                border: `1px solid ${selected === opt ? "var(--nm-purple)" : "var(--nm-border)"}`,
                color: "var(--nm-text)",
                opacity: submitted && selected !== opt ? 0.5 : 1,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        {submitted && <p className="text-xs mt-2" style={{ color: "var(--nm-purple-light)" }}>Resposta enviada ao mentor!</p>}
      </div>
    );
  }

  return (
    <div className="mt-2 p-3 rounded-xl" style={{ background: "var(--nm-bg-base)", border: "1px solid var(--nm-border)" }}>
      <p className="text-sm text-white font-medium mb-2">{ex.question}</p>
      {!submitted ? (
        <div className="flex gap-2">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Sua resposta..."
            className="flex-1 px-3 py-1.5 rounded-lg text-sm text-white outline-none"
            style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }}
            onKeyDown={(e) => e.key === "Enter" && answer.trim() && submit(answer)}
          />
          <button
            onClick={() => answer.trim() && submit(answer)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: "var(--nm-purple)" }}
          >
            Enviar
          </button>
        </div>
      ) : (
        <p className="text-xs" style={{ color: "var(--nm-purple-light)" }}>Resposta enviada ao mentor!</p>
      )}
    </div>
  );
}

export function StudentChat() {
  const addAttempt = useProgressStore((s) => s.addAttempt);
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const activeModuleId = currentLesson?.modules.find((m) => m.status === "approved")?.id ?? null;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o NeuroMentor. Pode me fazer perguntas, enviar um arquivo (PDF, TXT) ou uma imagem para estudarmos juntos. Se quiser, posso gerar atividades a partir do material que você enviar.",
    },
  ]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [context, setContext] = useState("");
  const [contextName, setContextName] = useState("");
  const [generatingEx, setGeneratingEx] = useState(false);
  const [sending, setSending] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollDown() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const processFile = useCallback(async (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        setAttachment({ name: file.name, type: "image", base64, mimeType: file.type, preview: dataUrl });
      };
      reader.readAsDataURL(file);
      return;
    }

    // PDF / TXT — upload para extrair texto
    const form = new FormData();
    form.append("file", file);
    const token = typeof window !== "undefined"
      ? (() => { try { return JSON.parse(localStorage.getItem("neuromentor-auth") ?? "{}")?.state?.token; } catch { return null; } })()
      : null;
    const res = await fetch(`${BACKEND_URL}/api/lessons/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      alert("Não foi possível processar o arquivo.");
      return;
    }
    const data = await res.json();
    setContext(data.text ?? "");
    setContextName(file.name);
    setAttachment({ name: file.name, type: "file", text: data.text });
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text && !attachment) return;
    setSending(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text || (attachment?.type === "image" ? "📷 Imagem enviada" : `📄 ${attachment?.name}`),
      attachment: attachment ?? undefined,
    };
    const loadingMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "", loading: true };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setAttachment(null);
    scrollDown();

    try {
      // Build multimodal content
      type Part = { type: "text"; text: string } | { type: "image"; image: string; mimeType: string };
      const userContent: Part[] = [];
      if (text) userContent.push({ type: "text", text });
      if (attachment?.type === "image" && attachment.base64) {
        userContent.push({ type: "image", image: attachment.base64, mimeType: attachment.mimeType ?? "image/jpeg" });
      }
      if (attachment?.type === "file" && attachment.text) {
        userContent.push({ type: "text", text: `\n\n[Arquivo: ${attachment.name}]\n${attachment.text.slice(0, 8000)}` });
        setContext(attachment.text);
        setContextName(attachment.name);
      }

      const history = messages
        .filter((m) => !m.loading && m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const chatToken = typeof window !== "undefined"
        ? (() => { try { return JSON.parse(localStorage.getItem("neuromentor-auth") ?? "{}")?.state?.token; } catch { return null; } })()
        : null;
      const chatMessages = [
        ...history,
        {
          role: "user",
          content: userContent.length === 1 && userContent[0].type === "text"
            ? userContent[0].text
            : userContent,
        },
      ];
      const res = await fetch(`${BACKEND_URL}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(chatToken ? { Authorization: `Bearer ${chatToken}` } : {}),
        },
        body: JSON.stringify({ messages: chatMessages, context: context || null, moduleId: activeModuleId }),
      });

      if (!res.ok) throw new Error("Erro na resposta");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("0:")) continue;
          try {
            const text = JSON.parse(line.slice(2));
            if (typeof text === "string") {
              assistantText += text;
              setMessages((prev) => prev.map((m) => m.loading ? { ...m, content: assistantText } : m));
            }
          } catch {}
        }
      }

      setMessages((prev) => prev.map((m) => m.loading ? { ...m, loading: false, content: assistantText } : m));
    } catch {
      setMessages((prev) => prev.map((m) => m.loading ? { ...m, loading: false, content: "Desculpe, ocorreu um erro. Tente novamente." } : m));
    } finally {
      setSending(false);
      scrollDown();
    }
  }

  async function generateExercises() {
    if (!context && messages.length < 3) return;
    setGeneratingEx(true);
    const loadingMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "", loading: true };
    setMessages((prev) => [...prev, loadingMsg]);
    scrollDown();

    try {
      const exToken = typeof window !== "undefined"
        ? (() => { try { return JSON.parse(localStorage.getItem("neuromentor-auth") ?? "{}")?.state?.token; } catch { return null; } })()
        : null;
      const exRes = await fetch(`${BACKEND_URL}/api/chat/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(exToken ? { Authorization: `Bearer ${exToken}` } : {}),
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Gere 3 exercícios sobre ${contextName || "o material estudado"}.` }],
          context: context || null,
          moduleId: activeModuleId,
        }),
      });
      const data = await exRes.json();
      const exercises: Exercise[] = data.exercises ?? [];
      const introText = `Gerei ${exercises.length} atividade${exercises.length !== 1 ? "s" : ""} com base no material. Responda cada uma:`;
      setMessages((prev) => prev.map((m) => m.loading ? { ...m, loading: false, content: introText, exercises } : m));
    } catch {
      setMessages((prev) => prev.map((m) => m.loading ? { ...m, loading: false, content: "Não foi possível gerar as atividades." } : m));
    } finally {
      setGeneratingEx(false);
      scrollDown();
    }
  }

  async function handleAnswer(question: string, answer: string) {
    const loadingId = crypto.randomUUID();
    setMessages((prev) => [...prev, {
      id: loadingId, role: "assistant", content: "", loading: true,
    }]);

    try {
      const result = await api.correctAnswer({ question, answer, context: context || undefined });

      setMessages((prev) => prev.map((m) =>
        m.id === loadingId
          ? { ...m, loading: false, content: result.feedback }
          : m
      ));

      addAttempt({
        lessonId: "chat", moduleId: "chat", question, answer,
        correct: result.correct, feedback: result.feedback,
      });

      api.recordAttempt({
        moduleId: "chat", question, answer,
        isCorrect: result.correct, feedback: result.feedback,
        teacherExplanation: result.teacherExplanation,
        pendingReview: true,
      }).catch(() => {});
    } catch {
      setMessages((prev) => prev.map((m) =>
        m.id === loadingId
          ? { ...m, loading: false, content: "Não foi possível corrigir a resposta. Tente novamente." }
          : m
      ));
    }

    scrollDown();
  }

  return (
    <StudentLayout>
      <header className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
        <div>
          <h2 className="text-lg font-semibold text-white">Chat com o Mentor</h2>
          <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>Envie dúvidas, arquivos ou fotos para estudar</p>
        </div>
        {contextName && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
            <FileText size={12} style={{ color: "var(--nm-purple-light)" }} />
            <span className="text-xs text-white truncate max-w-[160px]">{contextName}</span>
            <button onClick={() => { setContext(""); setContextName(""); }} style={{ color: "var(--nm-text-muted)" }}>
              <X size={12} />
            </button>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] ${msg.role === "user" ? "" : "w-full"}`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--nm-purple-light)" }}>NeuroMentor</span>
                </div>
              )}

              <div
                className="px-4 py-3 rounded-2xl text-sm"
                style={{
                  background: msg.role === "user" ? "var(--nm-purple)" : "var(--nm-bg-surface)",
                  border: msg.role === "assistant" ? "1px solid var(--nm-border)" : "none",
                  color: "white",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                }}
              >
                {/* Attachment preview */}
                {msg.attachment?.type === "image" && msg.attachment.preview && (
                  <img src={msg.attachment.preview} alt="upload" className="max-w-full rounded-lg mb-2" style={{ maxHeight: 200 }} />
                )}
                {msg.attachment?.type === "file" && (
                  <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <FileText size={14} />
                    <span className="text-xs truncate">{msg.attachment.name}</span>
                  </div>
                )}

                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" style={{ color: "var(--nm-purple-light)" }} />
                    <span style={{ color: "var(--nm-text-muted)" }}>Pensando...</span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                )}

                {/* Exercises */}
                {msg.exercises && msg.exercises.map((ex) => (
                  <ExerciseCard key={ex.id} ex={ex} onAnswer={handleAnswer} />
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: "1px solid var(--nm-border)" }}>
        {/* Attachment preview */}
        {attachment && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
            {attachment.type === "image"
              ? <ImageIcon size={14} style={{ color: "var(--nm-purple-light)" }} />
              : <FileText size={14} style={{ color: "var(--nm-purple-light)" }} />}
            <span className="text-xs text-white truncate flex-1">{attachment.name}</span>
            <button onClick={() => setAttachment(null)} style={{ color: "var(--nm-text-muted)" }}>
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-3">
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md,image/*" className="hidden" onChange={onFileChange} />

          <button
            onClick={() => fileRef.current?.click()}
            className="p-2 rounded-xl flex-shrink-0"
            style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)", color: "var(--nm-text-muted)" }}
            title="Enviar arquivo ou imagem"
          >
            <Paperclip size={16} />
          </button>

          {(context || messages.length > 2) && (
            <button
              onClick={generateExercises}
              disabled={generatingEx || sending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "var(--nm-purple-light)" }}
              title="Gerar atividades"
            >
              {generatingEx ? <Loader2 size={12} className="animate-spin" /> : <BookOpen size={12} />}
              Gerar atividade
            </button>
          )}

          <div className="flex-1 flex items-end gap-2 rounded-xl px-4 py-2" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Digite sua dúvida ou pergunta…"
              className="flex-1 bg-transparent text-sm text-white outline-none resize-none"
              style={{ color: "white", minHeight: 20, maxHeight: 120 }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={sending || (!input.trim() && !attachment)}
              className="p-1 rounded-lg flex-shrink-0"
              style={{ color: input.trim() || attachment ? "var(--nm-purple-light)" : "var(--nm-text-muted)" }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
