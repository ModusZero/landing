import type { IconName } from "@/types/icon-name";

export const SOCIAL_LINKS = [
    { name: 'GitHub', href: 'https://github.com/Luke1606', icon: 'github' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/luke1060-dev', icon: 'linkedin' },
    { name: 'Facebook', href: 'https://www.facebook.com/luis.hernandez.rosello/', icon: 'facebook' },
    { name: 'Threads', href: 'https://x.com/LuisAlbert21854', icon: 'threads' },
    { name: 'Instagram', href: 'https://www.instagram.com/luke1606/', icon: 'instagram' },
    { name: 'X', href: 'https://x.com/LuisAlbert21854', icon: 'twitter' },
] as {
    name: string;
    href: string;
    icon: IconName;
}[];