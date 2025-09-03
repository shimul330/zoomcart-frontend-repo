import React, { useState } from 'react';
import { Link } from 'react-router';
import { Dialog } from '@headlessui/react';
import ProductSingleData from '../productsingledata/ProductSingleData';
import { useCart } from '../../contaxts/CartContext/CartContext';


const ProductDataCard = ({ product, role, user }) => {
    const [selectedImage, setSelectedImage] = useState(product.photos[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { cartItems, addToCart, removeFromCart } = useCart();


    //  check if product is already in cart
    const isInCart = cartItems.some(item => item.productId === product._id);

    const handleViewCart = () => {
        // find the item from cartItems by productId
        const cartItem = cartItems.find(item => item.productId === product._id);
        if (cartItem) {
            setSelectedProduct(cartItem);
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className="max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl">
                {/* Product Image */}
                <div className="w-full h-64 md:h-72 lg:h-60 flex items-center justify-center overflow-hidden">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-xl"
                    />
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-2 p-2 overflow-x-auto">
                    {product.photos.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`${product.name}-${index}`}
                            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img ? 'border-indigo-500' : 'border-gray-200'}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                    <p className="text-sm text-gray-500">Slug: {product.slug}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                        {product.discount && <span className="text-sm text-red-500">{product.discount}% Off</span>}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className={`text-sm font-medium ${product.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                            {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{product.category}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-3">
                        {isInCart ? (
                            <button
                                onClick={handleViewCart} // modal open
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                View Cart
                            </button>
                        ) : (
                            <button
                                disabled={!user || role !== 'user'}
                                onClick={() => addToCart(product)}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                            >
                                Add to Cart
                            </button>
                        )}
                        <Link to={`/products/${product._id}`} className="flex-1">
                            <button className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
                                Details
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                {/* Overlay */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Centered Panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-bold mb-4">Cart Item</Dialog.Title>

                        {selectedProduct && (
                            <ProductSingleData
                                item={selectedProduct}
                                removeFromCart={removeFromCart}
                                closeModal={() => setIsModalOpen(false)}
                            />
                        )}

                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

        </>
    );
};

export default ProductDataCard;
