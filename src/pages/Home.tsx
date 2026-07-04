import { HeroSection } from '../components/sections/home/HeroSection';
import { FeaturedVehicles } from '../components/sections/home/FeaturedVehicles';
import { BrandCarousel } from '../components/sections/home/BrandCarousel';
import { LatestVehicles } from '../components/sections/home/LatestVehicles'; // Importação adicionada
import { ImportBannerSection } from '../components/sections/home/ImportBannerSection';
import { GuaranteeSection } from '../components/sections/home/GuaranteeSection';
import { WhyChooseUsSection } from '../components/sections/home/WhyChooseUsSection';
import { FAQSection } from '../components/sections/home/FAQSection';
import { HomeContact } from '../components/sections/home/HomeContact';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Secção de Hero (video) */}
      <HeroSection />
      
      {/* 2 e 3. Secção de Filtros + Secção de Destaques 
          (Estão combinadas no FeaturedVehicles conforme programado anteriormente) */}
      <FeaturedVehicles />
      
      {/* 4. Carrossel de Marcas */}
      <BrandCarousel />
      
      {/* 5. Secção de Novas Entradas (Últimos Adicionados) */}
      <LatestVehicles />
      
      {/* 6. Secção de Importação */}
      <ImportBannerSection />
      
      {/* 7. Secção de Garantia */}
      <GuaranteeSection />
      
      {/* 8. Secção de Motivos (Porquê Nós) */}
      <WhyChooseUsSection />
      
      {/* 9. Secção de Perguntas Frequentes */}
      <FAQSection />
      
      {/* 10. Secção de Visita / Instalações */}
      <HomeContact />
    </div>
  );
}