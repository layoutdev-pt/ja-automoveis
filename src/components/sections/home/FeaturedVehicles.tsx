import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Star, Clock } from 'lucide-react';
import { VehicleCard } from '../../ui/VehicleCard';
import { supabase } from '../../../lib/supabase';
import type { Vehicle } from '../../../types';

export function FeaturedVehicles() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [latestVehicles, setLatestVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar que aba está ativa
  const [activeTab, setActiveTab] = useState<'destaques' | 'novidades'>('destaques');

  useEffect(() => {
    async function fetchVehicles() {
      try {
        // Pedimos as duas listas ao mesmo tempo para ser super rápido
        const [featuredResponse, latestResponse] = await Promise.all([
          // Pedido 1: Apenas os que têm a estrela de destaque
          supabase
            .from('vehicles')
            .select('*')
            .eq('em_destaque', true)
            .eq('em_stock', true)
            .order('created_at', { ascending: false })
            .limit(6),
            
          // Pedido 2: Os 6 últimos a serem adicionados ao sistema (independentemente do destaque)
          supabase
            .from('vehicles')
            .select('*')
            .eq('em_stock', true)
            .order('created_at', { ascending: false })
            .limit(6)
        ]);

        if (featuredResponse.error) throw featuredResponse.error;
        if (latestResponse.error) throw latestResponse.error;

        setFeaturedVehicles(featuredResponse.data || []);
        setLatestVehicles(latestResponse.data || []);
        
      } catch (error) {
        console.error('Erro ao buscar veículos para a Home:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  // Determinar qual a lista a mostrar consoante a aba selecionada
  const displayVehicles = activeTab === 'destaques' ? featuredVehicles : latestVehicles;

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Secção com os Separadores (Tabs) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-4 transition-colors duration-500">
              Descubra a Nossa Seleção
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl transition-colors duration-500 mb-8">
              Garantimos qualidade, transparência e as melhores condições para o seu próximo negócio. Escolha o que deseja explorar primeiro.
            </p>

            {/* Separadores Estilizados (Destaques vs Novidades) */}
            <div className="inline-flex p-1.5 bg-gray-200/50 dark:bg-gray-900 rounded-2xl transition-colors duration-500">
              <button
                onClick={() => setActiveTab('destaques')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'destaques'
                    ? 'bg-white dark:bg-gray-800 text-ja-dark dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-ja-dark dark:hover:text-gray-200'
                }`}
              >
                <Star size={16} className={activeTab === 'destaques' ? 'text-yellow-500' : ''} />
                Em Destaque
              </button>
              <button
                onClick={() => setActiveTab('novidades')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'novidades'
                    ? 'bg-white dark:bg-gray-800 text-ja-dark dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-ja-dark dark:hover:text-gray-200'
                }`}
              >
                <Clock size={16} className={activeTab === 'novidades' ? 'text-ja-blue' : ''} />
                Últimas Entradas
              </button>
            </div>
          </div>
          
          <Link 
            to="/stand" 
            className="hidden md:flex items-center gap-2 text-ja-blue font-semibold hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
          >
            Ver todo o stand
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Grelha de Veículos ou Estado de Carregamento */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-ja-blue animate-spin" />
          </div>
        ) : displayVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-500">
              {activeTab === 'destaques' 
                ? 'Nenhum veículo em destaque no momento.' 
                : 'Não existem veículos adicionados recentemente.'}
            </p>
          </div>
        ) : (
          // Usar chave baseada na aba para forçar uma pequena re-renderização natural na troca
          <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {displayVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Botão Mobile */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link 
            to="/stand" 
            className="flex items-center gap-2 bg-ja-dark dark:bg-white text-white dark:text-ja-dark px-8 py-4 rounded-full font-medium hover:bg-ja-blue dark:hover:bg-ja-blue dark:hover:text-white transition-colors w-full justify-center"
          >
            Ver todo o stand
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  );
}