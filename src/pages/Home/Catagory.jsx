import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HashLoader } from 'react-spinners';


const Catagory = () => {
    const { data: categories, isLoading, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:3000/categories");
            return res.data;
        },
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );
    if (isError) return <p className="text-center text-red-500 py-10">Error: {error.response?.data?.message || error.message}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                🛒 Shop by Categories
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition"
                    >
                        
                        <img
                            src={item.images?.[0] || "/placeholder.png"} 
                            alt={item.name}
                            className="w-full h-28 object-contain rounded-3xl mb-4"
                        />

                        <div className="mt-4 text-center">
                            <h3 className="text-lg font-semibold mb-3">{item.category}</h3>
                            <p className="font-medium text-gray-700">{item.name}</p>
                            <p className="text-indigo-600 font-bold">${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catagory;
