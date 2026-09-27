export interface ImportStep {
  title: string;
  description: string;
}

/** Passos do processo: fonte única para o ecrã e para o schema HowTo. */
export const IMPORT_STEPS: ImportStep[] = [
    {
      title: '1. Pesquisa à Medida',
      description: 'Diga-nos exatamente o que procura. Marca, modelo, ano, equipamento e orçamento. A nossa equipa vasculha o mercado europeu (maioritariamente Alemanha e Países Baixos) para encontrar a viatura ideal.'
    },
    {
      title: '2. Inspeção e Histórico',
      description: 'Antes de qualquer compromisso, verificamos o histórico de manutenções, a ausência de acidentes e confirmamos a quilometragem real. Só avançamos com viaturas irrepreensíveis.'
    },
    {
      title: '3. Legalização e Burocracia',
      description: 'Tratamos de todo o processo burocrático: ISV, inspeção B, atribuição de matrícula portuguesa e registo automóvel. Não tem de se preocupar com filas ou papelada.'
    },
    {
      title: '4. Entrega Chave na Mão',
      description: 'A viatura é transportada em segurança, sujeita a uma revisão completa e detalhe automóvel antes de lhe ser entregue, pronta a circular com total tranquilidade.'
    }
];
