
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { bannerLists } from "../../utils";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <div className="py-2">
      <Swiper
        grabCursor={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        navigation
        effect="fade"
        modules={[Pagination, EffectFade, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="rounded-2xl overflow-hidden"
      >
        {bannerLists.map((item) => (
          <SwiperSlide key={item.id}>
         
            <div className="relative h-72 sm:h-[420px] lg:h-[520px] w-full">
              <img
                src={item.image}
                alt={item.title || "Banner"}
                className="h-full w-full object-cover"
              />
              <Link to="/products" className="absolute inset-0" aria-label="Go to products" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;
