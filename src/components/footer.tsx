import { Mail, Linkedin, Github } from "lucide-react";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="text-2xl tracking-tight mb-4">
              <span className="font-semibold text-foreground">Icarus</span>
              <span className="text-[#0066FF]">-Dev</span>
            </div>
            <p className="text-foreground/70 max-w-md mb-4">
              Criando sites de alta conversão que ajudam negócios a expandir
              sua presença online e aumentar a receita.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/icaro-costa-ic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted hover:bg-[#0066FF] hover:text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Icaro-Costa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted hover:bg-[#0066FF] hover:text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:icaro.costa@icarus-dev.com.br"
                className="w-10 h-10 bg-muted hover:bg-[#0066FF] hover:text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-foreground/70 hover:text-[#0066FF] transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("portfolio")}
                  className="text-foreground/70 hover:text-[#0066FF] transition-colors"
                >
                  Portfólio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("process")}
                  className="text-foreground/70 hover:text-[#0066FF] transition-colors"
                >
                  Processo
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:icaro.costa@icarus-dev.com.br"
                  className="text-foreground/70 hover:text-[#0066FF] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  icaro.costa@icarus-dev.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-foreground/60 text-sm">
          <p>
            © {new Date().getFullYear()} Icarus-Dev. Todos os direitos reservados. Desenvolvido com
            precisão e cuidado.
          </p>
        </div>
      </div>
    </footer>
  );
}
