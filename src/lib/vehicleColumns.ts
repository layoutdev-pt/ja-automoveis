/**
 * Colunas usadas pelos cartões de viatura (Stand, destaques, últimas, pesquisa).
 * Evita pedir ao Supabase a descrição, equipamentos e fotos_meta, que só a página
 * de detalhe usa — menos egress da API e respostas mais rápidas.
 * Manter em sincronia com CARD_COLUMNS em scripts/prerender.mjs.
 */
export const CARD_COLUMNS =
  'id,marca,modelo,versao,preco,ano,estado,quilometros,combustivel,transmissao,garantia,fotos,em_stock,em_destaque,created_at';
