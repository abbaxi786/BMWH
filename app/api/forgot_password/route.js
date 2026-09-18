import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

import { resend } from "@/lib/resend";

export async function POST(request) {
    try {
        // ==========================================
        // 1. Get email from request
        // ==========================================
        const { email } = await request.json();

        // ==========================================
        // 2. Validate email
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

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        // ==========================================
        // 3. Read auth.json
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
        // 4. Check admin object
        // ==========================================
        if (!authData.admin) {
            console.error(
                "Admin object not found in auth.json"
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

        // ==========================================
        // 5. Check admin email
        // ==========================================
        if (
            !authData.admin.email ||
            authData.admin.email.toLowerCase() !==
                normalizedEmail
        ) {
            /*
             * We intentionally return the same response
             * even when the email does not exist.
             *
             * This prevents email/account enumeration.
             */
            return NextResponse.json({
                success: true,
                message:
                    "If an account exists with this email, an OTP has been sent.",
            });
        }

        // ==========================================
        // 6. Generate 6-digit OTP
        // ==========================================
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        console.log("Generated OTP:", otp);

        // ==========================================
        // 7. Hash OTP
        // ==========================================
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // ==========================================
        // 8. OTP expiry
        // 10 minutes
        // ==========================================
        const otpExpiresAt =
            Date.now() + 10 * 60 * 1000;

        // ==========================================
        // 9. Send OTP email
        // ==========================================
        const { data, error } =
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL,
                to: normalizedEmail,

                subject:
                    "BMWH Hospital Admin Password Reset OTP",

                html: `
                    <div style="
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: #f5f5f5;
                        padding: 40px 20px;
                    ">

                        <div style="
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 35px;
                            border-radius: 10px;
                            border: 1px solid #eeeeee;
                        ">

                            <h2 style="
                                margin: 0 0 10px 0;
                                color: #911824;
                                font-size: 24px;
                            ">
                                Bashir Memorial Welfare Hospital
                            </h2>

                            <p style="
                                color: #666666;
                                margin-top: 0;
                            ">
                                Admin Panel
                            </p>

                            <hr style="
                                border: none;
                                border-top: 1px solid #eeeeee;
                                margin: 25px 0;
                            " />

                            <p style="
                                font-size: 16px;
                                color: #333333;
                            ">
                                Hello ${
                                    authData.admin.username ||
                                    "Admin"
                                },
                            </p>

                            <p style="
                                font-size: 15px;
                                line-height: 1.6;
                                color: #555555;
                            ">
                                We received a request to reset
                                your BMWH Hospital admin password.
                            </p>

                            <p style="
                                font-size: 15px;
                                color: #555555;
                            ">
                                Your verification code is:
                            </p>

                            <div style="
                                margin: 25px 0;
                                padding: 20px;
                                background-color: #f8f7f7;
                                border-radius: 8px;
                                text-align: center;
                            ">

                                <span style="
                                    font-size: 32px;
                                    font-weight: bold;
                                    letter-spacing: 8px;
                                    color: #911824;
                                ">
                                    ${otp}
                                </span>

                            </div>

                            <p style="
                                font-size: 14px;
                                color: #666666;
                            ">
                                This OTP will expire in
                                <strong>10 minutes</strong>.
                            </p>

                            <p style="
                                font-size: 14px;
                                line-height: 1.6;
                                color: #777777;
                            ">
                                If you did not request a password
                                reset, you can safely ignore this
                                email.
                            </p>

                            <hr style="
                                border: none;
                                border-top: 1px solid #eeeeee;
                                margin: 30px 0;
                            " />

                            <p style="
                                margin: 0;
                                font-size: 12px;
                                color: #999999;
                            ">
                                Bashir Memorial Welfare Hospital
                            </p>

                            <p style="
                                margin: 5px 0 0 0;
                                font-size: 12px;
                                color: #999999;
                            ">
                                Admin Password Recovery
                            </p>

                        </div>

                    </div>
                `,
            });

        // ==========================================
        // 10. Log Resend response
        // ==========================================
        console.log("RESEND DATA:", data);
        console.log("RESEND ERROR:", error);

        // ==========================================
        // 11. Check email error
        // ==========================================
        if (error) {
            console.error(
                "Resend email error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unable to send OTP email. Please try again.",
                },
                { status: 500 }
            );
        }

        // ==========================================
        // 12. Save OTP inside admin object
        // ==========================================
        authData.admin.resetOtpHash = otpHash;

        authData.admin.resetOtpExpiresAt =
            otpExpiresAt;

        // ==========================================
        // 13. Save updated auth.json
        // ==========================================
        await fs.writeFile(
            filePath,
            JSON.stringify(authData, null, 4),
            "utf-8"
        );

        // ==========================================
        // 14. Return success
        // ==========================================
        return NextResponse.json({
            success: true,
            message:
                "An OTP has been sent to your email address.",
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
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