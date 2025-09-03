import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';


const Login = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const onSubmit = async (data) => {
        loginUser(data.email, data.password)
            .then(result => {
                toast.success('login successfull');
                navigate("/")
            })
            .catch(error => {
                let message = 'Login failed';

                // Firebase auth error codes
                if (error.code === 'auth/user-not-found') {
                    message = 'Email not registered';
                } else if (error.code === 'auth/wrong-password') {
                    message = 'Incorrect password';
                } else if (error.code === 'auth/invalid-email') {
                    message = 'Invalid email format';
                } else if (error.code === 'auth/invalid-credential') {
                    message = 'Invalid credentials';
                }

                toast.error(message);
            })
    }
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true, minLength: 6 })}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {
                            errors.password?.type === "required" && <p className='text-red-500'>Password is required</p>
                        }
                        {
                            errors.password?.type === "minLength" && <p className='text-red-500'>Password must be 6 characters</p>
                        }
                    </div>
                    <div className="mb-4 text-right">
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                    <p className='mt-2'>Don't have an account <Link className='text-blue-600 underline' to='/register'>Register</Link> </p>
                </form>

            </div>
        </div>
    );
};

export default Login;