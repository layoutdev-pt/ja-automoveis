export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  preco: number;
  ano: number;
  combustivel: string;
  motor?: string;
  versao?: string;
  caracteristicas?: string[];
  fotos: string[];
  em_destaque: boolean;
  em_stock: boolean;
  created_at: string;
  updated_at: string;
}