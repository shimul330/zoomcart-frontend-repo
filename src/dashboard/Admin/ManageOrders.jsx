import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { HashLoader } from 'react-spinners';
import ManageOrderTable from '../../components/dashboard/Admin/ManageOrderTable';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

const ManageOrders = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: orders = [], isLoading, isError, error } = useQuery({
        queryKey: ['userAllOrders'],
        queryFn: async () => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return [];
                const token = await currentUser.getIdToken();

                const res = await axiosSecure(`/all-oders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return res.data || [];
            } catch (err) {
                
                if (!err.response || err.response.status !== 404) {
                    const message = err?.response?.data?.message || err.message || "Something went wrong";
                    toast.error(message);
                }
                return [];
            }
        },
        enabled: !!user?.email
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );

    if (isError) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-red-500 text-lg">
                {error?.response?.data?.message || "Something went wrong!"}
            </p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Manage Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-none">
                    <thead className="bg-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Quantity & Total Price</th>
                            <th className="py-2 px-4 text-left">Grand Total</th>
                            <th className="py-2 px-4 text-left">Payment Method</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, idx) => (
                                <ManageOrderTable key={order._id} order={order} idx={idx} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;
