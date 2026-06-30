export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  preco: number;
  ano: number;
  
  estado?: string;
  combustivel?: string;
  transmissao?: string;
  segmento?: string;
  quilometros?: number;
  motor?: string;
  versao?: string;
  descricao?: string;
  tags?: string[];
  
  // NOVOS CAMPOS DE EQUIPAMENTO
  equip_audio?: string;
  equip_conforto?: string;
  equip_desempenho?: string;
  equip_seguranca?: string;
  equip_tecnologia?: string;
  
  fotos: string[];
  em_destaque: boolean;
  em_stock: boolean;
  created_at: string;
}