import { motion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl !font-bold text-white mb-6">
            Pronto para Transformar sua Presença Online?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Pare de perder clientes para a concorrência. Tenha um site que
            trabalha tão duro quanto você para crescer o seu negócio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group px-10 py-4 bg-white text-[#0066FF] rounded-lg transition-all duration-200 active:scale-95 hover:shadow-2xl flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Comece Seu Projeto Hoje
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Consulta gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Orçamento sem compromisso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Resposta rápida</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
