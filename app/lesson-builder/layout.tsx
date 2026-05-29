import { LessonBuilderLayout } from "@/views/lesson-builder/LessonBuilderLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LessonBuilderLayout>{children}</LessonBuilderLayout>;
}
