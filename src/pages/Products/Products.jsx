import React, { useEffect, useState, useMemo } from 'react';
import { useLoaderData } from 'react-router';
import ProductDataCard from '../ProductDataCard/ProductDataCard';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { HashLoader } from 'react-spinners';

const Products = () => {
    const productsData = useLoaderData();
    const [role, isRoleLoading] = useRole();
    const { user } = useAuth();
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    // Show All / Show Less state
    const [showAll, setShowAll] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState([]);

    //  Filter products by search text (memoized)
    const filteredProducts = useMemo(() => {
        const search = searchText.toLowerCase();
        return productsData.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.slug.toLowerCase().includes(search)
        );
    }, [productsData, searchText]);

    //  Sort products (memoized)
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);

            if (sortOrder === 'low') return priceA - priceB;
            if (sortOrder === 'high') return priceB - priceA;
            return 0;
        });
    }, [filteredProducts, sortOrder]);

    //  Update displayed products based on showAll
    useEffect(() => {
        setDisplayedProducts(showAll ? sortedProducts : sortedProducts.slice(0, 8));
    }, [sortedProducts, showAll]);

    if (isRoleLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );

    return (
        <div className="min-h-screen py-6 px-3">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Products
            </h1>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-end mb-7 mt-3">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by medicine name or slug"
                        className="input ring-2 ring-indigo-300 input-bordered w-full pl-3 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm md:text-base"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-auto">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="select select-bordered h-[40px] md:h-[44px] w-full md:w-auto shadow-sm text-sm md:text-base"
                    >
                        <option value="">Sort by Price</option>
                        <option value="low">Low Price</option>
                        <option value="high">High Price</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {productsData && productsData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedProducts.map(product => (
                        <ProductDataCard key={product._id} product={product} role={role} user={user} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No products available</p>
            )}

            {/* Show All / Show Less Button */}
            {productsData.length > 6 && (
                <div className='text-center mt-5'>
                    <button
                        onClick={() => setShowAll(prev => !prev)}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md ${showAll ? 'bg-purple-600' : ''}`}
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
