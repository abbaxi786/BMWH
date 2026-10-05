"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="
                fixed
                bottom-6
                right-6
                z-50
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-blue-700
                hover:-translate-y-1
            "
        >
            <FaArrowUp />
        </button>
    );
}