import { useState, useEffect } from 'react';
import { UploadCloud, X, Loader2, Save, FileText, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Vehicle } from '../../types';

interface VehicleFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Vehicle | null;
}

type FormImage = { file?: File; url?: string };
type MarcaData = { id: string; nome: string; };
type ModeloData = { id: string; marca_id: string; nome: string; };

export function VehicleForm({ onCancel, onSuccess, initialData }: VehicleFormProps) {
  // ================= ESTADOS DE MARCAS E MODELOS =================
  const [marcasList, setMarcasList] = useState<MarcaData[]>([]);
  const [modelosList, setModelosList] = useState<ModeloData[]>([]);
  
  // Estados para os Inputs de Gestão (Adicionar Novo)
  const [newMarcaInput, setNewMarcaInput] = useState('');
  const [newModeloInput, setNewModeloInput] = useState('');

  // Carregar Marcas Iniciais
  useEffect(() => {
    async function loadMarcas() {
      const { data } = await supabase.from('marcas').select('*').order('nome');
      if (data) setMarcasList(data);
    }
    loadMarcas();
  }, []);

  const [marca, setMarca] = useState(initialData?.marca || '');
  const [modelo, setModelo] = useState(initialData?.modelo || '');
  
  // Carregar Modelos quando a Marca é selecionada
  useEffect(() => {
    async function fetchModelosDaMarca() {
      if (!marca || marca === 'MANAGE_MARCAS') {
        setModelosList([]);
        return;
      }
      const marcaObj = marcasList.find(m => m.nome === marca);
      if (marcaObj) {
        const { data } = await supabase.from('modelos').select('*').eq('marca_id', marcaObj.id).order('nome');
        if (data) setModelosList(data);
      }
    }
    fetchModelosDaMarca();
  }, [marca, marcasList]);

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMarca(e.target.value);
    setModelo(''); // Reseta o modelo
  };

  // ================= LÓGICA GESTÃO DE MARCAS INLINE =================
  const handleAddMarca = async () => {
    if (!newMarcaInput.trim()) return;
    const { data, error } = await supabase.from('marcas').insert([{ nome: newMarcaInput.trim() }]).select().single();
    if (error) alert('Erro ao adicionar. A marca já existe?');
    else if (data) {
      setMarcasList(prev => [...prev, data].sort((a,b) => a.nome.localeCompare(b.nome)));
      setNewMarcaInput('');
    }
  };

  const handleDeleteMarca = async (id: string) => {
    if (!window.confirm('Atenção: Apagar esta marca apagará todos os modelos associados a ela! Tem a certeza?')) return;
    await supabase.from('marcas').delete().eq('id', id);
    setMarcasList(prev => prev.filter(m => m.id !== id));
  };

  // ================= LÓGICA GESTÃO DE MODELOS INLINE =================
  const handleAddModelo = async () => {
    if (!newModeloInput.trim() || !marca) return;
    const marcaObj = marcasList.find(m => m.nome === marca);
    if (!marcaObj) return;
    const { data, error } = await supabase.from('modelos').insert([{ marca_id: marcaObj.id, nome: newModeloInput.trim() }]).select().single();
    if (error) alert('Erro ao adicionar. Este modelo já existe para esta marca?');
    else if (data) {
      setModelosList(prev => [...prev, data].sort((a,b) => a.nome.localeCompare(b.nome)));
      setNewModeloInput('');
    }
  };

  const handleDeleteModelo = async (id: string) => {
    if (!window.confirm('Apagar este modelo?')) return;
    await supabase.from('modelos').delete().eq('id', id);
    setModelosList(prev => prev.filter(m => m.id !== id));
  };

  // ================= RESTANTES ESTADOS DO FORMULÁRIO =================
  const [preco, setPreco] = useState(initialData?.preco?.toString() || '');
  const [ano, setAno] = useState(initialData?.ano?.toString() || '');
  const [estado, setEstado] = useState((initialData as any)?.estado || 'Novo');
  const [combustivel, setCombustivel] = useState(initialData?.combustivel || 'Diesel');
  const [transmissao, setTransmissao] = useState((initialData as any)?.transmissao || 'Manual');
  const [segmento, setSegmento] = useState((initialData as any)?.segmento || '');
  const [quilometros, setQuilometros] = useState(initialData?.quilometros?.toString() || '');
  const [motor, setMotor] = useState(initialData?.motor || '');
  const [versao, setVersao] = useState(initialData?.versao || '');
  const [garantia, setGarantia] = useState((initialData as any)?.garantia || '');
  
  const [emDestaque, setEmDestaque] = useState(initialData?.em_destaque ?? false);
  const [emStock, setEmStock] = useState(initialData?.em_stock ?? true);
  
  const [descricao, setDescricao] = useState((initialData as any)?.descricao || '');

  const [equipAudio, setEquipAudio] = useState(initialData?.equip_audio || '');
  const [equipConforto, setEquipConforto] = useState(initialData?.equip_conforto || '');
  const [equipDesempenho, setEquipDesempenho] = useState(initialData?.equip_desempenho || '');
  const [equipSeguranca, setEquipSeguranca] = useState(initialData?.equip_seguranca || '');
  const [equipTecnologia, setEquipTecnologia] = useState(initialData?.equip_tecnologia || '');

  const [fotoPerfil, setFotoPerfil] = useState<FormImage | null>(initialData?.fotos?.[0] ? { url: initialData.fotos[0] } : null);
  const [destaqueTop, setDestaqueTop] = useState<FormImage | null>(initialData?.fotos?.[1] ? { url: initialData.fotos[1] } : null);
  const [destaqueBottom, setDestaqueBottom] = useState<FormImage | null>(initialData?.fotos?.[2] ? { url: initialData.fotos[2] } : null);
  const [galeria, setGaleria] = useState<FormImage[]>(initialData?.fotos?.slice(3).map(url => ({ url })) || []);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const textoPadrao = `Viatura nacional em excelente estado de conservação.\n\n- Histórico completo de manutenção na marca;\n- Garantia de 18 meses por mútuo acordo;\n- Financiamento até 120 meses sem entrada inicial;\n- Aceitamos retomas mediante avaliação.\n\nA informação disponibilizada, ainda que precisa, não dispensa a sua confirmação, nem poderá ser considerada vinculativa.`;

  const handleColarTexto = () => setDescricao(textoPadrao);

  const handleSingleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<FormImage | null>>) => {
    if (e.target.files && e.target.files[0]) setter({ file: e.target.files[0] });
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
    
    // Validações Base
    if (marca === 'MANAGE_MARCAS' || modelo === 'MANAGE_MODELOS') {
      setError('Por favor feche os painéis de gestão e selecione uma marca/modelo válida.');
      return;
    }
    if (!fotoPerfil) { setError('A Foto de Perfil é obrigatória.'); return; }
    if (!marca || !modelo) { setError('Marca e Modelo são campos obrigatórios.'); return; }

    setLoading(true);
    setError('');

    try {
      const uploadSeNecessario = async (item: FormImage | null) => {
        if (!item) return null;
        if (item.url) return item.url;
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

      const imgPerfil = await uploadSeNecessario(fotoPerfil);
      const imgTop = await uploadSeNecessario(destaqueTop);
      const imgBottom = await uploadSeNecessario(destaqueBottom);
      
      const imgsGaleria = [];
      for (const item of galeria) {
        const url = await uploadSeNecessario(item);
        if (url) imgsGaleria.push(url);
      }

      const arrayFinalFotos = [imgPerfil, imgTop || 'placeholder', imgBottom || 'placeholder', ...imgsGaleria].filter(Boolean) as string[];
      const fotosLimpas = arrayFinalFotos.map(f => f === 'placeholder' ? '' : f);

      const vehicleData = {
        marca,
        modelo,
        preco: parseFloat(preco),
        ano: parseInt(ano),
        estado,
        combustivel,
        transmissao,
        segmento: segmento || null,
        quilometros: quilometros ? parseInt(quilometros) : null,
        motor: motor || null,
        versao: versao || null,
        garantia: garantia || null, 
        descricao: descricao || null,
        equip_audio: equipAudio || null,
        equip_conforto: equipConforto || null,
        equip_desempenho: equipDesempenho || null,
        equip_seguranca: equipSeguranca || null,
        equip_tecnologia: equipTecnologia || null,
        fotos: fotosLimpas,
        tags: [], // Passar vazio já que removemos as Tags
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

  const SingleUploadBox = ({ state, setter, label, format }: { state: FormImage | null, setter: any, label: string, format: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      {state ? (
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
          <img src={state.url || URL.createObjectURL(state.file!)} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <button type="button" onClick={() => setter(null)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"><X size={16} /></button>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800`}>
          <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 text-center px-4">{format}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSingleFile(e, setter)} />
        </label>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-ja-dark dark:text-white">{initialData ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</h2>
          <p className="text-gray-500 text-sm mt-1">Preencha os detalhes da viatura.</p>
        </div>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"><X size={24} /></button>
      </div>

      {error && <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Bloco 1: Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MARCA E GESTÃO DE MARCAS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Marca *</label>
            <select required value={marca} onChange={handleMarcaChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none">
              <option value="">Selecione uma marca...</option>
              {marcasList.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
              <option value="MANAGE_MARCAS" className="font-bold text-ja-blue">➕ Adicionar / Gerir Marcas...</option>
            </select>

            {/* Painel de Gestão de Marcas Inline */}
            {marca === 'MANAGE_MARCAS' && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="font-bold text-sm text-ja-dark dark:text-white">Gerir Marcas</h4>
                   <button type="button" onClick={() => setMarca('')} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 font-semibold"><X size={14}/> Fechar</button>
                 </div>
                 <div className="flex gap-2 mb-3">
                    <input 
                      type="text" placeholder="Nova Marca..." value={newMarcaInput} onChange={e => setNewMarcaInput(e.target.value)} 
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddMarca(); } }}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none text-ja-dark dark:text-white" 
                    />
                    <button type="button" onClick={handleAddMarca} className="bg-ja-dark dark:bg-gray-700 text-white p-2 rounded-lg hover:bg-ja-blue transition-colors"><Plus size={20}/></button>
                 </div>
                 <div className="max-h-32 overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-lg p-2 space-y-1 bg-white dark:bg-gray-900">
                    {marcasList.length === 0 ? <p className="text-xs text-center py-2 text-gray-500">Nenhuma marca criada.</p> : marcasList.map(m => (
                      <div key={m.id} className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
                        <span className="text-sm font-semibold text-ja-dark dark:text-white">{m.nome}</span>
                        <button type="button" onClick={() => handleDeleteMarca(m.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* MODELO E GESTÃO DE MODELOS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Modelo *</label>
            <select required disabled={!marca || marca === 'MANAGE_MARCAS'} value={modelo} onChange={e => setModelo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none disabled:opacity-50">
              <option value="">{marca && marca !== 'MANAGE_MARCAS' ? 'Selecione um modelo...' : 'Escolha a marca primeiro'}</option>
              {modelosList.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
              {marca && marca !== 'MANAGE_MARCAS' && <option value="MANAGE_MODELOS" className="font-bold text-ja-blue">➕ Adicionar / Gerir Modelos...</option>}
            </select>

            {/* Painel de Gestão de Modelos Inline */}
            {modelo === 'MANAGE_MODELOS' && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="font-bold text-sm text-ja-dark dark:text-white">Gerir Modelos para {marca}</h4>
                   <button type="button" onClick={() => setModelo('')} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 font-semibold"><X size={14}/> Fechar</button>
                 </div>
                 <div className="flex gap-2 mb-3">
                    <input 
                      type="text" placeholder="Novo Modelo..." value={newModeloInput} onChange={e => setNewModeloInput(e.target.value)} 
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddModelo(); } }}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none text-ja-dark dark:text-white" 
                    />
                    <button type="button" onClick={handleAddModelo} className="bg-ja-dark dark:bg-gray-700 text-white p-2 rounded-lg hover:bg-ja-blue transition-colors"><Plus size={20}/></button>
                 </div>
                 <div className="max-h-32 overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-lg p-2 space-y-1 bg-white dark:bg-gray-900">
                    {modelosList.length === 0 ? <p className="text-xs text-center py-2 text-gray-500">Nenhum modelo criado para esta marca.</p> : modelosList.map(m => (
                      <div key={m.id} className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
                        <span className="text-sm font-semibold text-ja-dark dark:text-white">{m.nome}</span>
                        <button type="button" onClick={() => handleDeleteModelo(m.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preço (€) *</label>
            <input type="number" required min="0" value={preco} onChange={e => setPreco(e.target.value)} placeholder="Ex: 32500" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ano *</label>
              <input type="number" required min="1900" max={new Date().getFullYear() + 1} value={ano} onChange={e => setAno(e.target.value)} placeholder="Ex: 2021" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quilómetros</label>
              <input type="number" min="0" value={quilometros} onChange={e => setQuilometros(e.target.value)} placeholder="Ex: 45000" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
            </div>
          </div>
        </div>

        {/* Bloco 2: Especificações Técnicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Segmento</label>
            <select value={segmento} onChange={e => setSegmento(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none">
              <option value="">Selecione...</option>
              <option value="Cabrio">Cabrio</option>
              <option value="Coupe">Coupe</option>
              <option value="Sedan">Sedan</option>
              <option value="Peq. Citadino">Peq. Citadino</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Combustível *</label>
            <select value={combustivel} onChange={e => setCombustivel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none">
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Híbrido (Gasolina)">Híbrido (Gasolina)</option>
              <option value="Híbrido Plug-in Gasolina">Híbrido Plug-in Gasolina</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Transmissão *</label>
            <select value={transmissao} onChange={e => setTransmissao(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none">
              <option value="Automática">Automática</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motor / CV</label>
            <input type="text" value={motor} onChange={e => setMotor(e.target.value)} placeholder="Ex: 116 cv" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
          </div>
        </div>

        {/* Linha Opcional com 3 colunas (Versão/Estado/Garantia) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Versão / Linha de Equipamento</label>
            <input type="text" value={versao} onChange={e => setVersao(e.target.value)} placeholder="Ex: AMG Line Auto" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estado da Viatura</label>
            <select value={estado} onChange={e => setEstado(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none">
              <option value="Novo">Novo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Garantia</label>
            <input type="text" value={garantia} onChange={e => setGarantia(e.target.value)} placeholder="Ex: 18 meses" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
          </div>
        </div>

        {/* Bloco de Equipamentos */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-ja-dark dark:text-white">Equipamentos (Separados por vírgula)</h3>
            <p className="text-xs text-gray-500">Ex: Bluetooth, Ecrã Tátil, Rádio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Áudio e Multimédia</label>
              <textarea value={equipAudio} onChange={e => setEquipAudio(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 text-sm outline-none text-ja-dark dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Conforto</label>
              <textarea value={equipConforto} onChange={e => setEquipConforto(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 text-sm outline-none text-ja-dark dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Desempenho</label>
              <textarea value={equipDesempenho} onChange={e => setEquipDesempenho(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 text-sm outline-none text-ja-dark dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Segurança</label>
              <textarea value={equipSeguranca} onChange={e => setEquipSeguranca(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 text-sm outline-none text-ja-dark dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tecnologia e Eletrónica</label>
              <textarea value={equipTecnologia} onChange={e => setEquipTecnologia(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 text-sm outline-none text-ja-dark dark:text-white" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Descrição da Viatura</label>
            <button type="button" onClick={handleColarTexto} className="flex items-center gap-1.5 text-xs font-bold text-ja-blue bg-ja-blue/10 hover:bg-ja-blue/20 px-3 py-1.5 rounded-lg">
              <FileText size={14} /> Colar Texto Padrão
            </button>
          </div>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={5} placeholder="Escreva a descrição livremente..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-ja-dark dark:text-white">Estrutura de Fotografias</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1 lg:border-r border-gray-100 dark:border-gray-800 lg:pr-8">
              <SingleUploadBox state={fotoPerfil} setter={setFotoPerfil} label="1. Foto de Perfil *" format="Listagem e Thumbnail" />
            </div>
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-1 flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">2. Galeria Principal</span>
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-ja-blue font-semibold hover:underline px-4 text-center">Adicionar Várias</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleFiles} />
                </label>
                {galeria.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {galeria.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                        <img src={img.url || URL.createObjectURL(img.file!)} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGaleriaItem(idx)} className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-1 grid grid-rows-2 gap-6">
                <SingleUploadBox state={destaqueTop} setter={setDestaqueTop} label="3. Destaque Superior" format="Opcional" />
                <SingleUploadBox state={destaqueBottom} setter={setDestaqueBottom} label="4. Destaque Inferior" format="Opcional" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={emDestaque} onChange={e => setEmDestaque(e.target.checked)} className="w-5 h-5 text-ja-blue cursor-pointer" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Destacar na Home Page</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={emStock} onChange={e => setEmStock(e.target.checked)} className="w-5 h-5 text-ja-blue cursor-pointer" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Em Stock</span></label>
        </div>

        <div className="pt-8 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue text-white px-8 py-3 rounded-xl font-semibold shadow-sm disabled:opacity-70">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} {loading ? 'A Guardar...' : (initialData ? 'Guardar' : 'Adicionar Veículo')}
          </button>
        </div>
      </form>
    </div>
  );
}