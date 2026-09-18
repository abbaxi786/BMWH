"use client";

import React, {
    FormEvent,
    useState,
} from "react";

import Link from "next/link";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiEye,
    FiEyeOff,
    FiLock,
} from "react-icons/fi";

function ResetPassword() {
    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // ==========================================
        // Validate password
        // ==========================================
        if (!password) {
            setError(
                "Please enter your new password."
            );

            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters long."
            );

            return;
        }

        // ==========================================
        // Confirm password
        // ==========================================
        if (!confirmPassword) {
            setError(
                "Please confirm your new password."
            );

            return;
        }

        if (
            password !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );

            return;
        }

        setLoading(true);

        try {
            // ==========================================
            // Reset password API
            // ==========================================
            const response = await fetch(
                "/api/reset_password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        newPassword:
                            password,
                    }),
                }
            );

            const data =
                await response.json();

            // ==========================================
            // Handle error
            // ==========================================
            if (
                !response.ok ||
                !data.success
            ) {
                setError(
                    data.message ||
                        "Unable to reset password."
                );

                return;
            }

            // ==========================================
            // Success
            // ==========================================
            setMessage(
                data.message ||
                    "Password reset successfully."
            );

            // Remove reset email
            sessionStorage.removeItem(
                "password_reset_email"
            );

            // ==========================================
            // Redirect to login
            // ==========================================
            setTimeout(() => {
                window.location.href =
                    "/admin/log-in";
            }, 1200);

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f7f7] flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                    {/* Icon */}
                    <div className="flex justify-center mb-6">

                        <div className="w-14 h-14 rounded-full bg-[#911824]/10 flex items-center justify-center">

                            <FiLock
                                size={26}
                                className="text-[#911824]"
                            />

                        </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-semibold text-[#5B403D]">
                            Reset Password
                        </h1>

                        <p className="text-sm text-gray-500 mt-2 leading-6">
                            Create a new password for
                            your admin account.
                        </p>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* New Password */}
                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#5B403D] mb-2"
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <FiLock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        password
                                    }
                                    onChange={(e) =>
                                        setPassword(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    className="w-full h-12 pl-10 pr-11 rounded-lg border border-gray-300 outline-none text-sm text-gray-700 transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                    disabled={
                                        loading
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#911824]"
                                >
                                    {showPassword ? (
                                        <FiEyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <FiEye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>

                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Password must be at least
                                8 characters.
                            </p>

                        </div>

                        {/* Confirm Password */}
                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-[#5B403D] mb-2"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <FiLock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    className="w-full h-12 pl-10 pr-11 rounded-lg border border-gray-300 outline-none text-sm text-gray-700 transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                    disabled={
                                        loading
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#911824]"
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <FiEye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {message && (
                            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                                <FiCheckCircle
                                    size={17}
                                />

                                {message}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#911824] hover:bg-[#7d141f] text-white font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    <FiLock size={17} />
                                    Reset Password
                                </>
                            )}

                        </button>

                    </form>

                    {/* Back to Login */}
                    <div className="mt-7 pt-6 border-t border-gray-100 text-center">

                        <Link
                            href="/admin/log-in"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#911824] hover:text-[#7d141f] transition"
                        >
                            <FiArrowLeft size={16} />
                            Back to Login
                        </Link>

                    </div>

                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Bashir Memorial Welfare Hospital
                </p>

            </div>

        </div>
    );
}

export default ResetPassword;