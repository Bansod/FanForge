// import React from "react";

// export default function Switch({ checked, onChange }) {
//   return (
//     <button
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
//         ${checked ? "bg-indigo-600" : "bg-gray-300"}`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-400
//           ${checked ? "translate-x-6" : "translate-x-1"}`}
//       />
//     </button>
//   );
// }


import React from "react";
import carouselImg from "../assets/carousel.png";
import gridImg from "../assets/grid.png";

export default function Switch({ checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <img src={carouselImg} alt="Carousel" className="h-7 w-7 object-contain" />
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-600 cursor-pointer
          ${checked ? "bg-black" : "bg-[#9a8305] border-2"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-600 cursor-pointer
            ${checked ? "translate-x-6 bg-[#9a8305]" : "translate-x-1 bg-black"}`}
        />
      </button>
      <img src={gridImg} alt="Grid" className="h-5 w-5 object-contain" />
    </div>
  );
}
