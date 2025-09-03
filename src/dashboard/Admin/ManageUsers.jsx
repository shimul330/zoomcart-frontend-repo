import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { HashLoader } from 'react-spinners';
import ManageUserTable from '../../components/dashboard/Admin/ManageUserTable';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const { data } = await axiosSecure('/all-user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return data;
            } catch (err) {
                const message = err?.response?.data?.message || err.message || "Something went wrong";
                toast.error(message)
            }
        }
    })

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );
    console.log(users)
    return (
        <div className='container mx-auto px-4 sm:px-8'>
            <h1 className='text-2xl font-bold text-center mb-3'>Manage Users</h1>
            <div className='py-8'>
                <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                    <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                        <table className='min-w-full leading-normal'>
                            <thead>
                                <tr>
                                    <th
                                        scope='col'
                                        className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                    >
                                        Role
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                    >
                                        Status
                                    </th>

                                    <th
                                        scope='col'
                                        className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users?.map(user => <ManageUserTable key={user?._id} user={user}></ManageUserTable>)
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManageUsers;