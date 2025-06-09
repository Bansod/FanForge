import React, { useEffect, useState } from "react";
import { FaUserCircle, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Topbar({ isShown }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="w-full h-[10vh] bg-[#28282B] shadow flex items-center justify-between px-6">
      <div className="text-xl font-bold animated-text-gradient cursor-pointer" onClick={() => { navigate("/home") }}>
        FanForge
      </div>


      {isShown && (
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <button
                aria-label="Wishlist"
                className="text-[#9a8305] hover:text-red-600 transition-colors"
              >
                <FaHeart size={25} />
              </button>
              <button
                aria-label="Cart"
                className="text-[#9a8305] hover:text-yellow-300 transition-colors"
              >
                <FaShoppingCart size={25} />
              </button>
              <button
                aria-label="Profile"
                className="text-blue-600 hover:text-[#3592b7] transition-colors"
              >
                <FaUserCircle size={30} />
              </button>
            </>
          ) : (
            <div className="flex justify-between gap-x-3">
              <button
                onClick={() => { navigate("/login") }}
                className="text-[#9a8305] font-bold border-2 border-[#9a8305] px-4 py-1 rounded hover:bg-[#9a8305] hover:text-[#0A1D66] transition-colors ease-in-out duration-300 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => { navigate("/register") }}
                className="text-[#660408] font-bold border-2 border-[#660408] px-4 py-1 rounded hover:bg-[#660408] hover:text-[#9a8305] transition-colors ease-in-out duration-300 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
