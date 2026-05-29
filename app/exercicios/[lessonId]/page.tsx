import { Exercicios } from "@/views/exercicios/Exercicios";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ module?: string }>;
}) {
  const { lessonId } = await params;
  const { module: moduleTitle } = await searchParams;
  return <Exercicios lessonId={lessonId} moduleTitle={moduleTitle ?? "Módulo"} />;
}
