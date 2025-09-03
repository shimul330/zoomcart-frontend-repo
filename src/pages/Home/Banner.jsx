import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import banner1 from "../../assets/images1.jpg";
import banner2 from "../../assets/images2.jpg";
import banner3 from "../../assets/image3.jpg";


const Banner = () => {
  const bannerImages = [banner1, banner2, banner3];

  return (
    <div className="w-full">
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        loop={true}
        className="w-full h-[300px] md:h-[400px] lg:h-[450px]"
      >
        {bannerImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
