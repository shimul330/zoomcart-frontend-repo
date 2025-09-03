import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ManageProductModal from './ManageProductModal';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const ManageproductTable = ({ product }) => {
    const axiosSecure = useAxiosSecure();
    const quaryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    //product delete
    const Mutation = useMutation({
        mutationFn: async (id) => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const res = await axiosSecure.delete(`/product/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                return res.data;
            } catch (error) {
                toast.error(err)
                throw err;
            }
        },
        onSuccess: (data) => {
            toast.success("product deleted!");
            quaryClient.invalidateQueries(['products']);
        },
        onError: (err) => {
            toast.error("Delete failed!");
        }
    })

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Mutation.mutate(id)
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }


    // updated Multiple Images Upload to imgbb 
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
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`, // 🔥 এখানে VITE_image_upload_key → VITE_IMAGE_UPLOAD_KEY
                    formData
                );
                urls.push(res.data.data.url);
            }

            setImageUrls(urls);
            toast.success("Images uploaded successfully!");
        } catch (err) {
            console.error("Image upload failed", err);
            toast.error("Image upload failed!");
        } finally {
            setLoading(false);
        }
    };

    // Add useMutation for update
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const { _id, ...rest } = data;
                const res = await axiosSecure.patch(`/product/update/${_id}`, rest, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return res.data;
            } catch (error) {
                toast.error(err)
                throw err;

            }
        },
        onSuccess: () => {
            toast.success("Product updated successfully!");
            quaryClient.invalidateQueries(['products']);
            setShowModal(false);
        },
        onError: () => {
            toast.error("Update failed!");
        },
    });

    // handle submit from modal
    const onSubmit = (formData) => {
        const payload = {
            _id: product._id,
            ...formData,
            photos: imageUrls.length > 0 ? imageUrls : product.photos
        };
        updateMutation.mutate(payload);
    };

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-2">{product.name}</td>
            <td className="p-2">
                <span className="font-semibold text-blue-600">
                    {product.price}৳
                </span>
                {product.discount > 0 && (
                    <span className="text-sm text-red-500 ml-1">
                        (-{product.discount}%)
                    </span>
                )}
            </td>
            <td className="p-2">{product.stock}</td>
            <td className="p-2">{product.category}</td>
            <td className="p-2 flex gap-2 justify-center">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500"
                >
                    Update
                </button>
                <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500"
                >
                    Delete
                </button>

                {/* modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                        <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative">
                            <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <ManageProductModal
                                    register={register}
                                    errors={errors}
                                    product={product}
                                    loading={loading}
                                    handleImageUpload={handleImageUpload}
                                />

                                {/* Save / Cancel buttons */}
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-700 rounded-xl text-white hover:bg-blue-600"
                                    >
                                        {updateMutation.isLoading ? "Saving..." : "Save"}
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
            </td>
        </tr>
    );
};

export default ManageproductTable;