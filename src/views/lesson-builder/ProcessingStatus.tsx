"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader, Flag, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useLessonStore } from "@/stores/lesson";

type Phase = "analyzing" | "structuring" | "ready" | "error";

export function ProcessingStatus() {
  const router = useRouter();
  const currentLesson = useLessonStore((s) => s.currentLesson);
  const upsertLesson = useLessonStore((s) => s.upsertLesson);
  const [phase, setPhase] = useState<Phase>("analyzing");
  const [logs, setLogs] = useState<Array<{ time: string; level: string; msg: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  function log(level: string, msg: string) {
    const time = new Date().toTimeString().slice(0, 8);
    setLogs((prev) => [...prev, { time, level, msg }]);
  }

  useEffect(() => {
    if (!currentLesson) {
      setError("Nenhum material carregado. Volte para o upload.");
      setPhase("error");
      return;
    }
    if (currentLesson.modules.length > 0) {
      setPhase("ready");
      log("INFO", `Aula "${currentLesson.title}" já processada (${currentLesson.modules.length} módulos).`);
      return;
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run() {
    try {
      log("INFO", `Iniciando análise de "${currentLesson!.title}"`);
      log("SUCCESS", `${currentLesson!.rawText.length.toLocaleString()} caracteres extraídos`);
      setPhase("structuring");
      log("INFO", "Gerando módulos pedagógicos com IA...");

      const { modules } = await api.generateModules({
        lessonId: currentLesson!.id,
        text: currentLesson!.rawText,
        title: currentLesson!.title,
      });

      log("SUCCESS", `${modules.length} módulos gerados`);
      upsertLesson({
        ...currentLesson!,
        modules: modules.map((m) => ({ ...m, status: "pending" as const })),
      });
      setPhase("ready");
      log("SUCCESS", "Pronto para revisão");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha no processamento";
      setError(msg);
      setPhase("error");
      log("ERROR", msg);
    }
  }

  const progress = phase === "analyzing" ? 25 : phase === "structuring" ? 65 : phase === "ready" ? 100 : 0;

  const steps = [
    { key: "analyzing", label: "Analisando", sub: "Extraindo texto e conceitos" },
    { key: "structuring", label: "Estruturando", sub: "Gerando módulos via IA" },
    { key: "ready", label: "Pronto", sub: "Validação final" },
  ];

  const logColor: Record<string, string> = {
    INFO: "var(--nm-text-muted)",
    SUCCESS: "#22c55e",
    WARN: "#eab308",
    ERROR: "#ef4444",
  };

  return (
    <div className="p-8 neuromentor">
      <h1 className="text-2xl font-bold text-white mb-1">Pipeline de Processamento</h1>
      <p className="text-sm mb-8" style={{ color: "var(--nm-text-muted)" }}>
        Transformando seu material em módulos estruturados de aula.
      </p>

      {error && (
        <div
          className="mb-6 p-4 rounded-xl flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
        >
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-400 text-sm">Erro</p>
            <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
              {error}
            </p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLogs([]);
              run();
            }}
            className="px-3 py-1 rounded-lg text-xs font-medium text-white"
            style={{ background: "var(--nm-purple)" }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div
        className="p-6 rounded-2xl mb-8"
        style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Progresso</h3>
          <span className="text-xl font-bold" style={{ color: "var(--nm-purple-light)" }}>
            {progress}%
          </span>
        </div>

        <div className="relative flex items-center">
          <div
            className="absolute left-0 right-0 top-5 h-0.5 z-0"
            style={{ background: "var(--nm-bg-elevated)" }}
          />
          <div
            className="absolute left-0 top-5 h-0.5 z-0"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #3b82f6)" }}
          />
          <div className="relative z-10 flex items-center justify-between w-full">
            {steps.map((step, i) => {
              const currentIdx = ["analyzing", "structuring", "ready"].indexOf(phase);
              const stepIdx = ["analyzing", "structuring", "ready"].indexOf(step.key);
              const done = stepIdx < currentIdx || phase === "ready";
              const active = stepIdx === currentIdx && phase !== "ready" && phase !== "error";
              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center"
                  style={{ flex: 1, alignItems: i === 0 ? "flex-start" : i === 2 ? "flex-end" : "center" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{
                      background: done ? "var(--nm-purple)" : active ? "var(--nm-bg-surface)" : "var(--nm-bg-elevated)",
                      border: active ? "2px solid var(--nm-purple)" : done ? "none" : "2px solid var(--nm-border)",
                    }}
                  >
                    {done ? (
                      <CheckCircle size={18} color="white" />
                    ) : active ? (
                      <Loader size={18} style={{ color: "var(--nm-purple-light)" }} className="animate-spin" />
                    ) : (
                      <Flag size={16} style={{ color: "var(--nm-text-muted)" }} />
                    )}
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: active || done ? "white" : "var(--nm-text-muted)" }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: active ? "var(--nm-purple-light)" : "var(--nm-text-muted)" }}
                  >
                    {step.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span style={{ color: "var(--nm-text-muted)" }}>&gt;_</span> Log do Mentor
          </h3>
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--nm-text-muted)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
          </span>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid var(--nm-border)" }}>
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--nm-border)" }}>
            {["#ef4444", "#eab308", "#22c55e"].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
            <span className="ml-2 text-xs" style={{ color: "var(--nm-text-muted)" }}>
              pipeline.log
            </span>
          </div>
          <div className="p-4 space-y-2 font-mono text-xs" style={{ maxHeight: 280, overflowY: "auto" }}>
            {logs.length === 0 && (
              <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
                Aguardando...
              </p>
            )}
            {logs.map((entry, i) => (
              <div key={i} className="flex gap-2">
                <span style={{ color: "var(--nm-text-muted)", flexShrink: 0 }}>[{entry.time}]</span>
                <span style={{ color: logColor[entry.level] || "var(--nm-text-muted)", flexShrink: 0 }}>
                  {entry.level}
                </span>
                <span style={{ color: "var(--nm-text)" }}>{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push("/lesson-builder/upload")}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border"
          style={{ borderColor: "var(--nm-border)", color: "var(--nm-text)" }}
        >
          ← Voltar para upload
        </button>
        <button
          onClick={() => router.push("/lesson-builder/review")}
          disabled={phase !== "ready"}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--nm-purple)" }}
        >
          Continuar para Revisão →
        </button>
      </div>
    </div>
  );
}
