

import { createContext, useState, useContext, useEffect } from "react";

import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";


const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    // Fetch Cart Items
    const fetchCart = async () => {
        if (!user?.email) return;

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            const token = await currentUser?.getIdToken();

            const res = await axios.get(`https://zoomcart-server-side.vercel.app/cart/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCartItems(res.data);
        } catch (error) {
            const message = err?.response?.data?.message || err.message || "Something went wrong";
            toast.error(message)
        }
    };

    useEffect(() => {
        if (!user || !user.email) return;

        fetchCart();
    }, [user]);


    // CART ADD
    const addToCart = async (medicine) => {

        try {
            const auth = getAuth();
            const currentUser = auth?.currentUser;
            if (!currentUser) return;
            const token = await currentUser?.getIdToken();

            const { _id, ...rest } = medicine;
            const item = { email: user.email, ...rest, productId: _id };
            const res = await axios.post('https://zoomcart-server-side.vercel.app/cart', item, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.insertedId) {
                const updated = await axios.get(`https://zoomcart-server-side.vercel.app/cart/${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCartItems(updated.data);
                toast.success("Product added successfully")
            }
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Something went wrong";
            toast.error(message)
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };



    // CART DELETE
    const removeFromCart = async (id) => {

        try {
            const auth = getAuth();
            const currentUser = auth?.currentUser;
            if (!currentUser) return;
            const token = await currentUser?.getIdToken();

            await axios.delete(`https://zoomcart-server-side.vercel.app/cart/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setCartItems(prev => prev.filter(item => item._id !== id));
            toast.success("Removed from cart");
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(message)
        }


    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// useCart Hook
export const useCart = () => {
    return useContext(CartContext);
};

