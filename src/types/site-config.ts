export type SiteConfig = {
    name: string;
    title: string;
    description: string;
    keywords: string[];
    email: string;
    
    author?: string;
    publishDate?: string;
    imageUrl?: string;
    
    siteOrigin?: string;
    basePrefix?: string;

    // Open Graph / Twitter
    ogTitle: string;
    ogDescription: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
}