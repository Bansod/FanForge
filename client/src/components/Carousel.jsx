import React, { useRef, useEffect, useState } from "react";
import hero1 from "../assets/hero1.jpeg"

const Carousel = ({ cards = [], tileCount }) => {
    const carouselRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const rotationStart = useRef(0);
    const animationFrameId = useRef(null);

    const [rotation, setRotation] = useState(0);
    const degreesPerTile = 360 / tileCount;

    const [flippedCards, setFlippedCards] = useState(new Set());
    const hoverIntervals = useRef({});
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    // 🔁 Resize listener
    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const containerWidth = viewportWidth * 0.75;
    const carouselRadius = containerWidth / 2.5;
    const tileSize = containerWidth / 9;
    const tileHeight = tileSize * 1.2;


    const snapRotation = (angle) => {
        return Math.round(angle / degreesPerTile) * degreesPerTile;
    };

    // 🔄 Scroll to rotate
    useEffect(() => {
        let scrollTimeout = null;

        const handleScroll = (e) => {
            e.preventDefault();
            const delta = e.deltaY;
            setRotation((prev) => prev + delta * 0.07);

            if (hoveredCardIndex !== null) {
                const cardElement = document.querySelector(`[data-card-index='${hoveredCardIndex}']`);
                const rect = cardElement?.getBoundingClientRect();

                const isCursorInside =
                    rect &&
                    rect.left <= window.innerWidth / 2 &&
                    rect.right >= window.innerWidth / 2 &&
                    rect.top <= window.innerHeight / 2 &&
                    rect.bottom >= window.innerHeight / 2;

                if (!isCursorInside) {
                    clearInterval(hoverIntervals.current[hoveredCardIndex]);
                    hoverIntervals.current[hoveredCardIndex] = null;

                    setFlippedCards((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(hoveredCardIndex);
                        return newSet;
                    });

                    setHoveredCardIndex(null);
                }
            }

            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setRotation((prev) => snapRotation(prev));
            }, 150);
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("wheel", handleScroll, { passive: false });
        }

        return () => {
            if (container) container.removeEventListener("wheel", handleScroll);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [hoveredCardIndex]);

    // 🖱️ Drag to rotate
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const ROTATION_SPEED = 0.15;
        const DRAG_THRESHOLD = 5;
        let lastDeltaX = 0;

        const onPointerDown = (e) => {
            e.preventDefault();
            isDragging.current = true;
            dragStartX.current = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
            rotationStart.current = rotation;
        };

        const onPointerMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();

            const currentX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
            const deltaX = currentX - dragStartX.current;

            if (Math.abs(deltaX) < DRAG_THRESHOLD) return;

            lastDeltaX = deltaX;

            if (!animationFrameId.current) {
                animationFrameId.current = requestAnimationFrame(() => {
                    const newRotation = rotationStart.current + lastDeltaX * ROTATION_SPEED;
                    setRotation(newRotation);
                    animationFrameId.current = null;
                });
            }
        };

        const onPointerUp = (e) => {
            e.preventDefault();
            isDragging.current = false;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            setRotation((prev) => snapRotation(prev));
        };

        container.addEventListener("mousedown", onPointerDown);
        container.addEventListener("mousemove", onPointerMove);
        container.addEventListener("mouseup", onPointerUp);
        container.addEventListener("mouseleave", onPointerUp);
        container.addEventListener("touchstart", onPointerDown, { passive: false });
        container.addEventListener("touchmove", onPointerMove, { passive: false });
        container.addEventListener("touchend", onPointerUp);
        container.addEventListener("touchcancel", onPointerUp);

        return () => {
            container.removeEventListener("mousedown", onPointerDown);
            container.removeEventListener("mousemove", onPointerMove);
            container.removeEventListener("mouseup", onPointerUp);
            container.removeEventListener("mouseleave", onPointerUp);
            container.removeEventListener("touchstart", onPointerDown);
            container.removeEventListener("touchmove", onPointerMove);
            container.removeEventListener("touchend", onPointerUp);
            container.removeEventListener("touchcancel", onPointerUp);
        };
    }, [rotation]);

    if (tileCount === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center md:justify-center justify-end">
                <h1 className="text-black text-4xl font-bold uppercase text-center">No products found</h1>
                <p>Try adjusting the filtres or refreshing the page.</p>
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            className="relative h-full mx-auto flex items-center justify-center"
            style={{
                width: "75vw",
                cursor: isDragging.current ? "grabbing" : "grab",
                overflow: "hidden",
            }}
        >
            <div
                className="absolute top-1/5 [transform-style:preserve-3d] [transform:perspective(1000px)] z-[2] transition-all duration-300 ease-in-out"
                ref={carouselRef}
                style={{
                    width: `${tileSize}px`,
                    height: `${tileHeight}px`,
                }}
            >
                <div
                    className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-300 ease-out"
                    style={{ transform: `rotateX(-16deg) rotateY(${rotation}deg)` }}
                >
                    {[...Array(tileCount)].map((_, i) => (
                        <div
                            key={i}
                            data-card-index={i}
                            onClick={() => window.open(`/product-details?id=${cards[i].productId}&categoryId=${cards[i].categoryId}`, "_blank")} className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-600 ease-in-out"
                            style={{
                                transform: `rotateY(${i * degreesPerTile}deg) translateZ(${carouselRadius}px)`,
                                width: `${tileSize}px`,
                                height: `${tileHeight}px`,
                            }}
                            onMouseEnter={() => {
                                setHoveredCardIndex(i);
                                if (hoverIntervals.current[i]) return;
                                hoverIntervals.current[i] = setTimeout(() => {
                                    setFlippedCards((prev) => new Set(prev).add(i));
                                }, 600);
                            }}
                            onMouseLeave={() => {
                                if (hoverIntervals.current[i]) {
                                    clearTimeout(hoverIntervals.current[i]);
                                    hoverIntervals.current[i] = null;
                                }
                                setFlippedCards((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(i);
                                    return newSet;
                                });
                            }}
                        >
                            <div
                                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-600 ease-in-out hover:scale-110"
                                style={{
                                    transform: flippedCards.has(i)
                                        ? "rotateY(180deg)"
                                        : "rotateY(0deg)",
                                }}
                            >
                                <div className="absolute w-full h-full backface-hidden">
                                    <img
                                        src={cards[i]?.image1}
                                        alt="Front Face"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="absolute w-full h-full [transform:rotateY(180deg)] backface-hidden">
                                    <img
                                        src={cards[i]?.image2}
                                        alt="Back Face"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        </div>
    );
};

export default Carousel;
