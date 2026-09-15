"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import Image from "next/image";
import axios from "axios";

interface SupporterFormData {
    name: string;
    type: string;
    support_type: string;
    description: string;
    website_url: string;
    is_active: boolean;
}

function SupportersForm() {
    const [form, setForm] = useState<SupporterFormData>({
        name: "",
        type: "",
        support_type: "",
        description: "",
        website_url: "",
        is_active: true,
    });

    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        null
    );

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Clean preview URL when component unmounts
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    /*
    |--------------------------------------------------------------------------
    | Handle normal input changes
    |--------------------------------------------------------------------------
    */
    function handleChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Handle logo selection
    |--------------------------------------------------------------------------
    */
    function handleLogoChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccess("");

        /*
        |--------------------------------------------------------------------------
        | Validate file type
        |--------------------------------------------------------------------------
        */
        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );

            event.target.value = "";
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | 5MB maximum
        |--------------------------------------------------------------------------
        */
        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Logo must be less than 5MB."
            );

            event.target.value = "";
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove previous preview URL
        |--------------------------------------------------------------------------
        */
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        const objectUrl = URL.createObjectURL(file);

        setLogo(file);
        setPreview(objectUrl);
    }

    /*
    |--------------------------------------------------------------------------
    | Handle active toggle
    |--------------------------------------------------------------------------
    */
    function handleActiveChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        setForm((previous) => ({
            ...previous,
            is_active: event.target.checked,
        }));

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Reset form
    |--------------------------------------------------------------------------
    */
    function resetForm() {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setForm({
            name: "",
            type: "",
            support_type: "",
            description: "",
            website_url: "",
            is_active: true,
        });

        setLogo(null);
        setPreview(null);

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Submit supporter
    |--------------------------------------------------------------------------
    */
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setSuccess("");

        /*
        |--------------------------------------------------------------------------
        | Validate name
        |--------------------------------------------------------------------------
        */
        if (!form.name.trim()) {
            setError(
                "Supporter name is required."
            );
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "type",
                form.type.trim()
            );

            formData.append(
                "support_type",
                form.support_type.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "website_url",
                form.website_url.trim()
            );

            formData.append(
                "is_active",
                String(form.is_active)
            );

            /*
            |--------------------------------------------------------------------------
            | Only append logo when one was selected
            |--------------------------------------------------------------------------
            */
            if (logo) {
                formData.append(
                    "logo",
                    logo
                );
            }

            const response = await axios.post(
                "/api/supporters",
                formData
            );

            if (response.data.success) {
                setSuccess(
                    "Supporter created successfully."
                );

                resetForm();

                /*
                |--------------------------------------------------------------------------
                | Keep success message after reset
                |--------------------------------------------------------------------------
                */
                setSuccess(
                    "Supporter created successfully."
                );
            } else {
                setError(
                    response.data.message ||
                        "Failed to create supporter."
                );
            }
        } catch (error) {
            console.error(
                "Error creating supporter:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to create supporter."
                );
            } else {
                setError(
                    "Failed to create supporter."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full rounded-xl border border-base-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#584140]">
                    Add Supporter
                </h2>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Add an organization, sponsor, or
                    partner supporting the hospital.
                </p>
            </div>

            {/* Success message */}
            {success && (
                <div className="alert alert-success mb-6">
                    <span>{success}</span>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="alert alert-error mb-6">
                    <span>{error}</span>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* =========================================================
                    NAME + TYPE
                ========================================================== */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Supporter Name
                                <span className="ml-1 text-error">
                                    *
                                </span>
                            </span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Al-Khidmat Foundation"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Type
                            </span>
                        </label>

                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            disabled={loading}
                            className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                        >
                            <option value="">
                                Select type
                            </option>

                            <option value="organization">
                                Organization
                            </option>

                            <option value="company">
                                Company
                            </option>

                            <option value="foundation">
                                Foundation
                            </option>

                            <option value="ngo">
                                NGO
                            </option>

                            <option value="individual">
                                Individual
                            </option>

                            <option value="government">
                                Government
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>
                </div>

                {/* =========================================================
                    SUPPORT TYPE + WEBSITE
                ========================================================== */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Support Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Support Type
                            </span>
                        </label>

                        <select
                            name="support_type"
                            value={form.support_type}
                            onChange={handleChange}
                            disabled={loading}
                            className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                        >
                            <option value="">
                                Select support type
                            </option>

                            <option value="financial">
                                Financial Support
                            </option>

                            <option value="medical">
                                Medical Support
                            </option>

                            <option value="equipment">
                                Equipment
                            </option>

                            <option value="medicines">
                                Medicines
                            </option>

                            <option value="services">
                                Services
                            </option>

                            <option value="sponsorship">
                                Sponsorship
                            </option>

                            <option value="partnership">
                                Partnership
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* Website */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Website URL
                            </span>
                        </label>

                        <input
                            type="url"
                            name="website_url"
                            value={form.website_url}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            disabled={loading}
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                        />
                    </div>
                </div>

                {/* =========================================================
                    DESCRIPTION
                ========================================================== */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium text-[#584140]">
                            Description
                        </span>
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe how this organization supports the hospital..."
                        rows={5}
                        disabled={loading}
                        className="textarea textarea-bordered w-full resize-y focus:border-[#911824] focus:outline-none"
                    />
                </div>

                {/* =========================================================
                    LOGO
                ========================================================== */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium text-[#584140]">
                            Supporter Logo
                        </span>
                    </label>

                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleLogoChange}
                        disabled={loading}
                        className="file-input file-input-bordered w-full"
                    />

                    <p className="mt-2 text-xs text-[#584140]/50">
                        PNG, JPG, JPEG or WebP.
                        Maximum size: 5MB.
                    </p>

                    {/* Logo preview */}
                    {preview && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium text-[#584140]">
                                Logo Preview
                            </p>

                            <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9]">
                                <Image
                                    src={preview}
                                    alt="Supporter logo preview"
                                    fill
                                    sizes="128px"
                                    className="object-contain p-3"
                                />
                            </div>

                            <p className="mt-2 max-w-xs truncate text-xs text-[#584140]/50">
                                {logo?.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* =========================================================
                    ACTIVE STATUS
                ========================================================== */}
                <div className="rounded-xl border border-base-200 bg-[#FBF9F9] p-4">
                    <label className="flex cursor-pointer items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-[#584140]">
                                Active Supporter
                            </p>

                            <p className="mt-1 text-sm text-[#584140]/60">
                                Active supporters will be
                                displayed on the public
                                website.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={handleActiveChange}
                            disabled={loading}
                            className="toggle border-[#911824] bg-white checked:bg-[#911824]"
                        />
                    </label>
                </div>

                {/* =========================================================
                    BUTTONS
                ========================================================== */}
                <div className="flex flex-col-reverse gap-3 border-t border-base-200 pt-6 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="btn btn-outline"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn border-[#911824] bg-[#911824] text-white hover:border-[#86000D] hover:bg-[#86000D]"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Creating...
                            </>
                        ) : (
                            "Create Supporter"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SupportersForm;