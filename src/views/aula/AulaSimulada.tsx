"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Sparkles, BookOpen, ArrowRight, Loader } from "lucide-react";
import { useChatStore } from "@/stores/chat";
import { BACKEND_URL } from "@/lib/api";

interface Props {
  lessonId: string;
  moduleTitle?: string;
}

export function AulaSimulada({ lessonId, moduleTitle = "Introdução" }: Props) {
  const router = useRouter();
  const { messages, addMessage, appendToMessage, setStreaming, streaming, reset } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reset();
    startLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function startLesson() {
    const userMsg = `Comece a aula sobre "${moduleTitle}". Siga a estrutura pedagógica obrigatória.`;
    await streamMentor([{ role: "user", content: userMsg }]);
  }

  async function streamMentor(history: Array<{ role: "user" | "assistant"; content: string }>) {
    setStreaming(true);
    const assistantId = addMessage({ role: "assistant", content: "" });

    try {
      const token = typeof window !== "undefined"
        ? (() => { try { return JSON.parse(localStorage.getItem("neuromentor-auth") ?? "{}")?.state?.token; } catch { return null; } })()
        : null;
      const res = await fetch(`${BACKEND_URL}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history, context: null }),
      });
      if (!res.ok || !res.body) throw new Error("Falha no chat");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("0:")) continue;
          try {
            const text = JSON.parse(line.slice(2));
            appendToMessage(assistantId, text);
          } catch {}
        }
      }
    } catch (e) {
      appendToMessage(assistantId, "\n\n⚠️ Erro ao conectar com o mentor. Verifique a ANTHROPIC_API_KEY em .env.");
    } finally {
      setStreaming(false);
    }
  }

  async function send() {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    setInput("");
    addMessage({ role: "user", content: text });
    const history = [...messages, { role: "user" as const, content: text }].map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
    await streamMentor(history);
  }

  return (
    <div className="min-h-screen neuromentor flex flex-col" style={{ background: "var(--nm-bg-base)", color: "var(--nm-text)" }}>
      <header className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--nm-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <h1 className="font-semibold text-white text-sm">Aula Simulada — {moduleTitle}</h1>
            <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>NeuroMentor está ensinando em tempo real</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/exercicios/${lessonId}?module=${encodeURIComponent(moduleTitle)}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--nm-purple)" }}
          >
            Praticar exercícios <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--nm-purple-light)" }} />
                <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>Preparando sua aula personalizada...</p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "user" ? (
                <div className="max-w-[80%] rounded-2xl px-4 py-3" style={{ background: "var(--nm-bg-elevated)", border: "1px solid var(--nm-border)" }}>
                  <p className="text-sm text-white whitespace-pre-wrap">{m.content}</p>
                </div>
              ) : (
                <div className="max-w-[85%] flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
                    <Sparkles size={14} color="white" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 flex-1" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--nm-purple-light)" }}>Mentor</p>
                    <div className="text-sm text-white whitespace-pre-wrap leading-relaxed">{m.content || "..."}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: "1px solid var(--nm-border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={streaming ? "Mentor está respondendo..." : "Faça uma pergunta ou pedido..."}
              disabled={streaming}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              className="w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-40"
              style={{ background: "var(--nm-purple)" }}
            >
              {streaming ? <Loader size={14} color="white" className="animate-spin" /> : <Send size={14} color="white" />}
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "var(--nm-text-muted)" }}>
            Conteúdo gerado pela IA com base no material enviado. Verifique informações críticas.
          </p>
        </div>
      </div>
    </div>
  );
}
