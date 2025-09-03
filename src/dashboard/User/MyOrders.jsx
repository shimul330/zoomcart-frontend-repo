import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const MyOrders = () => {
    const axiosSucure = useAxiosSecure();
    const { user } = useAuth();

    // TanStack Query to fetch orders by user email
    const { data: orders, isLoading, isError, error } = useQuery({
        queryKey: ['userOrders', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();
                const res = await axiosSucure(`/users/order/${user?.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return res.data;
            } catch (err) {
                toast.error(`Error fetching user orders: ${err.message}`);
                throw new Error(err.response?.data?.message || err.message || "Failed to fetch orders");
            }
        },
        enabled: !!user?.email
    });



    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    )

    if (isError) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-red-500 text-lg">
                {error.response?.data?.message || "Something went wrong!"}
            </p>
        </div>
    );


    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Quantity & TotalPrice</th>
                            <th className="py-2 px-4 text-left">GrandTotal</th>
                            <th className="py-2 px-4 text-left">Payment Method</th>
                            <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, idx) => (
                                <tr key={idx} className="border-b last:border-b-0">
                                    <td className="py-3 px-4">{order?.user}</td>
                                    <td className="py-3 px-4">
                                        {order?.quantity || 0} pcs / ${order?.totalPrice || 0}
                                    </td>
                                    <td className="py-3 px-4">${order?.grandTotal || 0}</td>
                                    <td className="py-3 px-4">{order?.paymentMethod}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-white text-sm ${order?.status === 'Pending'
                                                ? 'bg-yellow-500'
                                                : order?.status === 'Completed'
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-400'
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrders;