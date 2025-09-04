import React, { useEffect, useState } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from "@tanstack/react-query";
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

const useRole = () => {
    const { user, loading } = useAuth();

    const axiosSecure = useAxiosSecure();

    const { data: role, isLoading: isRoleLoading } = useQuery({
        queryKey: ['role', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            try {
                const auth = getAuth();
                const currentUser = auth?.currentUser;
                if (!currentUser) return;
                const token = await currentUser?.getIdToken();

                const { data } = await axiosSecure(`${import.meta.env.VITE_API_URL}/users/role/${user?.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                return data;
            } catch (err) {
                
             const message = err.message;
             toast.error(message);

            }
        }

    });




    return [role?.role, isRoleLoading]

}
export default useRole;
