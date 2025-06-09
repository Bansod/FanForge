import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/TopBar.jsx";
import photo from "../assets/photo.jpg"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    async function loginUser(data) {
        const res = await fetch(`http://localhost:5000/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return res.json();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        const response = await loginUser({ email, password, rememberMe });

        if (response.accessToken) {
            setMessage("Login successful!");
            if (rememberMe) {
                localStorage.setItem("accessToken", response.accessToken);
            } else {
                sessionStorage.setItem("accessToken", response.accessToken);
            }
            navigate("/home");
        } else {
            setMessage(response.error || "Login failed");
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background Image */}
            <div
                className="absolute inset-0 right-0 bottom-0 top-[10vh] bg-cover bg-center bg-zoom"
                style={{ backgroundImage: `url(${photo})`, zIndex: -1 }}
            ></div>

            {/* Topbar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Topbar isShown={false} />
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col md:flex-row justify-between gap-x-[35vw] items-center px-[5vw] min-h-screen">
                {/* Left Text - Hidden on mobile */}
                <div className="hidden md:block w-1/2 text-white text-left">
                    <h1 className="text-6xl font-bold mb-4 w-[30rem]">Welcome Back!</h1>
                    <p className="text-lg w-[20rem]">
                        Sign in to continue shopping with us. Explore our exclusive merchandise now.
                    </p>
                </div>

                {/* Right: Login Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded shadow-md w-full md:w-[40rem] md:my-0 my-auto md:mt-0"
                >
                    <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
                    {message && (
                        <p className="mb-4 text-red-600 text-sm text-center">{message}</p>
                    )}

                    <label className="block mb-2">
                        Email:
                        <input
                            type="email"
                            required
                            className="w-full border p-2 rounded mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="block mb-4">
                        Password:
                        <input
                            type="password"
                            required
                            className="w-full border p-2 rounded mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <label className="inline-flex items-center mb-2 text-sm">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="mr-2"
                        />
                        Remember me
                    </label>

                    <button
                        type="submit"
                        className="bg-blue-600 w-full text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-700 mt-6 gap-2">
                        <p>
                            Don’t have an account?{" "}
                            <a href="/register" className="text-blue-600 hover:underline">
                                Register here
                            </a>
                        </p>
                        <p>
                            <a href="/forgot-password" className="text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );


}
