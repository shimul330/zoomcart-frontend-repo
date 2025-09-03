import React from 'react';
import MenuItem from './MenuItem';
import { FaUsers } from 'react-icons/fa';

const AdminMenu = () => {
    return (
        <div>
            
            <MenuItem
                icon={FaUsers}
                label='Manage Products'
                address='/dashboard/manage-products'
            />
            <MenuItem
                icon={FaUsers}
                label='Manage Users'
                address='/dashboard/manage-users'
            />
            <MenuItem
                icon={FaUsers}
                label='Manage Orders'
                address='/dashboard/manage-orders'
            />
       

       
         
        </div>
    );
};

export default AdminMenu;