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

      {/* H1 da homepage: frase-chave clara e localizada.
          Fica visualmente integrado por baixo do hero, antes dos destaques. */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ja-dark dark:text-white tracking-tight transition-colors duration-500">
          Carros Usados e Semi-Novos na Covilhã
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-500">
          A JA Automóveis é um stand multimarca na Covilhã. Selecionamos cada viatura à mão e
          entregamo-la com {WARRANTY_MONTHS} meses de garantia, financiamento à medida e
          retoma do seu carro atual — com importação chave na mão sempre que o carro certo está lá fora.
        </p>
      </section>

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
