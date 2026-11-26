import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CallToAction } from "@/components/home/CallToAction";
import { FeatureBento } from "@/components/home/FeatureBento";
import { HomeHero } from "@/components/home/HomeHero";

export default function Home() {
  return (
    <div className="w-11/12 mx-auto">
      <Header />

      <div className="overflow-hidden bg-gray-50">
        <HomeHero />

        <FeatureBento />

        <CallToAction />

        <Footer />
      </div>
    </div>
  );
}
