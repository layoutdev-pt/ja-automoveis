import { useState, useEffect, useRef } from 'react';
import { UploadCloud, X, Loader2, Save, FileText, ImagePlus, Plus, Trash2, Camera, RotateCcw, Move, Video } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Vehicle } from '../../types';

interface VehicleFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Vehicle | null;
}

// ================= TIPOS DE DADOS NÃO DESTRUTIVOS =================
type ImageMeta = { zoom: number; rotation: number; panX: number; panY: number; masterUrl?: string };
type FormImage = {
  masterFile?: File;    // Ficheiro original selecionado (Master)
  masterUrl?: string;   // URL do original guardado
  cropBlob?: Blob;      // Novo recorte gerado (Crop)
  cropUrl?: string;     // URL do recorte guardado (Front-end usa este)
  meta?: ImageMeta;     // Registo de metadados
  isVideo?: boolean;    // Flag para identificar se é um vídeo
};

type MarcaData = { id: string; nome: string; };
type ModeloData = { id: string; marca_id: string; nome: string; };

// ================= COMPONENTE DE CHIPS (SUPABASE) =================
function EquipmentSection({ title, categoria, selected, setSelected }: { 
  title: string, categoria: string, selected: string[], setSelected: (val: string[]) => void 
}) {
  const [dbOptions, setDbOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    async function loadDbOptions() {
      const { data } = await supabase.from('equipamentos').select('nome').eq('categoria', categoria);
      if (data) setDbOptions(data.map((item: any) => item.nome));
    }
    loadDbOptions();
  }, [categoria]);

  const allOptions = Array.from(new Set([...dbOptions, ...selected]));

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) setSelected(selected.filter(o => o !== opt));
    else setSelected([...selected, opt]);
  };

  const handleAdd = async () => {
    if (!inputValue.trim()) return;
    const newOpt = inputValue.trim();
    
    if (!dbOptions.includes(newOpt)) {
      await supabase.from('equipamentos').insert([{ nome: newOpt, categoria }]);
      setDbOptions([...dbOptions, newOpt]);
    }
    
    if (!selected.includes(newOpt)) setSelected([...selected, newOpt]);
    setInputValue('');
  };

  const removeGlobalOption = async (e: React.MouseEvent, opt: string) => {
    e.stopPropagation();
    if (!window.confirm(`Tem a certeza que deseja apagar a opção "${opt}" do sistema global?`)) return;

    await supabase.from('equipamentos').delete().eq('nome', opt).eq('categoria', categoria);
    setDbOptions(dbOptions.filter(o => o !== opt));
    setSelected(selected.filter(o => o !== opt));
  };

  return (
    <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</label>
        <span className="text-xs font-bold bg-ja-blue/10 text-ja-blue dark:text-blue-400 px-3 py-1 rounded-full border border-ja-blue/20">
          {selected.length} selecionado(s)
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {allOptions.length === 0 && (
          <span className="text-xs text-gray-400 italic">Sem opções criadas. Digite abaixo para adicionar.</span>
        )}
        
        {allOptions.map(opt => {
          const isActive = selected.includes(opt);
          return (
            <button 
              key={opt} 
              type="button" 
              onClick={() => toggleOption(opt)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-ja-blue text-white shadow-md shadow-ja-blue/20 scale-105' 
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-ja-blue/50 hover:text-ja-blue'
              }`}
            >
              {opt}
              {isActive && <X size={14} className="ml-1 opacity-80 hover:opacity-100" />}
              
              {!isActive && (
                <div 
                  onClick={(e) => removeGlobalOption(e, opt)}
                  className="ml-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Apagar da base de dados global"
                >
                  <Trash2 size={14} />
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      <div className="flex gap-2 mt-2">
        <input 
          type="text" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAdd(); } }} 
          placeholder="Adicionar e gravar nova opção..." 
          className="flex-1 px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none text-ja-dark dark:text-white focus:ring-2 focus:ring-ja-blue/20" 
        />
        <button type="button" onClick={handleAdd} className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-ja-blue transition-colors flex items-center justify-center">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

export function VehicleForm({ onCancel, onSuccess, initialData }: VehicleFormProps) {
  const [marcasList, setMarcasList] = useState<MarcaData[]>([]);
  const [modelosList, setModelosList] = useState<ModeloData[]>([]);
  
  const [newMarcaInput, setNewMarcaInput] = useState('');
  const [newModeloInput, setNewModeloInput] = useState('');

  useEffect(() => {
    async function loadMarcas() {
      const { data } = await supabase.from('marcas').select('*').order('nome');
      if (data) setMarcasList(data);
    }
    loadMarcas();
  }, []);

  const [marca, setMarca] = useState(initialData?.marca || '');
  const [modelo, setModelo] = useState(initialData?.modelo || '');
  
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

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setMarca(e.target.value); setModelo(''); };

  const handleAddMarca = async () => {
    if (!newMarcaInput.trim()) return;
    const { data, error } = await supabase.from('marcas').insert([{ nome: newMarcaInput.trim() }]).select().single();
    if (error) alert('Erro ao adicionar. A marca já existe?');
    else if (data) { setMarcasList(prev => [...prev, data].sort((a,b) => a.nome.localeCompare(b.nome))); setNewMarcaInput(''); }
  };

  const handleDeleteMarca = async (id: string) => {
    if (!window.confirm('Atenção: Apagar esta marca apagará todos os modelos associados a ela! Tem a certeza?')) return;
    await supabase.from('marcas').delete().eq('id', id);
    setMarcasList(prev => prev.filter(m => m.id !== id));
  };

  const handleAddModelo = async () => {
    if (!newModeloInput.trim() || !marca) return;
    const marcaObj = marcasList.find(m => m.nome === marca);
    if (!marcaObj) return;
    const { data, error } = await supabase.from('modelos').insert([{ marca_id: marcaObj.id, nome: newModeloInput.trim() }]).select().single();
    if (error) alert('Erro ao adicionar. Este modelo já existe para esta marca?');
    else if (data) { setModelosList(prev => [...prev, data].sort((a,b) => a.nome.localeCompare(b.nome))); setNewModeloInput(''); }
  };

  const handleDeleteModelo = async (id: string) => {
    if (!window.confirm('Apagar este modelo?')) return;
    await supabase.from('modelos').delete().eq('id', id);
    setModelosList(prev => prev.filter(m => m.id !== id));
  };

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

  const [equipAudio, setEquipAudio] = useState<string[]>(initialData?.equip_audio ? initialData.equip_audio.split(', ') : []);
  const [equipConforto, setEquipConforto] = useState<string[]>(initialData?.equip_conforto ? initialData.equip_conforto.split(', ') : []);
  const [equipDesempenho, setEquipDesempenho] = useState<string[]>(initialData?.equip_desempenho ? initialData.equip_desempenho.split(', ') : []);
  const [equipSeguranca, setEquipSeguranca] = useState<string[]>(initialData?.equip_seguranca ? initialData.equip_seguranca.split(', ') : []);
  const [equipTecnologia, setEquipTecnologia] = useState<string[]>(initialData?.equip_tecnologia ? initialData.equip_tecnologia.split(', ') : []);

  // Leitura JSON dos Metadados (Parse DB) com verificação de vídeo
  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const parseInitialImage = (url?: string, meta?: any): FormImage | null => {
    if (!url) return null;
    return {
      cropUrl: url,
      masterUrl: meta?.masterUrl || url,
      meta: meta || { zoom: 1, rotation: 0, panX: 0, panY: 0 },
      isVideo: isVideoUrl(url)
    };
  };

  const initialFotosMeta = (initialData as any)?.fotos_meta || [];
  
  const [fotoPerfil, setFotoPerfil] = useState<FormImage | null>(parseInitialImage(initialData?.fotos?.[0], initialFotosMeta[0]));
  const [destaqueTop, setDestaqueTop] = useState<FormImage | null>(parseInitialImage(initialData?.fotos?.[1], initialFotosMeta[1]));
  const [destaqueBottom, setDestaqueBottom] = useState<FormImage | null>(parseInitialImage(initialData?.fotos?.[2], initialFotosMeta[2]));
  const [galeria, setGaleria] = useState<FormImage[]>((initialData?.fotos?.slice(3) || []).map((url, idx) => parseInitialImage(url, initialFotosMeta[idx + 3])!).filter(Boolean));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ================= ESTADOS DO CROPPER (MASTER INJECTION) =================
  const cropperRef = useRef<HTMLDivElement>(null);
  const [cropImage, setCropImage] = useState<{ src: string; target: 'perfil'|'top'|'bottom'|number } | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const textoPadrao = `Viatura nacional em excelente estado de conservação.\n\n- Histórico completo de manutenção na marca;\n- Garantia de 18 meses por mútuo acordo;\n- Financiamento até 120 meses sem entrada inicial;\n- Aceitamos retomas mediante avaliação.\n\nA informação disponibilizada, ainda que precisa, não dispensa a sua confirmação, nem poderá ser considerada vinculativa.`;

  const handleColarTexto = () => setDescricao(textoPadrao);

  // ================= HANDLERS DE IMAGENS E VÍDEOS =================
  const createNewMaster = (file: File): FormImage => ({ 
    masterFile: file, 
    meta: { zoom: 1, rotation: 0, panX: 0, panY: 0 },
    isVideo: file.type.startsWith('video/')
  });

  const handleSingleFileDrop = (e: React.DragEvent<HTMLLabelElement>, setter: React.Dispatch<React.SetStateAction<FormImage | null>>) => {
    e.preventDefault(); e.currentTarget.classList.remove('border-ja-blue', 'bg-blue-50', 'dark:bg-blue-900/20');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setter(createNewMaster(e.dataTransfer.files[0]));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.currentTarget.classList.add('border-ja-blue', 'bg-blue-50', 'dark:bg-blue-900/20'); };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.currentTarget.classList.remove('border-ja-blue', 'bg-blue-50', 'dark:bg-blue-900/20'); };

  const handleSingleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<FormImage | null>>) => {
    if (e.target.files && e.target.files[0]) setter(createNewMaster(e.target.files[0]));
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>) => {
    let files;
    if ('dataTransfer' in e) {
      e.preventDefault(); e.currentTarget.classList.remove('border-ja-blue', 'bg-blue-50', 'dark:bg-blue-900/20');
      files = e.dataTransfer.files;
    } else files = e.target.files;
    
    if (files) {
      const newFiles = Array.from(files).map(f => createNewMaster(f));
      setGaleria(prev => [...prev, ...newFiles]);
    }
  };

  const removeGaleriaItem = (indexToRemove: number) => { setGaleria(galeria.filter((_, index) => index !== indexToRemove)); };

  // Injetar o Master e aplicar Metadados Antigos
  const openCropModal = (image: FormImage, target: 'perfil'|'top'|'bottom'|number) => {
    // Bloqueia a abertura do cropper se for um vídeo
    if (image.isVideo) return; 

    const src = image.masterUrl || (image.masterFile ? URL.createObjectURL(image.masterFile) : image.cropUrl);
    if (src) {
      setCropImage({ src, target });
      setCropZoom(image.meta?.zoom || 1);
      setCropRotation(image.meta?.rotation || 0);
      setCropPan({ x: image.meta?.panX || 0, y: image.meta?.panY || 0 });
    }
  };

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - cropPan.x, y: clientY - cropPan.y });
  };

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setCropPan({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const onMouseUp = () => setIsDragging(false);

  const handleSaveCrop = async () => {
    if (!cropImage || !cropperRef.current) return;
    const container = cropperRef.current;
    
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = cropImage.src;
    await new Promise((resolve) => { img.onload = resolve; });

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scaleCover = Math.max(canvas.width / img.width, canvas.height / img.height);
    const finalScale = scaleCover * cropZoom;
    const baseX = (canvas.width / 2) - (img.width / 2) * finalScale;
    const baseY = (canvas.height / 2) - (img.height / 2) * finalScale;

    const panXCanvas = cropPan.x * (canvas.width / container.clientWidth);
    const panYCanvas = cropPan.y * (canvas.height / container.clientHeight);

    ctx.translate(canvas.width / 2 + panXCanvas, canvas.height / 2 + panYCanvas);
    ctx.rotate((cropRotation * Math.PI) / 180);
    ctx.translate(-(canvas.width / 2 + panXCanvas), -(canvas.height / 2 + panYCanvas));

    ctx.drawImage(img, baseX + panXCanvas, baseY + panYCanvas, img.width * finalScale, img.height * finalScale);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const newMeta = { zoom: cropZoom, rotation: cropRotation, panX: cropPan.x, panY: cropPan.y };
      
      const updateState = (prev: FormImage | null): FormImage => ({
        ...prev, cropBlob: blob, meta: { ...prev?.meta, ...newMeta }
      });

      if (cropImage.target === 'perfil') setFotoPerfil(prev => updateState(prev));
      else if (cropImage.target === 'top') setDestaqueTop(prev => updateState(prev));
      else if (cropImage.target === 'bottom') setDestaqueBottom(prev => updateState(prev));
      else {
        const newGaleria = [...galeria];
        newGaleria[cropImage.target as number] = updateState(newGaleria[cropImage.target as number]);
        setGaleria(newGaleria);
      }
      setCropImage(null);
    }, 'image/jpeg', 0.9);
  };

  // ================= SUBMIT (CROP + MASTER HANDLING) =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (marca === 'MANAGE_MARCAS' || modelo === 'MANAGE_MODELOS') { setError('Por favor feche os painéis de gestão.'); return; }
    if (!fotoPerfil) { setError('A Foto de Perfil é obrigatória.'); return; }
    if (!marca || !modelo) { setError('Marca e Modelo são campos obrigatórios.'); return; }

    setLoading(true); setError('');

    try {
      const processImage = async (item: FormImage | null) => {
        if (!item) return null;
        let finalMasterUrl = item.masterUrl;
        let finalCropUrl = item.cropUrl;

        // Guarda o Ficheiro Mestre Original na Nuvem
        if (item.masterFile) {
          const ext = item.masterFile.name.split('.').pop();
          const fileName = `master_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${ext}`;
          await supabase.storage.from('vehicle_images').upload(fileName, item.masterFile);
          finalMasterUrl = supabase.storage.from('vehicle_images').getPublicUrl(fileName).data.publicUrl;
        }

        // Guarda a Versão Derivada Processada (Corte)
        if (item.cropBlob) {
          const fileName = `crop_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.jpg`;
          await supabase.storage.from('vehicle_images').upload(fileName, item.cropBlob);
          finalCropUrl = supabase.storage.from('vehicle_images').getPublicUrl(fileName).data.publicUrl;
        } else if (!finalCropUrl && finalMasterUrl) {
          finalCropUrl = finalMasterUrl; // Fallback para vídeos ou imagens sem edição
        }

        return { cropUrl: finalCropUrl, meta: { ...item.meta, masterUrl: finalMasterUrl } };
      };

      const perfilRes = await processImage(fotoPerfil);
      const topRes = await processImage(destaqueTop);
      const bottomRes = await processImage(destaqueBottom);
      const galeriaRes = await Promise.all(galeria.map(img => processImage(img)));

      const allResults = [perfilRes, topRes, bottomRes, ...galeriaRes];
      const fotosLimpas = allResults.map(res => res ? res.cropUrl : '').map(f => f === '' ? '' : f) as string[];
      const fotosMeta = allResults.map(res => res ? res.meta : null);

      const vehicleData = {
        marca, modelo, preco: parseFloat(preco), ano: parseInt(ano), estado, combustivel, transmissao,
        segmento: segmento || null, quilometros: quilometros ? parseInt(quilometros) : null,
        motor: motor || null, versao: versao || null, garantia: garantia || null, descricao: descricao || null,
        equip_audio: equipAudio.length > 0 ? equipAudio.join(', ') : null,
        equip_conforto: equipConforto.length > 0 ? equipConforto.join(', ') : null,
        equip_desempenho: equipDesempenho.length > 0 ? equipDesempenho.join(', ') : null,
        equip_seguranca: equipSeguranca.length > 0 ? equipSeguranca.join(', ') : null,
        equip_tecnologia: equipTecnologia.length > 0 ? equipTecnologia.join(', ') : null,
        fotos: fotosLimpas,
        fotos_meta: fotosMeta, // Metadados registados!
        tags: [], em_destaque: emDestaque, em_stock: emStock
      };

      if (initialData) {
        await supabase.from('vehicles').update(vehicleData).eq('id', initialData.id);
        
        // ================= GARBAGE COLLECTION: Apagar imagens velhas =================
        try {
          // URLs de imagens e vídeos que vão FICAR no carro
          const finalUrls = new Set([
            ...fotosLimpas,
            ...fotosMeta.map(m => m?.masterUrl).filter(Boolean)
          ]);

          // URLs de imagens e vídeos que estavam no carro ANTES da edição
          const initialUrls = new Set([
            ...(initialData.fotos || []),
            ...(initialData.fotos_meta || []).map((m: any) => m?.masterUrl).filter(Boolean)
          ]);

          // As que estavam antes mas já não estão na lista final, foram apagadas pelo utilizador!
          const filesToDelete: string[] = [];
          initialUrls.forEach(url => {
            if (url && typeof url === 'string' && !finalUrls.has(url)) {
              const fileName = url.split('/').pop();
              if (fileName) filesToDelete.push(fileName);
            }
          });

          // Vai ao Storage e elimina esses ficheiros fisicamente
          if (filesToDelete.length > 0) {
            await supabase.storage.from('vehicle_images').remove(filesToDelete);
          }
        } catch (cleanupError) {
          console.error('Erro ao eliminar ficheiros órfãos do Storage:', cleanupError);
        }
        // ==============================================================================

      } else {
        await supabase.from('vehicles').insert([vehicleData]);
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao guardar veículo:', err);
      setError('Ocorreu um erro ao guardar o veículo.');
    } finally {
      setLoading(false);
    }
  };

  // Resolve o ficheiro a apresentar na Listagem do Editor
  const getDisplayUrl = (state: FormImage) => state.cropBlob ? URL.createObjectURL(state.cropBlob) : state.cropUrl || (state.masterFile ? URL.createObjectURL(state.masterFile) : '');

  const SingleUploadBox = ({ state, setter, label, format, targetName }: { state: FormImage | null, setter: any, label: string, format: string, targetName: 'perfil'|'top'|'bottom' }) => (
    <div className="flex flex-col gap-2 h-full">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      {state ? (
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group shadow-sm">
          <img src={getDisplayUrl(state)} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300 z-20">
            <button type="button" onClick={() => openCropModal(state, targetName)} className="bg-white text-gray-900 p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg" title="Ajustar Imagem"><Camera size={18} /></button>
            <button type="button" onClick={() => setter(null)} className="bg-red-500 text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg" title="Remover"><X size={18} /></button>
          </div>
        </div>
      ) : (
        <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => handleSingleFileDrop(e, setter)} className="flex flex-col items-center justify-center w-full h-full min-h-[140px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-semibold text-ja-dark dark:text-gray-300 mb-1">Upload ou Drag & Drop</span>
          <span className="text-xs text-gray-500 text-center px-4">{format}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSingleFile(e, setter)} />
        </label>
      )}
    </div>
  );

  return (
    <>
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
          {/* ================= INFORMAÇÕES PRINCIPAIS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Marca *</label>
              <select required value={marca} onChange={handleMarcaChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none">
                <option value="">Selecione uma marca...</option>
                {marcasList.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                <option value="MANAGE_MARCAS" className="font-bold text-ja-blue">➕ Adicionar / Gerir Marcas...</option>
              </select>

              {marca === 'MANAGE_MARCAS' && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                   <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-sm text-ja-dark dark:text-white">Gerir Marcas</h4>
                     <button type="button" onClick={() => setMarca('')} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 font-semibold"><X size={14}/> Fechar</button>
                   </div>
                   <div className="flex gap-2 mb-3">
                      <input type="text" placeholder="Nova Marca..." value={newMarcaInput} onChange={e => setNewMarcaInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddMarca(); } }} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none text-ja-dark dark:text-white" />
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Modelo *</label>
              <select required disabled={!marca || marca === 'MANAGE_MARCAS'} value={modelo} onChange={e => setModelo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-white dark:bg-gray-800 text-ja-dark dark:text-white outline-none disabled:opacity-50">
                <option value="">{marca && marca !== 'MANAGE_MARCAS' ? 'Selecione um modelo...' : 'Escolha a marca primeiro'}</option>
                {modelosList.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                {marca && marca !== 'MANAGE_MARCAS' && <option value="MANAGE_MODELOS" className="font-bold text-ja-blue">➕ Adicionar / Gerir Modelos...</option>}
              </select>

              {modelo === 'MANAGE_MODELOS' && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                   <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-sm text-ja-dark dark:text-white">Gerir Modelos para {marca}</h4>
                     <button type="button" onClick={() => setModelo('')} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 font-semibold"><X size={14}/> Fechar</button>
                   </div>
                   <div className="flex gap-2 mb-3">
                      <input type="text" placeholder="Novo Modelo..." value={newModeloInput} onChange={e => setNewModeloInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddModelo(); } }} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none text-ja-dark dark:text-white" />
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

          {/* ================= ESPECIFICAÇÕES TÉCNICAS ================= */}
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
                <option value="Carrinha">Carrinha</option>
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

          {/* ================= EQUIPAMENTOS ================= */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-ja-dark dark:text-white">Equipamentos</h3>
              <p className="text-sm text-gray-500 mt-1">Selecione as opções ou digite uma nova para adicionar à biblioteca.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <EquipmentSection title="Áudio e Multimédia" categoria="audio" selected={equipAudio} setSelected={setEquipAudio} />
              <EquipmentSection title="Conforto" categoria="conforto" selected={equipConforto} setSelected={setEquipConforto} />
              <EquipmentSection title="Desempenho" categoria="desempenho" selected={equipDesempenho} setSelected={setEquipDesempenho} />
              <EquipmentSection title="Segurança" categoria="seguranca" selected={equipSeguranca} setSelected={setEquipSeguranca} />
              <div className="lg:col-span-2">
                <EquipmentSection title="Tecnologia e Eletrónica" categoria="tecnologia" selected={equipTecnologia} setSelected={setEquipTecnologia} />
              </div>
            </div>
          </div>

          {/* ================= DESCRIÇÃO ================= */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Descrição da Viatura</label>
              <button type="button" onClick={handleColarTexto} className="flex items-center gap-1.5 text-xs font-bold text-ja-blue bg-ja-blue/10 hover:bg-ja-blue/20 px-3 py-1.5 rounded-lg">
                <FileText size={14} /> Colar Texto Padrão
              </button>
            </div>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={5} placeholder="Escreva a descrição livremente..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-white dark:bg-gray-800 text-ja-dark dark:text-white" />
          </div>

          {/* ================= FOTOS E VÍDEOS ================= */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-ja-dark dark:text-white">Estrutura de Fotografias / Vídeos</h3>
                <p className="text-sm text-gray-500 mt-1">Faça upload ou arraste as imagens e vídeos para as respetivas caixas.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="col-span-1 lg:border-r border-gray-100 dark:border-gray-800 lg:pr-8">
                <SingleUploadBox state={fotoPerfil} setter={setFotoPerfil} label="1. Foto de Perfil *" format="Listagem Principal" targetName="perfil" />
              </div>
              
              <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="col-span-1 flex flex-col gap-2 h-full">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">2. Galeria Principal</span>
                  <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleMultipleFiles} className="flex flex-col items-center justify-center w-full h-[140px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 transition-colors">
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-semibold text-ja-blue hover:underline px-4 text-center">Adicionar Múltiplas Fotos/Vídeos</span>
                    <span className="text-xs text-gray-500 mt-1">Upload ou Drag & Drop</span>
                    {/* INPUT ATUALIZADO PARA ACEITAR VÍDEOS */}
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleMultipleFiles} />
                  </label>
                  
                  {galeria.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                      {galeria.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group shadow-sm">
                          
                          {/* RENDERIZAÇÃO CONDICIONAL: IMAGEM OU VÍDEO */}
                          {img.isVideo ? (
                            <video src={getDisplayUrl(img)} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <img src={getDisplayUrl(img)} className="w-full h-full object-cover" />
                          )}
                          
                          {/* ÍCONE INDICADOR SE FOR VÍDEO */}
                          {img.isVideo && (
                            <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md p-1 rounded-md z-10">
                              <Video size={12} className="text-white" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity z-20">
                            {/* Oculta a ferramenta de corte se for vídeo */}
                            {!img.isVideo && (
                              <button type="button" onClick={() => openCropModal(img, idx)} className="bg-white text-gray-900 p-1.5 rounded-full hover:scale-110"><Camera size={14} /></button>
                            )}
                            <button type="button" onClick={() => removeGaleriaItem(idx)} className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110"><X size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-1 grid grid-rows-2 gap-6">
                  <SingleUploadBox state={destaqueTop} setter={setDestaqueTop} label="3. Destaque Superior" format="Opcional" targetName="top" />
                  <SingleUploadBox state={destaqueBottom} setter={setDestaqueBottom} label="4. Destaque Inferior" format="Opcional" targetName="bottom" />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={emDestaque} onChange={e => setEmDestaque(e.target.checked)} className="w-5 h-5 text-ja-blue cursor-pointer rounded" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Destacar na Home Page</span></label>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={emStock} onChange={e => setEmStock(e.target.checked)} className="w-5 h-5 text-ja-blue cursor-pointer rounded" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Em Stock</span></label>
          </div>

          <div className="pt-8 flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition-all disabled:opacity-70">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} {loading ? 'A Guardar...' : (initialData ? 'Guardar Alterações' : 'Adicionar Veículo')}
            </button>
          </div>
        </form>
      </div>

      {/* ================= MODAL DE CORTE COM INJEÇÃO METADATA ================= */}
      {cropImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div className="bg-[#18181b] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-800 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h3 className="text-white font-semibold flex items-center gap-2"><Camera size={18} className="text-ja-blue"/> Cortar / Ajustar Imagem</h3>
              <button onClick={() => setCropImage(null)} className="text-gray-400 hover:text-white p-1 rounded-full"><X size={20} /></button>
            </div>
            
            <div 
              ref={cropperRef}
              className="relative w-full aspect-[4/3] bg-black overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={onMouseUp}
              style={{ touchAction: 'none' }}
            >
              <img 
                src={cropImage.src} 
                draggable={false}
                style={{ 
                  transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropZoom}) rotate(${cropRotation}deg)`,
                  objectFit: 'cover', width: '100%', height: '100%',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }} 
              />
              
              {cropPan.x === 0 && cropPan.y === 0 && !isDragging && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 pointer-events-none z-20">
                  <Move size={14} /> Arraste a imagem para reposicionar
                </div>
              )}
              
              <div className="absolute inset-0 pointer-events-none border-2 border-white/50 z-10">
                <div className="absolute w-full h-full flex flex-col justify-evenly">
                  <div className="w-full border-t border-white/30"></div><div className="w-full border-t border-white/30"></div>
                </div>
                <div className="absolute w-full h-full flex justify-evenly">
                  <div className="h-full border-l border-white/30"></div><div className="h-full border-l border-white/30"></div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#18181b] space-y-4">
              <div>
                <label className="text-white text-xs font-semibold mb-2 flex justify-between">
                  <span>Zoom (Aproximar)</span><span className="text-gray-400">{Math.round(cropZoom * 100)}%</span>
                </label>
                <input type="range" min="1" max="3" step="0.05" value={cropZoom} onChange={e => setCropZoom(parseFloat(e.target.value))} className="w-full cursor-pointer accent-ja-blue" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setCropRotation(r => r - 90)} className="text-white bg-gray-800 hover:bg-gray-700 p-2.5 rounded-xl flex items-center gap-2 transition-colors">
                  <RotateCcw size={16}/> Rodar
                </button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setCropImage(null)} className="text-gray-400 hover:text-white px-4 py-2 font-medium">Cancelar</button>
                  <button type="button" onClick={handleSaveCrop} className="bg-ja-blue hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-colors">Cortar Imagem</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}