import React from 'react';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import MenuItem from './MenuItem';



const UserMenu = () => {
    return (
        <div>
            <MenuItem icon={FaMoneyCheckAlt} label='My Orders' address='/dashboard/my-orders'></MenuItem>
           
        </div>
    );
};

export default UserMenu;