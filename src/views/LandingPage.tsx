"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, BarChart2, Trophy, MessageSquare, Upload, CheckCircle, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

export function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const dashboardHref = user?.role === "teacher" ? "/lesson-builder/upload" : "/dashboard";

  return (
    <div className="min-h-screen neuromentor" style={{ background: "var(--nm-bg-base)", color: "var(--nm-text)" }}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: "var(--nm-border)", background: "rgba(13,17,23,0.85)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="font-bold text-white text-base">NeuroMentor</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Como funciona", "Funcionalidades", "Para quem é"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="text-sm transition-colors hover:text-white" style={{ color: "var(--nm-text-muted)" }}>
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm hidden sm:block" style={{ color: "var(--nm-text-muted)" }}>
                  Olá, <span className="text-white font-medium">{user.name.split(" ")[0]}</span>
                </span>
                <Link href={dashboardHref} className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90" style={{ background: "var(--nm-purple)" }}>
                  Ir para o app →
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-white" style={{ color: "var(--nm-text-muted)" }}>
                  Entrar
                </Link>
                <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90" style={{ background: "var(--nm-purple)" }}>
                  Criar conta grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ borderColor: "rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.1)", color: "var(--nm-purple-light)" }}>
          <Zap size={12} /> Plataforma de aprendizado com Inteligência Artificial
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
          Transforme qualquer material<br />
          em um{" "}
          <span style={{ background: "linear-gradient(90deg,#a855f7,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            mentor personalizado
          </span>
        </h1>

        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--nm-text-muted)" }}>
          Professores enviam seus materiais, a IA estrutura aulas e exercícios. Alunos aprendem com um mentor virtual que se adapta ao seu ritmo e nível.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup" className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-sm transition-opacity hover:opacity-90" style={{ background: "var(--nm-purple)" }}>
            Começar grátis <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm border transition-all hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.15)", color: "var(--nm-text)" }}>
            Já tenho conta
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { value: "10k+", label: "Alunos ativos" },
            { value: "500+", label: "Professores cadastrados" },
            { value: "98%", label: "Taxa de satisfação" },
            { value: "3×", label: "Mais retenção de conteúdo" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "var(--nm-text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-24" style={{ background: "var(--nm-bg-surface)", borderTop: "1px solid var(--nm-border)", borderBottom: "1px solid var(--nm-border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "var(--nm-purple-light)" }}>COMO FUNCIONA</p>
            <h2 className="text-4xl font-bold text-white">Simples para professores.<br />Poderoso para alunos.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Professor */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--nm-purple)" }}>P</div>
                <h3 className="font-semibold text-white text-lg">Para professores</h3>
              </div>
              <div className="space-y-6">
                {[
                  { icon: <Upload size={18} />, title: "1. Suba seu material", desc: "PDF, DOCX ou TXT. Qualquer apostila, livro ou slides que você já usa." },
                  { icon: <Zap size={18} />, title: "2. IA estrutura a aula", desc: "O NeuroMentor extrai módulos, conceitos e cria exercícios automaticamente com base na Taxonomia de Bloom." },
                  { icon: <CheckCircle size={18} />, title: "3. Revise e publique", desc: "Aprove ou edite os módulos gerados. Seus alunos já podem acessar em segundos." },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", color: "var(--nm-purple-light)" }}>
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">{step.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--nm-text-muted)" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aluno */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}>A</div>
                <h3 className="font-semibold text-white text-lg">Para alunos</h3>
              </div>
              <div className="space-y-6">
                {[
                  { icon: <BookOpen size={18} />, title: "1. Acesse a aula simulada", desc: "O mentor explica o conteúdo em etapas, com analogias e exemplos do mundo real." },
                  { icon: <Target size={18} />, title: "2. Pratique com exercícios", desc: "Questões abertas e múltipla escolha com feedback construtivo imediato." },
                  { icon: <MessageSquare size={18} />, title: "3. Tire dúvidas em tempo real", desc: "Chat com IA que entende o contexto do material e orienta sem dar respostas prontas." },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}>
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">{step.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--nm-text-muted)" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "var(--nm-purple-light)" }}>FUNCIONALIDADES</p>
          <h2 className="text-4xl font-bold text-white">Tudo que você precisa<br />para aprender de verdade</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap size={22} />, color: "#7c3aed", title: "Aula Simulada por IA", desc: "Conteúdo estruturado em etapas progressivas com objetivo, conceitos-chave, exemplos práticos e pergunta socrática." },
            { icon: <Target size={22} />, color: "#3b82f6", title: "Exercícios Adaptativos", desc: "3 níveis de Bloom por sessão: entender, aplicar e analisar. Correção e feedback personalizado em tempo real." },
            { icon: <MessageSquare size={22} />, color: "#ec4899", title: "Chat Inteligente", desc: "Faça perguntas, envie fotos e arquivos. O mentor responde com base no seu material e gera atividades sob demanda." },
            { icon: <BarChart2 size={22} />, color: "#22c55e", title: "Analytics Detalhado", desc: "Acompanhe acurácia, XP acumulado, streak diário e desempenho por módulo. Saiba exatamente onde evoluir." },
            { icon: <Trophy size={22} />, color: "#f59e0b", title: "Sistema de Conquistas", desc: "Desbloqueie medalhas ao atingir metas de estudo. Motivação contínua através de gamificação pedagógica." },
            { icon: <BookOpen size={22} />, color: "#a855f7", title: "Revisão Guiada", desc: "Após errar exercícios, receba uma revisão focada nas lacunas com novas analogias e exemplos direcionados." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl" style={{ background: "var(--nm-bg-surface)", border: "1px solid var(--nm-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}18` }}>
                <span style={{ color: f.color }}>{f.icon}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--nm-text-muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section id="para-quem-é" className="py-24" style={{ background: "var(--nm-bg-surface)", borderTop: "1px solid var(--nm-border)", borderBottom: "1px solid var(--nm-border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "var(--nm-purple-light)" }}>PARA QUEM É</p>
            <h2 className="text-4xl font-bold text-white">Feito para quem ensina<br />e para quem aprende</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl" style={{ background: "var(--nm-bg-base)", border: "1px solid rgba(124,58,237,0.3)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(124,58,237,0.15)" }}>
                <Upload size={22} style={{ color: "var(--nm-purple-light)" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Professores e educadores</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--nm-text-muted)" }}>
                Multiplique seu impacto. Carregue suas apostilas e deixe a IA criar uma experiência de aprendizado completa para cada aluno — sem horas extras de preparação.
              </p>
              <ul className="space-y-2">
                {["Upload de PDF, DOCX e TXT", "Geração automática de módulos", "Revisão e aprovação de conteúdo", "Chat com material para alunos", "Prévia da aula antes de publicar"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--nm-text-muted)" }}>
                    <CheckCircle size={14} style={{ color: "var(--nm-purple-light)", flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--nm-purple-light)" }}>
                Criar conta de professor <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p-8 rounded-2xl" style={{ background: "var(--nm-bg-base)", border: "1px solid rgba(249,115,22,0.3)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(249,115,22,0.12)" }}>
                <BookOpen size={22} style={{ color: "#f97316" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Alunos e estudantes</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--nm-text-muted)" }}>
                Aprenda no seu ritmo com um mentor que nunca cansa, explica de novo quantas vezes precisar e sabe exatamente onde você está travando.
              </p>
              <ul className="space-y-2">
                {["Aulas explicadas passo a passo", "Exercícios com correção instantânea", "Chat com IA para tirar dúvidas", "Envio de fotos e arquivos próprios", "Conquistas e progresso gamificado"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--nm-text-muted)" }}>
                    <CheckCircle size={14} style={{ color: "#f97316", flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#f97316" }}>
                Criar conta de aluno <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 text-center max-w-3xl mx-auto px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Pronto para transformar<br />sua forma de aprender?</h2>
        <p className="text-lg mb-10" style={{ color: "var(--nm-text-muted)" }}>
          Crie sua conta grátis agora e experimente o poder de ter um mentor de IA.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-base transition-opacity hover:opacity-90" style={{ background: "var(--nm-purple)" }}>
            Criar conta grátis <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-full font-medium text-base border transition-all hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.15)", color: "var(--nm-text)" }}>
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10" style={{ borderColor: "var(--nm-border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--nm-purple)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-white">NeuroMentor</span>
          </div>
          <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>
            © {new Date().getFullYear()} NeuroMentor. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            {["Termos de uso", "Privacidade", "Contato"].map((item) => (
              <a key={item} href="#" className="text-xs transition-colors hover:text-white" style={{ color: "var(--nm-text-muted)" }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
