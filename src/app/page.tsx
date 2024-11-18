import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PlaceholdersAndVanishInputDemo } from "@/components/placeholder";
import SuperCharge from "@/components/Supercharge";
import GridPattern from "@/components/ui/grid-pattern";
import WordRotate from "@/components/ui/word-rotate";
import { cn } from "@/lib/utils";


export default function Home() {
  return (
    <div className="w-11/12 mx-auto">
      <Header/>
      
      <div className=" overflow-hidden bg-background bg-gray-50">
        <div className="z-10 flex flex-col items-center justify-center h-lvh w-full">
          <h1 className="text-4xl text-red-500 font-bold">
            Short Links, Big Impact.
            <WordRotate
              className="text-4xl font-bold text-black dark:text-white"
              words={["Create", "Share", "Analyze"]}
            />  
          </h1>
          <PlaceholdersAndVanishInputDemo/>
        </div>

        <SuperCharge/>  

        <Footer/>
        
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          )}
        />
      </div>
      
    </div>
  );
}
