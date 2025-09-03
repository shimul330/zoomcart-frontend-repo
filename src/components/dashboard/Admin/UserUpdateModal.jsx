import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const UserUpdateRole = ({ isOpen, setIsOpen, role, userEmail }) => {
    const [updatedRole, setUpdatedRole] = useState(role);
    const axiosSecure = useAxiosSecure();
    const quaryClient = useQueryClient();

    function close() {
        setIsOpen(false)
    }

    //user role update
    const mutation = useMutation({
        mutationFn: async (role) => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const { data } = await axiosSecure.patch(`/user/role/update/${userEmail}`, { role }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                return data;
            } catch (err) {
                toast.error(err)
                throw err;
                
            }
        },
        onSuccess: (data) => {
            toast.success("User role updated!");
            setIsOpen(false);
            quaryClient.invalidateQueries(['users'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(updatedRole)
    }




    return (
        <Dialog
            open={isOpen}
            as='div'
            className='relative z-10 focus:outline-none'
            onClose={close}
        >
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-4'>
                    <DialogPanel
                        transition
                        className='w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl'
                    >
                        <DialogTitle
                            as='h3'
                            className='text-base/7 font-medium text-black'
                        >
                            Update User Role
                        </DialogTitle>
                        <form onSubmit={handleSubmit} >
                            <div>
                                <select
                                    value={updatedRole}
                                    onChange={e => setUpdatedRole(e.target.value)}
                                    className='w-full my-3 border border-gray-200 rounded-xl px-2 py-3'
                                    name='role'
                                    id=''
                                >
                                    <option value='user'>User</option>
                                    <option value='admin'>Admin</option>
                                </select>
                            </div>
                            <div className='flex justify-between mt-5'>
                                <button
                                    type='submit'
                                    className='bg-green-400 py-2 px-3 cursor-pointer text-gray-700 rounded-xl '
                                >
                                    Update
                                </button>
                                <button
                                    onClick={close}
                                    type='button'
                                    className='bg-red-400 py-2 px-3 cursor-pointer text-gray-700 rounded-xl'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default UserUpdateRole;