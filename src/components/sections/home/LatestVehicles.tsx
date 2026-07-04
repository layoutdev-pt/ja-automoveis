import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Clock } from 'lucide-react';
import { VehicleCard } from '../../ui/VehicleCard';
import { supabase } from '../../../lib/supabase';
import type { Vehicle } from '../../../types';

export function LatestVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestVehicles() {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('em_stock', true)
          // Ordenar pela data de criação, do mais recente para o mais antigo
          .order('created_at', { ascending: false })
          // Limitar a 6 para criar uma grelha perfeita de 3 colunas
          .limit(6);

        if (error) throw error;
        setVehicles(data || []);
      } catch (error) {
        console.error('Erro ao buscar as últimas entradas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestVehicles();
  }, []);

  return (
    // Fundo branco no modo claro e um tom de cinza diferente no escuro para criar contraste com a secção anterior
    <section className="py-24 bg-white dark:bg-[#121212] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Secção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-ja-blue font-bold mb-3 uppercase tracking-wider text-sm">
              <Clock size={18} />
              Novidades
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-4 transition-colors duration-500">
              Últimas Entradas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl transition-colors duration-500">
              As viaturas mais recentes a chegar ao nosso stand. Não perca a oportunidade de encontrar o carro ideal antes de todos.
            </p>
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
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-500">
              Não existem viaturas adicionadas recentemente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Botão Mobile */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link 
            to="/stand" 
            className="flex items-center gap-2 bg-ja-dark dark:bg-white text-white dark:text-ja-dark px-8 py-4 rounded-full font-medium hover:bg-ja-blue dark:hover:bg-ja-blue dark:hover:text-white transition-colors w-full justify-center shadow-lg"
          >
            Ver todo o stand
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  );
}