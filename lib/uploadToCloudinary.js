import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
});

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