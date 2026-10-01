import { HeroSection } from '../components/sections/home/HeroSection';
import { FeaturedVehicles } from '../components/sections/home/FeaturedVehicles';
import { BrandCarousel } from '../components/sections/home/BrandCarousel';
import { LatestVehicles } from '../components/sections/home/LatestVehicles'; // Importação adicionada
import { ImportBannerSection } from '../components/sections/home/ImportBannerSection';
import { GuaranteeSection } from '../components/sections/home/GuaranteeSection';
import { WhyChooseUsSection } from '../components/sections/home/WhyChooseUsSection';
import { FAQSection } from '../components/sections/home/FAQSection';
import { FAQS } from '../data/faqs';
import { HomeContact } from '../components/sections/home/HomeContact';
import { ScrollReveal } from '../components/ui/ScrollReveal'; // Importação do motor de animação
import { Seo } from '../seo/Seo';
import { faqSchema, localBusinessSchema, websiteSchema } from '../seo/schema';
import { WARRANTY_MONTHS } from '../seo/siteConfig';

export function Home() {
  return (
    <div className="flex flex-col w-full">

      <Seo
        title="Carros Usados e Semi-Novos na Covilhã | JA Automóveis"
        description={`Stand multimarca na Covilhã com viaturas usadas e semi-novas selecionadas. Garantia de ${WARRANTY_MONTHS} meses, financiamento até 120 meses, retoma avaliada e importação chave na mão.`}
        path="/"
        jsonLd={[localBusinessSchema(), websiteSchema(), faqSchema(FAQS)]}
      />

      {/* 1. Secção de Hero (video) - Sem ScrollReveal pois é o topo imediato da página */}
      <HeroSection />

      {/* H1 semântico e acessível (sr-only) para manter a hierarquia de títulos e o SEO local no Google a 100% */}
      <h1 className="sr-only">
        Carros Usados e Semi-Novos na Covilhã — Stand JA Automóveis
      </h1>

      <ScrollReveal>
        {/* 2 e 3. Secção de Filtros + Secção de Destaques
            (Estão combinadas no FeaturedVehicles conforme programado anteriormente) */}
        <FeaturedVehicles />
      </ScrollReveal>

      <ScrollReveal>
        {/* 4. Carrossel de Marcas */}
        <BrandCarousel />
      </ScrollReveal>

      <ScrollReveal>
        {/* 5. Secção de Novas Entradas (Últimos Adicionados) */}
        <LatestVehicles />
      </ScrollReveal>

      <ScrollReveal>
        {/* 6. Secção de Importação */}
        <ImportBannerSection />
      </ScrollReveal>

      <ScrollReveal>
        {/* 7. Secção de Garantia */}
        <GuaranteeSection />
      </ScrollReveal>

      <ScrollReveal>
        {/* 8. Secção de Motivos (Porquê Nós) */}
        <WhyChooseUsSection />
      </ScrollReveal>

      <ScrollReveal>
        {/* 9. Secção de Perguntas Frequentes */}
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal>
        {/* 10. Secção de Visita / Instalações */}
        <HomeContact />
      </ScrollReveal>
    </div>
  );
}
