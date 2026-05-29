import { motion } from "motion/react";
import { MessageSquare, Pencil, Code, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Conversa Inicial",
    description:
      "Discutimos os objetivos do seu negócio, seu público-alvo e como o sucesso se parece para você.",
  },
  {
    number: "02",
    icon: Pencil,
    title: "Design & Planejamento",
    description:
      "Crio um design e estrutura personalizados para sua marca e metas de conversão.",
  },
  {
    number: "03",
    icon: Code,
    title: "Desenvolvimento",
    description:
      "Seu site é construído com código limpo, performance otimizada e atenção aos detalhes.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Lançamento & Suporte",
    description:
      "Seu site vai ao ar e ofereço suporte contínuo para garantir que tudo funcione perfeitamente.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#0066FF]/10 rounded-full mb-4">
            <span className="text-sm text-[#0066FF] font-medium">
              Como Funciona
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl !font-bold text-foreground mb-4">
            Processo Simples, Resultados Poderosos
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Da consulta inicial ao lançamento, torno todo o processo
            tranquilo e sem estresse.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8 h-full hover:border-[#0066FF] transition-colors">
                <div className="text-6xl font-bold text-[#0066FF]/10 mb-4">
                  {step.number}
                </div>
                <div className="w-14 h-14 bg-[#0066FF]/10 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-[#0066FF]" />
                </div>
                <h3 className="!text-xl !font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
