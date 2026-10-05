"use client";

import {
    FaWhatsapp,
    FaYoutube,
    FaFacebookF,
    FaInstagram,
    FaShareAlt,
} from "react-icons/fa";

export default function SocialMediaFab() {
    return (
        <div className="fab fab-flower fixed bottom-24 right-6 sm:bottom-6 sm:right-27 z-50">

            {/* Main FAB */}
            <div
                tabIndex={0}
                role="button"
                className="relative btn btn-lg btn-circle bg-[#86000D] text-primary-content border-none shadow-lg overflow-visible"
                aria-label="Social media links"
            >
                {/* Rotating Text */}
                <div className="absolute -inset-6 pointer-events-none">
                    <svg
                        viewBox="0 0 120 120"
                        className="h-full w-full animate-[spin_10s_linear_infinite]"
                    >
                        <defs>
                            <path
                                id="socialCircle"
                                d="
                                    M 60,60
                                    m -48,0
                                    a 48,48 0 1,1 96,0
                                    a 48,48 0 1,1 -96,0
                                "
                            />
                        </defs>

                        <text
                            className="fill-[#86000D] font-bold uppercase"
                            style={{
                                fontSize: "12px",
                                letterSpacing: "2.2px",
                            }}
                        >
                            <textPath
                                href="#socialCircle"
                                startOffset="0%"
                            >
                                Let's Get Social
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* Center Icon */}
                <FaShareAlt className="relative z-10 text-xl" />
            </div>

            {/* Main Action */}
            <button
                className="fab-main-action btn btn-circle btn-lg bg-primary text-primary-content border-none shadow-lg"
                aria-label="Open social media links"
            >
                <FaShareAlt className="text-xl" />
            </button>

            {/* WhatsApp */}
            <div
                className="tooltip tooltip-left"
                data-tip="WhatsApp"
            >
                <a
                    href="https://wa.me/YOUR_WHATSAPP_NUMBER"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="btn btn-lg btn-circle bg-green-500 hover:bg-green-600 text-white border-none shadow-lg"
                >
                    <FaWhatsapp className="text-xl" />
                </a>
            </div>

            {/* YouTube */}
            <div
                className="tooltip tooltip-left"
                data-tip="YouTube"
            >
                <a
                    href="https://www.youtube.com/@bmwhospital"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="btn btn-lg btn-circle bg-red-600 hover:bg-red-700 text-white border-none shadow-lg"
                >
                    <FaYoutube className="text-xl" />
                </a>
            </div>

            {/* Facebook */}
            <div
                className="tooltip tooltip-left"
                data-tip="Facebook"
            >
                <a
                    href="https://www.facebook.com/profile.php?id=61592074031243"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="btn btn-lg btn-circle bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg"
                >
                    <FaFacebookF className="text-xl" />
                </a>
            </div>

            {/* Instagram */}
            <div
                className="tooltip tooltip-left"
                data-tip="Instagram"
            >
                <a
                    href="https://www.instagram.com/bashirmemorialbmt?igsh=MXhxamZsOHl6andpaA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="btn btn-lg btn-circle bg-pink-600 hover:bg-pink-700 text-white border-none shadow-lg"
                >
                    <FaInstagram className="text-xl" />
                </a>
            </div>
        </div>
    );
}