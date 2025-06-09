import React, { useEffect, useState } from "react";
import Topbar from "../components/TopBar";
import ToastProvider from "../components/ToastProvider";
import { toast } from "react-toastify";
import {
    WhatsappShareButton,
    WhatsappIcon,
} from "react-share";
import { FaInstagram, FaLink, FaHeart } from "react-icons/fa";
import Loading from "../components/Loading.jsx";
import { useNavigate } from "react-router-dom";

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const token = localStorage.getItem("accessToken");
    const isLoggedIn = !!token;
    const navigate = useNavigate();

    const handleClick = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setShowAuthPopup(true);
        } else {

        }
    };

    const queryParams = new URLSearchParams(window.location.search);
    const productId = queryParams.get("id");
    const categoryId = queryParams.get("categoryId");

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${productId}`);
                const data = await res.json();
                setProduct(data);
                setCurrentImageIndex(0);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (!categoryId) return;

        const fetchSimilarProducts = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/category/${categoryId}`);
                const data = await res.json();
                setSimilarProducts(data.filter(item => item.productId !== Number(productId)));
            } catch (error) {
                console.error("Failed to fetch similar products:", error);
            }
        };

        fetchSimilarProducts();
    }, [categoryId, productId]);

    const AuthPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg w-80 shadow-lg relative">
                {/* Close button top-right */}
                <button
                    onClick={() => setShowAuthPopup(false)}
                    aria-label="Close popup"
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4">Please Log In</h2>
                <p className="mb-6">You need to be logged in or have an account to proceed.</p>

                {/* Buttons at the bottom */}
                <div className="flex justify-between gap-x-4 mt-8">
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );



    if (!product) return <Loading />;

    const images = product.images
        ? Object.values(product.images).filter(Boolean)
        : [];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="w-full min-h-screen flex flex-col overflow-hidden bg-[#3a3a3a]">

            {/* Topbar */}
            <div className="h-[10vh] flex-shrink-0">
                <Topbar isShown={true} />
            </div>

            {/* Scrollable Content */}
            <div className="h-[90vh] overflow-auto px-[5%] py-[2%]">
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    {/* Left column - Carousel */}
                    <div className="md:w-1/2 flex flex-col items-center">
                        {images.length > 0 ? (
                            <>
                                <div className="relative w-full max-w-md h-[400px]">
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={`${product.name} image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-contain rounded-md"
                                    />
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                    >
                                        &#10094;
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                    >
                                        &#10095;
                                    </button>
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Thumbnail ${i + 1}`}
                                            className={`w-16 h-16 object-contain rounded cursor-pointer border-2 ${i === currentImageIndex ? "border-blue-500" : "border-transparent"
                                                }`}
                                            onClick={() => setCurrentImageIndex(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p>No images available</p>
                        )}
                    </div>

                    {/* Right column - Details */}
                    <div className="md:w-1/2 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl text-[#9a8305] font-bold mb-2 uppercase ">{product.name}</h1>
                            <p className="mb-6 text-[#9a8305] text-lg font-bold">{product.description}</p>
                            <div className="flex justify-end">
                                <p className="text-4xl font-bold text-green-700">
                                    ₹{product.price}
                                </p>
                            </div>

                            {/* Share Buttons */}
                            <div className="mt-6">
                                <p className="mb- text-[#9a8305] font-semibold">Share:</p>
                                <div className="flex items-center gap-2">
                                    <WhatsappShareButton url={window.location.href} title={product.name}>
                                        <WhatsappIcon size={25} round />
                                    </WhatsappShareButton>

                                    <div title="Instagram sharing not supported via web">
                                        <FaInstagram size={25} className="text-pink-500 cursor-not-allowed opacity-50" />
                                    </div>

                                    <button
                                        onClick={copyToClipboard}
                                        className="cursor-pointer flex items-center gap-2 px-2 py-1 border rounded text-sm text-white hover:text-black hover:bg-[#9a8305]"
                                    >
                                        <FaLink />
                                        Share
                                    </button>
                                </div>
                            </div>



                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex items-center gap-4">
                            <button
                                aria-label="Wishlist"
                                title={isLoggedIn ? "Add to wishlist" : "You need to sign in"}
                                disabled={!isLoggedIn}
                                className={`h-[2.75rem] w-[2.75rem] flex items-center justify-center transition-colors rounded 
    ${isLoggedIn ? "cursor-pointer text-gray-300 hover:text-red-600" : "cursor-not-allowed text-gray-500"}`}
                                onClick={() => {
                                    if (isLoggedIn) {
                                        toast.success("Added to wishlist!");
                                    }
                                }}
                            >
                                <FaHeart size={40} />
                            </button>

                            <button onClick={handleClick} className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md">
                                Add to Cart
                            </button>

                            <button onClick={handleClick} className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md">
                                Buy Now
                            </button>
                        </div>

                        {similarProducts.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl text-[#9a8305] font-bold mb-4">Similar Products</h2>
                                <div className="flex overflow-x-auto space-x-2 pb-2" style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    "&::-webkit-scrollbar": { display: "none" },
                                }}>
                                    {similarProducts.slice(0, 5).map((prod) => (
                                        <div
                                            key={prod.productId}
                                            className="min-w-[160px] max-w-[160px] cursor-pointer border-3 border-[#9a8305] rounded-md p-1 hover:shadow flex-shrink-0"
                                            onClick={() =>
                                                window.open(`/product-details?id=${prod.productId}&categoryId=${prod.categoryId}`, "_blank")
                                            }
                                        >
                                            <img
                                                src={prod.images.front}
                                                alt={prod.name}
                                                className="w-full h-[10rem] object-contain rounded"
                                            />
                                            <p className="text-md mt-2 font-medium text-center text-[#9a8305] font-bold">{prod.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showAuthPopup && <AuthPopup />}
            <ToastProvider />
        </div>
    );
}
