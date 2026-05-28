import { useState } from 'react';
import { UploadCloud, X, Loader2, Save, FileText, ImagePlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Vehicle } from '../../types';

interface VehicleFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Vehicle | null;
}

// Tipo auxiliar para gerir imagens antigas vs novas nos estados locais
type FormImage = { file?: File; url?: string };

export function VehicleForm({ onCancel, onSuccess, initialData }: VehicleFormProps) {
  const [marca, setMarca] = useState(initialData?.marca || '');
  const [modelo, setModelo] = useState(initialData?.modelo || '');
  const [preco, setPreco] = useState(initialData?.preco?.toString() || '');
  const [ano, setAno] = useState(initialData?.ano?.toString() || '');
  
  // NOVO: Estado para "Novo" ou "Usado" (padrão: Novo)
  const [estado, setEstado] = useState((initialData as any)?.estado || 'Novo');
  
  const [combustivel, setCombustivel] = useState(initialData?.combustivel || 'Gasóleo');
  const [motor, setMotor] = useState(initialData?.motor || '');
  const [versao, setVersao] = useState(initialData?.versao || '');
  const [emDestaque, setEmDestaque] = useState(initialData?.em_destaque ?? false);
  const [emStock, setEmStock] = useState(initialData?.em_stock ?? true);
  
  const [descricao, setDescricao] = useState((initialData as any)?.descricao || '');

  // Lógica Divisória de Imagens (Index 0: Perfil, 1: Destaque Top, 2: Destaque Bottom, 3+: Galeria)
  const [fotoPerfil, setFotoPerfil] = useState<FormImage | null>(initialData?.fotos?.[0] ? { url: initialData.fotos[0] } : null);
  const [destaqueTop, setDestaqueTop] = useState<FormImage | null>(initialData?.fotos?.[1] ? { url: initialData.fotos[1] } : null);
  const [destaqueBottom, setDestaqueBottom] = useState<FormImage | null>(initialData?.fotos?.[2] ? { url: initialData.fotos[2] } : null);
  const [galeria, setGaleria] = useState<FormImage[]>(initialData?.fotos?.slice(3).map(url => ({ url })) || []);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Template da Descrição
  const textoPadrao = `Viatura nacional em excelente estado de conservação.\n\n- Histórico completo de manutenção na marca;\n- Garantia de 18 meses por mútuo acordo;\n- Financiamento até 120 meses sem entrada inicial;\n- Aceitamos retomas mediante avaliação.\n\nA informação disponibilizada, ainda que precisa, não dispensa a sua confirmação, nem poderá ser considerada vinculativa.`;

  const handleColarTexto = () => {
    setDescricao(textoPadrao);
  };

  // Handlers para os Inputs de Arquivos
  const handleSingleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<FormImage | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter({ file: e.target.files[0] });
    }
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ file: f }));
      setGaleria(prev => [...prev, ...newFiles]);
    }
  };

  const removeGaleriaItem = (indexToRemove: number) => {
    setGaleria(galeria.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificamos pelo menos a foto de perfil
    if (!fotoPerfil) {
      setError('A Foto de Perfil é obrigatória.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Função auxiliar para fazer o upload se for um ficheiro novo
      const uploadSeNecessario = async (item: FormImage | null) => {
        if (!item) return null;
        if (item.url) return item.url; // Já estava na BD
        if (item.file) {
          const ext = item.file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${ext}`;
          const { error } = await supabase.storage.from('vehicle_images').upload(fileName, item.file);
          if (error) throw error;
          const { data } = supabase.storage.from('vehicle_images').getPublicUrl(fileName);
          return data.publicUrl;
        }
        return null;
      };

      // 1. Processar todas as imagens na ordem correta
      const imgPerfil = await uploadSeNecessario(fotoPerfil);
      const imgTop = await uploadSeNecessario(destaqueTop);
      const imgBottom = await uploadSeNecessario(destaqueBottom);
      
      const imgsGaleria = [];
      for (const item of galeria) {
        const url = await uploadSeNecessario(item);
        if (url) imgsGaleria.push(url);
      }

      // Constrói o array final
      const arrayFinalFotos = [
        imgPerfil,
        imgTop || 'placeholder', 
        imgBottom || 'placeholder',
        ...imgsGaleria
      ].filter(Boolean) as string[];

      // Remove placeholders
      const fotosLimpas = arrayFinalFotos.map(f => f === 'placeholder' ? '' : f);

      // 2. Os dados a guardar
      const vehicleData = {
        marca,
        modelo,
        preco: parseFloat(preco),
        ano: parseInt(ano),
        estado, // Guardar o estado (Novo/Usado)
        combustivel,
        motor: motor || null,
        versao: versao || null,
        descricao: descricao || null,
        fotos: fotosLimpas,
        em_destaque: emDestaque,
        em_stock: emStock
      };

      if (initialData) {
        const { error: updateError } = await supabase.from('vehicles').update(vehicleData).eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('vehicles').insert([vehicleData]);
        if (insertError) throw insertError;
      }

      onSuccess();

    } catch (err: any) {
      console.error('Erro ao guardar veículo:', err);
      setError('Ocorreu um erro ao guardar o veículo. Verifique a sua ligação.');
    } finally {
      setLoading(false);
    }
  };

  // Componente visual para caixas de upload individuais
  const SingleUploadBox = ({ state, setter, label, format }: { state: FormImage | null, setter: any, label: string, format: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-500">{label}</span>
      {state ? (
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group transition-colors duration-500">
          <img src={state.url || URL.createObjectURL(state.file!)} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={() => setter(null)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-500`}>
          <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">{format}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSingleFile(e, setter)} />
        </label>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
      
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors duration-500">
        <div>
          <h2 className="text-2xl font-bold text-ja-dark dark:text-white transition-colors duration-500">
            {initialData ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-500">Preencha os detalhes, a descrição e organize as fotografias.</p>
        </div>
        <button onClick={onCancel} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors duration-300">
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800/50 transition-colors duration-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Bloco 1: Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Marca *</label>
            <input type="text" required value={marca} onChange={e => setMarca(e.target.value)} placeholder="Ex: Mercedes-Benz" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Modelo *</label>
            <input type="text" required value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Classe A" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Preço (€) *</label>
            <input type="number" required min="0" value={preco} onChange={e => setPreco(e.target.value)} placeholder="Ex: 32500" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Ano *</label>
            <input type="number" required min="1900" max={new Date().getFullYear() + 1} value={ano} onChange={e => setAno(e.target.value)} placeholder="Ex: 2021" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500" />
          </div>
        </div>

        {/* Bloco 2: Especificações Técnicas (Agora com o Estado da Viatura e grid-cols-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Estado *</label>
            <select value={estado} onChange={e => setEstado(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white transition-colors duration-500">
              <option value="Novo">Novo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Combustível *</label>
            <select value={combustivel} onChange={e => setCombustivel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white transition-colors duration-500">
              <option value="Gasóleo">Gasóleo</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Elétrico">Elétrico</option>
              <option value="Híbrido">Híbrido</option>
              <option value="GPL">GPL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Motor</label>
            <input type="text" value={motor} onChange={e => setMotor(e.target.value)} placeholder="Ex: 1.5 - 116 CV" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Versão / Linha</label>
            <input type="text" value={versao} onChange={e => setVersao(e.target.value)} placeholder="Ex: AMG Line" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500" />
          </div>
        </div>

        {/* Bloco de Descrição com Texto Padrão */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-500">
              Descrição da Viatura
            </label>
            <button
              type="button"
              onClick={handleColarTexto}
              className="flex items-center gap-1.5 text-xs font-bold text-ja-blue bg-ja-blue/10 hover:bg-ja-blue/20 dark:bg-ja-blue/20 dark:hover:bg-ja-blue/30 px-3 py-1.5 rounded-lg transition-colors duration-300"
            >
              <FileText size={14} />
              Colar Texto Padrão
            </button>
          </div>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={5}
            placeholder="Escreva a descrição livremente..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-y transition-colors duration-500"
          />
        </div>

        {/* Layout de Mosaico de Imagens */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-ja-dark dark:text-white transition-colors duration-500">Estrutura de Fotografias</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">Defina o mosaico que será apresentado na página de detalhes deste veículo.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Foto de Perfil */}
            <div className="col-span-1 border-r-0 lg:border-r border-gray-100 dark:border-gray-800 lg:pr-8 transition-colors duration-500">
              <SingleUploadBox state={fotoPerfil} setter={setFotoPerfil} label="1. Foto de Perfil *" format="Listagem e Thumbnail" />
            </div>

            {/* Configuração do Mosaico (Lado Direito) */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Modal 1: Galeria Múltipla */}
              <div className="col-span-1 flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-500">2. Galeria Principal (Modal Maior)</span>
                
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-500">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-4 font-semibold text-ja-blue hover:underline">
                    Adicionar Várias Imagens
                  </span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleFiles} />
                </label>

                {/* Lista das Múltiplas */}
                {galeria.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {galeria.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group transition-colors duration-500">
                        <img src={img.url || URL.createObjectURL(img.file!)} alt={`Galeria ${idx}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGaleriaItem(idx)} className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modais Laterais 2 e 3 */}
              <div className="col-span-1 grid grid-rows-2 gap-6">
                <SingleUploadBox state={destaqueTop} setter={setDestaqueTop} label="3. Destaque Superior (Modal 2)" format="Foto Horizontal Única" />
                <SingleUploadBox state={destaqueBottom} setter={setDestaqueBottom} label="4. Destaque Inferior (Modal 3)" format="Foto Horizontal Única" />
              </div>

            </div>
          </div>
        </div>

        {/* Bloco 4: Estado e Visibilidade */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-8 transition-colors duration-500">
          <label className="relative flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={emDestaque} onChange={e => setEmDestaque(e.target.checked)} className="w-5 h-5 text-ja-blue border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded focus:ring-ja-blue cursor-pointer transition-colors duration-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-500">Destacar na Home Page?</span>
          </label>
          
          <label className="relative flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={emStock} onChange={e => setEmStock(e.target.checked)} className="w-5 h-5 text-ja-blue border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded focus:ring-ja-blue cursor-pointer transition-colors duration-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-500">Veículo Disponível em Stock?</span>
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="pt-8 flex items-center justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue dark:hover:bg-ja-blue text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-sm disabled:opacity-70">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {loading ? 'A Guardar...' : (initialData ? 'Guardar Alterações' : 'Adicionar Veículo')}
          </button>
        </div>
      </form>
    </div>
  );
}