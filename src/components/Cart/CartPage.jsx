import React from 'react';
import { useCart } from '../../contaxts/CartContext/CartContext';
import CartDataCard from './CartDataCard';

const CartPage = () => {
    const { cartItems, removeFromCart, } = useCart();
    return (
        <div className="p-4 mt-3 mb-16">
            <h2 className="text-xl font-bold text-center mb-2">🛒 Your Cart</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <CartDataCard key={item._id} item={item} removeFromCart={removeFromCart} />
                    ))
                ) : (


                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">Your cart is empty</p>
                    </div>

                )}
            </div>
        </div>
    );
};

export default CartPage;