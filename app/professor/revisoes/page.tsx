"use client";
import { LessonBuilderLayout } from "@/views/lesson-builder/LessonBuilderLayout";
import { RevisaoChat } from "@/views/professor/RevisaoChat";
export default function Page() {
  return (
    <LessonBuilderLayout>
      <RevisaoChat />
    </LessonBuilderLayout>
  );
}
