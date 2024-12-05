import { FeaturesSection } from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import SuperCharge from "@/components/Supercharge";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="w-11/12 mx-auto">
      <Header />

      <div className=" overflow-hidden bg-background bg-gray-50">
        <Hero />

        <FeaturesSection />

        <SuperCharge />

        <Footer />

        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
      </div>
    </div>
  );
}
