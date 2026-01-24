import type { DropMenuItem } from '@/types/drop-menu-item';

const prefix = 'layout.header.product_list';

export const PRODUCTS_MENU: DropMenuItem[] = [
    {
        title: `${prefix}.mod0`,
        descriptionTranslationKey: `${prefix}.mod0_description`,
        href: 'mod0',
        icon: 'code'
    },
];