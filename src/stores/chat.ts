import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  quoted?: string;
  createdAt: number;
}

interface ChatState {
  messages: ChatMessage[];
  streaming: boolean;
  addMessage: (msg: Omit<ChatMessage, "id" | "createdAt">) => string;
  appendToMessage: (id: string, chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streaming: false,
  addMessage: (msg) => {
    const id = crypto.randomUUID();
    set((s) => ({ messages: [...s.messages, { ...msg, id, createdAt: Date.now() }] }));
    return id;
  },
  appendToMessage: (id, chunk) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, content: m.content + chunk } : m)),
    })),
  setStreaming: (streaming) => set({ streaming }),
  reset: () => set({ messages: [], streaming: false }),
}));
