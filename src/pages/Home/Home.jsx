import React from 'react';
import Banner from './Banner';
import Catagory from './Catagory';
import DiscountProducts from './DiscountProducts';

const Home = () => {
    return (
         <div>
     
            <div className='mt-5 mb-5'>
                <Banner/>
            </div>
            <div className='mt-5 mb-5'>
                <Catagory/>
            </div>
            <div className='mt-5 mb-8'>
               <DiscountProducts/>
            </div>
        </div>
    );
};

export default Home;