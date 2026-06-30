import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, Loader2, ChevronDown, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { VehicleCard } from '../components/ui/VehicleCard';
import type { Vehicle } from '../types';

// ================= COMPONENTE CUSTOMIZADO PARA OS DROPDOWNS =================
// Este componente recria o visual premium das tuas imagens de referência
function FilterDropdown({ 
  placeholder, 
  value, 
  options, 
  onChange, 
  searchable = false 
}: { 
  label?: string;
  placeholder: string; 
  value: string; 
  options: string[]; 
  onChange: (val: string) => void; 
  searchable?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        // O estilo bg-[#f4f4f5] com texto escuro reflete o design das tuas imagens
        className="w-full flex justify-between items-center py-2.5 px-4 bg-gray-100 dark:bg-[#f4f4f5] rounded-xl text-sm text-gray-800 font-medium border border-transparent focus:ring-2 focus:ring-ja-blue/30 outline-none transition-all shadow-sm"
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#f4f4f5] border border-gray-200 dark:border-gray-300 rounded-xl shadow-2xl max-h-60 flex flex-col overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-300">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-lg text-sm outline-none text-gray-800 focus:ring-1 focus:ring-ja-blue"
                  placeholder="Procurar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto p-1">
            <button 
              onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }} 
              className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-200 rounded-lg transition-colors"
            >
              Qualquer {placeholder.toLowerCase()}
            </button>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">Sem resultados</div>
            ) : (
              filteredOptions.map((opt) => (
                <button 
                  key={opt} 
                  onClick={() => { onChange(opt); setIsOpen(false); setSearch(''); }} 
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${value === opt ? 'bg-ja-blue/10 text-ja-blue font-semibold' : 'text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-200'}`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ================= LISTAS FIXAS E GERAÇÃO DE DADOS =================
const SEGMENTOS = ['Cabrio', 'Carrinha', 'Citadino', 'Coupe', 'Monovolume', 'Peq. Citadino', 'Sedan', 'SUV'];
const TRANSMISSOES = ['Automática', 'Manual'];
const COMBUSTIVEIS = ['Diesel', 'Eléctrico', 'Gasolina', 'Híbrido (Gasolina)', 'Híbrido (Diesel)'];

const currentYear = new Date().getFullYear();
const ANOS = Array.from({ length: currentYear - 1999 }, (_, i) => (currentYear - i).toString());
const PRECOS = ['5000', '10000', '15000', '20000', '25000', '30000', '40000', '50000', '75000', '100000'];
const QUILOMETROS = ['0', '10000', '25000', '50000', '75000', '100000', '125000', '150000', '200000'];

const ITEMS_PER_PAGE = 9;

// ================= COMPONENTE PRINCIPAL DO STAND =================
export function Stand() {
  const location = useLocation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Estados dos Filtros Ativos
  const [marcaFilter, setMarcaFilter] = useState(location.state?.searchQuery || '');
  const [modeloFilter, setModeloFilter] = useState('');
  const [transmissaoFilter, setTransmissaoFilter] = useState('');
  const [segmentoFilter, setSegmentoFilter] = useState('');
  const [combustivelFilter, setCombustivelFilter] = useState('');
  
  const [anoDesde, setAnoDesde] = useState('');
  const [anoAte, setAnoAte] = useState('');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [kmDesde, setKmDesde] = useState('');
  const [kmAte, setKmAte] = useState('');

  // Listas Dinâmicas que virão do Admin
  const [marcasAtivas, setMarcasAtivas] = useState<string[]>([]);
  const [modelosAtivos, setModelosAtivos] = useState<string[]>([]);

  // 1. CARREGAR MARCAS DA BASE DE DADOS
  useEffect(() => {
    async function loadMarcas() {
      try {
        const { data } = await supabase.from('marcas').select('nome').order('nome');
        if (data) setMarcasAtivas(data.map(m => m.nome));
      } catch (error) {
        // Ignora silenciosamente até criarmos as tabelas na Fase 2
      }
    }
    loadMarcas();
  }, []);

  // 2. CARREGAR MODELOS DA BASE DE DADOS (Depende da Marca Selecionada)
  useEffect(() => {
    async function loadModelos() {
      if (!marcaFilter) {
        setModelosAtivos([]);
        return;
      }
      try {
        const { data: marcaObj } = await supabase.from('marcas').select('id').eq('nome', marcaFilter).single();
        if (marcaObj) {
          const { data } = await supabase.from('modelos').select('nome').eq('marca_id', marcaObj.id).order('nome');
          if (data) setModelosAtivos(data.map(m => m.nome));
        }
      } catch (error) {
        // Ignora silenciosamente
      }
    }
    loadModelos();
  }, [marcaFilter]);

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setMarcaFilter(''); setModeloFilter(''); setTransmissaoFilter('');
    setSegmentoFilter(''); setCombustivelFilter(''); setAnoDesde('');
    setAnoAte(''); setPrecoMin(''); setPrecoMax(''); setKmDesde(''); setKmAte('');
  };

  const handleMarcaChange = (val: string) => {
    setMarcaFilter(val);
    setModeloFilter(''); // Reseta o modelo se mudar de marca!
  };

  // 3. PESQUISA DE VEÍCULOS NO SUPABASE
  const fetchVehicles = async (currentPage: number, isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      else setLoadingMore(true);

      let query = supabase.from('vehicles').select('*', { count: 'exact' }).eq('em_stock', true).order('created_at', { ascending: false });

      // Aplicar filtros rigorosos
      if (marcaFilter) query = query.eq('marca', marcaFilter);
      if (modeloFilter) query = query.eq('modelo', modeloFilter);
      if (transmissaoFilter) query = query.eq('transmissao', transmissaoFilter);
      if (segmentoFilter) query = query.eq('segmento', segmentoFilter);
      if (combustivelFilter) query = query.eq('combustivel', combustivelFilter);
      
      if (anoDesde) query = query.gte('ano', parseInt(anoDesde));
      if (anoAte) query = query.lte('ano', parseInt(anoAte));
      
      if (precoMin) query = query.gte('preco', parseInt(precoMin));
      if (precoMax) query = query.lte('preco', parseInt(precoMax));
      
      if (kmDesde) query = query.gte('quilometros', parseInt(kmDesde));
      if (kmAte) query = query.lte('quilometros', parseInt(kmAte));

      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      if (data) {
        setVehicles(prev => isNewSearch ? data : [...prev, ...data]);
        if (count !== null) setHasMore(from + ITEMS_PER_PAGE < count);
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    const timeoutId = setTimeout(() => fetchVehicles(0, true), 300);
    return () => clearTimeout(timeoutId);
  }, [marcaFilter, modeloFilter, transmissaoFilter, segmentoFilter, combustivelFilter, anoDesde, anoAte, precoMin, precoMax, kmDesde, kmAte]);

  useEffect(() => {
    if (page > 0) fetchVehicles(page, false);
  }, [page]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(prevPage => prevPage + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  return (
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

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR DE FILTROS SUPER PREMIUM */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-[#18181b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-28 transition-colors duration-500">
              
              <div className="flex items-center gap-3 font-bold text-lg mb-8 text-ja-dark dark:text-white transition-colors duration-500">
                <SlidersHorizontal size={20} />
                Opções de pesquisa
              </div>

              <div className="space-y-4">
                
                {/* Filtros Principais */}
                <div>
                  <FilterDropdown label="Marca" placeholder="Marca" searchable value={marcaFilter} options={marcasAtivas.length > 0 ? marcasAtivas : ['Sem marcas criadas']} onChange={handleMarcaChange} />
                </div>
                <div>
                  <FilterDropdown label="Modelo" placeholder="Modelo" searchable value={modeloFilter} options={modelosAtivos.length > 0 ? modelosAtivos : (marcaFilter ? ['Sem modelos'] : ['Escolha a marca primeiro'])} onChange={setModeloFilter} />
                </div>
                <div>
                  <FilterDropdown label="Transmissão" placeholder="Transmissão" value={transmissaoFilter} options={TRANSMISSOES} onChange={setTransmissaoFilter} />
                </div>
                <div>
                  <FilterDropdown label="Segmento" placeholder="Segmento" value={segmentoFilter} options={SEGMENTOS} onChange={setSegmentoFilter} />
                </div>
                <div>
                  <FilterDropdown label="Combustível" placeholder="Combustível" value={combustivelFilter} options={COMBUSTIVEIS} onChange={setCombustivelFilter} />
                </div>

                {/* Filtros de Ranged (Desde/Até) */}
                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ano</label>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterDropdown label="Ano Mínimo" placeholder="Desde" value={anoDesde} options={ANOS} onChange={setAnoDesde} />
                    <FilterDropdown label="Ano Máximo" placeholder="Até" value={anoAte} options={ANOS} onChange={setAnoAte} />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preço</label>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterDropdown label="Preço Mínimo" placeholder="Mínimo" value={precoMin} options={PRECOS} onChange={setPrecoMin} />
                    <FilterDropdown label="Preço Máximo" placeholder="Máximo" value={precoMax} options={PRECOS} onChange={setPrecoMax} />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quilómetros</label>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterDropdown label="Km Desde" placeholder="Desde" value={kmDesde} options={QUILOMETROS} onChange={setKmDesde} />
                    <FilterDropdown label="Km Até" placeholder="Até" value={kmAte} options={QUILOMETROS} onChange={setKmAte} />
                  </div>
                </div>

              </div>

              {/* Botão de Apagar Filtros */}
              <button 
                onClick={clearFilters}
                className="w-full mt-10 flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              >
                <RotateCcw size={16} />
                Apagar filtros
              </button>

            </div>
          </aside>

          {/* ÁREA DE RESULTADOS */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={40} className="text-ja-blue animate-spin" /></div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
                <h3 className="text-xl font-semibold text-ja-dark dark:text-white mb-2 transition-colors duration-500">Nenhum veículo encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-500">Ajuste os filtros ou clique em "Apagar filtros" para ver mais viaturas.</p>
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