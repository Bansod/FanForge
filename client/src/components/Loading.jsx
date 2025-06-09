import React from "react";
import flyingImage from "../assets/flying.png";

export default function Loading() {
  return (
    <div className="flex items-center justify-center relative w-full h-screen overflow-hidden">
      <img
        src={flyingImage}
        alt="Flying"
        className="absolute top-1/2 left-0 transform -translate-y-[20vh] animate-slide-x"
        style={{ width: "150px" }}
      />
      <h1 className="text-3xl font-bold text-[#3a3a3a] uppercase">Loading</h1>
    </div>
  );
}
