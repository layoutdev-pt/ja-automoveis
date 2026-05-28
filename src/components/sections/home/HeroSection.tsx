import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Vehicle } from '../../../types';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Novos estados para a pesquisa em tempo real
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Função para formatar o preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  };

  // Efeito 1: Fechar o dropdown de resultados se o utilizador clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efeito 2: Pesquisa na base de dados à medida que o utilizador escreve (com Debounce)
  useEffect(() => {
    // Se a barra estiver vazia, limpa tudo
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      setShowDropdown(true); // Abre a janelinha
      
      try {
        const { data, count, error } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact' })
          .eq('em_stock', true)
          .or(`marca.ilike.%${searchQuery}%,modelo.ilike.%${searchQuery}%`)
          .limit(4); // Limite de 4 carros para não dar lag!

        if (error) throw error;
        setSearchResults(data || []);
        setTotalCount(count);
      } catch (error) {
        console.error('Erro na pesquisa rápida:', error);
      } finally {
        setIsSearching(false);
      }
    };

    // Espera 300ms depois do utilizador parar de teclar para ir à BD
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Função para quando o utilizador carrega na tecla "Enter" ou no botão "Procurar"
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/stand', { state: { searchQuery } });
    } else {
      navigate('/stand');
    }
    setShowDropdown(false);
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center mt-[-80px]">
      {/* Fundo com Vídeo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Conteúdo Central sobreposto */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center pt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 tracking-tight drop-shadow-lg">
          Encontre o veículo perfeito para si
        </h1>
        
        {/* Usamos a Ref aqui para saber quando o utilizador clica fora desta área */}
        <div className="w-full max-w-3xl relative" ref={dropdownRef}>
          
          <form 
            onSubmit={handleSearch}
            // Fundo da barra de pesquisa adapta-se ao tema escuro
            className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-2xl flex items-center p-2 border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:bg-white dark:hover:bg-gray-900"
          >
            <div className="pl-6 text-gray-500 dark:text-gray-400 transition-colors duration-500">
              <Search size={24} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="O meu próximo carro é..."
              // Texto e placeholder adaptam-se
              className="w-full py-4 px-4 bg-transparent outline-none text-ja-dark dark:text-white text-lg placeholder-gray-500 dark:placeholder-gray-500 font-medium transition-colors duration-500"
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="bg-ja-blue hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Procurar
            </button>
          </form>

          {/* O Dropdown dos Resultados Mágicos */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-4 z-50 transition-colors duration-500">
              
              {isSearching ? (
                <div className="p-8 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium transition-colors duration-500">
                  <Loader2 size={24} className="animate-spin mr-3 text-ja-blue" />
                  A procurar viaturas...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium transition-colors duration-500">
                  Não encontrámos viaturas para "{searchQuery}".
                </div>
              ) : (
                <div className="flex flex-col">
                  {searchResults.map((vehicle) => (
                    <Link 
                      key={vehicle.id}
                      to={`/stand/${vehicle.id}`}
                      // Hover altera a cor no modo escuro também
                      className="flex items-center gap-4 p-4 mx-2 mt-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors duration-300 group"
                    >
                      {/* Miniatura da Imagem */}
                      <div className="w-16 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 transition-colors duration-500">
                        <img 
                          src={vehicle.fotos[0]} 
                          alt={vehicle.modelo} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Detalhes Compactos */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-ja-dark dark:text-white truncate group-hover:text-ja-blue dark:group-hover:text-blue-400 transition-colors text-base">
                          {vehicle.marca} {vehicle.modelo}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">
                          <span>{vehicle.ano}</span>
                          <span>•</span>
                          <span className="truncate">{vehicle.versao}</span>
                        </div>
                      </div>
                      
                      {/* Preço e Seta */}
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-ja-dark dark:text-white text-right transition-colors">
                          {formatPrice(vehicle.preco)}
                        </span>
                        {/* Ícone de Seta com adaptação ao tema escuro */}
                        <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full text-gray-400 dark:text-gray-500 group-hover:bg-ja-blue/10 dark:group-hover:bg-ja-blue/20 group-hover:text-ja-blue dark:group-hover:text-blue-400 transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Rodapé do Dropdown: O botão ver "Tudo" */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 mt-2 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
                    <button 
                      onClick={() => handleSearch()}
                      className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-ja-blue dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      Ver todos os {totalCount} resultados encontrados
                      <Search size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}