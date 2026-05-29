import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  onGetStarted: () => void;
  onViewProjects: () => void;
}

export function Hero({ onGetStarted, onViewProjects }: HeroProps) {
  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 rounded-full mb-6">
              <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
              <span className="text-sm text-[#0066FF]">
                Disponível para Novos Projetos
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl !font-bold !leading-tight text-foreground mb-6">
              Transforme Seu Negócio com um Site{" "}
              <span className="text-[#0066FF]">que Converte</span>
            </h1>

            <p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-xl">
              Sites desenvolvidos sob medida que não só têm boa aparência — geram
              resultados reais. Aumente suas vendas, credibilidade e presença
              online com um site criado para converter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                Quero Meu Site Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onViewProjects}
                className="px-8 py-4 border-2 border-border hover:border-[#0066FF] text-foreground rounded-lg transition-all duration-200 active:scale-95"
              >
                Ver Projetos
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-foreground/60">Projetos Entregues</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-foreground/60">Em até uma semana de entrega</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-foreground/60">Satisfação dos Clientes</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1630522790545-67ad2cb700fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWJzaXRlJTIwbW9ja3VwJTIwbGFwdG9wfGVufDF8fHx8MTc3NjA1NzI5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mockup de site moderno"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0066FF]/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0066FF]/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
