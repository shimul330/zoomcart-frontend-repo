import React from 'react';

import { NavLink } from 'react-router';

const MenuItem = ({ label, address, icon: Icon }) => {
    return (
        <NavLink
            to={address}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 my-3 rounded-lg transition-all duration-200
     hover:bg-gray-300 hover:text-black
     ${isActive ? 'bg-gray-300 text-green-800 font-medium shadow-sm' : 'text-gray-600'}`
            }
        >
            <Icon className='w-5 h-5' />
            <h4 className="text-[15px]"> {label} </h4>
        </NavLink>
    );
};

export default MenuItem;