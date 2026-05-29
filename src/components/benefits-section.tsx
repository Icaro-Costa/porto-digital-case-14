import { motion } from "motion/react";
import {
  CheckCircle2,
  Smartphone,
  Gauge,
  Lock,
  Palette,
  BarChart,
} from "lucide-react";

const benefits = [
  {
    icon: Palette,
    title: "Totalmente Personalizado",
    description: "Desenvolvido para refletir perfeitamente a identidade da sua marca",
  },
  {
    icon: Smartphone,
    title: "Otimizado para Mobile",
    description: "Experiência impecável em qualquer dispositivo ou tamanho de tela",
  },
  {
    icon: Gauge,
    title: "Extremamente Rápido",
    description: "Otimizado para velocidade, mantendo os visitantes engajados",
  },
  {
    icon: BarChart,
    title: "Feito para Converter",
    description: "Cada elemento projetado para transformar visitantes em clientes",
  },
  {
    icon: Lock,
    title: "Seguro e Confiável",
    description: "Segurança padrão do setor e boas práticas de desenvolvimento",
  },
  {
    icon: CheckCircle2,
    title: "Otimizado para SEO",
    description: "Pensado para mecanismos de busca desde o primeiro dia",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl !font-bold text-foreground mb-4">
            Por que Escolher um Site Personalizado?
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Todas as vantagens de uma presença digital profissional sem o
            preço de grandes agências.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0066FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-[#0066FF]" />
                </div>
                <div>
                  <h3 className="!text-lg !font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-foreground/70">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
