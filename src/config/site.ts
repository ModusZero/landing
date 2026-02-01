import type { SiteConfig } from "@/types/site-config";

const keyWordsPrefix = 'site.keywords';

export const SITE_CONFIG: SiteConfig = {
    name: 'site.name',
    title: 'site.title',
    description: 'site.description',
    keywords: Array.from({ length: 13 }).map(
        (_, index) => `${keyWordsPrefix}.${index + 1}`
    ),
    email: 'luisalbertohedzro@gmail.com',
    author: 'Luis Alberto Hernández Roselló',
    publishDate: '2025-01-16',
    siteOrigin: "https://moduszero.github.io",
    basePrefix: "/landing",

    // Open Graph / Twitter
    ogTitle: 'site.title',
    ogDescription: 'site.description',
    twitterCard: 'summary_large_image',
    twitterTitle: 'site.name',
    twitterDescription: 'site.description',
};