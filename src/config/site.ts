import type { SiteConfig } from "@/types/site-config";
import logoLight from '@/assets/logos/favicon.svg';
import logoDark from '@/assets/logos/favicon-dark.svg';
import previewEs from '@/assets/previews/v1-moduszero-og-es.jpg';
import previewEn from '@/assets/previews/v1-moduszero-og-en.jpg';

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
    imageUrls: {
        logos: {
            light: logoLight.src,
            dark: logoDark.src,
        },
        previews: {
            es: previewEs.src,
            en: previewEn.src,
        }
    },

    // Open Graph / Twitter
    ogTitle: 'site.title',
    ogDescription: 'site.description',
    twitterCard: 'summary_large_image',
    twitterTitle: 'site.name',
    twitterDescription: 'site.description',
};