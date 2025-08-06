import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="bg-[#EFD6C0] pt-35 md:flex md:justify-between md:pt-25">
      <div className="flex flex-col items-center md:items-start md:gap-3 md:pt-35 md:p-10 lg:pl-35">
        <div className="flex flex-col items-center lg:flex-row">
          <div className="text-3xl font-semibold">Build your English habit</div>
          <div className="text-3xl font-semibold">- one log at a time</div>
        </div>
        <div className="hidden text-xl lg:block">
          Your English improves with every log. <br /> AI support helps you
          sound clear and natural.
        </div>
        <Button variant="outline" className="mt-5 text-xl">
          <Link href="/new-entry">New Logue</Link>
        </Button>
      </div>

      <div className="mt-5 md:mt-0">
        <Image
          src="/images/home-hero-section.jpg"
          alt="Illustration of notebooks, a laptop and a pen"
          width={500}
          height={500}
          className="h-[280px] md:min-h-[500px]"
        />
      </div>
    </div>
  );
};

export default HeroSection;
