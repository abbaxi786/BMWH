"use client";

import React, {
    FormEvent,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiKey,
} from "react-icons/fi";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const storedEmail =
            sessionStorage.getItem(
                "password_reset_email"
            );

        if (!storedEmail) {
            window.location.href =
                "/admin/forgot_password";

            return;
        }

        setEmail(storedEmail);
    }, []);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // ==========================================
        // Validate OTP
        // ==========================================
        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        if (!/^\d{6}$/.test(otp.trim())) {
            setError(
                "OTP must be a 6-digit code."
            );
            return;
        }

        setLoading(true);

        try {
            // ==========================================
            // Verify OTP
            // ==========================================
            const response = await fetch(
                "/api/verify_otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        otp: otp.trim(),
                    }),
                }
            );

            const data = await response.json();

            // ==========================================
            // Handle error
            // ==========================================
            if (
                !response.ok ||
                !data.success
            ) {
                setError(
                    data.message ||
                        "Invalid OTP."
                );

                return;
            }

            // ==========================================
            // Success
            // ==========================================
            setMessage(
                data.message ||
                    "OTP verified successfully."
            );

            // ==========================================
            // Move to reset password page
            // ==========================================
            setTimeout(() => {
                window.location.href =
                    "/admin/reset_password";
            }, 700);

        } catch (error) {
            console.error(
                "Verify OTP error:",
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

                            <FiKey
                                size={26}
                                className="text-[#911824]"
                            />

                        </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-semibold text-[#5B403D]">
                            Verify OTP
                        </h1>

                        <p className="text-sm text-gray-500 mt-2 leading-6">
                            Enter the 6-digit verification
                            code we sent to your email.
                        </p>

                        {email && (
                            <p className="text-sm font-medium text-[#911824] mt-3 break-all">
                                {email}
                            </p>
                        )}

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* OTP */}
                        <div>

                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-[#5B403D] mb-2"
                            >
                                Verification Code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 outline-none text-center tracking-[0.4em] text-lg font-semibold text-gray-700 transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                disabled={loading}
                                autoComplete="one-time-code"
                            />

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
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FiKey size={17} />
                                    Verify OTP
                                </>
                            )}

                        </button>

                    </form>

                    {/* Back */}
                    <div className="mt-7 pt-6 border-t border-gray-100 text-center">

                        <Link
                            href="/admin/forgot_password"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#911824] hover:text-[#7d141f] transition"
                        >
                            <FiArrowLeft size={16} />
                            Request New OTP
                        </Link>

                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Bashir Memorial Welfare Hospital
                </p>

            </div>

        </div>
    );
}

export default VerifyOtp;