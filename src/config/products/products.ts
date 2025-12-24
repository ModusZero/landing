import type { DropMenuItem } from '@/types/drop-menu-item';

const prefix = 'layout.header.product_list';

export const PRODUCTS_MENU: DropMenuItem[] = [
    {
        title: `${prefix}.canvacn18`,
        descriptionTranslationKey: `${prefix}.canvacn18_description`,
        href: 'canvacn18',
        icon: 'brush'
    },
    {
        title: `${prefix}.sdk_cli`,
        descriptionTranslationKey: `${prefix}.sdk_cli_description`,
        href: 'sdk-cli',
        icon: 'code'
    },
    {
        title: `${prefix}.guardcn18`,
        descriptionTranslationKey: `${prefix}.guardcn18_description`,
        href: 'guardcn18',
        icon: 'shield'
    },
    {
        title: `${prefix}.marketplacn18`,
        descriptionTranslationKey: `${prefix}.marketplacn18_description`,
        href: 'marketplacn18',
        icon: 'chart'
    },
];