"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { HeroBannerSkeleton } from "./heroAndStatsSkeleton";

type BannerImage = {
  id: number;
  src: string;
  alt: string | null;
};

type HeroContent = {
  id: number;
  badge_text: string | null;
  heading: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
};

type ImagesApiResponse = {
  success: boolean;
  message?: string;
  data?: BannerImage[];
};

type HeroApiResponse = {
  success: boolean;
  message?: string;
  data?: HeroContent;
};

const IMAGES_API_URL = "/api/content/banner_images";
const HERO_API_URL = "/api/content/hero_section";

const DEFAULT_HERO_CONTENT: HeroContent = {
  id: 1,
  badge_text: "Compassionate Care. Stronger Communities.",
  heading: "Compassionate Healthcare. Serving the Community.",
  description:
    "Bashir Memorial Welfare Hospital is committed to providing quality healthcare to everyone, regardless of their financial status.",
  button_text: "Find a Doctor",
  button_url: "/doctors",
};

export default function HeroBanner() {
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [heroContent, setHeroContent] =
    useState<HeroContent>(DEFAULT_HERO_CONTENT);

  // Fetch hero text content from the database
  const fetchHeroContent = useCallback(async () => {
    try {
      const response = await axios.get<HeroApiResponse>(HERO_API_URL, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load hero content."
        );
      }

      if (response.data.data) {
        setHeroContent({
          ...DEFAULT_HERO_CONTENT,
          ...response.data.data,
          badge_text:
            response.data.data.badge_text ??
            DEFAULT_HERO_CONTENT.badge_text,
          heading:
            response.data.data.heading ??
            DEFAULT_HERO_CONTENT.heading,
          description:
            response.data.data.description ??
            DEFAULT_HERO_CONTENT.description,
          button_text:
            response.data.data.button_text ??
            DEFAULT_HERO_CONTENT.button_text,
          button_url:
            response.data.data.button_url ??
            DEFAULT_HERO_CONTENT.button_url,
        });
      }
    } catch (error) {
      if (axios.isAxiosError<HeroApiResponse>(error)) {
        console.error(
          "Failed to fetch hero content:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Failed to fetch hero content:", error);
      }

      // Keep the default content if the API request fails.
      setHeroContent(DEFAULT_HERO_CONTENT);
    }
  }, []);

  // Fetch banner images from the database
  const fetchBannerImages = useCallback(async () => {
    try {
      const response = await axios.get<ImagesApiResponse>(
        IMAGES_API_URL,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load banner images."
        );
      }

      const images = Array.isArray(response.data.data)
        ? response.data.data.filter(
          (image) =>
            typeof image.src === "string" &&
            image.src.trim().length > 0
        )
        : [];

      setBannerImages(images);
      setCurrentImage(0);
    } catch (error) {
      if (axios.isAxiosError<ImagesApiResponse>(error)) {
        console.error(
          "Failed to fetch banner images:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Failed to fetch banner images:", error);
      }

      setBannerImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load hero content and banner images
  useEffect(() => {
    void fetchHeroContent();
    void fetchBannerImages();
  }, [fetchHeroContent, fetchBannerImages]);

  // Automatically rotate through the available banner images
  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % bannerImages.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [bannerImages.length]);

  // Keep the current image index valid
  useEffect(() => {
    if (currentImage >= bannerImages.length) {
      setCurrentImage(0);
    }
  }, [currentImage, bannerImages.length]);

  // Avoid displaying an empty banner while images are loading or unavailable
  if (loading) {
    return <HeroBannerSkeleton />;
  }

  if (bannerImages.length === 0) {
    return (
      <section className="min-h-155 w-full bg-[#FBF9F9] sm:min-h-150 lg:h-150" />
    );
  }

  // Use database content, falling back to defaults for empty fields
  const badgeText =
    heroContent.badge_text?.trim() || DEFAULT_HERO_CONTENT.badge_text;

  const heading =
    heroContent.heading?.trim() || DEFAULT_HERO_CONTENT.heading || "";

  const description =
    heroContent.description?.trim() ||
    DEFAULT_HERO_CONTENT.description;

  const buttonText =
    heroContent.button_text?.trim() ||
    DEFAULT_HERO_CONTENT.button_text;

  const buttonUrl =
    heroContent.button_url?.trim() || DEFAULT_HERO_CONTENT.button_url;

  // Split the heading after the first sentence for the existing two-line layout
  const headingParts = heading.match(/^(.+?\.)\s*(.*)$/);
  const firstHeadingLine = headingParts?.[1] || heading;
  const secondHeadingLine = headingParts?.[2] || "";

  return (
    <section
      className="
        relative z-0 min-h-155 w-full overflow-hidden bg-[#FBF9F9]
        sm:min-h-150 md:min-h-155 lg:h-150 lg:min-h-0
        xl:h-155 2xl:h-165
      "
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {bannerImages.map((image, index) => (
          <div
            key={image.id}
            className={`
              absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${currentImage === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
              }
            `}
          >
            <Image
              src={image.src}
              alt={image.alt || "Bashir Memorial Welfare Hospital"}
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
          absolute inset-0
          bg-[linear-gradient(90deg,rgba(251,249,249,0.98)_0%,rgba(251,249,249,0.93)_35%,rgba(251,249,249,0.65)_62%,rgba(251,249,249,0.12)_100%)]
          max-md:bg-[linear-gradient(180deg,rgba(251,249,249,0.97)_0%,rgba(251,249,249,0.90)_48%,rgba(251,249,249,0.42)_100%)]
        "
      />

      {/* Hero Content Container */}
      <div
        className="
          relative z-10 mx-auto flex h-full min-h-155 w-full max-w-7xl
          items-center px-5 py-16 sm:min-h-150 sm:px-8 sm:py-20
          lg:min-h-0 lg:px-10 xl:px-12 2xl:min-h-0
          2xl:max-w-360 2xl:px-16
        "
      >
        <div
          className="
            flex w-full max-w-2xl flex-col items-start gap-4
            lg:max-w-147.5 xl:max-w-155 2xl:max-w-165
          "
        >
          {/* Badge */}
          {badgeText && (
            <div
              className="
                rounded-full bg-[rgba(175,16,26,0.1)]
                px-3 py-1 sm:px-4 sm:py-1.5
              "
            >
              <span
                className="
                  text-[10px] font-medium leading-4 tracking-[0.2px]
                  text-[#86000D] sm:text-xs sm:tracking-[0.24px]
                "
              >
                {badgeText}
              </span>
            </div>
          )}

          {/* Heading */}
          {heading && (
            <h1
              className="
                max-w-170 text-[34px] font-bold leading-[1.12]
                tracking-[-0.6px] text-[#1B1C1C]
                sm:text-[40px] md:text-[44px] lg:text-[48px]
                lg:leading-[1.15] lg:tracking-[-0.96px]
                xl:text-[52px] 2xl:text-[56px]
              "
            >
              {firstHeadingLine}
              {secondHeadingLine && (
                <>
                  <br />
                  {secondHeadingLine}
                </>
              )}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p
              className="
                max-w-xl text-sm leading-6 text-[#5B403D]
                sm:text-base sm:leading-7 md:text-lg
                2xl:text-[19px] 2xl:leading-8
              "
            >
              {description}
            </p>
          )}

          {/* Action Button */}
          {buttonText && buttonUrl && (
            <div
              className="
                flex w-full flex-col gap-3 pt-2
                sm:w-auto sm:flex-row sm:items-center sm:gap-4
              "
            >
              <Link
                href={buttonUrl}
                className="
                  flex h-11 w-full items-center justify-center gap-2
                  rounded bg-[#c5c3c3] px-5 text-sm font-semibold
                  leading-5 text-[#1B1C1C]
                  shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                  transition-colors duration-200 hover:bg-[#e5e2e2]
                  focus:outline-none focus:ring-2
                  focus:ring-[#86000D]/20
                  sm:w-auto sm:px-6
                "
              >
                <FaUserDoctor size={17} className="text-[#86000D]" />
                <span>{buttonText}</span>
              </Link>
            </div>
          )}

          {/* Banner Indicators */}
          {bannerImages.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              {bannerImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`Show banner ${index + 1}`}
                  aria-current={currentImage === index}
                  onClick={() => setCurrentImage(index)}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    focus:outline-none focus:ring-2
                    focus:ring-[#86000D]/30
                    ${currentImage === index
                      ? "w-8 bg-[#86000D]"
                      : "w-2 bg-[#86000D]/30 hover:bg-[#86000D]/60"
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}