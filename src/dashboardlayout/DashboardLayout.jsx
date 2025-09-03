import React, { useState } from 'react';
import { Link, Outlet } from 'react-router';
import { Menu, X, } from 'lucide-react';
import AdminMenu from '../dashboard/sidebar/menu/AdminMenu';
import UserMenu from '../dashboard/sidebar/menu/UserMenu';
import useRole from '../hooks/useRole';
import { HashLoader } from 'react-spinners';

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [role, isRoleLoading] = useRole();

    if (isRoleLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="lg:flex">
                {/* Sidebar for desktop */}
                <aside className="hidden lg:block w-64 bg-white shadow-md p-4 h-screen fixed">
                    <Link to='/'>
                        <h1 className='text-2xl font-bold'>Dashboard</h1>
                    </Link>
                    <div className="space-y-4 mt-6">
                        <nav>
                            {role === 'user' && <UserMenu />}
                            {role === 'admin' && <AdminMenu />}


                        </nav>
                    </div>
                </aside>

                {/* Sidebar for mobile with animation */}
                <div
                    className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-30"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Sliding Sidebar */}
                    <aside
                        className={`w-64 bg-white shadow-md p-4 h-full absolute left-0 top-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Dashboard</h2>
                            <button onClick={() => setIsOpen(false)}>
                                <X size={28} />
                            </button>
                        </div>
                        <nav>
                            {role === 'user' && <UserMenu />}
                            {role === 'admin' && <AdminMenu />}
                        </nav>
                    </aside>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-64">
                    {/* Mobile top bar */}
                    <div className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-30">
                        <Link to='/'> <h2 className="text-lg font-semibold">Dashboard</h2></Link>
                        <button onClick={() => setIsOpen(true)}>
                            <Menu size={28} />
                        </button>
                    </div>

                    <main className="p-4 sm:p-6 space-y-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;