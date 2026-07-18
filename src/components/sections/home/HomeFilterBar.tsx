import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const TRANSMISSOES = ['Automática', 'Manual'];
const COMBUSTIVEIS = ['Diesel', 'Eléctrico', 'Gasolina', 'Híbrido (Gasolina)', 'Híbrido Plug-in Gasolina'];

// Componente Interno do Dropdown
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
        // No telemóvel tem cor sólida para não confundir a leitura. No PC (lg:) ganha o efeito vidro flutuante.
        className={`w-full flex justify-between items-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[13px] sm:text-sm font-medium transition-all ${
          disabled 
            ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-800 lg:border-transparent' 
            : 'bg-white dark:bg-[#18181b] lg:bg-white/95 lg:dark:bg-black/70 lg:backdrop-blur-md text-gray-800 dark:text-gray-200 hover:ring-2 hover:ring-ja-blue/50 shadow-sm lg:shadow-lg border border-gray-200 dark:border-gray-800 lg:border-transparent'
        }`}
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#18181b] lg:bg-white/95 lg:dark:bg-[#1a1a1c]/95 lg:backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 flex flex-col">
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

export function HomeFilterBar() {
  const navigate = useNavigate();
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [transmissao, setTransmissao] = useState('');
  
  const [marcasAtivas, setMarcasAtivas] = useState<string[]>([]);
  const [modelosAtivos, setModelosAtivos] = useState<string[]>([]);

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

  const handleSearchClick = () => {
    navigate('/stand', { state: { marca, modelo, combustivel, transmissao } });
  };

  return (
    <div className="w-full max-w-7xl mx-auto relative z-20 transition-colors duration-500">
      {/* MÁGICA AQUI: grid-cols-2 no mobile (2 caixas lado a lado) e flex-row no PC */}
      <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="col-span-1 lg:flex-1"><InlineDropdown placeholder="Marca" value={marca} options={marcasAtivas} onChange={(val) => { setMarca(val); setModelo(''); }} /></div>
        <div className="col-span-1 lg:flex-1"><InlineDropdown placeholder="Modelo" value={modelo} options={modelosAtivos} onChange={setModelo} disabled={!marca} /></div>
        <div className="col-span-1 lg:flex-1"><InlineDropdown placeholder="Combustível" value={combustivel} options={COMBUSTIVEIS} onChange={setCombustivel} /></div>
        <div className="col-span-1 lg:flex-1"><InlineDropdown placeholder="Transmissão" value={transmissao} options={TRANSMISSOES} onChange={setTransmissao} /></div>
        
        <button onClick={handleSearchClick} className="col-span-2 lg:col-span-1 lg:w-auto flex items-center justify-center gap-2 bg-ja-blue text-white px-8 py-2.5 sm:py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md lg:shadow-xl font-semibold lg:backdrop-blur-md">
          <Search size={18} className="sm:w-5 sm:h-5" />
          <span className="lg:hidden">Procurar Viaturas</span>
        </button>
      </div>
    </div>
  );
}