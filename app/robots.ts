
import type { MetadataRoute } from "next";

const siteUrl = process.env.BACKEND_URL?.replace(/\/+$/, "") || "";

if (!siteUrl) {
    throw new Error("BACKEND_URL is not defined");
}

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${new URL(siteUrl).origin}/sitemap.xml`,
    };
}
