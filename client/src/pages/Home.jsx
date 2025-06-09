import React, { useState, useEffect, useRef } from "react";
import Topbar from "../components/TopBar";
import Carousel from "../components/Carousel";
import Switch from "../components/Switch";
import ClothingCard from "../components/ClothingCard";
import Pagination from "../components/Pagination";
import Banner from "../components/Banner";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, Infinity],
    categoryId: null,
    fitTypeId: null
  });
  const scrollContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const price = Number(product.price);

    const matchesPrice =
      price >= filters.priceRange[0] && price <= filters.priceRange[1];

    const matchesCategory = filters.categoryId
      ? product.categoryId === parseInt(filters.categoryId)
      : true;

    const matchesFit = filters.fitTypeId
      ? product.fitTypeId === parseInt(filters.fitTypeId)
      : true;

    const matchesSearch = [product.name, product.category, product.fitType]
      .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPrice && matchesCategory && matchesFit && matchesSearch;

  });

  const allCards = filteredProducts.map((product, i) => ({
    id: product._id || i,
    productId: product.productId,
    categoryId: product.categoryId,
    image1: product.images?.front,
    image2: product.images?.back,
    name: product.name,
    price: product.price,
  }));

  const totalPages = Math.ceil(allCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedCards = allCards.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar isShown={true} />
      </div>
      <div ref={scrollContainerRef} className="snap-y snap-mandatory h-[90vh] mt-[10vh] overflow-scroll overflow-x-hidden scroll-smooth custom-scrollbar">
        <div className="snap-start h-[90vh] bg-[#9a8305] flex flex-col items-center justify-end text-center transition-all duration-2000 ease-in-out">
          <div className="text-center md:mb-[15vh] mb-[10vh] text-3xl md:text-5xl font-bold text-white uppercase leading-tight">
            <span className="block">The new</span>
            <span className="block text-[#660408] text-6xl">Superman</span>
            <span className="block">collection</span>
          </div>
          <Banner />
        </div>

        <div className="snap-start bg-[#9a8305] h-[90vh] flex flex-col overflow-hidden py-">



          <div className="md:hidden w-[full] p-4">
            <input
              type="text"
              placeholder="Search by name, category, fit"
              className="w-full px-4 py-2 rounded border-2 border-[#3a3a3a] text-[#3a3a3a] font-bold focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full flex items-center justify-between gap-y-[10rem] px-6 py-2 sm:gap-x-2">
            <div className="md:w-[10%] w-[50%]">
              <button
                className="bg-[#28282B] text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                {sidebarOpen ? "Close Filters" : "Filters"}
              </button>
            </div>
            <div className="md:block hidden w-[50%]">
              <input
                type="text"
                placeholder="Search by name, category, fit"
                className="w-full px-4 py-2 rounded border-2 border-[#3a3a3a] text-[#3a3a3a] font-bold focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className=" ">
              <Switch checked={enabled} onChange={setEnabled} />
            </div>
          </div>

          <div className="flex flex-grow overflow-hidden">


<div
  className={`transition-all duration-500 ease-in-out bg-[#3a3a3a] text-white overflow-hidden ${
    sidebarOpen ? "md:w-[20vw] w-full p-4" : "w-0 p-0"
  }`}
>
  <div className="w-full">
    <label className="block mb-2 text-xl font-bold text-[#9a8305]">Price Range:</label>

    {/* Wrapper to isolate relative positioning */}
    <div className="relative w-full h-10 flex items-center">
      <div className="absolute w-full flex justify-between text-white text-sm px-1 z-10">
        <span>₹{filters.priceRange[0]}</span>
        <span>₹{filters.priceRange[1] === Infinity ? "5000+" : filters.priceRange[1]}</span>
      </div>

      <div className="w-full h-1 bg-gray-400 rounded absolute top-[2.5rem] z-0" />

      {/* Sliders (not affecting layout due to z-index and pointer-events) */}
      <input
        type="range"
        min={0}
        max={5000}
        step={100}
        value={filters.priceRange[0]}
        onChange={(e) => {
          const newMin = Math.min(Number(e.target.value), filters.priceRange[1] - 100);
          setFilters((prev) => ({ ...prev, priceRange: [newMin, prev.priceRange[1]] }));
        }}
        className="absolute cursor-pointer top-[2.5rem] w-full h-1 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
      />

      <input
        type="range"
        min={0}
        max={5000}
        step={100}
        value={filters.priceRange[1] === Infinity ? 5000 : filters.priceRange[1]}
        onChange={(e) => {
          const val = Number(e.target.value);
          const newMax = val >= 5000 ? Infinity : Math.max(val, filters.priceRange[0] + 100);
          setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], newMax] }));
        }}
        className="absolute cursor-pointer top-[2.5rem] w-full h-1 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
      />
    </div>

    <label className="block mt-6 mb-2 text-xl font-bold text-[#9a8305] ">Category:</label>
    <div className="relative w-full">
      <select
        className="cursor-pointer appearance-none rounded-0 border border-[#9a8305] text-[#9a8305] font-semibold w-full px-4 py-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-[#9a8305]"
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            categoryId: e.target.value === "" ? null : e.target.value,
          }))
        }
      >
        <option value="" className="cursor-pointer bg-[#3a3a3a] rounded-0 text-sm font-bold">All</option>
        <option value="1" className="cursor-pointer bg-[#3a3a3a] rounded-0 text-sm font-bold">Shirts</option>
        <option value="2" className="cursor-pointer bg-[#3a3a3a] rounded-0 text-sm font-bold">Sleeveless</option>
        <option value="3" className="cursor-pointer bg-[#3a3a3a] rounded-0 text-sm font-bold">Hoodies</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9a8305]">▼</div>
    </div>

    <label className="block mt-6 mb-2 text-xl font-bold text-[#9a8305]">Fit Type:</label>
    <div className="relative w-full">
      <select
        className="cursor-pointer appearance-none border border-[#9a8305] text-[#9a8305] font-semibold w-full px-4 py-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-[#9a8305]"
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            fitTypeId: e.target.value === "" ? null : e.target.value,
          }))
        }
      >
        <option value="" className="cursor-pointer bg-[#3a3a3a] text-sm font-bold">All</option>
        <option value="1" className="cursor-pointer bg-[#3a3a3a] text-sm font-bold">Slim</option>
        <option value="2" className="cursor-pointer bg-[#3a3a3a] text-sm font-bold">Regular</option>
        <option value="3" className="cursor-pointer bg-[#3a3a3a] text-sm font-bold">Oversized</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9a8305]">▼</div>
    </div>
  </div>
