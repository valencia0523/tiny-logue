import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const HomeCommunitySection = () => {
  return (
    <div className="bg-[#B5D182] md:flex items-center justify-between">
      <div className="md:w-3/4 lg:w-1/2">
        <Image
          src="/images/home-community-section.jpg"
          alt="Join our community banner"
          width={400}
          height={300}
          className="md:h-[350px] lg:h-[450px] w-full"
        />
      </div>

      <div className="flex flex-col items-center gap-3 p-10 md:p-3 lg:pr-25">
        <div className="text-2xl font-semibold text-center">
          Join a growing community of English learners
        </div>
        <div className="hidden text-xl lg:flex lg:flex-col lg:items-center">
          <div>Share your logs, stay motivated, and learn together</div>
          <div>- one log at a time.</div>
        </div>
        <Button variant="outline" className="mt-5 text-xl">
          <Link href="/community">Explore the Community</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeCommunitySection;
