import { motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";

const features = [
  "Design personalizado para a sua marca",
  "Responsivo em todos os dispositivos",
  "Carregamento rápido para melhor experiência do usuário",
  "Otimização SEO para maior visibilidade",
  "Formulários de contato e captação de leads",
  "Integração com redes sociais",
  "Configuração do Google Analytics",
  "30 dias de suporte pós-lançamento",
  "Treinamento para atualizar o conteúdo",
  "Revisões ilimitadas até você ficar satisfeito",
];

interface OfferSectionProps {
  onGetStarted: () => void;
}

export function OfferSection({ onGetStarted }: OfferSectionProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl !font-bold text-foreground mb-4">
            Tudo que Você Precisa para Ter Sucesso Online
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Uma solução completa de site projetada para crescer o seu negócio,
            não apenas para ter boa aparência.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border-2 border-[#0066FF] rounded-2xl p-8 sm:p-12"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0066FF]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#0066FF]" />
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-2xl sm:text-3xl !font-bold text-foreground mb-3">
                  Vamos Criar o Seu Site
                </div>
                <div className="text-lg text-foreground/70 max-w-xl mx-auto mb-2">
                  Cada projeto é único. Receba um orçamento personalizado em minutos.
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/60 mt-4">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#0066FF]" />
                    Sem taxas ocultas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#0066FF]" />
                    Resposta rápida via WhatsApp
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#0066FF]" />
                    Solução personalizada para o seu negócio
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={onGetStarted}
                  className="group w-full sm:w-auto px-10 py-5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 text-lg !font-semibold shadow-lg shadow-[#0066FF]/25"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Solicite seu Orçamento no WhatsApp
                </button>
                <p className="text-sm text-foreground/60">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Vagas limitadas esta semana • Resposta em minutos
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}