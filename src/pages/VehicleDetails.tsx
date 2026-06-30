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
  
  // Estado para controlar as Abas (Tabs)
  const [activeTab, setActiveTab] = useState<'equipamento' | 'descricao'>('equipamento');

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

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 size={40} className="text-ja-blue animate-spin" /></div>;
  if (!vehicle) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><h2 className="text-2xl font-bold">Viatura não encontrada</h2><Link to="/stand" className="text-ja-blue mt-4">Voltar ao Inventário</Link></div>;

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

  const fotoPerfil = vehicle.fotos[0];
  const destaqueTop = vehicle.fotos[1] || fotoPerfil; 
  const destaqueBottom = vehicle.fotos[2] || fotoPerfil; 
  const galeriaRaw = vehicle.fotos.slice(3).filter(f => f !== '');
  const galeria = galeriaRaw.length > 0 ? galeriaRaw : [fotoPerfil]; 

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galeria.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galeria.length) % galeria.length);

  // Função auxiliar para renderizar os blocos de equipamento a partir de texto com vírgulas
  const renderEquipList = (title: string, dataString?: string) => {
    if (!dataString) return null;
    const items = dataString.split(',').map(item => item.trim()).filter(item => item.length > 0);
    if (items.length === 0) return null;

    return (
      <div className="bg-gray-50 dark:bg-[#18181b] rounded-2xl p-6 md:p-8 mb-6 border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors duration-500">
        <h4 className="text-xl font-bold text-ja-dark dark:text-white mb-6">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white font-bold" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/stand" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-dark dark:hover:text-white mb-8 transition-colors duration-500">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Inventário
        </Link>

        {/* GALERIA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
          <div className="lg:col-span-2 relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group shadow-sm border border-gray-200/50 dark:border-gray-800">
            <img src={galeria[currentSlide]} alt="galeria" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
            {galeria.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
                <div className="absolute top-6 right-6 z-20 bg-black/40 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md">{currentSlide + 1} / {galeria.length}</div>
                <div className="absolute bottom-6 left-6 z-20 flex gap-3 p-2 bg-black/40 backdrop-blur-md rounded-2xl">
                  {galeria.slice(0, 4).map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-20 h-14 rounded-xl overflow-hidden border-2 ${currentSlide === idx ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}><img src={img} className="w-full h-full object-cover" /></button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="hidden lg:flex flex-col gap-4 h-[500px]">
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900"><img src={destaqueTop} className="absolute inset-0 w-full h-full object-cover" /></div>
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900"><img src={destaqueBottom} className="absolute inset-0 w-full h-full object-cover" /></div>
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

            {/* ESPECIFICAÇÕES CHAVE - Design Clean inspirado na imagem */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-ja-dark dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                Especificações Chave
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <div>
                  <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1">Ano</span>
                  <span className="font-bold text-lg text-ja-dark dark:text-white">{vehicle.ano}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1">Combustível</span>
                  <span className="font-bold text-lg text-ja-dark dark:text-white">{vehicle.combustivel}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1">Motor</span>
                  <span className="font-bold text-lg text-ja-dark dark:text-white">{vehicle.motor || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1">Estado</span>
                  <span className="font-bold text-lg text-ja-dark dark:text-white">{(vehicle as any).estado || 'Usado'}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400 dark:text-gray-500 mb-1">Disponibilidade</span>
                  <span className="font-bold text-lg text-emerald-500 flex items-center gap-1">
                    {vehicle.em_stock ? <><Check size={18} /> Em Stock</> : <span className="text-gray-500">Vendido</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* SISTEMA DE ABAS (TABS) */}
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

              {/* CONTEÚDO DAS ABAS */}
              {activeTab === 'equipamento' && (
                <div className="animate-in fade-in duration-500">
                  {(!vehicle.equip_audio && !vehicle.equip_conforto && !vehicle.equip_desempenho && !vehicle.equip_seguranca && !vehicle.equip_tecnologia) ? (
                    <p className="text-gray-500 italic">Detalhes de equipamento não especificados para esta viatura.</p>
                  ) : (
                    <>
                      {renderEquipList("Áudio e Multimédia", vehicle.equip_audio)}
                      {renderEquipList("Conforto", vehicle.equip_conforto)}
                      {renderEquipList("Desempenho", vehicle.equip_desempenho)}
                      {renderEquipList("Segurança", vehicle.equip_seguranca)}
                      {renderEquipList("Tecnologia e Eletrónica", vehicle.equip_tecnologia)}
                    </>
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

          {/* CAIXA LATERAL DE PREÇO E CONTACTO */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-gray-50 dark:bg-[#18181b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60 sticky top-28 shadow-sm">
              <div className="mb-6">
                <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Preço Fixo
                </span>
                <span className="text-4xl lg:text-5xl font-bold text-ja-dark dark:text-white">
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