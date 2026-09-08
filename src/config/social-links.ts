import type { IconName } from "@/types/icon-name";

export const SOCIAL_LINKS = [
    { name: 'GitHub', href: 'https://github.com/luishrosello', icon: 'github' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/luishrosello', icon: 'linkedin' },
    { name: 'Facebook', href: 'https://www.facebook.com/luis.hernandez.rosello', icon: 'facebook' },
    { name: 'Instagram', href: 'https://www.instagram.com/luishrosello', icon: 'instagram' },
    { name: 'Threads', href: 'https://www.threads.com/@luishrosello', icon: 'threads' },
    { name: 'X', href: 'https://x.com/LuisAlbert21854', icon: 'twitter' },
] as {
    name: string;
    href: string;
    icon: IconName;
}[];
