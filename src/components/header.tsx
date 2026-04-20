import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onGetStarted: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl tracking-tight">
              <span className="font-semibold text-foreground">Icarus</span>
              <span className="text-[#0066FF]">-Dev</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Portfólio
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Processo
            </button>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Alternar tema"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg transition-all duration-200 active:scale-95"
            >
              Começar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
