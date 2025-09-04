import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';

const ManageOrderTable = ({ order, idx }) => {
    const axiosSucure = useAxiosSecure();
    const quaryClient = useQueryClient();

    //order delete
    const Mutation = useMutation({
        mutationFn: async (id) => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const res = await axiosSucure.delete(`/order/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return res.data;
            } catch (err) {
                const message = err.message;
                toast.error(message)
                
            }
        },
        onSuccess: () => {
            toast.success("Order deleted!");
            quaryClient.invalidateQueries(['userAllOrders']);
        },
        onError: () => {
            toast.error("Delete failed!");
        }
    });

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
                Mutation.mutate(id);
            }
        });
    };

    //order Acecpt 
    const acceptMutation = useMutation({
        mutationFn: async (id) => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const res = await axiosSucure.patch(`/order/accept/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return res.data;
            } catch (err) {

                throw new Error(err.response?.data?.message || "Accept failed!");
            }
        },
        onSuccess: (data) => {
            toast.success(data.message || "Order accepted!");
            quaryClient.invalidateQueries(['userAllOrders']);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleAccept = (id) => {
        acceptMutation.mutate(id);
    }

    return (
        <tr key={idx}>
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
                    {order?.status}
                </span>
            </td>
            <td className="py-3 px-4 flex gap-2">
                {
                    order?.status === 'Completed' ? "" : <button
                        onClick={() => handleAccept(order?._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                        Accept
                    </button>
                }

                <button
                    onClick={() => handleDelete(order?._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ManageOrderTable;