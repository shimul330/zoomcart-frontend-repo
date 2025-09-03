import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import { HashLoader } from 'react-spinners';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader />
        </div>
    );

    if (!user) {
        return <Navigate to='/login' state={location.pathname} ></Navigate>
    }
    return children;
};

export default PrivateRoute;