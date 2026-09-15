import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";
import { requireAdmin } from "@/lib/auth";

/*
|--------------------------------------------------------------------------
| POST - Create Hospital Facility
|--------------------------------------------------------------------------
*/
export async function POST(request) {
    try {
        // Admin authentication
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const is_active = formData.get("is_active") === "true";
        const image = formData.get("image");

        if (!name || !category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "name and category are required",
                },
                {
                    status: 400,
                }
            );
        }

        let image_url = null;

        // Upload image if provided
        if (image && typeof image.arrayBuffer === "function") {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            image_url = uploaded.secure_url;
        }

        const result = await sql`
            INSERT INTO hospital_facilities
                (
                    name,
                    category,
                    description,
                    image_url,
                    is_active
                )
            VALUES
                (
                    ${name},
                    ${category},
                    ${description},
                    ${image_url},
                    ${is_active}
                )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility created successfully",
                data: result[0],
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST hospital facility error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to create hospital facility",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| GET - Get Hospital Facilities
|--------------------------------------------------------------------------
*/
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const facility_id = searchParams.get("facility_id");

        /*
        |--------------------------------------------------------------------------
        | Get Single Facility
        |--------------------------------------------------------------------------
        */
        if (facility_id) {
            const result = await sql`
                SELECT *
                FROM hospital_facilities
                WHERE id = ${facility_id}
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Hospital facility not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    data: result[0],
                },
                {
                    status: 200,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Get All Facilities
        |--------------------------------------------------------------------------
        */
        const result = await sql`
            SELECT *
            FROM hospital_facilities
            ORDER BY id ASC;
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("GET hospital facilities error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch hospital facilities",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT - Update Hospital Facility
|--------------------------------------------------------------------------
|
| Example:
| PUT /api/hospital_facilities?facility_id=1
|
| FormData:
| name
| category
| description
| is_active
| image              -> optional new image
| remove_image=true  -> remove existing image
|
|--------------------------------------------------------------------------
*/
export async function PUT(request) {
    try {
        // Admin authentication
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { searchParams } = new URL(request.url);

        const facility_id = searchParams.get("facility_id");

        if (!facility_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "facility_id is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find Existing Facility
        |--------------------------------------------------------------------------
        */
        const existingFacility = await sql`
            SELECT *
            FROM hospital_facilities
            WHERE id = ${facility_id}
        `;

        if (existingFacility.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Hospital facility not found",
                },
                {
                    status: 404,
                }
            );
        }

        const currentFacility = existingFacility[0];

        /*
        |--------------------------------------------------------------------------
        | Read FormData
        |--------------------------------------------------------------------------
        */
        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const is_active = formData.get("is_active") === "true";

        const image = formData.get("image");

        const remove_image =
            formData.get("remove_image") === "true";

        /*
        |--------------------------------------------------------------------------
        | Validate Required Fields
        |--------------------------------------------------------------------------
        */
        if (!name || !category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "name and category are required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Image Handling
        |--------------------------------------------------------------------------
        */

        let image_url = currentFacility.image_url;

        let oldImageToDelete = null;

        /*
        |--------------------------------------------------------------------------
        | New Image Uploaded
        |--------------------------------------------------------------------------
        */
        if (
            image &&
            typeof image.arrayBuffer === "function"
        ) {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            image_url = uploaded.secure_url;

            // Delete old image after successful DB update
            oldImageToDelete = currentFacility.image_url;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove Existing Image
        |--------------------------------------------------------------------------
        |
        | Only remove the image when no new image is being uploaded.
        |
        |--------------------------------------------------------------------------
        */
        else if (remove_image) {
            image_url = null;

            oldImageToDelete = currentFacility.image_url;
        }

        /*
        |--------------------------------------------------------------------------
        | Update Database
        |--------------------------------------------------------------------------
        */
        const result = await sql`
            UPDATE hospital_facilities
            SET
                name = ${name},
                category = ${category},
                description = ${description},
                image_url = ${image_url},
                is_active = ${is_active}
            WHERE id = ${facility_id}
            RETURNING *;
        `;

        /*
        |--------------------------------------------------------------------------
        | Delete Old Cloudinary Image
        |--------------------------------------------------------------------------
        |
        | Database update has already succeeded, so failure to delete
        | the old image should not make the API return an error.
        |
        |--------------------------------------------------------------------------
        */
        if (oldImageToDelete) {
            try {
                await deleteFileFromCloudinary(
                    oldImageToDelete
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete old Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility updated successfully",
                data: result[0],
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("PUT hospital facility error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update hospital facility",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| DELETE - Delete Hospital Facility
|--------------------------------------------------------------------------
|
| Example:
| DELETE /api/hospital_facilities?facility_id=1
|
|--------------------------------------------------------------------------
*/
export async function DELETE(request) {
    try {
        // Admin authentication
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { searchParams } = new URL(request.url);

        const facility_id = searchParams.get("facility_id");

        if (!facility_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "facility_id is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find Facility
        |--------------------------------------------------------------------------
        */
        const existingFacility = await sql`
            SELECT *
            FROM hospital_facilities
            WHERE id = ${facility_id}
        `;

        if (existingFacility.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Hospital facility not found",
                },
                {
                    status: 404,
                }
            );
        }

        const facility = existingFacility[0];

        /*
        |--------------------------------------------------------------------------
        | Delete From Database
        |--------------------------------------------------------------------------
        */
        await sql`
            DELETE FROM hospital_facilities
            WHERE id = ${facility_id}
        `;

        /*
        |--------------------------------------------------------------------------
        | Delete Image From Cloudinary
        |--------------------------------------------------------------------------
        */
        if (facility.image_url) {
            try {
                await deleteFileFromCloudinary(
                    facility.image_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("DELETE hospital facility error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to delete hospital facility",
            },
            {
                status: 500,
            }
        );
    }
}