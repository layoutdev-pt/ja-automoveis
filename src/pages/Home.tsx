import { HeroSection } from '../components/sections/home/HeroSection';
import { BrandCarousel } from '../components/sections/home/BrandCarousel';
import { FeaturedVehicles } from '../components/sections/home/FeaturedVehicles';
import { GuaranteeSection } from '../components/sections/home/GuaranteeSection';
import { HomeContact } from '../components/sections/home/HomeContact';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <BrandCarousel />
      <FeaturedVehicles />
      <GuaranteeSection />
      <HomeContact />
    </div>
  );
}