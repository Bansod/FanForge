// import React from "react";

// export default function ClothingCard({ imageSrc, name, price }) {
//   return (
//     <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
//       <img src={imageSrc} alt={name} className="w-full h-48 object-cover" />
//       <div className="p-4 flex flex-col justify-between h-32">
//         <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
//         <p className="text-gray-600 mt-auto">{price ? `$${price}` : "Price TBD"}</p>
//       </div>
//     </div>
//   );
// }


// import React from "react";

// export default function ClothingCard({ imageSrc, name, price }) {
//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[10rem] h-[20rem] md:w-[15rem] md:h-[20rem]">
//       <img
//         src={imageSrc}
//         alt={name}
//         className="w-full h-2/3 object-cover"
//       />
//       <div className="p-2 flex flex-col justify-between h-1/3">
//         <h3 className="text-sm font-semibold text-gray-800 truncate">{name}</h3>
//         <p className="text-xs text-gray-600 mt-auto">{price ? `$${price}` : "Price TBD"}</p>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import hero1 from "../assets/hero1.jpeg"
import hero2 from "../assets/hero2.jpg"

export default function ClothingCard({ image1, image2, name, price }) {
    const [activeImage, setActiveImage] = useState(0); // 0 or 1
    const [hovering, setHovering] = useState(false);
    const intervalRef = useRef(null);

    // On hover, start carousel; on leave, reset
    useEffect(() => {
        if (hovering) {
            const timeout = setTimeout(() => {
                intervalRef.current = setInterval(() => {
                    setActiveImage((prev) => 1 - prev);
                }, 1500);
            }, 0);

            return () => {
                clearTimeout(timeout);
                clearInterval(intervalRef.current);
            };
        } else {
            setActiveImage(0); // reset to first image
            clearInterval(intervalRef.current);
        }
    }, [hovering]);

    return (
        <div
            className="group bg-[#9a8305] border-2 border-[#3a3a3a] rounded-lg shadow-lg overflow-hidden w-[10rem] h-[15rem] md:w-[15rem] md:h-[20rem] relative"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* Image Slider */}
            <div className="relative w-full h-2/3 overflow-hidden p-2">
                <div
                    className="flex w-[200%] h-full transition-transform duration-700"
                    style={{ transform: `translateX(-${activeImage * 50}%)` }}
                >
                    <img
                        src={image1}
                        alt={name}
                        className="w-full h-full object-cover rounded-md mr-4"
                    />
                    <img
                        src={image2}
                        alt={name}
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
            </div>

            {/* Tab Indicator */}
            <div className="absolute bottom-2/5 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${activeImage === i ? "bg-black" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>

            <div className="p-2 flex flex-col justify-between h-1/3">
                <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
                <p className="text-sm font-bold text-gray-[#3a3a3a] self-end">{price ? `${price}` : "Price TBD"}</p>
            </div>
        </div>
    );
}

