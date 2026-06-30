import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

{/*

import { Moon, Sun,  } from 'lucide-react';

*/}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  {/*

  // Estado para controlar o Dark Mode
  const [isDark, setIsDark] = useState(false);

  */}

  // Efeito para o Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  {/*

  // Efeito para carregar o tema guardado e aplicar a classe 'dark' no HTML
  useEffect(() => {
    const savedTheme = localStorage.getItem('ja-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);




  
  // Função para alternar o tema
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ja-theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ja-theme', 'dark');
      setIsDark(true);
    }
  };

*/}

  // Adaptação das cores do link para suportar o modo escuro (dark:text-gray-300)
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-semibold transition-all duration-300 pb-1 ${
      isActive 
        ? 'text-ja-blue border-b-2 border-ja-blue' 
        : 'text-gray-600 dark:text-gray-300 hover:text-ja-blue dark:hover:text-ja-blue border-b-2 border-transparent'
    }`;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out flex justify-center ${
        isScrolled ? 'pt-4' : 'pt-0'
      }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'w-11/12 max-w-6xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg rounded-full py-3 px-8 border border-gray-200 dark:border-gray-800'
            : 'w-full bg-white dark:bg-[#0a0a0a] py-5 px-6 md:px-12 lg:px-16 border-b border-gray-100 dark:border-gray-900'
        }`}
      >
        
        {/* 1. Zona Esquerda (Logótipo) */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="JA Automóveis Logo" 
              // Adicionamos dark:invert para que a logo preta fique branca no modo escuro (opcional)
              className="h-8 md:h-10 object-contain dark:invert transition-all duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            
            <span className="text-xl font-bold text-ja-dark dark:text-white transition-colors duration-500 tracking-tight">
              JA <span className="text-ja-blue">Automóveis</span>
            </span>
          </Link>
        </div>

        {/* 2. Zona Central (Links) */}
        <nav className="hidden md:flex flex-shrink-0 items-center gap-8 lg:gap-12">
          <NavLink to="/" className={navLinkClasses}>Home</NavLink>
          <NavLink to="/stand" className={navLinkClasses}>Stand</NavLink>
          <NavLink to="/importacao" className={navLinkClasses}>Importação</NavLink>
          <NavLink to="/sobre" className={navLinkClasses}>Sobre Nós</NavLink>
          <NavLink to="/contactos" className={navLinkClasses}>Contactos</NavLink>
        </nav>

        {/* 3. Zona Direita (Ações) */}
        <div className="flex-1 flex justify-end items-center gap-4">
          
          {/* Botão de Dark Mode Animado 
          <button 
            onClick={toggleTheme}
            className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-ja-blue rounded-full transition-colors overflow-hidden flex items-center justify-center w-10 h-10"
            aria-label="Alternar Tema"
          >
            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? 'translate-y-8 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0'}`}>
              <Moon size={20} />
            </div>
            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 -rotate-90'}`}>
              <Sun size={20} />
            </div>
          </button>
            */}

        </div>

      </div>
    </header>
  );
}