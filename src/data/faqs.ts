import { WARRANTY_MONTHS } from '../seo/siteConfig';

export interface Faq {
  q: string;
  a: string;
}

/**
 * Fonte única das perguntas frequentes: alimenta a secção visível e o
 * schema FAQPage, garantindo que o texto indexado é o texto apresentado.
 */
export const FAQS: Faq[] = [
    { 
      q: "Quais tipos de veículos posso encontrar na JA Automóveis?", 
      a: "Trabalhamos com uma vasta gama de viaturas multimarcas, desde utilitários económicos a SUVs familiares e modelos premium desportivos, focando-nos sempre no excelente estado de conservação." 
    },
    { 
      q: "A JA Automóveis oferece garantia nos carros usados?", 
      a: `Sim, absolutamente. Todas as nossas viaturas são entregues com garantia por mútuo acordo, válida por ${WARRANTY_MONTHS} meses, para lhe assegurar total tranquilidade após a compra.` 
    },
    { 
      q: "É possível fazer uma retoma do meu carro usado por outro veículo?", 
      a: "Sem dúvida! Avaliamos a sua viatura atual de forma justa e transparente, utilizando o seu valor para facilitar a transição para o seu novo automóvel." 
    },
    { 
      q: "A JA Automóveis oferece serviços de financiamento?", 
      a: "Sim, dispomos de parcerias com as melhores entidades financeiras para lhe apresentar opções de crédito automóvel com as melhores taxas do mercado, adaptadas ao seu orçamento mensal." 
    },
    { 
      q: "Como funciona exatamente o vosso serviço de importação?", 
      a: "É um serviço 'Chave na Mão'. Escolhemos a viatura no mercado europeu, realizamos a vistoria física, transportamos, tratamos da legalização completa e entregamos-lhe o carro pronto a circular com matrícula portuguesa." 
    }
];
