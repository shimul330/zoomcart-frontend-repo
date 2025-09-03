import React from 'react';
import useRole from '../hooks/useRole';
import { HashLoader } from 'react-spinners';
import ManageProducts from '../dashboard/Admin/ManageProducts';
import MyOrders from '../dashboard/User/MyOrders';

const DefaultDashboard = () => {
    const [role, isRoleLoading] = useRole();

    if (isRoleLoading) {
        return (
            <div className="flex justify-center py-10">
                <HashLoader />
            </div>
        );
    };

    if (role === 'admin') {
        return <ManageProducts />;
    }
    if (role === 'user') {
        return <MyOrders />;
    }

    return (
        <div className="text-center py-10 text-gray-600 text-lg">
            Welcome to your Dashboard!
        </div>
    );
};

export default DefaultDashboard;