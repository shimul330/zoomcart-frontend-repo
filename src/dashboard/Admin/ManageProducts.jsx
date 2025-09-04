import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ManageProductTable from '../../form/ManageProductTable';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HashLoader } from 'react-spinners';
import ManageproductTable from '../../components/dashboard/Admin/ManageproductTable';
import { getAuth } from 'firebase/auth';

const ManageProducts = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Multiple Images Upload to imgbb
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setLoading(true);
        try {
            const urls = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append("image", file);

                const res = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
                    formData
                );
                urls.push(res.data.data.url);
            }

            setImageUrls(urls);
            toast.success("Images uploaded successfully!");
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Something went wrong";
            toast.error(message)
        } finally {
            setLoading(false);
        }
    };

    // Form Submit
    const onSubmit = async (data) => {
        if (!imageUrls.length) {
            toast.error("Please upload at least one image!");
            return;
        }

        setIsUploading(true);

        const productData = {
            name: data.name,
            slug: data.slug,
            price: parseFloat(data.price),
            discount: parseFloat(data.discount) || 0,
            stock: data.stock,
            status: data.status,
            category: data.category,
            photos: imageUrls,
        };

        try {
            const auth = getAuth();
            const currentUser = auth?.currentUser;
            if (!currentUser) return;
            const token = await currentUser?.getIdToken();
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.insertedId || res.data.success) {
                toast.success("Product added successfully!");
                reset();
                setImageUrls([]);
                queryClient.invalidateQueries({ queryKey: ["products"] });
            }
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Something went wrong";
            toast.error(message)
        } finally {
            setIsUploading(false);
        }
    };

    //get product data
    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const { data } = await axiosSecure('/all-product', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return data || [];
            } catch (err) {
                if (!err.response || err.response.status !== 404) {
                    const message = err?.response?.data?.message || err.message || "Something went wrong";
                    toast.error(message);
                }
                return []; 
            }
        }
    })

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 ">
            <h2 className="text-xl font-bold text-center mb-4">Add / Manage Product</h2>
            <div className="mb-4">
                <button
                    className="px-4 py-2 bg-blue-700 rounded-xl text-white hover:bg-blue-600"
                    onClick={() => setShowModal(true)}
                >
                    Add Product
                </button>
            </div>
            {/* modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <ManageProductTable
                                register={register}
                                errors={errors}
                                loading={loading}
                                handleImageUpload={handleImageUpload}
                            />

                            {/* Save / Cancel buttons */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-700 rounded-xl text-white hover:bg-blue-600"
                                >
                                    {isUploading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-amber-700 rounded-xl text-white hover:bg-amber-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white rounded-xl shadow-md">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-gray-700 font-medium uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-center text-gray-700 font-medium uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products?.length > 0 ? (
                            products.map((product) => (
                                <ManageproductTable key={product._id} product={product} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-6 text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>

    );
};

export default ManageProducts;
