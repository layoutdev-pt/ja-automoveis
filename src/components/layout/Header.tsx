import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Vehicle } from '../../types';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // ================= ESTADOS DA PESQUISA NO SUPABASE =================
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null); // Ref adicionado para o mobile

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  };

  // Efeito do Scroll para a função de Encolher
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Controla o scroll da página quando o menu mobile é aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // ================= EFEITOS DA PESQUISA =================
  // 1. Fecha o dropdown se clicar fora dele (agora verifica desktop e mobile)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const inDesktop = dropdownRef.current?.contains(e.target as Node);
      const inMobile = mobileDropdownRef.current?.contains(e.target as Node);

      if (!inDesktop && !inMobile) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 2. Pesquisa em tempo real na Base de Dados (Supabase)
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setTotalCount(0);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error, count } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact' })
          .eq('em_stock', true)
          .or(`marca.ilike.%${searchQuery}%,modelo.ilike.%${searchQuery}%`)
          .limit(4);

        if (error) throw error;
        setSearchResults(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Erro na pesquisa rápida:', err);
      } finally {
        setIsSearching(false);
      }
    };

    // Pequeno atraso para não fazer requests a cada letra digitada
    const timeoutId = setTimeout(() => {
      if (showDropdown) fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, showDropdown]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      setShowDropdown(false); // Esconde o dropdown ao ir para a página do Stand
      navigate('/stand', { state: { searchQuery } });
    }
  };

  // Componente do Logótipo (reutilizável para manter coerência)
 const Logo = () => (
  // O 'to' deve voltar a ser "/" para ir para a página inicial ao clicar
  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 shrink-0">
    
    {/* Substituímos a div do quadrado azul por uma tag de imagem real */}
    <img 
      src="/logo.png" 
      alt="Logo JA Automóveis" 
      className="w-[45px] h-[45px] lg:w-[50px] lg:h-[50px] object-contain shrink-0" 
    />

    {/* O texto lateral continua aqui (se a sua imagem já tiver o texto incluído, pode apagar esta <div> inteira) */}
    <div className="flex flex-col mt-0.5">
      <div className="text-2xl lg:text-3xl font-bold tracking-tight leading-none dark:text-white transition-colors duration-500">
        <span className="text-black dark:text-white">JA</span> <span className="text-[#2557D6]">Automóveis</span>
      </div>
      <span className="text-[10px] text-gray-400 font-bold tracking-[0.15em] mt-1 uppercase">
        Since 1993
      </span>
    </div>
  </Link>
);

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out flex flex-col items-center ${isScrolled ? 'pt-4' : 'pt-0'}`}>
        
        {/* ================= TOP BAR UTILITÁRIA ================= */}
        <div className={`w-full bg-[#111827] text-slate-300 text-sm px-4 lg:px-8 transition-all duration-500 overflow-hidden flex flex-col justify-center ${isScrolled ? 'max-h-0 opacity-0 border-transparent py-0' : 'max-h-20 opacity-100 border-b border-slate-800 py-2'}`}>
          <div className="max-w-7xl mx-auto w-full flex justify-end lg:justify-between items-center gap-4">
            
            {/* Lado Esquerdo: Morada e Email (Apenas Desktop) */}
            <div className="hidden lg:flex items-center gap-6 font-medium tracking-wide">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Covilhã, Portugal</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>geral@jaautomoveis.pt</span>
              </div>
            </div>

            {/* Lado Direito: Telefone (Visível Mobile e Desktop) */}
            <div className="flex items-center gap-2 font-medium tracking-wide text-[13px] sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+351 961 650 396</span>
            </div>
            
          </div>
        </div>

        {/* ================= NAVBAR PRINCIPAL (Com função de encolher) ================= */}
        <nav className={`transition-all duration-500 ease-in-out flex items-center justify-center ${
          isScrolled 
            ? 'w-11/12 max-w-7xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg rounded-full py-3 px-4 sm:px-8 border border-gray-200 dark:border-gray-800' 
            : 'w-full bg-[#f8f9fa] dark:bg-[#0a0a0a] shadow-sm px-4 py-7 lg:px-8 border-b border-gray-200 dark:border-gray-800'
        }`}>
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
            
            <Logo />

            {/* Bloco 2: Navegação Desktop */}
            <ul className="hidden lg:flex items-center gap-8 text-slate-700 dark:text-slate-300 font-semibold text-[15px]">
              <li><NavLink to="/" className={({ isActive }) => `transition-colors ${isActive ? 'text-[#2557D6] dark:text-blue-400' : 'hover:text-[#2557D6] dark:hover:text-blue-400'}`}>Início</NavLink></li>
              <li><NavLink to="/stand" className={({ isActive }) => `transition-colors ${isActive ? 'text-[#2557D6] dark:text-blue-400' : 'hover:text-[#2557D6] dark:hover:text-blue-400'}`}>Stand</NavLink></li>
              <li><NavLink to="/importacao" className={({ isActive }) => `transition-colors ${isActive ? 'text-[#2557D6] dark:text-blue-400' : 'hover:text-[#2557D6] dark:hover:text-blue-400'}`}>Importação</NavLink></li>
              <li><NavLink to="/sobre" className={({ isActive }) => `transition-colors ${isActive ? 'text-[#2557D6] dark:text-blue-400' : 'hover:text-[#2557D6] dark:hover:text-blue-400'}`}>Sobre nós</NavLink></li>
              <li><NavLink to="/contactos" className={({ isActive }) => `transition-colors ${isActive ? 'text-[#2557D6] dark:text-blue-400' : 'hover:text-[#2557D6] dark:hover:text-blue-400'}`}>Contactos</NavLink></li>
            </ul>

            {/* Bloco 3: Pesquisa Desktop */}
            <div className="hidden lg:block shrink-0 relative" ref={dropdownRef}>
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim() !== '') {
                      setShowDropdown(true);
                    } else {
                      setShowDropdown(false);
                    }
                  }}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  autoComplete="off"
                  className="bg-white dark:bg-[#18181b] rounded-full py-2.5 pl-11 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2557D6]/50 w-[240px] text-slate-700 dark:text-slate-200 placeholder-slate-400 font-medium transition-all border border-gray-200 dark:border-gray-800"
                />
              </form>

              {/* Dropdown de Resultados em Tempo Real */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-4 w-[300px] sm:w-[350px] md:w-[450px] bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-4 z-50 transition-colors duration-500">
                  
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
                          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#2557D6] hover:text-[#1d4ed8] transition-colors"
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

            {/* Botão Menu Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MENU MOBILE (OVERLAY) ================= */}
<div className={`fixed inset-0 bg-[#f8f9fa] dark:bg-[#0a0a0a] z-[100] flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>        
        {/* Cabeçalho do Menu Mobile */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shrink-0">
          <Logo />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Corpo do Menu Mobile (Scrollável) */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          
          {/* Caixa de Pesquisa Mobile e Dropdown envoltos no novo Ref */}
          <div className="relative w-full mb-6" ref={mobileDropdownRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Pesquisar veículos..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setShowDropdown(true);
                  } else {
                    setShowDropdown(false);
                  }
                }}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                autoComplete="off"
                className="bg-gray-100 dark:bg-[#18181b] rounded-lg py-3 pl-10 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2557D6] w-full text-slate-800 dark:text-slate-200 placeholder-slate-500 font-medium border border-transparent dark:border-gray-800"
              />
            </form>

            {/* Dropdown de Resultados Mobile */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-4 z-50 transition-colors duration-500">
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
                        onClick={() => {
                          setShowDropdown(false);
                          setIsMobileMenuOpen(false);
                        }}
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
                        </div>
                      </Link>
                    ))}
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 mt-2 border-t border-gray-100 dark:border-gray-800">
                      <button 
                        onClick={() => handleSearch()}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#2557D6] hover:text-[#1d4ed8] transition-colors"
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
          
          <ul className="flex flex-col gap-1 text-[16px]">
            {[
              { path: '/', label: 'Início' },
              { path: '/stand', label: 'Stand' },
              { path: '/importacao', label: 'Importação' },
              { path: '/sobre', label: 'Sobre nós' },
              { path: '/contactos', label: 'Contactos' }
            ].map((link) => (
              <li key={link.path}>
                <NavLink 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `block px-4 py-3.5 font-bold rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#EEF2FF] dark:bg-blue-900/30 text-[#2557D6] dark:text-blue-400' 
                      : 'text-slate-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé do Menu Mobile (Telefone) */}
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-[#f8f9fa] dark:bg-[#0a0a0a] mt-auto">
          <div className="flex items-center gap-3 text-[#2557D6] dark:text-blue-400 font-bold text-lg px-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+351 961 650 396</span>
          </div>
        </div>
      </div>
    </>
  );
}