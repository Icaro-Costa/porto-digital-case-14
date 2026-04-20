import { create } from "zustand";
import { api, ClassDto } from "@/lib/api";

export interface ClassLesson {
  id: string;
  title: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  lessons: ClassLesson[];
  students: ClassStudent[];
  createdAt: string;
}

function mapDto(dto: ClassDto): ClassRoom {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    teacherName: dto.teacherName,
    createdAt: dto.createdAt,
    lessons: dto.lessons.map((l) => ({ id: l.id, title: l.title })),
    students: dto.students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      joinedAt: s.joinedAt,
    })),
  };
}

interface ClassState {
  classes: ClassRoom[];
  // Teacher actions
  loadTeacherClasses: () => Promise<void>;
  createClass: (name: string) => Promise<{ ok: boolean; error?: string; classRoom?: ClassRoom }>;
  addLesson: (classId: string, lesson: ClassLesson) => Promise<void>;
  removeLesson: (classId: string, lessonId: string) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  // Student actions
  loadStudentClasses: () => Promise<void>;
  joinClass: (code: string) => Promise<{ ok: boolean; error?: string }>;
  getTeacherClasses: (teacherId?: string) => ClassRoom[];
  getStudentClasses: (studentId?: string) => ClassRoom[];
  getLessonIdsForStudent: (studentId?: string) => string[];
}

export const useClassStore = create<ClassState>()((set, get) => ({
  classes: [],

  loadTeacherClasses: async () => {
    try {
      const dtos = await api.getTeacherClasses();
      set({ classes: dtos.map(mapDto) });
    } catch {}
  },

  loadStudentClasses: async () => {
    try {
      const dtos = await api.getStudentClasses();
      set({ classes: dtos.map(mapDto) });
    } catch {}
  },

  createClass: async (name) => {
    try {
      const dto = await api.createClass(name);
      const classRoom = mapDto(dto);
      set((s) => ({ classes: [...s.classes, classRoom] }));
      return { ok: true, classRoom };
    } catch (e: unknown) {
      return { ok: false, error: e instanceof Error ? e.message : "Erro ao criar turma." };
    }
  },

  addLesson: async (classId, lesson) => {
    try {
      await api.addLessonToClass(classId, lesson.id, lesson.title);
      set((s) => ({
        classes: s.classes.map((c) =>
          c.id === classId && !c.lessons.find((l) => l.id === lesson.id)
            ? { ...c, lessons: [...c.lessons, lesson] }
            : c
        ),
      }));
    } catch {}
  },

  removeLesson: async (classId, lessonId) => {
    try {
      await api.removeLessonFromClass(classId, lessonId);
      set((s) => ({
        classes: s.classes.map((c) =>
          c.id === classId ? { ...c, lessons: c.lessons.filter((l) => l.id !== lessonId) } : c
        ),
      }));
    } catch {}
  },

  deleteClass: async (classId) => {
    try {
      await api.deleteClass(classId);
      set((s) => ({ classes: s.classes.filter((c) => c.id !== classId) }));
    } catch {}
  },

  joinClass: async (code) => {
    try {
      const dto = await api.joinClass(code.trim().toUpperCase());
      const classRoom = mapDto(dto);
      set((s) => {
        const exists = s.classes.find((c) => c.id === classRoom.id);
        return { classes: exists ? s.classes : [...s.classes, classRoom] };
      });
      return { ok: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Turma não encontrada.";
      return { ok: false, error: msg };
    }
  },

  // These work from cached classes in state (loaded by loadTeacherClasses / loadStudentClasses)
  getTeacherClasses: (_teacherId?: string) => get().classes,

  getStudentClasses: (_studentId?: string) => get().classes,

  getLessonIdsForStudent: (_studentId?: string) => [
    ...new Set(get().classes.flatMap((c) => c.lessons.map((l) => l.id))),
  ],
}));
