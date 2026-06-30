import { Link } from 'react-router-dom';
import { CalendarDays, Gauge, Fuel, Settings2, Zap } from 'lucide-react';
import type { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Formatação para colocar espaço nos quilómetros (ex: 158 500 km)
  const formatKm = (km?: number) => {
    if (km === undefined || km === null) return null;
    return new Intl.NumberFormat('pt-PT').format(km).replace(',', ' ') + ' km';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col group p-4">
      
      {/* Imagem do Veículo */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 transition-colors duration-500">
        <img 
          src={vehicle.fotos[0]} 
          alt={`${vehicle.marca} ${vehicle.modelo}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {vehicle.em_destaque && (
          <span className="absolute top-3 right-3 bg-ja-blue/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
            Destaque
          </span>
        )}
      </div>

      {/* Condição (Usado/Novo) escondida visualmente mas presente para manter estrutura, 
          ou podes removê-la se preferires focar apenas nos badges. Mantive para coerência. */}
      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-500">
        <span>{(vehicle as any).estado || 'Usado'}</span>
      </div>

      {/* Título e Versão */}
      <h3 className="text-lg font-bold text-ja-dark dark:text-white leading-tight mb-1 line-clamp-1 transition-colors duration-500">
        {vehicle.marca} {vehicle.modelo}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1 transition-colors duration-500">
        {vehicle.versao}
      </p>

      {/* Tags Personalizadas (Nacional, Garantia, etc) */}
      {vehicle.tags && vehicle.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 transition-colors duration-500">
          {vehicle.tags.map(tag => (
            <span key={tag} className="bg-ja-blue/10 dark:bg-ja-blue/20 text-ja-blue dark:text-blue-400 border border-ja-blue/20 dark:border-ja-blue/30 text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full transition-colors">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Detalhes Extra em Badges (Estilo Premium) */}
      <div className="flex flex-wrap gap-2 mb-6">
        
        {/* Ano */}
        <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#18181b] border border-gray-100 dark:border-transparent px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 transition-colors duration-500">
          <CalendarDays size={12} className="opacity-70" />
          {/* Mostra Mês/Ano se existir o mês, senão mostra só o Ano */}
          {(vehicle as any).mes ? `${(vehicle as any).mes}/${vehicle.ano}` : vehicle.ano}
        </span>

        {/* Quilómetros */}
        {vehicle.quilometros !== undefined && (
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#18181b] border border-gray-100 dark:border-transparent px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 transition-colors duration-500">
            <Gauge size={12} className="opacity-70" />
            {formatKm(vehicle.quilometros)}
          </span>
        )}

        {/* Combustível */}
        {vehicle.combustivel && (
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#18181b] border border-gray-100 dark:border-transparent px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 transition-colors duration-500">
            <Fuel size={12} className="opacity-70" />
            {vehicle.combustivel}
          </span>
        )}

        {/* Transmissão */}
        {(vehicle as any).transmissao && (
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#18181b] border border-gray-100 dark:border-transparent px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 transition-colors duration-500">
            <Settings2 size={12} className="opacity-70" />
            {(vehicle as any).transmissao}
          </span>
        )}

        {/* Potência/Motor (cv) */}
        {vehicle.motor && (
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#18181b] border border-gray-100 dark:border-transparent px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 transition-colors duration-500">
            <Zap size={12} className="opacity-70" />
            {vehicle.motor}
          </span>
        )}

      </div>

      {/* Seção Inferior: Garantia, Preço e Botão */}
      <div className="mt-auto">
        
        {/* Linha de separação e Garantia (Conforme Imagem) */}
        <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4 mb-4 transition-colors duration-500">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Garantia: <span className="text-teal-600 dark:text-teal-400">18 meses</span>
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-ja-dark dark:text-white transition-colors duration-500">
            {formatPrice(vehicle.preco)}
          </div>
        </div>

        <Link 
          to={`/stand/${vehicle.id}`} 
          className="block w-full text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-ja-dark dark:text-white font-semibold py-3 rounded-xl transition-colors duration-300 text-sm shadow-sm"
        >
          Ver Detalhes
        </Link>
      </div>
      
    </div>
  );
}