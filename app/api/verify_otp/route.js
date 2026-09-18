import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
    try {
        // ==========================================
        // 1. Get email and OTP
        // ==========================================
        const { email, otp } = await request.json();

        // ==========================================
        // 2. Validate input
        // ==========================================
        if (!email || typeof email !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is required.",
                },
                { status: 400 }
            );
        }

        if (!otp || typeof otp !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    message: "OTP is required.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const normalizedOtp = otp.trim();

        // ==========================================
        // 3. Validate OTP format
        // ==========================================
        if (!/^\d{6}$/.test(normalizedOtp)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "OTP must be a 6-digit code.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 4. Read auth.json
        // ==========================================
        const filePath = path.join(
            process.cwd(),
            "auth",
            "auth.json"
        );

        const fileData = await fs.readFile(
            filePath,
            "utf-8"
        );

        const authData = JSON.parse(fileData);

        // ==========================================
        // 5. Check admin object
        // ==========================================
        if (!authData.admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin account not found.",
                },
                { status: 500 }
            );
        }

        // ==========================================
        // 6. Check email
        // ==========================================
        if (
            !authData.admin.email ||
            authData.admin.email.toLowerCase() !==
                normalizedEmail
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OTP request.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 7. Check OTP exists
        // ==========================================
        if (
            !authData.admin.resetOtpHash ||
            !authData.admin.resetOtpExpiresAt
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "No active OTP found. Please request a new OTP.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 8. Check OTP expiry
        // ==========================================
        if (
            Date.now() >
            Number(authData.admin.resetOtpExpiresAt)
        ) {
            // Remove expired OTP
            delete authData.admin.resetOtpHash;
            delete authData.admin.resetOtpExpiresAt;

            await fs.writeFile(
                filePath,
                JSON.stringify(authData, null, 4),
                "utf-8"
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "OTP has expired. Please request a new OTP.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 9. Hash submitted OTP
        // ==========================================
        const submittedOtpHash = crypto
            .createHash("sha256")
            .update(normalizedOtp)
            .digest("hex");

        // ==========================================
        // 10. Compare OTP hashes
        // ==========================================
        if (
            submittedOtpHash !==
            authData.admin.resetOtpHash
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid OTP. Please check the code and try again.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 11. Generate temporary reset token
        // ==========================================
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash reset token before storing it
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // ==========================================
        // 12. Reset token expires in 10 minutes
        // ==========================================
        const resetTokenExpiresAt =
            Date.now() + 10 * 60 * 1000;

        // ==========================================
        // 13. Remove used OTP
        // ==========================================
        delete authData.admin.resetOtpHash;
        delete authData.admin.resetOtpExpiresAt;

        // ==========================================
        // 14. Save reset token hash
        // ==========================================
        authData.admin.resetTokenHash =
            resetTokenHash;

        authData.admin.resetTokenExpiresAt =
            resetTokenExpiresAt;

        await fs.writeFile(
            filePath,
            JSON.stringify(authData, null, 4),
            "utf-8"
        );

        // ==========================================
        // 15. Set HttpOnly reset cookie
        // ==========================================
        const response = NextResponse.json({
            success: true,
            message:
                "OTP verified successfully. You can now reset your password.",
        });

        response.cookies.set(
            "admin_reset_token",
            resetToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "strict",
                path: "/",
                maxAge: 10 * 60,
            }
        );

        return response;

    } catch (error) {
        console.error(
            "Verify OTP error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Something went wrong. Please try again.",
            },
            { status: 500 }
        );
    }
}