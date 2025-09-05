import axios from 'axios';
import React, { useState } from 'react';

const Footer = () => {
    const [status, setStatus] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setStatus("");

        const fullName = e.target.fullName.value;
        const email = e.target.email.value;
        const message = e.target.message.value;

        const info = { fullName, email, message };

        try {
            const res = await axios.post("https://zoomcart-server-side.vercel.app/contact", info);

            if (res.data.success) {
                setStatus("Message sent successfully!");
                setTimeout(() => setStatus(""), 2000);
            } else {
                setStatus("Failed to send message.");
            }
        } catch (error) {
            setStatus("Error sending message.");
        } finally {
            setSending(false);
        }
    };

    return (
        <footer className="bg-gray-600 text-white py-8 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-evenly items-start md:items-center gap-6">

                {/* Left side */}
                <div className="text-left w-full md:w-auto">
                    <h1 className='text-2xl font-bold text-white mb-2'>ZoomCart Shop</h1>
                    <p className="text-sm">
                        © 2025 ZoomCart E-Commerce Platform. All rights reserved.
                    </p>
                </div>

                {/* Right side - Contact Form */}
                <div className="w-full md:w-auto text-left">
                    <h1 className='text-2xl font-bold text-white mb-3'>Contact</h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 w-full md:w-96"
                    >
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full name"
                            className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            className="px-3 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="message"
                            placeholder="Message"
                            rows="4"
                            className="px-3 py-2 rounded bg-gray-800 text-white w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            {sending ? "Sending..." : "Send"}
                        </button>
                        <p className="mt-2 text-sm">{status}</p>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
