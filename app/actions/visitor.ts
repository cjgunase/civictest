"use server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { siteVisitors } from "@/src/db/schema";
import { sql } from "drizzle-orm";

export async function getAndRecordVisitorStats(isNewVisit: boolean) {
    try {
        if (isNewVisit) {
            const headersList = await headers();
            const forwardedFor = headersList.get('x-forwarded-for') || 'local-' + Math.random().toString();
            let city = headersList.get('x-vercel-ip-city');
            let country = headersList.get('x-vercel-ip-country');

            // Fallback for local dev
            if (!city) {
                city = 'Local';
            }
            if (!country) {
                country = 'US';
            }

            await db.insert(siteVisitors).values({
                ipHash: forwardedFor,
                city: decodeURIComponent(city),
                country,
            });
        }

        // Fast count mapping to integer directly
        const res = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(siteVisitors);
        const totalVisits = res[0].count || 0;

        // Fetch the 6 most recent unique locations based on latest visit
        const latestLocations = await db.execute(sql`
            SELECT city, country, max(visited_at) as recent_visit
            FROM site_visitors
            WHERE city IS NOT NULL
            GROUP BY city, country
            ORDER BY recent_visit DESC
            LIMIT 6
        `);

        return {
            totalVisits: totalVisits,
            recentLocations: latestLocations.rows as { city: string, country: string, recent_visit: string | Date }[]
        };

    } catch (error) {
        console.error("Failed to get visitor stats", error);
        return { totalVisits: 0, recentLocations: [] };
    }
}
