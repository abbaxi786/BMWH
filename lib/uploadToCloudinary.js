import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
});


// ======================================================
// UPLOAD FILE TO CLOUDINARY
// ======================================================

export async function uploadFileToCloudinary(
    file,
    folder = "bmh"
) {
    if (!file || typeof file.arrayBuffer !== "function") {
        throw new Error("Invalid file");
    }

    // File -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert image to WebP
    const webpBuffer = await sharp(buffer)
        .webp({
            quality: 80,
        })
        .toBuffer();

    // Upload WebP to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                format: "webp",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(webpBuffer);
    });

    return result;
}


// ======================================================
// DELETE FILE FROM CLOUDINARY USING IMAGE URL
// ======================================================

export async function deleteFileFromCloudinary(imageUrl) {
    if (!imageUrl) {
        return null;
    }

    try {
        // Example image URL:
        //
        // https://res.cloudinary.com/xxxxx/image/upload/v1234567890/bmh/diagnostic-services/image.webp
        //
        // We need:
        //
        // bmh/diagnostic-services/image
        //

        const url = new URL(imageUrl);

        let publicId = url.pathname.split("/image/upload/")[1];

        if (!publicId) {
            throw new Error("Invalid Cloudinary image URL");
        }

        // Remove version from URL
        // v1234567890/bmh/diagnostic-services/image.webp
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove file extension
        // bmh/diagnostic-services/image.webp
        // becomes
        // bmh/diagnostic-services/image
        publicId = publicId.replace(/\.[^/.]+$/, "");

        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
            }
        );

        return result;

    } catch (error) {
        console.error(
            "Error deleting Cloudinary file:",
            error
        );

        throw error;
    }
}