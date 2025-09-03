import React from 'react';
import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/footer/Footer';

const MainLayout = () => {
    return (
        <div>
       
             <Navbar/>
     
            <main className='min-h-[calc(100vh-472px)] max-w-7xl mx-auto'>
                <Outlet></Outlet>
            </main>
            <Footer/>
        </div>
    );
};

export default MainLayout;