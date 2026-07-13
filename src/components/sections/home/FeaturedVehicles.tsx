import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';
import { VehicleCard } from '../../ui/VehicleCard';
import { supabase } from '../../../lib/supabase';
import type { Vehicle } from '../../../types';

const TRANSMISSOES = ['Automática', 'Manual'];
const COMBUSTIVEIS = ['Diesel', 'Eléctrico', 'Gasolina', 'Híbrido (Gasolina)', 'Híbrido Plug-in Gasolina'];

// ================= COMPONENTE DE DROPDOWN INLINE =================
function InlineDropdown({ 
  placeholder, value, options, onChange, disabled = false 
}: { 
  placeholder: string; value: string; options: string[]; onChange: (val: string) => void; disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button 
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex justify-between items-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${
          disabled 
            ? 'bg-gray-400/20 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-50 dark:bg-[#202022] text-gray-800 dark:text-gray-200 hover:ring-2 hover:ring-ja-blue/30 shadow-sm'
        }`}
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#202022] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1 flex flex-col">
          <button onClick={() => { onChange(''); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            Qualquer {placeholder.toLowerCase()}
          </button>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">Sem opções</div>
          ) : (
            options.map((opt) => (
              <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${value === opt ? 'bg-ja-blue/10 text-ja-blue font-semibold' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ================= COMPONENTE PRINCIPAL =================
export function FeaturedVehicles() {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [transmissao, setTransmissao] = useState('');
  
  const [marcasAtivas, setMarcasAtivas] = useState<string[]>([]);
  const [modelosAtivos, setModelosAtivos] = useState<string[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function loadMarcas() {
      const { data } = await supabase.from('marcas').select('nome').order('nome');
      if (data) setMarcasAtivas(data.map(m => m.nome));
    }
    loadMarcas();
  }, []);

  useEffect(() => {
    async function loadModelos() {
      if (!marca) { setModelosAtivos([]); setModelo(''); return; }
      const { data: marcaObj } = await supabase.from('marcas').select('id').eq('nome', marca).single();
      if (marcaObj) {
        const { data } = await supabase.from('modelos').select('nome').eq('marca_id', marcaObj.id).order('nome');
        if (data) setModelosAtivos(data.map(m => m.nome));
      }
    }
    loadModelos();
  }, [marca]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const { data, error } = await supabase.from('vehicles').select('*').eq('em_destaque', true).eq('em_stock', true).order('created_at', { ascending: false }).limit(10);
        if (error) throw error;
        setFeaturedVehicles(data || []);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally { setLoading(false); }
    }
    fetchVehicles();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 350 : 250;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true); setHasDragged(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };
  const handleMouseLeave = () => { setIsDragging(false); setHasDragged(false); };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault(); setHasDragged(true);
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSearchClick = () => navigate('/stand', { state: { marca, modelo, combustivel, transmissao } });

  return (
    // pt-0 garante que não há espaçamento entre o vídeo e esta secção
    <section className="pb-24 pt-0 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500 border-b border-gray-100 dark:border-gray-900">
      
      {/* 1. BARRA DE PESQUISA COLADA AO HERO (Largura total, fundo branco/escuro) */}
      <div className="w-full bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 py-4 shadow-sm z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <InlineDropdown placeholder="Marca" value={marca} options={marcasAtivas} onChange={(val) => { setMarca(val); setModelo(''); }} />
            <InlineDropdown placeholder="Modelo" value={modelo} options={modelosAtivos} onChange={setModelo} disabled={!marca} />
            <InlineDropdown placeholder="Combustível" value={combustivel} options={COMBUSTIVEIS} onChange={setCombustivel} />
            <InlineDropdown placeholder="Transmissão" value={transmissao} options={TRANSMISSOES} onChange={setTransmissao} />
            
            <button onClick={handleSearchClick} className="w-full lg:w-auto flex items-center justify-center gap-2 bg-ja-blue text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg font-semibold">
              <Search size={20} />
              <span className="lg:hidden">Procurar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. VEÍCULOS EM DESTAQUE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-4 transition-colors duration-500">
              Veículos em Destaque
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl transition-colors duration-500">
              Descubra a nossa seleção exclusiva de viaturas. Garantimos qualidade, transparência e as melhores condições para o seu próximo negócio.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/stand" className="hidden md:flex items-center gap-2 text-ja-blue font-semibold hover:text-blue-800 transition-colors">
              Ver todo o stand
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 size={40} className="text-ja-blue animate-spin" /></div>
        ) : featuredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum veículo em destaque no momento.</p>
          </div>
        ) : (
          <div className="relative group">
            
            <button onClick={() => scroll('left')} className="absolute top-[40%] -translate-y-1/2 -left-6 z-20 w-14 h-14 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-ja-blue dark:hover:text-ja-blue rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hidden md:flex opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
              <ChevronLeft size={28} />
            </button>
            
            <div 
              ref={carouselRef}
              onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
              onClickCapture={(e) => { if (hasDragged) { e.stopPropagation(); e.preventDefault(); } }}
              // Ajuste de gap: gap-6 iguala o gap das Últimas Entradas
              className={`flex gap-6 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'}`}
            >
              {featuredVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  // MATEMÁTICA PERFEITA: Estas larguras igualam exatamente a Grelha do LatestVehicles.tsx!
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-start"
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>

            <button onClick={() => scroll('right')} className="absolute top-[40%] -translate-y-1/2 -right-6 z-20 w-14 h-14 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-ja-blue dark:hover:text-ja-blue rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hidden md:flex opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
              <ChevronRight size={28} />
            </button>

          </div>
        )}

      </div>
    </section>
  );
}