import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-2 mb-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="cursor-pointer px-1 py-2 bg-[#9a8305] border-2 border-black rounded hover:bg-black hover:text-[#9a8305] disabled:opacity-20 flex items-center justify-center"
      >
        <FaArrowLeft />
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`rounded cursor-pointer ${
            currentPage === index + 1
              ? "bg-black text-[#9a8305]  font-bold px-4 py-2"
              : "bg-[#9a8305] text-black border-2 border-[#3a3a3a] px-3 py-1"
          }`}
        >
          {index + 1}
        </button>
      ))}

<button
  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
  disabled={currentPage === totalPages}
  className="cursor-pointer px-1 py-2 bg-[#9a8305] border-2 border-black rounded hover:bg-black hover:text-[#9a8305] disabled:opacity-20 flex items-center justify-center"
>
  <FaArrowRight />
</button>
    </div>
  );
}
