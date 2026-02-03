import { PRODUCTS_MENU } from "./products/products";
import { RESOURCES_MENU } from "./resources";

const prefix = 'layout.header';

export const NAVIGATION_CONFIG = {
    links: [
        { 
            href: 'products', 
            translationKey: `${prefix}.products`,
            drop: true,
            items: PRODUCTS_MENU
        },
        { 
            href: 'resources', 
            translationKey: `${prefix}.resources`,
            drop: true,
            items: RESOURCES_MENU
        },
        { 
            href: 'about-us', 
            translationKey: `${prefix}.about_us`,
            drop: false
        },
        // { 
        //     href: 'enterprise', 
        //     translationKey: `${prefix}.enterprise`,
        //     drop: false
        // },
         { 
            href: 'help', 
            translationKey: `${prefix}.help`,
            drop: false
        },
    ],
    cta: {
        href: 'contact',
        translationKey: `${prefix}.get_demo`,
    },
};