import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { getAuth } from 'firebase/auth';

const Shipping = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const location = useLocation();
    const { product, quantity, totalPrice, grandTotal } = location.state;


    const onSubmit = async (data) => {
        // cash on delivery checkbox check
        if (!data.cod) {
            toast.error("Please select Cash on Delivery before placing order.");
            return;
        }

        const { _id, ...productWithoutId } = product;


        const orderedData = {
            user: user?.email,
            shipping: {
                fullName: data.fullName,
                address: data.address,
                city: data.city,
                phone: data.phone,
            },
            productId: _id,
            product: productWithoutId,
            quantity: quantity,
            totalPrice: totalPrice,
            grandTotal: grandTotal,
            paymentMethod: "Cash on Delivery",
            status: "Pending",
            createdAt: new Date(),
        };

        try {
            const auth = getAuth();
            const currentUser = auth?.currentUser;
            if (!currentUser) return;
            const token = await currentUser?.getIdToken();

            await axios.post('https://zoomcart-server-side.vercel.app/order', orderedData,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Order placed successfully!");
            reset();
        } catch (err) {
            if (err.response && err.response.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.err("Something went wrong!");
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg mt-6 mb-16">
            <Link to='/cart'>
                <button className='px-2 py-2 bg-blue-700 text-white rounded-full'>  <ArrowLeft size={22} /></button>
            </Link>
            <h2 className="text-xl text-center font-bold mb-4">Shipping Information</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

                {/* Full Name */}
                <div>
                    <input
                        {...register("fullName", { required: "Full Name is required" })}
                        placeholder="Full Name"
                        className="border p-2 rounded w-full"
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <input
                        {...register("address", { required: "Address is required" })}
                        placeholder="Address"
                        className="border p-2 rounded w-full"
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address.message}</p>
                    )}
                </div>

                {/* City */}
                <div>
                    <input
                        {...register("city", { required: "City is required" })}
                        placeholder="City"
                        className="border p-2 rounded w-full"
                    />
                    {errors.city && (
                        <p className="text-red-500 text-sm">{errors.city.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <input
                        {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Enter a valid phone number",
                            },
                        })}
                        placeholder="Phone"
                        className="border p-2 rounded w-full"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                </div>

                {/* Cash on Delivery Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register("cod", { required: true })}
                        className="w-4 h-4"
                    />
                    <label className="text-gray-700">Cash on Delivery</label>
                </div>
                {errors.cod && (
                    <p className="text-red-500 text-sm">You must select Cash on Delivery</p>
                )}

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-3"
                >
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default Shipping;
