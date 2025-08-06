"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const FeaturesSection = () => {
  return (
    <div className="py-5 md:flex md:justify-around md:py-10">
      <div className="md:w-1/2">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <img
              src="/images/home-features-1.png"
              alt="Features image 1"
              className="w-full h-[300px] object-contain p-5 md:h-[400px] lg:h-[450px]"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/images/home-features-2.png"
              alt="Features image 2"
              className="w-full h-[300px] object-contain p-5 md:h-[400px] lg:h-[450px]"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/images/home-features-3.png"
              alt="Features image 3"
              className="w-full h-[300px] object-contain p-5 md:h-[400px] lg:h-[450px]"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="flex flex-col items-center">
        <ul className="list-disc list-inside leading-7.5 md:text-xl md:pr-10 md:pt-25 lg:hidden">
          <li>Write in English with native help</li>
          <li>Get AI-powered corrections</li>
          <li>Switch between UK/US spelling</li>
          <li>Save and search by date</li>
          <li>Share and stay motivated</li>
        </ul>

        <ul className="list-disc list-inside hidden lg:block text-xl leading-10 p-20">
          <li>Write in English with native language support.</li>
          <li>Get AI corrections based on what you meant.</li>
          <li>Choose British or American spelling.</li>
          <li>Save your entries by date and search anytime.</li>
          <li>Share with the community and stay motivated.</li>
        </ul>
      </div>
    </div>
  );
};

export default FeaturesSection;
