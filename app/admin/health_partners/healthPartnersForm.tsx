"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import Image from "next/image";
import axios from "axios";

interface HealthPartnerFormData {
    name: string;
    type: string;
    partnership_type: string;
    description: string;
    website_url: string;
    is_active: boolean;
}

function HealthPartnersForm() {
    const initialForm: HealthPartnerFormData = {
        name: "",
        type: "",
        partnership_type: "",
        description: "",
        website_url: "",
        is_active: true,
    };

    const [form, setForm] =
        useState<HealthPartnerFormData>(initialForm);

    const [logo, setLogo] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    // Clean up object URL when component unmounts
    // or when preview changes.
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function handleChange(
        event: ChangeEvent<
            HTMLInputElement |
                HTMLTextAreaElement |
                HTMLSelectElement
        >
    ) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleLogoChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            alert("Logo must be less than 5MB.");

            event.target.value = "";
            return;
        }

        // Only allow images
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");

            event.target.value = "";
            return;
        }

        // Remove previous preview URL
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        const objectUrl =
            URL.createObjectURL(file);

        setLogo(file);
        setPreview(objectUrl);
    }

    function handleActiveChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        setForm((previous) => ({
            ...previous,
            is_active: event.target.checked,
        }));
    }

    function resetForm() {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setForm(initialForm);
        setLogo(null);
        setPreview(null);
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!form.name.trim()) {
            alert("Health partner name is required.");
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
                "partnership_type",
                form.partnership_type.trim()
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

            if (logo) {
                formData.append(
                    "logo",
                    logo
                );
            }

            const response = await axios.post(
                "/api/health_partners",
                formData
            );

            if (response.data.success) {
                alert(
                    "Health partner created successfully."
                );

                resetForm();
            }
        } catch (error) {
            console.error(
                "Error creating health partner:",
                error
            );

            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.message ||
                        "Failed to create health partner."
                );
            } else {
                alert(
                    "Failed to create health partner."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full rounded-xl border border-base-200 bg-white p-4 shadow-sm sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#584140]">
                    Add Health Partner
                </h2>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Add a healthcare organization or
                    institution that partners with the
                    hospital.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Name + Type */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Partner Name
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
                            placeholder="e.g. Shaukat Khanum Memorial"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Partner Type
                            </span>
                        </label>

                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                        >
                            <option value="">
                                Select type
                            </option>

                            <option value="hospital">
                                Hospital
                            </option>

                            <option value="clinic">
                                Clinic
                            </option>

                            <option value="laboratory">
                                Laboratory
                            </option>

                            <option value="pharmaceutical">
                                Pharmaceutical
                            </option>

                            <option value="medical_organization">
                                Medical Organization
                            </option>

                            <option value="ngo">
                                NGO
                            </option>

                            <option value="foundation">
                                Foundation
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

                {/* Partnership Type + Website */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Partnership Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Partnership Type
                            </span>
                        </label>

                        <select
                            name="partnership_type"
                            value={
                                form.partnership_type
                            }
                            onChange={handleChange}
                            className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                        >
                            <option value="">
                                Select partnership
                            </option>

                            <option value="clinical">
                                Clinical Partnership
                            </option>

                            <option value="referral">
                                Referral Partnership
                            </option>

                            <option value="medical">
                                Medical Partnership
                            </option>

                            <option value="diagnostic">
                                Diagnostic Partnership
                            </option>

                            <option value="research">
                                Research Partnership
                            </option>

                            <option value="training">
                                Training Partnership
                            </option>

                            <option value="equipment">
                                Equipment Partnership
                            </option>

                            <option value="pharmaceutical">
                                Pharmaceutical Partnership
                            </option>

                            <option value="strategic">
                                Strategic Partnership
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
                            value={
                                form.website_url
                            }
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium text-[#584140]">
                            Description
                        </span>
                    </label>

                    <textarea
                        name="description"
                        value={
                            form.description
                        }
                        onChange={handleChange}
                        placeholder="Describe the partnership and its role..."
                        rows={5}
                        className="textarea textarea-bordered w-full resize-y focus:border-[#911824] focus:outline-none"
                    />
                </div>

                {/* Logo */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium text-[#584140]">
                            Partner Logo
                        </span>
                    </label>

                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleLogoChange}
                        className="file-input file-input-bordered w-full"
                    />

                    <p className="mt-2 text-xs text-[#584140]/50">
                        PNG, JPG, JPEG or WebP.
                        Maximum size: 5MB.
                    </p>

                    {/* Preview */}
                    {preview && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium text-[#584140]">
                                Logo Preview
                            </p>

                            <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9]">
                                <Image
                                    src={preview}
                                    alt="Partner logo preview"
                                    fill
                                    sizes="128px"
                                    className="object-contain p-3"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Active */}
                <div className="rounded-xl border border-base-200 bg-[#FBF9F9] p-4">
                    <label className="flex cursor-pointer items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-[#584140]">
                                Active Health Partner
                            </p>

                            <p className="mt-1 text-sm text-[#584140]/60">
                                Active partners will be
                                displayed on the public
                                website.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={handleActiveChange}
                            className="toggle border-[#911824] bg-white checked:bg-[#911824]"
                        />
                    </label>
                </div>

                {/* Buttons */}
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
                            "Create Health Partner"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HealthPartnersForm;