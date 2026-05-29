import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Check, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchVehicle() {
      if (!id) return;
      try {
        const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();
        if (error) throw error;
        setVehicle(data);
      } catch (error) {
        console.error('Erro ao buscar viatura:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center pt-20 transition-colors duration-500">
        <Loader2 size={40} className="text-ja-blue animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center pt-20 transition-colors duration-500">
        <h2 className="text-2xl font-bold text-ja-dark dark:text-white transition-colors duration-500">Viatura não encontrada</h2>
        <Link to="/stand" className="text-ja-blue hover:text-blue-700 dark:hover:text-blue-400 mt-4 transition-colors duration-300">
          Voltar ao Inventário
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

  const fotoPerfil = vehicle.fotos[0];
  const destaqueTop = vehicle.fotos[1] || fotoPerfil; 
  const destaqueBottom = vehicle.fotos[2] || fotoPerfil; 
  const galeriaRaw = vehicle.fotos.slice(3).filter(f => f !== '');
  const galeria = galeriaRaw.length > 0 ? galeriaRaw : [fotoPerfil]; 

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galeria.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galeria.length) % galeria.length);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/stand" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-dark dark:hover:text-white mb-8 transition-colors duration-500">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Inventário
        </Link>

        {/* GALERIA PREMIUM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
          
          {/* Modal Maior (Slider) */}
          <div className="lg:col-span-2 relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group shadow-sm border border-gray-200/50 dark:border-gray-800 transition-colors duration-500">
            <img 
              src={galeria[currentSlide]} 
              alt={`${vehicle.marca} galeria ${currentSlide + 1}`} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" 
            />
            
            {galeria.length > 1 && (
              <>
                {/* Setas Elegantes */}
                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10">
                  <ChevronRight size={24} />
                </button>
                
                {/* Contador Clean */}
                <div className="absolute top-6 right-6 z-20 bg-black/40 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                  {currentSlide + 1} / {galeria.length}
                </div>

                {/* Ilha de Miniaturas em Vidro */}
                <div className="absolute bottom-6 left-6 z-20 flex gap-3 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                  {galeria.slice(0, 4).map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 ${currentSlide === idx ? 'border-white shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'} transition-all duration-300`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {galeria.length > 4 && (
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center text-white text-sm font-bold border-2 border-transparent cursor-pointer hover:bg-black/80 transition-all" onClick={() => setCurrentSlide(4)}>
                      +{galeria.length - 4}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Modais Menores (Direita) */}
          <div className="hidden lg:flex flex-col gap-4 h-[500px]">
            <div className="flex-1 relative rounded-2xl overflow-hidden group bg-gray-100 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 transition-colors duration-500 shadow-sm">
              <img src={destaqueTop} alt="Destaque Superior" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden group bg-gray-100 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 transition-colors duration-500 shadow-sm">
              <img src={destaqueBottom} alt="Destaque Inferior" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>

        </div>

        {/* Detalhes da Viatura */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          <div className="lg:w-2/3 w-full">
            <h1 className="text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-2 transition-colors duration-500">
              {vehicle.marca} {vehicle.modelo}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-500">
              {vehicle.versao}
            </p>
            
            <div className="whitespace-pre-line text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-12 transition-colors duration-500">
              {(vehicle as any).descricao || 'Uma viatura meticulosamente inspecionada e preparada para lhe oferecer a melhor experiência de condução. Entre em contacto para saber todos os detalhes deste modelo.'}
            </div>

            <h3 className="text-2xl font-bold text-ja-dark dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors duration-500">
              Especificações Chave
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 mb-12">
              <div>
                <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1 transition-colors duration-500">Ano</span>
                <span className="font-semibold text-lg text-ja-dark dark:text-white transition-colors duration-500">{vehicle.ano}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1 transition-colors duration-500">Combustível</span>
                <span className="font-semibold text-lg text-ja-dark dark:text-white transition-colors duration-500">{vehicle.combustivel}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1 transition-colors duration-500">Motor</span>
                <span className="font-semibold text-lg text-ja-dark dark:text-white transition-colors duration-500">{vehicle.motor || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1 transition-colors duration-500">Estado</span>
                <span className="font-semibold text-lg text-ja-dark dark:text-white transition-colors duration-500">{(vehicle as any).estado || 'Usado'}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1 transition-colors duration-500">Disponibilidade</span>
                <span className="font-semibold text-lg text-green-600 dark:text-green-400 flex items-center gap-1 transition-colors duration-500">
                  <Check size={18} /> {vehicle.em_stock ? 'Em Stock' : 'Vendido'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 w-full">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-28 transition-colors duration-500 shadow-sm">
              <div className="mb-6">
                <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-500">
                  Preço Fixo
                </span>
                <span className="text-4xl lg:text-5xl font-bold text-ja-dark dark:text-white transition-colors duration-500">
                  {formatPrice(vehicle.preco)}
                </span>
              </div>

              <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-6 transition-colors duration-500"></div>

              <h4 className="text-xl font-bold text-ja-dark dark:text-white mb-3 transition-colors duration-500">
                Tem interesse nesta viatura?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-500 leading-relaxed">
                A nossa equipa de especialistas está pronta para esclarecer todas as suas dúvidas e agendar uma visita ao nosso stand.
              </p>
              
              <Link 
                to="/contactos"
                state={{ 
                  scrollToForm: true, 
                  assunto: `Interesse: ${vehicle.marca} ${vehicle.modelo} (${vehicle.ano})` 
                }}
                className="w-full flex items-center justify-center gap-2 bg-ja-dark dark:bg-white hover:bg-ja-blue dark:hover:bg-gray-200 text-white dark:text-ja-dark font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <MessageSquare size={20} />
                Falar com a Equipa
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}