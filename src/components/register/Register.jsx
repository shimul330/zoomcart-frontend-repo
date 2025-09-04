import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";


const Register = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [profilePic, setProfilePic] = useState("");
    const [loading, setLoading] = useState(false);
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    // Image Upload Handler
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append("image", image);

        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

        try {
            setLoading(true);
            const res = await axios.post(imageUploadUrl, formData);
            setProfilePic(res.data.data.url);
            setLoading(false);
        } catch (err) {
            console.error("Image upload failed", err);
            setLoading(false);
        }
    };

    // Form Submit Handler
    const onSubmit = async (data) => {

        if (!profilePic) {
            toast.error("Please upload a profile picture!");
            return;
        }


        try {
            // Step 1: Create Firebase User
            const result = await createUser(data.email, data.password);

            // Step 2: Update Firebase Profile
            const userProfile = {
                displayName: data.name,
                photoURL: profilePic
            };
            await updateUserProfile(userProfile);

            // Step 3: Save user in backend

            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "user",
                photo: profilePic,
            };


            const res = await axios.post("https://zoomcart-server-side.vercel.app/users", userData);

            toast.success("Registration Successful ✅");
            reset();
            setProfilePic("");
            navigate("/")
        } catch (error) {
            toast.error("Registration failed ❌: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create an account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        {errors.name && <p className="text-red-500">Name is required</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {loading && <p className="text-blue-500">Uploading image...</p>}

                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        {errors.email && <p className="text-red-500">Email is required</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                            })}
                            placeholder="Enter a strong password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        {errors.password?.type === "required" && (
                            <p className="text-red-500">Password is required</p>
                        )}
                        {errors.password?.type === "minLength" && (
                            <p className="text-red-500">
                                Password must be at least 8 characters
                            </p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p className="text-red-500">
                                Password must include uppercase, lowercase, number & special character
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Register
                    </button>
                    <p className="mt-2">
                        Already have an account?{" "}
                        <Link className="text-blue-600 underline" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
