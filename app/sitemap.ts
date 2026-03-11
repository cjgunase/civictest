import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Replace this with your actual production domain
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://civictest2025.com';

    return [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/study-guide`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/practice`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/interview`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }
    ];
}
