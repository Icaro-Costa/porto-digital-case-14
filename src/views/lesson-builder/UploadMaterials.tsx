"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, X, Trash2, RotateCcw, ShieldCheck, FolderOpen, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useLessonStore } from "@/stores/lesson";

type FileStatus = "uploading" | "complete" | "error";

interface QueuedFile {
  id: string;
  file: File;
  name: string;
  ext: string;
  size: string;
  progress: number;
  status: FileStatus;
  errorMsg?: string;
  color: string;
  lessonId?: string;
}

const EXT_COLORS: Record<string, string> = {
  PDF: "#ef4444",
  DOCX: "#3b82f6",
  DOC: "#3b82f6",
  PPTX: "#f97316",
  PPT: "#f97316",
  TXT: "#6b7280",
  MD: "#6b7280",
};

const progressColor: Record<FileStatus, string> = {
  uploading: "#3b82f6",
  complete: "#22c55e",
  error: "#ef4444",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadMaterials() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const upsertLesson = useLessonStore((s) => s.upsertLesson);

  async function enqueue(list: FileList | File[]) {
    const incoming = Array.from(list);
    const queued: QueuedFile[] = incoming.map((f) => {
      const ext = (f.name.split(".").pop() || "FILE").toUpperCase();
      return {
        id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        name: f.name,
        ext,
        size: formatSize(f.size),
        progress: 0,
        status: "uploading",
        color: EXT_COLORS[ext] || "#6b7280",
      };
    });
    setFiles((prev) => [...prev, ...queued]);

    for (const q of queued) {
      if (q.file.size > 50 * 1024 * 1024) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === q.id ? { ...f, status: "error", errorMsg: "Arquivo excede o limite de 50MB.", progress: 100 } : f,
          ),
        );
        continue;
      }
      try {
        setFiles((prev) => prev.map((f) => (f.id === q.id ? { ...f, progress: 40 } : f)));
        const result = await api.uploadFile(q.file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === q.id ? { ...f, status: "complete", progress: 100, lessonId: result.lessonId } : f,
          ),
        );
        upsertLesson({
          id: result.lessonId,
          title: result.title,
          sourceFileName: q.file.name,
          rawText: result.text,
          modules: [],
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === q.id
              ? {
                  ...f,
                  status: "error",
                  progress: 100,
                  errorMsg: err instanceof Error ? err.message : "Falha no upload",
                }
              : f,
          ),
        );
      }
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function retryFile(id: string) {
    const q = files.find((f) => f.id === id);
    if (!q) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    enqueue([q.file]);
  }

  const hasSuccess = files.some((f) => f.status === "complete");

  return (
    <div className="p-8 neuromentor">
      <h1 className="text-2xl font-bold text-white mb-1">Upload de Materiais</h1>
      <p className="text-sm mb-8" style={{ color: "var(--nm-text-muted)" }}>
        Arraste e solte seu PDF, DOCX ou TXT. O Mentor gera a estrutura pedagógica automaticamente.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.md,.pptx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) enqueue(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files) enqueue(e.dataTransfer.files);
        }}
        className="rounded-2xl flex flex-col items-center justify-center py-16 mb-8 transition-all"
        style={{
          border: `2px dashed ${dragging ? "var(--nm-purple)" : "rgba(124,58,237,0.4)"}`,
          background: dragging ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.05)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(124,58,237,0.2)" }}
        >
          <CloudUpload size={28} style={{ color: "var(--nm-purple-light)" }} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Arraste arquivos aqui</h3>
        <p className="text-sm text-center mb-6 max-w-sm" style={{ color: "var(--nm-text-muted)" }}>
          PDF, DOCX, TXT. Tamanho máximo 50MB por documento.
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--nm-purple)" }}
        >
          <FolderOpen size={16} /> Selecionar arquivos
        </button>
      </div>

      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Fila ({files.length})</h3>
            <button onClick={() => setFiles([])} className="text-sm" style={{ color: "var(--nm-purple-light)" }}>
              Limpar tudo
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-xl"
                style={{
                  background: "var(--nm-bg-surface)",
                  border: `1px solid ${file.status === "error" ? "rgba(239,68,68,0.3)" : "var(--nm-border)"}`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: file.color }}
                  >
                    {file.ext}
                  </div>
                  <span className="flex-1 text-sm font-medium text-white truncate">{file.name}</span>

                  {file.status === "uploading" && (
                    <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
                      {file.progress}%
                    </span>
                  )}
                  {file.status === "complete" && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle2 size={12} /> Pronto
                    </span>
                  )}
                  {file.status === "error" && (
                    <span className="flex items-center gap-1 text-xs text-red-400">⚠ Erro</span>
                  )}

                  <span className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
                    {file.size}
                  </span>

                  {file.status === "uploading" && (
                    <button onClick={() => removeFile(file.id)} style={{ color: "var(--nm-text-muted)" }}>
                      <X size={14} />
                    </button>
                  )}
                  {file.status === "complete" && (
                    <button onClick={() => removeFile(file.id)} style={{ color: "var(--nm-text-muted)" }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                  {file.status === "error" && (
                    <>
                      <button
                        onClick={() => retryFile(file.id)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ color: "var(--nm-purple-light)", background: "rgba(124,58,237,0.1)" }}
                      >
                        <RotateCcw size={12} className="inline mr-1" />
                        Tentar
                      </button>
                      <button onClick={() => removeFile(file.id)} style={{ color: "var(--nm-text-muted)" }}>
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>

                <div
                  className="ml-12 h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--nm-bg-elevated)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${file.progress}%`, background: progressColor[file.status] }}
                  />
                </div>
                {file.status === "error" && file.errorMsg && (
                  <p className="ml-12 mt-1 text-xs text-red-400">{file.errorMsg}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs" style={{ color: "var(--nm-text-muted)" }}>
          <ShieldCheck size={14} className="text-green-400" />
          Upload seguro. Arquivos não são usados para treinamento.
        </p>
        <button
          onClick={() => router.push("/lesson-builder/processing")}
          disabled={!hasSuccess}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border text-white transition-colors hover:bg-white/5 disabled:opacity-40"
          style={{ borderColor: "var(--nm-border)" }}
        >
          Continuar para Processamento →
        </button>
      </div>
    </div>
  );
}
