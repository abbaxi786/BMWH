import React from 'react'
import {
    FaArrowRight,
    FaClock,
    FaMapMarkerAlt
} from "react-icons/fa";

function Map() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid overflow-hidden rounded-3xl bg-[#911824] lg:grid-cols-2">
                    {/* Map */}
                    <div className="min-h-95 bg-gray-200">
                        <iframe
                            title="Bashir Memorial Eye Trust Hospital Location"
                            src="https://www.google.com/maps?q=31.558139,74.3089297&output=embed"
                            className="h-full min-h-95 w-full border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Location details */}
                    <div className="flex flex-col justify-center p-8 text-white md:p-12">
                        <span className="text-sm font-semibold uppercase tracking-wider text-white/70">
                            Find Us
                        </span>

                        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                            Visit Bashir Memorial Eye Trust Hospital
                        </h2>

                        <p className="mt-5 leading-7 text-white/75">
                            Our hospital team is here to assist you with directions, appointments,
                            departments, and information about our healthcare services.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                <FaMapMarkerAlt />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Hospital Address
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-white/75">
                                    Bashir Memorial Eye Trust Hospital
                                    <br />
                                    Lahore, Punjab, Pakistan
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                <FaClock />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Hospital Location
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-white/75">
                                    31.558139, 74.3089297
                                </p>
                            </div>
                        </div>

                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=31.558139,74.3089297"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn mt-8 w-fit border-none bg-white px-7 text-[#911824] hover:bg-gray-100"
                        >
                            Get Directions
                            <FaArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Map