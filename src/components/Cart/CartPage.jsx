import React, { useEffect } from 'react';
import { useCart } from '../../contaxts/CartContext/CartContext';
import CartDataCard from './CartDataCard';
import useRole from '../../hooks/useRole';
import { HashLoader } from 'react-spinners';

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [role, isRoleLoading] = useRole();
    useEffect(() => {
        
        if (!isRoleLoading && role !== "user") {
            clearCart();
        }
    }, [role, isRoleLoading, clearCart]);

    if (isRoleLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color="#3B82F6" />
            </div>
        );
    }

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