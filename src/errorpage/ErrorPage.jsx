import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
       <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="text-2xl mt-4 text-gray-700">Oops! Page Not Found</p>
            <p className="text-gray-500 mt-2">The page you are looking for does not exist or has been moved.</p>
            <Link
                to="/"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;