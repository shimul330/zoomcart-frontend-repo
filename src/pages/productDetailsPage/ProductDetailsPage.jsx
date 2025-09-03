import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import { useCart } from '../../contaxts/CartContext/CartContext';
import toast from 'react-hot-toast';
import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import { HashLoader } from 'react-spinners';
import { ChevronLeft } from 'lucide-react';

const ProductDetailsPage = () => {
    const product = useLoaderData();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(product.photos[0]);
    const [role, isRoleLoading] = useRole();

    if (isRoleLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div>
                <Link to='/products'>
                    <button className='px-2 py-2 rounded-full bg-indigo-600'><ChevronLeft className='text-white' size={24} /></button>
                </Link>
            </div>
            {/* Container */}
            <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">

                {/* Left Side - Image Gallery */}
                <div className="flex-1 flex flex-col items-center gap-4">
                    {/* Main Image */}
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full max-w-md rounded-lg shadow-md object-contain"
                    />
                    {/* Other Images */}
                    <div className="flex gap-3 flex-wrap justify-center">
                        {product.photos.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name}-${index}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img
                                    ? "border-indigo-500"
                                    : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side - Details */}
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-indigo-700 mb-4">{product.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Slug: {product.slug}
                    </p>
                    <p className="text-gray-600"><span className="font-semibold">Category:</span> {product.category}</p>
                    <p className="text-gray-600"><span className="font-semibold">Stock:</span> {product.stock}</p>
                    <p className="text-gray-600"><span className="font-semibold">Status:</span> {product.status}</p>

                    <p className="text-lg font-semibold mt-4">💰 Price: <span className="text-green-600">${product.price}</span></p>
                    <p className="text-lg font-semibold">🎁 Discount: <span className="text-red-600">{product.discount}%</span></p>

                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
