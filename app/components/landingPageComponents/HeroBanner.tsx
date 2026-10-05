"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendarCheck, FaUserDoctor } from "react-icons/fa6";

const bannerImages = [
  {
    src: "/images/banner.jpeg",
    alt: "Bashir Memorial Welfare Hospital",
  },
  {
    src: "/images/dentalSeat.jpeg",
    alt: "Bashir Memorial Welfare Hospital",
  },
  {
    src: "/images/stethoscope.jpg",
    alt: "Bashir Memorial Welfare Hospital",
  },
  {
    src: "/images/med.jpeg",
    alt: "Bashir Memorial Welfare Hospital",
  },
];

export default function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="
        relative
        z-0
        min-h-[620px]
        w-full
        overflow-hidden
        bg-[#FBF9F9]
        sm:min-h-[600px]
        md:min-h-[620px]
        lg:h-[600px]
        lg:min-h-0
        xl:h-[620px]
        2xl:h-[660px]
      "
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {bannerImages.map((image, index) => (
          <div
            key={image.src}
            className={`
              absolute
              inset-0
              transition-opacity
              duration-1000
              ease-in-out
              ${
                currentImage === index
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }
            `}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgba(251,249,249,0.98)_0%,rgba(251,249,249,0.93)_35%,rgba(251,249,249,0.65)_62%,rgba(251,249,249,0.12)_100%)]
          max-md:bg-[linear-gradient(180deg,rgba(251,249,249,0.97)_0%,rgba(251,249,249,0.90)_48%,rgba(251,249,249,0.42)_100%)]
        "
      />

      {/* Hero Content Container */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          h-full
          min-h-[620px]
          w-full
          max-w-7xl
          items-center
          px-5
          py-16
          sm:min-h-[600px]
          sm:px-8
          sm:py-20
          lg:min-h-0
          lg:px-10
          xl:px-12
          2xl:min-h-0
          2xl:max-w-[1440px]
          2xl:px-16
        "
      >
        <div
          className="
            flex
            w-full
            max-w-2xl
            flex-col
            items-start
            gap-4
            lg:max-w-[590px]
            xl:max-w-[620px]
            2xl:max-w-[660px]
          "
        >
          {/* Badge */}
          <div
            className="
              rounded-full
              bg-[rgba(175,16,26,0.1)]
              px-3
              py-1
              sm:px-4
              sm:py-1.5
            "
          >
            <span
              className="
                text-[10px]
                font-medium
                leading-4
                tracking-[0.2px]
                text-[#86000D]
                sm:text-xs
                sm:tracking-[0.24px]
              "
            >
              Compassionate Care. Stronger Communities.
            </span>
          </div>

          {/* Heading */}
          <h1
            className="
              max-w-[680px]
              text-[34px]
              font-bold
              leading-[1.12]
              tracking-[-0.6px]
              text-[#1B1C1C]
              sm:text-[40px]
              md:text-[44px]
              lg:text-[48px]
              lg:leading-[1.15]
              lg:tracking-[-0.96px]
              xl:text-[52px]
              2xl:text-[56px]
            "
          >
            Compassionate Healthcare.
            <br />
            Serving the Community.
          </h1>

          {/* Description */}
          <p
            className="
              max-w-xl
              text-sm
              leading-6
              text-[#5B403D]
              sm:text-base
              sm:leading-7
              md:text-lg
              2xl:text-[19px]
              2xl:leading-8
            "
          >
            Bashir Memorial Welfare Hospital is committed to providing
            quality healthcare to everyone, regardless of their financial
            status.
          </p>

          {/* Action Buttons */}
          <div
            className="
              flex
              w-full
              flex-col
              gap-3
              pt-2
              sm:w-auto
              sm:flex-row
              sm:items-center
              sm:gap-4
            "
          >
            <Link
              href="/book-appointment"
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                bg-[#86000D]
                px-5
                text-sm
                font-semibold
                leading-5
                text-white
                shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                transition-opacity
                duration-200
                hover:opacity-90
                focus:outline-none
                focus:ring-2
                focus:ring-[#86000D]/30
                sm:w-auto
                sm:px-6
              "
            >
              <FaCalendarCheck size={15} />
              <span>Book an Appointment</span>
            </Link>

            <Link
              href="/doctors"
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                bg-[#EFEDED]
                px-5
                text-sm
                font-semibold
                leading-5
                text-[#1B1C1C]
                shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                transition-colors
                duration-200
                hover:bg-[#e5e2e2]
                focus:outline-none
                focus:ring-2
                focus:ring-[#86000D]/20
                sm:w-auto
                sm:px-6
              "
            >
              <FaUserDoctor
                size={17}
                className="text-[#86000D]"
              />
              <span>Find a Doctor</span>
            </Link>
          </div>

          {/* Banner Indicators */}
          <div
            className="
              mt-3
              flex
              items-center
              gap-2
            "
          >
            {bannerImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                aria-current={currentImage === index}
                onClick={() => setCurrentImage(index)}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#86000D]/30
                  ${
                    currentImage === index
                      ? "w-8 bg-[#86000D]"
                      : "w-2 bg-[#86000D]/30 hover:bg-[#86000D]/60"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}