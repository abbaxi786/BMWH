"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import axios from "axios";

import type { NewsUpdate } from "./newsUpdatesList";


interface NewsFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author_name: string;
    is_featured: boolean;
    is_published: boolean;
    published_at: string;
    meta_title: string;
    meta_description: string;
}


interface NewsUpdatesFormProps {
    editNews: NewsUpdate | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}


function NewsUpdatesForm({
    editNews,
    onSuccess,
    onCancelEdit,
}: NewsUpdatesFormProps) {

    const isEditMode = !!editNews;


    // ==================================================
    // FORM STATE
    // ==================================================

    const [form, setForm] =
        useState<NewsFormData>({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            category: "",
            author_name: "",
            is_featured: false,
            is_published: true,
            published_at: "",
            meta_title: "",
            meta_description: "",
        });


    // New image selected by user
    const [image, setImage] =
        useState<File | null>(null);


    // Preview of newly selected image
    const [imagePreview, setImagePreview] =
        useState<string | null>(null);


    // Existing Cloudinary image
    const [existingImage, setExistingImage] =
        useState<string | null>(null);


    // Whether existing image should be removed
    const [removeExistingImage, setRemoveExistingImage] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [success, setSuccess] =
        useState("");


    const [error, setError] =
        useState("");


    // ==================================================
    // GENERATE SLUG
    // ==================================================

    const generateSlug = (
        value: string
    ) => {
        return value
            .toLowerCase()
            .trim()
            .replace(
                /[^\w\s-]/g,
                ""
            )
            .replace(
                /[\s_-]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");
    };


    // ==================================================
    // FORMAT DATETIME FOR INPUT
    // ==================================================

    const formatDateTimeLocal = (
        date: string | null
    ) => {

        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        // Convert to local datetime-local value
        const year =
            parsedDate.getFullYear();

        const month =
            String(
                parsedDate.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                parsedDate.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                parsedDate.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                parsedDate.getMinutes()
            ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    // ==================================================
    // LOAD EDIT DATA
    // ==================================================

    useEffect(() => {

        if (editNews) {

            setForm({
                title:
                    editNews.title || "",

                slug:
                    editNews.slug || "",

                excerpt:
                    editNews.excerpt || "",

                content:
                    editNews.content || "",

                category:
                    editNews.category || "",

                author_name:
                    editNews.author_name || "",

                is_featured:
                    editNews.is_featured ?? false,

                is_published:
                    editNews.is_published ?? true,

                published_at:
                    formatDateTimeLocal(
                        editNews.published_at
                    ),

                meta_title:
                    editNews.meta_title || "",

                meta_description:
                    editNews.meta_description || "",
            });


            setExistingImage(
                editNews.image_url || null
            );

            setImage(null);
            setImagePreview(null);

            setRemoveExistingImage(
                false
            );

            setError("");
            setSuccess("");

        } else {

            resetForm();

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editNews]);


    // ==================================================
    // HANDLE TEXT CHANGES
    // ==================================================

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const {
            name,
            value,
        } = e.target;


        setForm((previous) => {

            const updated = {
                ...previous,
                [name]: value,
            };


            // Generate slug from title
            if (
                name === "title"
            ) {

                updated.slug =
                    generateSlug(
                        value
                    );


                // Automatically generate meta title
                // only if user has not manually entered one
                if (
                    !previous.meta_title
                ) {

                    updated.meta_title =
                        value;

                }

            }


            return updated;
        });


        setError("");
        setSuccess("");
    };


    // ==================================================
    // FEATURED
    // ==================================================

    const handleFeaturedChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        setForm((previous) => ({
            ...previous,

            is_featured:
                e.target.checked,
        }));

        setError("");
        setSuccess("");
    };


    // ==================================================
    // PUBLISHED
    // ==================================================

    const handlePublishedChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const checked =
            e.target.checked;


        setForm((previous) => ({
            ...previous,

            is_published:
                checked,

            published_at:
                checked &&
                !previous.published_at
                    ? new Date()
                          .toISOString()
                          .slice(
                              0,
                              16
                          )
                    : previous.published_at,
        }));


        setError("");
        setSuccess("");
    };


    // ==================================================
    // IMAGE CHANGE
    // ==================================================

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        // 5MB validation
        if (
            file.size >
            5 * 1024 * 1024
        ) {

            setError(
                "Image size must be less than 5MB."
            );

            e.target.value = "";

            return;
        }


        // Image validation
        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            setError(
                "Please select a valid image."
            );

            e.target.value = "";

            return;
        }


        // New image selected
        setImage(file);


        // Create preview
        setImagePreview(
            URL.createObjectURL(file)
        );


        // New image replaces existing image
        setRemoveExistingImage(
            false
        );


        setError("");
        setSuccess("");
    };


    // ==================================================
    // REMOVE NEW IMAGE
    // ==================================================

    const removeImage = () => {

        setImage(null);
        setImagePreview(null);


        const fileInput =
            document.getElementById(
                "news-image"
            ) as HTMLInputElement | null;


        if (fileInput) {
            fileInput.value = "";
        }
    };


    // ==================================================
    // REMOVE EXISTING IMAGE
    // ==================================================

    const removeExistingImageHandler = () => {

        setExistingImage(null);

        setRemoveExistingImage(
            true
        );
    };


    // ==================================================
    // KEEP EXISTING IMAGE
    // ==================================================

    const keepExistingImage = () => {

        if (editNews?.image_url) {

            setExistingImage(
                editNews.image_url
            );

        }

        setRemoveExistingImage(
            false
        );
    };


    // ==================================================
    // RESET FORM
    // ==================================================

    const resetForm = () => {

        setForm({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            category: "",
            author_name: "",
            is_featured: false,
            is_published: true,
            published_at: "",
            meta_title: "",
            meta_description: "",
        });


        setImage(null);

        setImagePreview(null);

        setExistingImage(null);

        setRemoveExistingImage(
            false
        );


        const fileInput =
            document.getElementById(
                "news-image"
            ) as HTMLInputElement | null;


        if (fileInput) {
            fileInput.value = "";
        }


        setError("");
        setSuccess("");
    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        setLoading(true);
        setError("");
        setSuccess("");


        try {

            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !form.title.trim()
            ) {

                setError(
                    "Title is required."
                );

                return;
            }


            if (
                !form.slug.trim()
            ) {

                setError(
                    "Slug is required."
                );

                return;
            }


            if (
                !form.content.trim()
            ) {

                setError(
                    "Content is required."
                );

                return;
            }


            // ------------------------------------------
            // FORM DATA
            // ------------------------------------------

            const formData =
                new FormData();


            formData.append(
                "title",
                form.title.trim()
            );


            formData.append(
                "slug",
                form.slug.trim()
            );


            formData.append(
                "excerpt",
                form.excerpt.trim()
            );


            formData.append(
                "content",
                form.content.trim()
            );


            formData.append(
                "category",
                form.category.trim()
            );


            formData.append(
                "author_name",
                form.author_name.trim()
            );


            formData.append(
                "is_featured",
                String(
                    form.is_featured
                )
            );


            formData.append(
                "is_published",
                String(
                    form.is_published
                )
            );


            if (
                form.published_at
            ) {

                formData.append(
                    "published_at",
                    new Date(
                        form.published_at
                    ).toISOString()
                );

            } else {

                formData.append(
                    "published_at",
                    ""
                );

            }


            formData.append(
                "meta_title",
                form.meta_title.trim()
            );


            formData.append(
                "meta_description",
                form.meta_description.trim()
            );


            // ------------------------------------------
            // IMAGE
            // ------------------------------------------

            if (image) {

                formData.append(
                    "image",
                    image
                );

            }


            // ------------------------------------------
            // REMOVE EXISTING IMAGE
            // ------------------------------------------

            if (
                isEditMode &&
                removeExistingImage &&
                !image
            ) {

                formData.append(
                    "remove_image",
                    "true"
                );

            }


            // ------------------------------------------
            // CREATE
            // ------------------------------------------

            if (!isEditMode) {

                const response =
                    await axios.post(
                        "/api/new_updates",
                        formData
                    );


                if (
                    response.data.success
                ) {

                    setSuccess(
                        "News article created successfully."
                    );


                    resetForm();


                    // Go back to list
                    onSuccess();

                } else {

                    setError(
                        response.data.message ||
                        "Failed to create news article."
                    );

                }


                return;
            }


            // ------------------------------------------
            // UPDATE
            // ------------------------------------------

            const response =
                await axios.put(
                    `/api/new_updates?id=${editNews?.id}`,
                    formData
                );


            if (
                response.data.success
            ) {

                setSuccess(
                    "News article updated successfully."
                );


                // Return to list
                onSuccess();

            } else {

                setError(
                    response.data.message ||
                    "Failed to update news article."
                );

            }

        } catch (error: any) {

            console.error(
                isEditMode
                    ? "Update news error:"
                    : "Create news error:",
                error
            );


            setError(
                error?.response?.data
                    ?.message ||
                (
                    isEditMode
                        ? "Failed to update news article."
                        : "Failed to create news article."
                )
            );

        } finally {

            setLoading(false);

        }
    };


    // ==================================================
    // CANCEL
    // ==================================================

    const handleCancel = () => {

        if (isEditMode) {

            onCancelEdit();

        } else {

            resetForm();

        }
    };


    return (
        <div className="w-full">

            <div className="rounded-box bg-base-100 shadow-md">

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="border-b border-base-200 p-6">

                    <h2 className="text-lg font-semibold text-[#584140]">

                        {isEditMode
                            ? "Edit News & Update"
                            : "Add News & Update"}

                    </h2>


                    <p className="mt-1 text-sm text-[#584140]/60">

                        {isEditMode
                            ? "Update the selected hospital news article."
                            : "Publish hospital news, announcements, and updates."}

                    </p>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-6 p-6"
                >

                    {/* ==================================
                        MESSAGES
                    ================================== */}

                    {success && (
                        <div className="alert alert-success text-sm">
                            <span>
                                {
                                    success
                                }
                            </span>
                        </div>
                    )}


                    {error && (
                        <div className="alert alert-error text-sm">
                            <span>
                                {error}
                            </span>
                        </div>
                    )}


                    {/* ==================================
                        TITLE
                    ================================== */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Title
                            </span>

                        </label>


                        <input
                            type="text"
                            name="title"
                            value={
                                form.title
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter news title"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />

                    </div>


                    {/* ==================================
                        SLUG
                    ================================== */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Slug
                            </span>

                        </label>


                        <input
                            type="text"
                            name="slug"
                            value={
                                form.slug
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="news-article-slug"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />


                        <label className="label">

                            <span className="label-text-alt text-[#584140]/50">
                                Automatically generated from the title.
                            </span>

                        </label>

                    </div>


                    {/* ==================================
                        CATEGORY + AUTHOR
                    ================================== */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Category */}
                        <div className="form-control">

                            <label className="label">

                                <span className="label-text font-medium text-[#584140]">
                                    Category
                                </span>

                            </label>


                            <select
                                name="category"
                                value={
                                    form.category
                                }
                                onChange={
                                    handleChange
                                }
                                className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={
                                    loading
                                }
                            >

                                <option value="">
                                    Select category
                                </option>

                                <option value="news">
                                    News
                                </option>

                                <option value="announcement">
                                    Announcement
                                </option>

                                <option value="event">
                                    Event
                                </option>

                                <option value="health">
                                    Health
                                </option>

                                <option value="hospital-update">
                                    Hospital Update
                                </option>

                                <option value="welfare">
                                    Welfare
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Author */}
                        <div className="form-control">

                            <label className="label">

                                <span className="label-text font-medium text-[#584140]">
                                    Author
                                </span>

                            </label>


                            <input
                                type="text"
                                name="author_name"
                                value={
                                    form.author_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. BMWH Media Team"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={
                                    loading
                                }
                            />

                        </div>

                    </div>


                    {/* ==================================
                        EXCERPT
                    ================================== */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Excerpt
                            </span>

                        </label>


                        <textarea
                            name="excerpt"
                            value={
                                form.excerpt
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Short summary of the article..."
                            className="textarea textarea-bordered min-h-24 w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />


                        <label className="label">

                            <span className="label-text-alt text-[#584140]/50">
                                A short summary used in news cards and previews.
                            </span>


                            <span className="label-text-alt text-[#584140]/50">

                                {
                                    form
                                        .excerpt
                                        .length
                                }{" "}
                                characters

                            </span>

                        </label>

                    </div>


                    {/* ==================================
                        CONTENT
                    ================================== */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Content
                            </span>

                        </label>


                        <textarea
                            name="content"
                            value={
                                form.content
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Write the full news article..."
                            className="textarea textarea-bordered min-h-64 w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />


                        <label className="label">

                            <span className="label-text-alt text-[#584140]/50">
                                Full article content.
                            </span>


                            <span className="label-text-alt text-[#584140]/50">

                                {
                                    form
                                        .content
                                        .length
                                }{" "}
                                characters

                            </span>

                        </label>

                    </div>


                    {/* ==================================
                        IMAGE
                    ================================== */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Featured Image
                            </span>


                            <span className="label-text-alt text-[#584140]/50">
                                Optional · Max 5MB
                            </span>

                        </label>


                        <input
                            id="news-image"
                            type="file"
                            accept="image/*"
                            onChange={
                                handleImageChange
                            }
                            className="file-input file-input-bordered w-full"
                            disabled={
                                loading
                            }
                        />


                        {/* Existing image */}
                        {existingImage && (
                            <div className="mt-4">

                                <p className="mb-2 text-xs font-medium text-[#584140]/60">
                                    Current Image
                                </p>


                                <div className="relative w-fit">

                                    <img
                                        src={
                                            existingImage
                                        }
                                        alt="Current news"
                                        className="h-48 w-80 rounded-xl object-cover"
                                    />


                                    <button
                                        type="button"
                                        onClick={
                                            removeExistingImageHandler
                                        }
                                        className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                        disabled={
                                            loading
                                        }
                                    >
                                        ✕
                                    </button>

                                </div>

                            </div>
                        )}


                        {/* New image preview */}
                        {imagePreview && (
                            <div className="mt-4">

                                <p className="mb-2 text-xs font-medium text-[#584140]/60">
                                    New Image
                                </p>


                                <div className="relative w-fit">

                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="New news preview"
                                        className="h-48 w-80 rounded-xl object-cover"
                                    />


                                    <button
                                        type="button"
                                        onClick={
                                            removeImage
                                        }
                                        className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                        disabled={
                                            loading
                                        }
                                    >
                                        ✕
                                    </button>

                                </div>


                                {image && (
                                    <p className="mt-2 text-xs text-[#584140]/60">
                                        {
                                            image.name
                                        }
                                    </p>
                                )}

                            </div>
                        )}


                        {/* Removed existing image */}
                        {isEditMode &&
                            removeExistingImage &&
                            !image && (
                                <div className="mt-4 rounded-lg bg-red-50 p-3">

                                    <p className="text-sm text-red-700">
                                        Current image will be removed when you save.
                                    </p>


                                    <button
                                        type="button"
                                        onClick={
                                            keepExistingImage
                                        }
                                        className="mt-2 text-sm font-medium text-[#911824] hover:underline"
                                    >
                                        Keep existing image
                                    </button>

                                </div>
                            )}

                    </div>


                    {/* ==================================
                        PUBLISH DATE
                    ================================== */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Publish Date
                            </span>

                        </label>


                        <input
                            type="datetime-local"
                            name="published_at"
                            value={
                                form.published_at
                            }
                            onChange={
                                handleChange
                            }
                            className="input input-bordered w-full max-w-md focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading ||
                                !form.is_published
                            }
                        />

                    </div>


                    {/* ==================================
                        STATUS
                    ================================== */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Published */}
                        <div className="rounded-xl border border-base-200 bg-base-50 p-4">

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="font-medium text-[#584140]">
                                        Published
                                    </p>

                                    <p className="mt-1 text-xs text-[#584140]/60">
                                        Show this article on the public website.
                                    </p>

                                </div>


                                <input
                                    type="checkbox"
                                    checked={
                                        form.is_published
                                    }
                                    onChange={
                                        handlePublishedChange
                                    }
                                    className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                    disabled={
                                        loading
                                    }
                                />

                            </div>

                        </div>


                        {/* Featured */}
                        <div className="rounded-xl border border-base-200 bg-base-50 p-4">

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="font-medium text-[#584140]">
                                        Featured Article
                                    </p>

                                    <p className="mt-1 text-xs text-[#584140]/60">
                                        Highlight this article on the website.
                                    </p>

                                </div>


                                <input
                                    type="checkbox"
                                    checked={
                                        form.is_featured
                                    }
                                    onChange={
                                        handleFeaturedChange
                                    }
                                    className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                    disabled={
                                        loading
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        SEO
                    ================================== */}

                    <div className="rounded-xl border border-base-200 p-5">

                        <div className="mb-5">

                            <h3 className="font-semibold text-[#584140]">
                                SEO Information
                            </h3>

                            <p className="mt-1 text-xs text-[#584140]/60">
                                Optional metadata for search engines.
                            </p>

                        </div>


                        <div className="space-y-5">

                            {/* Meta title */}
                            <div className="form-control">

                                <label className="label">

                                    <span className="label-text font-medium text-[#584140]">
                                        Meta Title
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="meta_title"
                                    value={
                                        form.meta_title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="SEO title"
                                    className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                    disabled={
                                        loading
                                    }
                                />

                            </div>


                            {/* Meta description */}
                            <div className="form-control">

                                <label className="label">

                                    <span className="label-text font-medium text-[#584140]">
                                        Meta Description
                                    </span>

                                </label>


                                <textarea
                                    name="meta_description"
                                    value={
                                        form.meta_description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="SEO description..."
                                    className="textarea textarea-bordered min-h-24 w-full focus:border-[#911824] focus:outline-none"
                                    disabled={
                                        loading
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        BUTTONS
                    ================================== */}

                    <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-200 pt-6 sm:flex-row">

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            className="btn btn-ghost"
                            disabled={
                                loading
                            }
                        >
                            {isEditMode
                                ? "Cancel"
                                : "Reset"}
                        </button>


                        <button
                            type="submit"
                            className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            disabled={
                                loading
                            }
                        >

                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    {isEditMode
                                        ? "Updating..."
                                        : "Creating..."}
                                </>
                            ) : (
                                isEditMode
                                    ? "Update News"
                                    : "Create News"
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default NewsUpdatesForm;
