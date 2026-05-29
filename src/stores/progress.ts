import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

export interface ExerciseAttempt {
  id: string;
  lessonId: string;
  moduleId: string;
  question: string;
  answer: string;
  correct: boolean;
  feedback: string;
  createdAt: number;
}

interface ProgressState {
  xp: number;
  level: number;
  streak: number;
  attempts: ExerciseAttempt[];
  addAttempt: (attempt: Omit<ExerciseAttempt, "id" | "createdAt">) => void;
  addXP: (amount: number) => void;
  syncFromServer: () => Promise<void>;
  wrongAnswers: (lessonId: string) => ExerciseAttempt[];
}

const XP_PER_LEVEL = 500;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      attempts: [],
      addAttempt: (attempt) =>
        set((s) => {
          const full: ExerciseAttempt = { ...attempt, id: crypto.randomUUID(), createdAt: Date.now() };
          const newXP = s.xp + (attempt.correct ? 50 : 10);
          const allAttempts = [...s.attempts, full];
          const today = new Date(); today.setHours(0, 0, 0, 0);
          const daySet = new Set(allAttempts.map((a) => {
            const d = new Date(a.createdAt); d.setHours(0, 0, 0, 0);
            return d.getTime();
          }));
          let streak = 0;
          const cursor = new Date(today);
          while (daySet.has(cursor.getTime())) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
          }
          return {
            attempts: allAttempts,
            xp: newXP,
            level: Math.floor(newXP / XP_PER_LEVEL) + 1,
            streak,
          };
        }),
      addXP: (amount) =>
        set((s) => {
          const newXP = s.xp + amount;
          return { xp: newXP, level: Math.floor(newXP / XP_PER_LEVEL) + 1 };
        }),
      syncFromServer: async () => {
        try {
          const data = await api.getAttempts(50);
          const attempts: ExerciseAttempt[] = data.map((a) => ({
            id: a.id,
            lessonId: a.lessonId,
            moduleId: a.moduleId,
            question: a.question,
            answer: a.answer,
            correct: a.isCorrect,
            feedback: a.feedback,
            createdAt: new Date(a.createdAt).getTime(),
          }));
          const totalXP = data.reduce((sum, a) => sum + a.xpGained, 0);

          // Calculate streak: consecutive days with at least one attempt, ending today
          const today = new Date(); today.setHours(0, 0, 0, 0);
          const daySet = new Set(attempts.map((a) => {
            const d = new Date(a.createdAt); d.setHours(0, 0, 0, 0);
            return d.getTime();
          }));
          let streak = 0;
          const cursor = new Date(today);
          while (daySet.has(cursor.getTime())) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
          }

          set({ attempts, xp: totalXP, level: Math.floor(totalXP / XP_PER_LEVEL) + 1, streak });
        } catch {}
      },
      wrongAnswers: (lessonId) => get().attempts.filter((a) => a.lessonId === lessonId && !a.correct),
    }),
    { name: "neuromentor-progress" }
  )
);
