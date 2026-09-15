"use client";

import { useState } from "react";
import Image from "next/image";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "@/app/context/context";


function LogIn() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const success = await login(email, password);

            if (!success) {
                setError("Invalid email or password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4 py-10">

            {/* Login Card */}
            <div className="w-full max-w-107.5">

                <div className="bg-white border border-[#E0BFBD]/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-sm px-7 py-8 sm:px-9 sm:py-10">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-22.5 h-22.5">
                            <Image
                                src="/logo.png"
                                alt="Bashir Memorial Welfare Hospital"
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-[23px] font-semibold text-[#5B403D]">
                            Bashir Memorial Welfare Hospital
                        </h1>

                        <p className="mt-2 text-[13px] text-gray-500">
                            Hospital Administration
                        </p>
                    </div>

                    {/* Login Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Error */}
                        {error && (
                            <div className="rounded-sm border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-[13px] font-medium text-[#5B403D]"
                            >
                                Email Address
                            </label>

                            <div className="relative">
                                <FiMail
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className="
                                        h-11
                                        w-full
                                        rounded-sm
                                        border
                                        border-[#D9C7C5]
                                        bg-white
                                        pl-10
                                        pr-3
                                        text-[13px]
                                        text-[#5B403D]
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-[#911824]
                                        focus:ring-1
                                        focus:ring-[#911824]/20
                                    "
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-[13px] font-medium text-[#5B403D]"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <FiLock
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="
                                        h-11
                                        w-full
                                        rounded-sm
                                        border
                                        border-[#D9C7C5]
                                        bg-white
                                        pl-10
                                        pr-11
                                        text-[13px]
                                        text-[#5B403D]
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-[#911824]
                                        focus:ring-1
                                        focus:ring-[#911824]/20
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        transition
                                        hover:text-[#911824]
                                    "
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <FiEyeOff size={17} />
                                    ) : (
                                        <FiEye size={17} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-2
                                flex
                                h-11
                                w-full
                                items-center
                                justify-center
                                rounded-sm
                                bg-[#911824]
                                text-[13px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#86000D]
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            "
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer text */}
                    <div className="mt-7 border-t border-[#E0BFBD]/30 pt-5 text-center">
                        <p className="text-[11px] text-gray-400">
                            Authorized personnel only
                        </p>
                    </div>
                </div>

                {/* Bottom branding */}
                <p className="mt-5 text-center text-[11px] text-gray-400">
                    © {new Date().getFullYear()} Bashir Memorial Welfare Hospital
                </p>
            </div>
        </main>
    );
}

export default LogIn;

