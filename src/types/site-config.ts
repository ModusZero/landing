export type SiteConfig = {
    name: string;
    title: string;
    description: string;
    keywords: string[];
    email: string;
    
    author?: string;
    publishDate?: string;
    imageUrls?: {
        logos?: {
            default?: string,
            google?: string,
            light?: string,
            dark?: string,
        },
        previews?: {
            default?: string,
            es?: string,
            en?: string,
        }
    };
    
    // Open Graph / Twitter
    ogTitle: string;
    ogDescription: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
}