</div>


            <div className={`animated-gradient relative flex-grow transition-all duration-1000 ease-in-out ${sidebarOpen ? "md:w-[60vw]" : "w-full"} overflow-hidden`}>
              <div className={`absolute inset-0 transform transition-transform duration-1000 ease-in-out ${enabled ? "translate-x-0" : "translate-x-full"}`}>
                {filteredProducts.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="mt-4 text-black text-4xl font-bold uppercase">No products found</h1>
                    <p>Try adjusting the filtres or refreshing the page.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center h-full overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none", "&::-webkit-scrollbar": { display: "none" }, }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                      {paginatedCards.map((card) => (
                        <div
                          key={card.id}
                          className="cursor-pointer"
                          onClick={() => window.open(`/product-details?id=${card.productId}&categoryId=${card.categoryId}`, "_blank")}
                        >
                          <ClothingCard
                            productId={card.productId}
                            image1={card.image1}
                            image2={card.image2}
                            name={card.name}
                            price={card.price}
                          />
                        </div>
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>

              <div
                className={`absolute inset-0 transform transition-transform duration-1000 ease-in-out ${enabled ? "-translate-x-full" : "translate-x-0"}`}
              >
                <div className="flex justify-center items-center md:h-full h-[30vh] md:mt-0 mt-[10vh]">
                  <Carousel
                    sidebarOpen={sidebarOpen}
                    cards={allCards}
                    tileCount={allCards.length}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start bg-[#132654] h-[90vh] flex flex-col items-center justify-start text-center">
          <button
            className="w-full bg-[#9a8305] text-black py-3 font-semibold hover:bg-yellow-600 transition cursor-pointer uppercase"
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Back to Top
          </button>
          <div className="flex flex-col items-center justify-center flex-grow w-full px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl text-center">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">About us</h3>
                <a href="https://dummyurl1.com" className="block text-blue-300 underline mb-1">Our Story</a>
                <a href="https://dummyurl2.com" className="block text-blue-300 underline mb-1">Careers</a>
                <a href="https://dummyurl3.com" className="block text-blue-300 underline mb-1">Team</a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Contact us</h3>
                <a href="https://dummyurl4.com" className="block text-blue-300 underline mb-1">Email</a>
                <a href="https://dummyurl5.com" className="block text-blue-300 underline mb-1">Locations</a>
                <a href="https://dummyurl6.com" className="block text-blue-300 underline mb-1">Press</a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
                <a href="https://dummyurl7.com" className="block text-blue-300 underline mb-1">Help Center</a>
                <a href="https://dummyurl8.com" className="block text-blue-300 underline mb-1">FAQ</a>
                <a href="https://dummyurl9.com" className="block text-blue-300 underline mb-1">Returns</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
