import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Loader2, Check, ChevronLeft, ChevronRight, MessageSquare,
  Calendar, Gauge, Fuel, Settings2, Zap, Car, BadgeCheck, CheckCircle, XCircle,
  ShieldCheck, Video, Play, Pause // Adicionados Play e Pause
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  
  const [activeTab, setActiveTab] = useState<'equipamento' | 'descricao'>('equipamento');

  // Estados para o controlo de Vídeo Moderno
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  // Sempre que mudamos de slide, assumimos que o vídeo novo vai fazer autoPlay
  useEffect(() => {
    setIsPlaying(true);
  }, [currentSlide]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 size={40} className="text-ja-blue animate-spin" /></div>;
  if (!vehicle) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><h2 className="text-2xl font-bold">Viatura não encontrada</h2><Link to="/stand" className="text-ja-blue mt-4">Voltar ao Inventário</Link></div>;

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  const formatNumber = (num: number) => new Intl.NumberFormat('pt-PT').format(num);

  const fotoPerfil = vehicle.fotos[0];
  const destaqueTop = vehicle.fotos[1] || fotoPerfil; 
  const destaqueBottom = vehicle.fotos[2] || fotoPerfil; 
  const galeriaRaw = vehicle.fotos.slice(3).filter(f => f !== '');
  const galeria = galeriaRaw.length > 0 ? galeriaRaw : [fotoPerfil]; 

  // ================= FUNÇÃO PARA DETETAR VÍDEOS =================
  const isVideoUrl = (url: string) => typeof url === 'string' && /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);

  // ================= TOGGLE DO VÍDEO (PLAY/PAUSE) =================
  const togglePlay = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation(); // Evita conflitos com outros cliques
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const navigateToSlide = (newSlide: number, directionHint?: 'forward' | 'backward') => {
    setCurrentSlide(newSlide);
    if (galeria.length <= 4) return;
    
    setThumbStart(prevStart => {
        let newStart = prevStart;
        let slot = newSlide - prevStart;
        if (slot < 0) slot += galeria.length;
        
        let direction = directionHint;
        if (!direction) {
            if (slot > 2) direction = 'forward';
            else if (slot < 1) direction = 'backward';
            else direction = 'forward';
        }
        
        if (slot > 3) {
            if (direction === 'forward') newStart = (newSlide - 2 + galeria.length) % galeria.length;
            else newStart = (newSlide - 1 + galeria.length) % galeria.length;
        } else {
            if (direction === 'forward' && slot > 2) {
                newStart = (newSlide - 2 + galeria.length) % galeria.length;
            } else if (direction === 'backward' && slot < 1) {
                newStart = (newSlide - 1 + galeria.length) % galeria.length;
            }
        }
        
        if (newSlide === 0) newStart = 0;
        else if (newSlide === 1) newStart = 0;
        
        return newStart;
    });
  };

  const nextSlide = () => navigateToSlide((currentSlide + 1) % galeria.length, 'forward');
  const prevSlide = () => navigateToSlide((currentSlide - 1 + galeria.length) % galeria.length, 'backward');

  const validEquips = [
    { title: "Áudio e Multimédia", data: vehicle.equip_audio },
    { title: "Conforto", data: vehicle.equip_conforto },
    { title: "Desempenho", data: vehicle.equip_desempenho },
    { title: "Segurança", data: vehicle.equip_seguranca },
    { title: "Tecnologia e Eletrónica", data: vehicle.equip_tecnologia }
  ].filter(section => {
    if (!section.data) return false;
    return section.data.split(',').map(i => i.trim()).filter(i => i.length > 0).length > 0;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-42 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/stand" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-dark dark:hover:text-white mb-8 transition-colors duration-500">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Inventário
        </Link>

        {/* GALERIA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
          <div className="lg:col-span-2 relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group shadow-sm border border-gray-200/50 dark:border-gray-800">
            
            {/* RENDERIZAÇÃO CONDICIONAL: IMAGEM VS VÍDEO PRINCIPAL */}
            {isVideoUrl(galeria[currentSlide]) ? (
              <>
                <video 
                  ref={videoRef}
                  src={galeria[currentSlide]} 
                  playsInline 
                  autoPlay
                  muted
                  loop
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-700 cursor-pointer" 
                />
                
                {/* Botão Play/Pause Central (Estilo Moderno) */}
                <button 
                  onClick={togglePlay}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all duration-300 pointer-events-none group-hover:pointer-events-auto ${
                    isPlaying 
                      ? 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100' 
                      : 'opacity-100 scale-100 ring-4 ring-white/20'
                  }`}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={36} className="ml-2" />}
                </button>
              </>
            ) : (
              <img 
                src={galeria[currentSlide]} 
                alt="galeria" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" 
              />
            )}

            {galeria.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
                <button onClick={nextSlide} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
                <div className="absolute top-3 sm:top-6 right-3 sm:right-6 z-20 bg-black/40 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md">{currentSlide + 1} / {galeria.length}</div>
                
                <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-6 z-20 flex gap-2 sm:gap-3 p-1.5 sm:p-2 bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl max-w-[90%] overflow-x-auto">
                  {Array.from({ length: Math.min(4, galeria.length) }).map((_, i) => {
                    const idx = galeria.length <= 4 ? i : (thumbStart + i) % galeria.length;
                    const isVid = isVideoUrl(galeria[idx]);
                    
                    return (
                      <button 
                        key={`thumb-${idx}`} 
                        onClick={() => navigateToSlide(idx)} 
                        className={`relative w-14 h-10 sm:w-20 sm:h-14 rounded-lg sm:rounded-xl flex-shrink-0 overflow-hidden border-2 ${currentSlide === idx ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
                      >
                        {/* MINIATURA: IMAGEM VS VÍDEO */}
                        {isVid ? (
                          <>
                            <video src={galeria[idx]} className="w-full h-full object-cover" muted playsInline />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                              <Video size={16} className="text-white drop-shadow-md" />
                            </div>
                          </>
                        ) : (
                          <img src={galeria[idx]} className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          
          {/* FOTOS LATERAIS / INFERIORES */}
          <div className="flex flex-row lg:flex-col gap-4 lg:h-[500px]">
            <div className="flex-1 relative h-[120px] sm:h-[200px] lg:h-auto rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group">
              {isVideoUrl(destaqueTop) ? (
                <video src={destaqueTop} className="absolute inset-0 w-full h-full object-cover" muted playsInline autoPlay loop />
              ) : (
                <img src={destaqueTop} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 relative h-[120px] sm:h-[200px] lg:h-auto rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group">
               {isVideoUrl(destaqueBottom) ? (
                <video src={destaqueBottom} className="absolute inset-0 w-full h-full object-cover" muted playsInline autoPlay loop />
              ) : (
                <img src={destaqueBottom} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>

        {/* CONTEÚDO INFERIOR */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          <div className="lg:w-2/3 w-full">
            <h1 className="text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-2">
              {vehicle.marca} {vehicle.modelo}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
              {vehicle.versao}
            </p>

            {/* ESPECIFICAÇÕES CHAVE */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-ja-dark dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                Especificações Chave
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                
                {/* Ano */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                    <Calendar size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Ano</span>
                    <span className="font-bold text-lg text-ja-dark dark:text-white">{vehicle.ano}</span>
                  </div>
                </div>

                {/* Quilómetros */}
                {(vehicle as any).quilometros != null && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                      <Gauge size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Quilómetros</span>
                      <span className="font-bold text-lg text-ja-dark dark:text-white">
                        {formatNumber((vehicle as any).quilometros)} km
                      </span>
                    </div>
                  </div>
                )}

                {/* Combustível */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                    <Fuel size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Combustível</span>
                    <span className="font-bold text-lg text-ja-dark dark:text-white">{vehicle.combustivel}</span>
                  </div>
                </div>

                {/* Transmissão */}
                {(vehicle as any).transmissao && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                      <Settings2 size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Transmissão</span>
                      <span className="font-bold text-lg text-ja-dark dark:text-white">{(vehicle as any).transmissao}</span>
                    </div>
                  </div>
                )}

                {/* Motor/CV */}
                {vehicle.motor && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                      <Zap size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Motor / CV</span>
                      <span className="font-bold text-lg text-ja-dark dark:text-white">{vehicle.motor}</span>
                    </div>
                  </div>
                )}

                {/* Segmento */}
                {(vehicle as any).segmento && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                      <Car size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Segmento</span>
                      <span className="font-bold text-lg text-ja-dark dark:text-white">{(vehicle as any).segmento}</span>
                    </div>
                  </div>
                )}

                {/* Estado */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                    <BadgeCheck size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Estado</span>
                    <span className="font-bold text-lg text-ja-dark dark:text-white">{(vehicle as any).estado || 'Usado'}</span>
                  </div>
                </div>

                {/* Disponibilidade */}
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${vehicle.em_stock ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {vehicle.em_stock ? <CheckCircle size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Disponibilidade</span>
                    <span className={`font-bold text-lg ${vehicle.em_stock ? 'text-emerald-500' : 'text-red-500'}`}>
                      {vehicle.em_stock ? 'Em Stock' : 'Vendido'}
                    </span>
                  </div>
                </div>

                {/* Garantia */}
                {(vehicle as any).garantia && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl text-ja-blue dark:text-blue-400 flex-shrink-0">
                      <ShieldCheck size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Garantia</span>
                      <span className="font-bold text-lg text-ja-dark dark:text-white">{(vehicle as any).garantia}</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ABAS (Equipamento / Descrição) */}
            <div className="mb-12">
              <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-8">
                <button 
                  onClick={() => setActiveTab('equipamento')}
                  className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'equipamento' ? 'text-ja-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  Equipamento
                  {activeTab === 'equipamento' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-ja-blue rounded-t-full"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('descricao')}
                  className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'descricao' ? 'text-ja-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  Descrição
                  {activeTab === 'descricao' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-ja-blue rounded-t-full"></div>}
                </button>
              </div>

              {activeTab === 'equipamento' && (
                <div className="animate-in fade-in duration-500">
                  {validEquips.length === 0 ? (
                    <p className="text-gray-500 italic">Detalhes de equipamento não especificados para esta viatura.</p>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {validEquips.map((section, idx) => {
                        const isLastOdd = idx === validEquips.length - 1 && validEquips.length % 2 !== 0;
                        const items = section.data!.split(',').map(item => item.trim()).filter(item => item.length > 0);
                        
                        return (
                          <div key={section.title} className={`bg-gray-50 dark:bg-[#18181b] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors duration-500 h-full ${isLastOdd ? 'lg:col-span-2' : ''}`}>
                            <h4 className="text-xl font-bold text-ja-dark dark:text-white mb-6">{section.title}</h4>
                            <div className={`grid grid-cols-1 ${isLastOdd ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-y-4 gap-x-8`}>
                              {items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-white font-bold" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'descricao' && (
                <div className="animate-in fade-in duration-500">
                  <div className="bg-gray-50 dark:bg-[#18181b] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm">
                    <div className="whitespace-pre-line text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                      {vehicle.descricao || 'Descrição indisponível.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="lg:w-1/3 w-full">
            <div className="bg-gray-50 dark:bg-[#18181b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60 sticky top-28 shadow-sm overflow-hidden">
              <div className="mb-6 w-full">
                <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Preço Fixo
                </span>
                <span className="block text-4xl lg:text-5xl font-bold text-ja-dark dark:text-white break-all">
                  {formatPrice(vehicle.preco)}
                </span>
              </div>

              <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-6"></div>

              <h4 className="text-xl font-bold text-ja-dark dark:text-white mb-3">
                Tem interesse nesta viatura?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                A nossa equipa de especialistas está pronta para esclarecer todas as suas dúvidas e agendar uma visita.
              </p>
              
              <Link 
                to="/contactos"
                state={{ scrollToForm: true, assunto: `Interesse: ${vehicle.marca} ${vehicle.modelo} (${vehicle.ano})` }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
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