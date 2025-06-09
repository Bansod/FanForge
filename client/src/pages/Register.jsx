import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/TopBar";
import registerImage from "../assets/registerImage.jpg";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent form reload
        if (!formData.email || !formData.password) {
            setMessage("Email and password are required");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (res.ok) {
                navigate("/login");
            } else {
                setMessage(result.error || "Signup failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setMessage("Something went wrong");
        }
    };


    return (
  <div
    className="min-h-screen bg-cover bg-center animate-bgZoom"
    style={{ backgroundImage: `url(${registerImage})` }}
  >
    <div className="fixed top-0 left-0 right-0">
      <Topbar isShown={false} />
    </div>

    <div className="flex items-center justify-start min-h-screen px-[5vw] pt-[10vh]">
      {/* Left-aligned Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
        {message && (
          <p className="mb-4 text-red-600 text-sm text-center">{message}</p>
        )}

        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="email"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-2">
          Phone:
          <input
            type="text"
            name="phone"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-2">
          Address:
          <input
            type="text"
            name="address"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.address}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-4">
          Password:
          <input
            type="password"
            name="password"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  </div>
);

}
