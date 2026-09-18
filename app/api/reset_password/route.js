import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        // ==========================================
        // 1. Get new password
        // ==========================================
        const { newPassword } =
            await request.json();

        // ==========================================
        // 2. Validate password
        // ==========================================
        if (
            !newPassword ||
            typeof newPassword !== "string"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password is required.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 3. Password length
        // ==========================================
        if (newPassword.length < 8) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must be at least 8 characters long.",
                },
                { status: 400 }
            );
        }

        // ==========================================
        // 4. Get reset token from cookie
        // ==========================================
        const resetToken =
            request.cookies.get(
                "admin_reset_token"
            )?.value;

        if (!resetToken) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password reset session has expired. Please request a new OTP.",
                },
                { status: 401 }
            );
        }

        // ==========================================
        // 5. Read auth.json
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
        // 6. Check admin
        // ==========================================
        if (!authData.admin) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin account not found.",
                },
                { status: 500 }
            );
        }

        // ==========================================
        // 7. Check reset token
        // ==========================================
        if (
            !authData.admin.resetTokenHash ||
            !authData.admin.resetTokenExpiresAt
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid password reset session.",
                },
                { status: 401 }
            );
        }

        // ==========================================
        // 8. Check reset token expiry
        // ==========================================
        if (
            Date.now() >
            Number(
                authData.admin
                    .resetTokenExpiresAt
            )
        ) {
            // Remove expired reset token
            delete authData.admin.resetTokenHash;
            delete authData.admin.resetTokenExpiresAt;

            await fs.writeFile(
                filePath,
                JSON.stringify(
                    authData,
                    null,
                    4
                ),
                "utf-8"
            );

            const response =
                NextResponse.json(
                    {
                        success: false,
                        message:
                            "Password reset session has expired. Please request a new OTP.",
                    },
                    { status: 401 }
                );

            response.cookies.delete(
                "admin_reset_token"
            );

            return response;
        }

        // ==========================================
        // 9. Hash submitted reset token
        // ==========================================
        const resetTokenHash =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

        // ==========================================
        // 10. Compare reset token
        // ==========================================
        if (
            resetTokenHash !==
            authData.admin.resetTokenHash
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid password reset session.",
                },
                { status: 401 }
            );
        }

        // ==========================================
        // 11. Hash new password
        // ==========================================
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                12
            );

        // ==========================================
        // 12. Update password
        // ==========================================
        authData.admin.password =
            hashedPassword;

        // ==========================================
        // 13. Remove reset token
        // ==========================================
        delete authData.admin.resetTokenHash;

        delete authData.admin
            .resetTokenExpiresAt;

        // ==========================================
        // 14. Save auth.json
        // ==========================================
        await fs.writeFile(
            filePath,
            JSON.stringify(
                authData,
                null,
                4
            ),
            "utf-8"
        );

        // ==========================================
        // 15. Clear reset cookie
        // ==========================================
        const response =
            NextResponse.json({
                success: true,
                message:
                    "Password reset successfully. You can now log in.",
            });

        response.cookies.delete(
            "admin_reset_token"
        );

        return response;

    } catch (error) {
        console.error(
            "Reset password error:",
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