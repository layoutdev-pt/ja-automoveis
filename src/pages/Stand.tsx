import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { VehicleCard } from '../components/ui/VehicleCard';
import type { Vehicle } from '../types';

const ITEMS_PER_PAGE = 9;

export function Stand() {
  const location = useLocation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState(location.state?.searchQuery || '');
  const [marcaFilter, setMarcaFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  // Função para ir buscar os dados ao Supabase
  const fetchVehicles = async (currentPage: number, isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Construir a query base
      let query = supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('em_stock', true)
        .order('created_at', { ascending: false });

      // Aplicar filtros dinamicamente
      if (searchTerm) {
        query = query.or(`marca.ilike.%${searchTerm}%,modelo.ilike.%${searchTerm}%`);
      }
      if (marcaFilter) {
        query = query.eq('marca', marcaFilter);
      }
      if (priceFilter) {
        query = query.lte('preco', parseInt(priceFilter));
      }

      // Paginação
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      if (data) {
        setVehicles(prev => isNewSearch ? data : [...prev, ...data]);
        if (count !== null) {
          setHasMore(from + ITEMS_PER_PAGE < count);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Efeito para disparar nova pesquisa quando os filtros mudam
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    // Usamos um pequeno timeout (debounce) para não disparar requests a cada tecla digitada
    const timeoutId = setTimeout(() => {
      fetchVehicles(0, true);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, marcaFilter, priceFilter]);

  // Efeito para carregar mais páginas quando a página muda (Infinite Scroll)
  useEffect(() => {
    if (page > 0) {
      fetchVehicles(page, false);
    }
  }, [page]);

  // Lógica do Infinite Scroll com Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

return (
    // Fundo da página transita para um preto profundo
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ja-dark dark:text-white tracking-tight transition-colors duration-500">
            Todo o Inventário
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-500">
            Explore a nossa vasta gama de veículos de qualidade.
          </p>
        </div>

        {/* Layout com Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar de Filtros (Esquerda) */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Caixa da Sidebar adapta-se ao tema */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-28 transition-colors duration-500">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 text-ja-dark dark:text-white transition-colors duration-500">
                <SlidersHorizontal size={20} />
                Filtros
              </div>

              {/* Pesquisa */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Pesquisa</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-500" />
                  <input
                    type="text"
                    placeholder="Marca ou modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // Campos de input tornam-se escuros e com letras legíveis
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-ja-blue/20 focus:border-ja-blue text-sm bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-500"
                  />
                </div>
              </div>

              {/* Filtro Marca */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Marca</label>
                <select 
                  value={marcaFilter}
                  onChange={(e) => setMarcaFilter(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none transition-colors duration-500"
                >
                  <option value="">Todas</option>
                  <option value="Audi">Audi</option>
                  <option value="BMW">BMW</option>
                  <option value="Citroën">Citroën</option>
                  <option value="Dacia">Dacia</option>
                  <option value="Ford">Ford</option>
                  <option value="Kia">Kia</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Renault">Renault</option>
                  <option value="Seat">Seat</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Volvo">Volvo</option>
                </select>
              </div>

              {/* Filtro Preço */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Preço Máximo</label>
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none transition-colors duration-500"
                >
                  <option value="">Qualquer valor</option>
                  <option value="15000">Até 15.000 €</option>
                  <option value="30000">Até 30.000 €</option>
                  <option value="50000">Até 50.000 €</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Área de Resultados (Direita) */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={40} className="text-ja-blue animate-spin" /></div>
            ) : vehicles.length === 0 ? (
              // Estado Vazio (Sem Resultados) também recebe a pintura escura
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
                <h3 className="text-xl font-semibold text-ja-dark dark:text-white mb-2 transition-colors duration-500">Nenhum veículo encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-500">Tente ajustar os filtros de pesquisa.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle, index) => (
                    <div ref={vehicles.length === index + 1 ? lastElementRef : null} key={vehicle.id}>
                      <VehicleCard vehicle={vehicle} />
                    </div>
                  ))}
                </div>
                {loadingMore && (
                  <div className="mt-8 flex justify-center"><Loader2 size={24} className="text-ja-blue animate-spin" /></div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}