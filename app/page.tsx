import Image from "next/image";
import mainBackground from "@/public/images/main-background-3.png";
import mobileBackground from "@/public/images/main-background-mobile.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";

export default function MainPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />

      {/* <div className="animate-fade-in-up absolute top-65 ml-10 text-left md:ml-165 md:top-90">
        <div className="flex flex-col gap-30">
          <div
            className="italic text-2xl text-[#5A4033] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.3)]
          md:text-5xl"
          >
            Build your English, <br />
            one logue at a time.
          </div>
          <Link href="/new-entry" className="ml-30 md:ml-100">
            <Button
              variant="outline"
              className="p-3 bg-[#EFD6C0] text-md hover:cursor-pointer hover:bg-[#e6c8b0]
              text-[#5A4033] [box-shadow:_0_0_15px_4px_rgba(255,210,150,0.9)] transition-all duration-200
              md:text-3xl md:p-6"
            >
              Begin your logue
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  );
}
