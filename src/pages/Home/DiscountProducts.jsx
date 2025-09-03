import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HashLoader } from 'react-spinners';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

SwiperCore.use([Navigation, Pagination]);

const DiscountProducts = () => {
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ["discount-products"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:3000/discount-products");
            return res.data;
        },
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );

    if (isError) return (
        <div className="text-center py-10 text-red-500">
            {error.message || "Failed to load products"}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Discounted Products
            </h2>

            {/* product cards slider */}
            <Swiper
                navigation
                // pagination={{ clickable: true }}
                spaceBetween={20}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product._id}>
                        <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition h-full flex flex-col">

                    
                            <img
                                src={product.photos?.[0] || "/placeholder.png"}
                                alt={product.name}
                                className="w-full h-48 object-contain rounded-lg mb-4"
                            />

                            <div className="mt-4 text-center flex-1 flex flex-col justify-between">
                                <p className="font-medium text-gray-700">{product.name}</p>
                                <p className="text-indigo-600 font-bold mt-2">
                                    ${product.price} {product.discount ? `(Save ${product.discount}%)` : ""}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default DiscountProducts;
