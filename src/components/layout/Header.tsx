import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Loader2, ChevronRight, Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Vehicle } from '../../types';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Estado para controlar o Menu Mobile (Hamburger)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      // Fechar o menu mobile ao fazer scroll
      if (window.scrollY > 20 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Fechar o dropdown de pesquisa se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      // Fechar menu mobile se clicar fora
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      setShowDropdown(true);
      
      try {
        const { data, count, error } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact' })
          .eq('em_stock', true)
          .or(`marca.ilike.%${searchQuery}%,modelo.ilike.%${searchQuery}%`)
          .limit(4);

        if (error) throw error;
        setSearchResults(data || []);
        setTotalCount(count);
      } catch (error) {
        console.error('Erro na pesquisa rápida:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/stand', { state: { searchQuery } });
    } else {
      navigate('/stand');
    }
    setShowDropdown(false);
    setIsMobileMenuOpen(false); // Fecha o menu mobile ao pesquisar
  };

  // Classes para os links no Desktop
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-semibold transition-all duration-300 pb-1 ${
      isActive 
        ? 'text-ja-blue border-b-2 border-ja-blue' 
        : 'text-gray-600 dark:text-gray-300 hover:text-ja-blue dark:hover:text-ja-blue border-b-2 border-transparent'
    }`;

  // Classes para os links no Mobile Menu
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `block px-4 py-3 text-base font-semibold transition-all duration-300 rounded-xl ${
      isActive 
        ? 'text-ja-blue bg-blue-50 dark:bg-blue-900/20' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out flex justify-center ${
        isScrolled ? 'pt-4' : 'pt-0'
      }`}
      ref={mobileMenuRef}
    >
      <div
        className={`relative flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'w-11/12 max-w-7xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg rounded-full py-3 px-4 sm:px-8 border border-gray-200 dark:border-gray-800'
            : 'w-full bg-white dark:bg-[#0a0a0a] py-4 sm:py-5 px-4 sm:px-6 md:px-12 lg:px-16 border-b border-gray-100 dark:border-gray-900'
        }`}
      >
        
        {/* 1. Zona Esquerda (Logótipo) */}
        <div className="flex justify-start z-20">
          <Link to="/" className="flex items-center gap-1 sm:gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/logo.png" 
              alt="JA Automóveis Logo" 
              className="h-7 sm:h-8 md:h-10 object-contain dark:invert transition-all duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            
            <span className="text-lg sm:text-xl font-bold text-ja-dark dark:text-white transition-colors duration-500 tracking-tight leading-none sm:leading-normal">
              JA <span className="text-ja-blue hidden sm:inline">Automóveis</span>
              <span className="text-ja-blue sm:hidden block text-sm">Automóveis</span>
            </span>
          </Link>
        </div>

        {/* 2. Zona Central (Links - Desktop) */}
        <nav className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 z-10 whitespace-nowrap">
          <NavLink to="/" className={navLinkClasses}>Início</NavLink>
          <NavLink to="/stand" className={navLinkClasses}>Stand</NavLink>
          <NavLink to="/importacao" className={navLinkClasses}>Importação</NavLink>
          <NavLink to="/sobre" className={navLinkClasses}>Sobre Nós</NavLink>
          <NavLink to="/contactos" className={navLinkClasses}>Contactos</NavLink>
        </nav>

        {/* 3. Zona Direita (Pesquisa + Telefone + Hamburger) */}
        <div className="flex justify-end items-center gap-2 sm:gap-4 lg:gap-6 z-20">
          
          {/* Barra de Pesquisa */}
          <div 
            // CORREÇÃO: Foi removida a classe 'sm:max-w-full' que estava a conflituar com os tamanhos definidos.
            className={`relative w-full transition-all duration-500 max-w-[140px] ${isScrolled ? 'sm:max-w-[240px]' : 'sm:max-w-[240px]'}`} 
            ref={dropdownRef}
          >
            <form 
              onSubmit={handleSearch}
              className="flex items-center w-full bg-gray-100 dark:bg-gray-800 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-900 shadow-sm"
            >
              <Search size={16} className="text-gray-400 min-w-max sm:w-[18px] sm:h-[18px]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Pesquisar..."
                className="w-full bg-transparent outline-none border-none text-xs sm:text-sm ml-2 text-ja-dark dark:text-white placeholder-gray-400"
                autoComplete="off"
              />
            </form>

            {showDropdown && (
              <div className="absolute top-full right-[-40px] sm:right-0 mt-4 w-[300px] sm:w-[350px] md:w-[450px] bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-4 z-50 transition-colors duration-500">
                
                {isSearching ? (
                  <div className="p-6 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <Loader2 size={20} className="animate-spin mr-3 text-ja-blue" />
                    A procurar...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Sem resultados para "{searchQuery}".
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {searchResults.map((vehicle) => (
                      <Link 
                        key={vehicle.id}
                        to={`/stand/${vehicle.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 sm:gap-4 p-3 mx-2 mt-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors duration-300 group"
                      >
                        <div className="w-12 h-8 sm:w-14 sm:h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                          <img 
                            src={vehicle.fotos[0]} 
                            alt={vehicle.modelo} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-ja-dark dark:text-white truncate group-hover:text-ja-blue transition-colors text-xs sm:text-sm">
                            {vehicle.marca} {vehicle.modelo}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 font-medium">
                            <span>{vehicle.ano}</span>
                            <span>•</span>
                            <span className="truncate">{vehicle.versao}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ja-dark dark:text-white text-xs sm:text-sm text-right">
                            {formatPrice(vehicle.preco)}
                          </span>
                          <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full text-gray-400 group-hover:bg-ja-blue/10 group-hover:text-ja-blue transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 mt-2 border-t border-gray-100 dark:border-gray-800">
                      <button 
                        onClick={() => handleSearch()}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-ja-blue hover:text-blue-700 transition-colors"
                      >
                        Ver todos os {totalCount} resultados
                        <Search size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          

          {/* Botão Hamburger (Mobile) */}
          <button 
            className="xl:hidden flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
        
        {/* Mobile Menu Dropdown */}
        <div 
          className={`xl:hidden absolute left-0 right-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen 
              ? 'top-full opacity-100 pointer-events-auto mt-2 rounded-2xl max-h-[500px]' 
              : 'top-[80%] opacity-0 pointer-events-none max-h-0'
          }`}
          style={isScrolled ? { width: 'calc(100% + 2rem)', marginLeft: '-1rem' } : {}}
        >
          <div className="flex flex-col p-4 gap-2">
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Início</NavLink>
            <NavLink to="/stand" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Stand</NavLink>
            <NavLink to="/importacao" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Importação</NavLink>
            <NavLink to="/sobre" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Sobre Nós</NavLink>
            <NavLink to="/contactos" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>Contactos</NavLink>
            
            
            </div>
          </div>
        </div>
        

    </header>
  );
}