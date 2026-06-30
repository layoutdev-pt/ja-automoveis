import { HeroSection } from '../components/sections/home/HeroSection';
import { BrandCarousel } from '../components/sections/home/BrandCarousel';
import { FeaturedVehicles } from '../components/sections/home/FeaturedVehicles';
import { GuaranteeSection } from '../components/sections/home/GuaranteeSection';
import { HomeContact } from '../components/sections/home/HomeContact';

// Novas importações
import { ImportBannerSection } from '../components/sections/home/ImportBannerSection';
import { WhyChooseUsSection } from '../components/sections/home/WhyChooseUsSection';
import { FAQSection } from '../components/sections/home/FAQSection';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      
      <BrandCarousel />
      
      <FeaturedVehicles />
      
      {/* NOVO: Banner de Importação (Acima da garantia) */}
      <ImportBannerSection />
      
      <GuaranteeSection />
      
      {/* NOVO: Porquê nós (Abaixo da garantia) */}
      <WhyChooseUsSection />
      
      {/* NOVO: Perguntas e respostas (Logo a seguir) */}
      <FAQSection />
      
      <HomeContact />
    </div>
  );
}