import { AulaSimulada } from "@/views/aula/AulaSimulada";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ module?: string }>;
}) {
  const { lessonId } = await params;
  const { module: moduleTitle } = await searchParams;
  return <AulaSimulada lessonId={lessonId} moduleTitle={moduleTitle} />;
}
