import { motion } from "motion/react";
import { Clock, TrendingUp, Users } from "lucide-react";

export function UrgencySection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#0066FF]/10 via-[#0066FF]/5 to-transparent border border-[#0066FF]/20 rounded-2xl p-8 sm:p-12"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 border border-[#0066FF]/20 rounded-full mb-6">
              <Clock className="w-4 h-4 text-[#0066FF]" />
              <span className="text-sm text-[#0066FF] font-medium">
                Vagas Limitadas
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl !font-bold text-foreground mb-6">
              Apenas 3 Vagas Disponíveis Este Mês
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Para manter a qualidade e dar a atenção que cada projeto merece,
              aceito apenas um número limitado de clientes por mês.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <Clock className="w-8 h-8 text-[#0066FF] mb-3 mx-auto" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  1 semana
                </div>
                <div className="text-sm text-foreground/70">
                  Tempo Médio de Resposta
                </div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <Users className="w-8 h-8 text-[#0066FF] mb-3 mx-auto" />
                <div className="text-2xl font-bold text-foreground mb-1">3</div>
                <div className="text-sm text-foreground/70">
                  Vagas Restantes Este Mês
                </div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-[#0066FF] mb-3 mx-auto" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  100%
                </div>
                <div className="text-sm text-foreground/70">
                  Satisfação dos Clientes
                </div>
              </div>
            </div>

            <p className="text-foreground/60 text-sm">
              Próxima vaga disponível a partir de 28 de abril de 2026
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
