import { Link } from 'react-router-dom';
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

  return (
    // Fundo do cartão muda para um cinza escuro, com as bordas a adaptarem-se
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col group p-4">
      
      {/* Imagem do Veículo com cantos arredondados internos */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 transition-colors duration-500">
        <img 
          src={vehicle.fotos[0]} 
          alt={`${vehicle.marca} ${vehicle.modelo}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {vehicle.em_destaque && (
          <span className="absolute top-3 right-3 bg-ja-blue/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Destaque
          </span>
        )}
      </div>

      {/* Ano e Condição */}
      <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-500">
        <span>{(vehicle as any).estado || 'Usado'}</span>
        <span>{vehicle.ano}</span>
      </div>

      {/* Título */}
      <h3 className="text-lg font-bold text-ja-dark dark:text-white leading-tight mb-1 line-clamp-1 transition-colors duration-500">
        {vehicle.marca} {vehicle.modelo}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1 transition-colors duration-500">
        {vehicle.versao}
      </p>

      {/* Detalhes com separadores de ponto */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium flex flex-wrap items-center gap-1.5 transition-colors duration-500">
        {vehicle.motor && (
          <>
            <span>{vehicle.motor}</span>
            <span>•</span>
          </>
        )}
        <span>{vehicle.combustivel}</span>
      </div>

      {/* Preço e Botão */}
      <div className="mt-auto">
        <div className="text-xl font-bold text-ja-dark dark:text-white mb-4 transition-colors duration-500">
          {formatPrice(vehicle.preco)}
        </div>
        <Link 
          to={`/stand/${vehicle.id}`} 
          // O botão de "Ver Detalhes" adapta a sua cor de fundo e hover para o modo escuro
          className="block w-full text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-ja-dark dark:text-white font-semibold py-3 rounded-xl transition-colors duration-300 text-sm"
        >
          Ver Detalhes
        </Link>
      </div>
      
    </div>
  );
}