import { motion } from "motion/react";
import { XCircle } from "lucide-react";

const problems = [
  {
    title: "Sem Presença Online",
    description:
      "Seus concorrentes estão na internet. Seus clientes em potencial não conseguem te encontrar.",
  },
  {
    title: "Site Desatualizado",
    description:
      "Um site antigo e lento prejudica sua credibilidade e afasta visitantes.",
  },
  {
    title: "Poucas Conversões",
    description:
      "Seu site recebe visitas mas não converte visitantes em clientes.",
  },
  {
    title: "Fora do Mobile",
    description:
      "Mais de 60% do tráfego é mobile. O seu site está preparado para isso?",
  },
];

export function ProblemSection() {
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
            Seu Negócio Está Perdendo Dinheiro Todo Dia?
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Sem um site moderno e de alta performance, você está deixando
            dinheiro na mesa.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-destructive/50 transition-colors"
            >
              <XCircle className="w-10 h-10 text-destructive mb-4" />
              <h3 className="!text-lg !font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-foreground/70">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
