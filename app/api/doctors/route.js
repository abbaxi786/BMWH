import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const department_id = formData.get("department_id");
        const name = formData.get("name");
        const doctor_type = formData.get("doctor_type");
        const designation = formData.get("designation");
        const specialty = formData.get("specialty");
        const qualifications = formData.get("qualifications");
        const biography = formData.get("biography");
        const expertise = formData.get("expertise");
        const profile_link = formData.get("profile_link");
        const is_active = formData.get("is_active") === "true";

        const photo = formData.get("photo");

        if (!department_id || !name || !doctor_type || !designation) {
            return NextResponse.json({
                success: false,
                message: "department_id, name, doctor_type and designation are required"
            }, {
                status: 400
            });
        }

        let photo_url = null;

        if (photo && typeof photo.arrayBuffer === "function") {
            const uploadedPhoto = await uploadFileToCloudinary(
                photo,
                "bmh/doctors"
            );

            photo_url = uploadedPhoto.secure_url;
        }

        const result = await sql`
            INSERT INTO doctors
                (
                    department_id,
                    name,
                    doctor_type,
                    designation,
                    specialty,
                    qualifications,
                    biography,
                    expertise,
                    photo_url,
                    profile_link,
                    is_active
                )
            VALUES
                (
                    ${department_id},
                    ${name},
                    ${doctor_type},
                    ${designation},
                    ${specialty},
                    ${qualifications},
                    ${biography},
                    ${expertise},
                    ${photo_url},
                    ${profile_link},
                    ${is_active}
                )
            RETURNING *;
        `;

        return NextResponse.json({
            success: true,
            message: "Doctor created successfully",
            data: result[0]
        }, {
            status: 201
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json({
            success: false,
            message: error?.message
        }, {
            status: 500
        });
    }
}


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "ID is required"
            }, {
                status: 400
            });
        }

        const result = await sql`
    SELECT 
        doctors.*,
        departments.name AS department_name
    FROM doctors
    INNER JOIN departments
        ON doctors.department_id = departments.id
    WHERE doctors.id = ${id}
`;
        if (result.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Doctor not found"
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            success: true,
            data: result[0]
        }, {
            status: 200
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch doctors"
        }, {
            status: 500
        });
    }
}