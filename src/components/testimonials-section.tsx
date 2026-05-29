import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fundadora, StyleHub",
    content:
      "Nosso novo site aumentou as conversões em 300% no primeiro mês. A atenção aos detalhes e a compreensão do nosso negócio foram excepcionais.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CEO, TechStart",
    content:
      "Rápido, profissional e exatamente o que precisávamos. O site ficou incrível e performa ainda melhor. Recomendo muito!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Proprietária, Local Bakery",
    content:
      "Passei de zero presença online para um site lindo que traz clientes todos os dias. Melhor investimento que já fiz para o meu negócio.",
    rating: 5,
  },
];

export function TestimonialsSection() {
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
            Aprovado por Negócios em Crescimento
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Não precisa acreditar só na minha palavra. Veja o que os clientes
            dizem sobre seus novos sites.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 relative"
            >
              <Quote className="w-10 h-10 text-[#0066FF]/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#0066FF] text-[#0066FF]"
                  />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-foreground/60">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
