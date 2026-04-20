import type { Metadata } from "next";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "NeuroMentor — Framework MentorIA",
  description: "Transforme materiais didáticos em mentores virtuais especialistas com IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
