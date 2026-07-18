import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { VehicleCard } from '../../ui/VehicleCard';
import { supabase } from '../../../lib/supabase';
import type { Vehicle } from '../../../types';

export function FeaturedVehicles() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500 border-b border-gray-100 dark:border-gray-900">
      
      {/* 2. VEÍCULOS EM DESTAQUE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
              className={`flex gap-6 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'}`}
            >
              {featuredVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
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