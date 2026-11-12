
import type { MetadataRoute } from "next";

import { getNews } from "@/lib/data/news/news";
import { getActiveDepartments } from "@/lib/data/department/all_department";
import { getActiveHospitalFacilities } from "@/lib/data/hospitalFacilities/hospitalFacilties";

// Revalidate sitemap every 24 hours.
export const revalidate = 86400;

// Public website URL.
const siteUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
}

const baseUrl = new URL(siteUrl).origin;

// Safely convert database dates into Date objects.
function getLastModified(
    ...dates: (string | Date | null | undefined)[]
): Date | undefined {
    for (const value of dates) {
        if (!value) continue;

        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return date;
        }
    }

    return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        // Fetch all dynamic sitemap records in parallel.
        const [news, departments, facilities] = await Promise.all([
            getNews(),
            getActiveDepartments(),
            getActiveHospitalFacilities(),
        ]);

        // Static public pages.
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}/`,
                changeFrequency: "weekly",
                priority: 1.0,
            },
            {
                url: `${baseUrl}/pages/departments`,
                changeFrequency: "weekly",
                priority: 0.9,
            },
            {
                url: `${baseUrl}/pages/facilities`,
                changeFrequency: "weekly",
                priority: 0.9,
            },
            {
                url: `${baseUrl}/pages/all_news_updates`,
                changeFrequency: "daily",
                priority: 0.9,
            },
        ];

        // Published news articles.
        const newsPages: MetadataRoute.Sitemap = news
            .filter(
                (item) =>
                    item.slug &&
                    item.is_published === true
            )
            .map((item) => ({
                url: `${baseUrl}/pages/new_update/${encodeURIComponent(item.slug)}`,
                lastModified: getLastModified(
                    item.updated_at,
                    item.published_at,
                    item.created_at
                ),
                changeFrequency: "monthly",
                priority: 0.7,
            }));

        // Active departments.
        const departmentPages: MetadataRoute.Sitemap = departments
            .filter((department) => department.slug)
            .map((department) => ({
                url: `${baseUrl}/pages/departments/department/${encodeURIComponent(department.slug)}`,
                lastModified: getLastModified(
                    department.updated_at,
                    department.created_at
                ),
                changeFrequency: "monthly",
                priority: 0.8,
            }));

        // Active hospital facilities.
        const facilityPages: MetadataRoute.Sitemap = facilities
            .filter(
                (facility) =>
                    facility.id !== null &&
                    facility.id !== undefined
            )
            .map((facility) => ({
                url: `${baseUrl}/pages/facilities/${facility.id}`,
                lastModified: getLastModified(
                    facility.updated_at,
                    facility.created_at
                ),
                changeFrequency: "monthly",
                priority: 0.7,
            }));

        // Combine all URLs and remove duplicates.
        const allPages: MetadataRoute.Sitemap = [
            ...staticPages,
            ...newsPages,
            ...departmentPages,
            ...facilityPages,
        ];

        const uniquePages = Array.from(
            new Map(
                allPages.map((page) => [page.url, page])
            ).values()
        );

        return uniquePages;
    } catch (error) {
        console.error("Failed to generate sitemap:", error);
        throw error;
    }
}
