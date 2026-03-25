
import BestDeals from "../../components/BestDeals";
import { CategoriesSection } from "../../components/categorySectoin";
import { HeroSection } from "../../components/Header";
import HeroStack from "../../components/HeroStack";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <BestDeals />
      <HeroStack />
    </div>
  );
}