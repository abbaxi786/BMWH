
"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";

type BannerImage = {
    id: number;
    alt: string | null;
    src: string;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    data?: BannerImage[];
};

const API_URL = "/api/content/banner_images";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function BannerImagesSettings() {
    const [images, setImages] = useState<BannerImage[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [alt, setAlt] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // GET: Fetch saved banner images using Axios
    const fetchImages = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get<ApiResponse>(API_URL, {
                headers: {
                    Accept: "application/json",
                },
            });

            const result = response.data;

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch banner images."
                );
            }

            setImages(Array.isArray(result.data) ? result.data : []);
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiResponse>(err)) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load banner images."
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while loading images."
                );
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchImages();
    }, [fetchImages]);

    // Validate selected image
    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0] ?? null;

        setError("");
        setSuccess("");

        if (!file) {
            setImageFile(null);
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError(
                "Only JPEG, PNG, WebP, and AVIF images are allowed."
            );
            event.target.value = "";
            setImageFile(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Image size must not exceed 5 MB.");
            event.target.value = "";
            setImageFile(null);
            return;
        }

        setImageFile(file);
    }

    // POST: Upload banner image using Axios
    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!imageFile) {
            setError("Please select an image to upload.");
            return;
        }

        if (alt.trim().length > 255) {
            setError("Alt text must not exceed 255 characters.");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("alt", alt.trim());

        setUploading(true);

        try {
            const response = await axios.post<ApiResponse>(
                API_URL,
                formData,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const result = response.data;

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to upload banner image."
                );
            }

            setSuccess(
                result.message || "Banner image uploaded successfully."
            );

            setImageFile(null);
            setAlt("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await fetchImages();
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiResponse>(err)) {
                setError(
                    err.response?.data?.message ||
                    (err.response?.status === 404
                        ? "API route not found. Check the banner_images route path."
                        : err.message) ||
                    "Failed to upload banner image."
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred."
                );
            }
        } finally {
            setUploading(false);
        }
    }

    // DELETE: Delete banner image from API, Cloudinary and database
    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this banner image? This action cannot be undone."
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingId(id);

        try {
            const response = await axios.delete<ApiResponse>(
                `${API_URL}?id=${encodeURIComponent(id)}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const result = response.data;

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to delete banner image."
                );
            }

            // Remove the deleted image from the UI
            setImages((previous) =>
                previous.filter((image) => image.id !== id)
            );

            setSuccess(
                result.message || "Banner image deleted successfully."
            );
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiResponse>(err)) {
                setError(
                    err.response?.data?.message ||
                    (err.response?.status === 404
                        ? "Banner image or API route not found."
                        : err.message) ||
                    "Failed to delete banner image."
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred while deleting."
                );
            }
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-8">
            {/* Upload form */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Banner Images
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Upload images for your homepage banner. Images
                        are uploaded to Cloudinary and saved in your
                        database.
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="banner-image"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Select Image
                        </label>

                        <input
                            ref={fileInputRef}
                            id="banner-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={handleFileChange}
                            className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-red-700 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-red-800"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            JPEG, PNG, WebP or AVIF. Maximum size: 5 MB.
                        </p>
                    </div>

                    {imageFile && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="mb-3 text-sm font-semibold text-gray-700">
                                Selected file
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Selected banner preview"
                                    className="h-20 w-28 rounded-lg border border-gray-200 object-cover"
                                />

                                <div className="min-w-0">
                                    <p className="break-all text-sm font-medium text-gray-800">
                                        {imageFile.name}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {(imageFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="banner-alt"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Alternative Text (Alt)
                        </label>

                        <input
                            id="banner-alt"
                            type="text"
                            value={alt}
                            onChange={(event) => setAlt(event.target.value)}
                            maxLength={255}
                            placeholder="e.g. Bashir Memorial Welfare Hospital"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                        />

                        <p className="mt-1 text-right text-xs text-gray-500">
                            {alt.length}/255 characters
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !imageFile || deletingId !== null}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <span aria-hidden="true">+</span>
                                Upload Banner Image
                            </>
                        )}
                    </button>
                </form>
            </section>

            {/* Saved images */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Saved Banner Images
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {images.length} image
                            {images.length === 1 ? "" : "s"} saved
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void fetchImages()}
                        disabled={loading || deletingId !== null}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-700" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center">
                        <p className="font-medium text-gray-700">
                            No banner images found.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload your first image using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {images.map((image) => (
                            <article
                                key={image.id}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                            >
                                <div className="aspect-video bg-gray-100">
                                    <img
                                        src={image.src}
                                        alt={image.alt || ""}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="space-y-3 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Image ID: {image.id}
                                    </p>

                                    <p className="wrap-break-words text-sm font-medium text-gray-800">
                                        {image.alt || "No alt text provided"}
                                    </p>

                                    <a
                                        href={image.src}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-sm font-semibold text-red-700 hover:text-red-800 hover:underline"
                                    >
                                        Open full image
                                    </a>

                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(image.id)}
                                        disabled={
                                            deletingId !== null ||
                                            uploading
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {deletingId === image.id ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <span aria-hidden="true"><MdOutlineDelete /></span>
                                                Delete Image
                                            </>
                                        )}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
