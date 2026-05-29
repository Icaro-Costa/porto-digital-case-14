import { motion } from "motion/react";
import { Zap, Target, TrendingUp } from "lucide-react";

const solutions = [
  {
    icon: Zap,
    title: "Sites Desenvolvidos sob Medida",
    description:
      "Cada site é construído do zero, adaptado à sua marca, setor e objetivos. Sem templates. Sem atalhos.",
  },
  {
    icon: Target,
    title: "Entrega Rápida",
    description:
      "Seu site no ar em dias, não em meses. Trabalho com eficiência sem abrir mão da qualidade.",
  },
  {
    icon: TrendingUp,
    title: "Otimizado para Resultados",
    description:
      "Cada elemento é pensado para converter. Carregamento rápido, otimizado para mobile e criado para transformar visitantes em clientes.",
  },
];

export function SolutionSection() {
  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
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
              A Solução
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl !font-bold text-foreground mb-4">
            Sites Profissionais que Impulsionam o Crescimento
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Crio sites desenvolvidos especificamente para o seu negócio,
            projetados para atrair clientes e gerar receita.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 hover:border-[#0066FF] transition-all hover:shadow-lg"
            >
              <div className="w-14 h-14 bg-[#0066FF]/10 rounded-xl flex items-center justify-center mb-6">
                <solution.icon className="w-7 h-7 text-[#0066FF]" />
              </div>
              <h3 className="!text-xl !font-semibold text-foreground mb-3">
                {solution.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
