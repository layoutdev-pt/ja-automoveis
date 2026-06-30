export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  preco: number;
  ano: number;
  
  // Propriedades Adicionadas Recente
  estado?: string;
  combustivel?: string;
  transmissao?: string;
  segmento?: string;
  quilometros?: number;
  motor?: string;
  versao?: string;
  descricao?: string;
  tags?: string[]; // Array de tags personalizadas
  
  fotos: string[];
  em_destaque: boolean;
  em_stock: boolean;
  created_at: string;
}