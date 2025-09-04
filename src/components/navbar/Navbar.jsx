import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useCart } from '../../contaxts/CartContext/CartContext';
import useRole from '../../hooks/useRole';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logOut } = useAuth();
    const { cartItems, clearCart } = useCart();
    const [role, isRoleLoading] = useRole();



    useEffect(() => {
        if (!isRoleLoading && role !== "user") {
            clearCart(); // cart clear
        }
    }, [role, isRoleLoading, clearCart]);

    const handleLogOut = async () => {
        try {
            await logOut();
            clearCart()
            toast.success("Logout Successful!");
            navigate('/');
        } catch (error) {
            toast.error("Logout failed!");

        }
    };


    const cartCount = (!isRoleLoading && role === "user") ? cartItems.length : 0;



    // Desktop menu list
    const list = (
        <>
            <NavLink to='/' className="hover:text-indigo-600">Home</NavLink>
            <NavLink to='/products' className="hover:text-indigo-600">Products</NavLink>
        </>
    );

    return (
        <div className='bg-white shadow sticky top-0   z-50'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto py-4 px-3'>
                {/* Logo */}
                <div>
                    <h1 className="text-xl font-semibold">ZoomCart</h1>
                </div>

                {/* Desktop Menu (Drawer খোলা থাকলে hide হবে) */}
                <div className={`hidden md:flex items-center gap-6 font-medium ${isOpen ? "hidden" : "flex"}`}>
                    {list}
                </div>

                {/* Cart + User (Desktop + Mobile) */}
                <div className="flex items-center gap-4 relative">
                    {/* Cart */}
                    <NavLink to='/cart' className="relative hover:text-indigo-600 flex items-center gap-1">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute top-[-5px] right-[-10px] bg-red-500 text-white text-xs px-2 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>

                    {/* User/Profile */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500"
                            >
                                <img
                                    src={user.photoURL || "https://i.ibb.co.com/xq9vwtqP/Flux-Dev-Create-a-bold-colorful-cartoonstyle-logo-for-a-You-Tub-3.jpg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 flex flex-col z-50">
                                    <Link to="/dashboard" className="px-3 py-2 hover:bg-indigo-100 rounded-md" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                                    <button onClick={() => { handleLogOut(); setDropdownOpen(false); }} className="px-3 py-2 text-left hover:bg-red-100 rounded-md">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to='/login'>
                            <button className="px-5 py-2 bg-indigo-600 text-white font-medium text-base rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition duration-300">
                                Login
                            </button>
                        </Link>
                    )}

                    {/* Mobile Hamburger */}
                    <div className='md:hidden ml-2'>
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <></> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed md:hidden top-0 left-0 h-full w-64 bg-white shadow-lg z-40 px-3 py-3 flex flex-col"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                    >
                        <div className='relative flex flex-col px-2 gap-4 py-4 font-medium'>
                            {/* Close Button */}
                            <div className='absolute top-0 right-0'>
                                <button className='bg-gray-300 hover:bg-blue-500 rounded-full' onClick={() => setIsOpen(false)}>
                                    <X size={28} className='text-black hover:text-white' />
                                </button>
                            </div>

                            {/* Mobile Menu Links */}
                            <div className='flex flex-col mt-4 gap-4'>
                                <NavLink to='/' className="hover:text-indigo-600" onClick={() => setIsOpen(false)}>Home</NavLink>
                                <NavLink to='/products' className="hover:text-indigo-600" onClick={() => setIsOpen(false)}>Products</NavLink>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
