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
        // Atualizado para um efeito "vidro" (translucido) para encaixar melhor no vídeo
        className={`w-full flex justify-between items-center py-3 px-4 rounded-xl text-sm font-medium transition-all backdrop-blur-md ${
          disabled 
            ? 'bg-white/40 dark:bg-black/40 text-gray-500 cursor-not-allowed' 
            : 'bg-white/95 dark:bg-black/70 text-gray-800 dark:text-gray-200 hover:ring-2 hover:ring-ja-blue/50 shadow-lg'
        }`}
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-[#1a1a1c]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1 flex flex-col">
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
    // Removidas as margens, bordas e fundo sólido. Agora o container é totalmente transparente.
    <div className="w-full max-w-7xl mx-auto relative z-20 transition-colors duration-500">
      <div className="flex flex-col lg:flex-row items-center gap-3 md:gap-4">
        <InlineDropdown placeholder="Marca" value={marca} options={marcasAtivas} onChange={(val) => { setMarca(val); setModelo(''); }} />
        <InlineDropdown placeholder="Modelo" value={modelo} options={modelosAtivos} onChange={setModelo} disabled={!marca} />
        <InlineDropdown placeholder="Combustível" value={combustivel} options={COMBUSTIVEIS} onChange={setCombustivel} />
        <InlineDropdown placeholder="Transmissão" value={transmissao} options={TRANSMISSOES} onChange={setTransmissao} />
        
        <button onClick={handleSearchClick} className="w-full lg:w-auto flex items-center justify-center gap-2 bg-ja-blue text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-xl font-semibold backdrop-blur-md">
          <Search size={20} />
          <span className="lg:hidden">Procurar</span>
        </button>
      </div>
    </div>
  );
}