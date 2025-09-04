import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const CartDataCard = ({ item, removeFromCart }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { _id, name, price, discount, category, stock, photos } = item;
   

    const [quantity, setQuantity] = useState(1);
    const [currentPhoto, setCurrentPhoto] = useState(0);

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleNextPhoto = () => {
        setCurrentPhoto((prev) => (prev + 1) % photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const totalPrice = price * quantity;
    const totalDiscount = discount ? discount : 0;
    const grandTotal = (totalPrice - totalDiscount).toFixed(2);

    //checkout shipping page user check
    const handleCheckout = () => {
        if (!user) {
            navigate("/login"); // Non-logged user -> Login
        } else {
            navigate("/shipping", {
                state: {
                    product: item,       
                    quantity: quantity,  
                    totalPrice: totalPrice,
                    grandTotal: grandTotal
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            {/*  Image Carousel */}
            {photos && photos.length > 0 && (
                <div className="relative w-full h-52">
                    <img
                        src={photos[currentPhoto]}
                        alt={name}
                        className="w-full h-52 object-contain"
                    />
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevPhoto}
                                className="absolute left-2 top-1/2 -translate-y-1/2  text-white px-2 py-1 rounded-full"
                            >
                                ◀
                            </button>
                            <button
                                onClick={handleNextPhoto}
                                className="absolute right-2 top-1/2 -translate-y-1/2  text-white px-2 py-1 rounded-full"
                            >
                                ▶
                            </button>
                        </>
                    )}
                </div>
            )}

            {/*  Product Info */}
            <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <p className="text-sm text-gray-600">
                    Category: <span className="text-gray-700">{category}</span>
                </p>
                <p className="text-sm text-gray-600">
                    Stock:{" "}
                    <span className={`text-sm font-medium ${stock ? "text-green-600" : "text-red-600"}`}>
                        {stock ? "In Stock" : "Out of Stock"}
                    </span>
                </p>
                <p className="text-sm text-gray-600">
                    Price:{" "}
                    <span className="text-green-600 font-semibold">${price}</span>
                </p>
                {discount > 0 && (
                    <p className="text-sm text-gray-600">
                        Discount:{" "}
                        <span className="text-blue-600 font-semibold">${discount}</span>
                    </p>
                )}

                <hr />

                {/*  Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                    <button
                        onClick={handleDecrease}
                        className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-lg"
                    >
                        −
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-lg"
                    >
                        +
                    </button>
                </div>

                {/* 💵 Total Price */}
                <p className="text-sm text-gray-600 mt-2">
                    Total:{" "}
                    <span className="text-blue-600 font-bold">${grandTotal}</span>
                </p>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => removeFromCart(_id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!user}
                        onClick={handleCheckout}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDataCard;
