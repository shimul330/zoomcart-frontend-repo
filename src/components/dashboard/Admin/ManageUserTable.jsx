import React, { useState } from 'react';
import UserUpdateRole from './UserUpdateModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';


const ManageUserTable = ({ user, }) => {
    const { email, role, status, _id } = user;
    const [isOpen, setIsOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const quaryClient = useQueryClient();

    //user delete
    const Mutation = useMutation({
        mutationFn: async (id) => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const res = await axiosSecure.delete(`/user/delete/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                return res.data;
            } catch (err) {
                toast.error(err)
                throw err;

            }
        },
        onSuccess: (data) => {
            toast.success("User deleted!");
            quaryClient.invalidateQueries(['users']);
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

    return (
        <tr>
            {/* Email */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>{email}</p>
            </td>

            {/* Role */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>{role}</p>
            </td>

            {/* Status */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p
                    className={`whitespace-no-wrap ${status === 'requested'
                        ? 'text-yellow-500'
                        : status === 'verified'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                >
                    {status ? status : 'Unavailable'}
                </p>
            </td>

            {/* Actions: Update Role + Delete */}
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm flex gap-2'>
                {/* Update Role Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className='relative cursor-pointer px-3 py-1 font-semibold text-green-900 bg-green-200 rounded-full hover:bg-green-300'
                >
                    Update Role
                </button>

                {/* Delete Button */}
                <button
                    onClick={() => handleDelete(_id)}
                    className='relative cursor-pointer px-3 py-1 font-semibold text-red-900 bg-red-200 rounded-full hover:bg-red-300'
                >
                    Delete
                </button>

                {/* Modal */}
                <UserUpdateRole
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    role={role}
                    userEmail={email}
                />
            </td>
        </tr>
    );
};

export default ManageUserTable;
