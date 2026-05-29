import { Revisao } from "@/views/revisao/Revisao";

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <Revisao lessonId={lessonId} />;
}
