"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiMail, FiSend } from "react-icons/fi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // ==========================================
    // Validate email
    // ==========================================
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // Call forgot password API
      // ==========================================
      const response = await fetch(
        "/api/forgot_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      // ==========================================
      // Handle API error
      // ==========================================
      if (!response.ok || !data.success) {
        setError(
          data.message ||
          "Something went wrong. Please try again."
        );

        return;
      }

      sessionStorage.setItem(
        "password_reset_email",
        email.trim().toLowerCase()
      );

      setMessage(
        data.message ||
        "An OTP has been sent to your email address."
      );

      setTimeout(() => {
        window.location.href =
          "/admin/verify_otp";
      }, 700);

      // ==========================================
      // Handle success
      // ==========================================
      setMessage(
        data.message ||
        "An OTP has been sent to your email address."
      );

      // Optional:
      // Clear email after successful request
      setEmail("");

    } catch (error) {
      console.error(
        "Forgot password error:",
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

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#911824]/10 flex items-center justify-center">
              <FiMail
                size={26}
                className="text-[#911824]"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-2xl font-semibold text-[#5B403D]">
              Forgot Password?
            </h1>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Enter the email address associated with
              your admin account and we'll send you a
              verification code.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#5B403D] mb-2"
              >
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your admin email"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 outline-none text-sm text-gray-700 transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                  disabled={loading}
                  autoComplete="email"
                />

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
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
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
                  Sending...
                </>
              ) : (
                <>
                  <FiSend size={17} />
                  Send Verification Code
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

export default ForgotPassword;