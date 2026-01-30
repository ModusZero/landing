import type { DropMenuItem } from '@/types/drop-menu-item';

const prefix = 'layout.header.resource_list';

export const RESOURCES_MENU: DropMenuItem[] = [
    {
        title: `${prefix}.releases`,
        descriptionTranslationKey: `${prefix}.releases_description`,
        categoryTranslationKey: `${prefix}.news`,
        href: 'releases',
        icon: 'chart'
    },
    {
        title: `${prefix}.first_steps`,
        descriptionTranslationKey: `${prefix}.first_steps_description`,
        categoryTranslationKey: `${prefix}.learn`,
        href: 'first-steps',
        icon: 'dribbble'
    },
    {
        title: `${prefix}.docs`,
        descriptionTranslationKey: `${prefix}.docs_description`,
        categoryTranslationKey: `${prefix}.learn`,
        href: 'docs',
        icon: 'layers'
    },
    {
        title: `${prefix}.get_product`,
        descriptionTranslationKey: `${prefix}.get_product_description`,
        categoryTranslationKey: `${prefix}.community`,
        href: 'get-product',
        icon: 'heart'
    },
    {
        title: `${prefix}.blog`,
        descriptionTranslationKey: `${prefix}.blog_description`,
        categoryTranslationKey: `${prefix}.news`,
        href: 'blog',
        icon: 'brush'
    },
    {
        title: `${prefix}.collaborate`,
        descriptionTranslationKey: `${prefix}.collaborate_description`,
        categoryTranslationKey: `${prefix}.community`,
        href: 'collaborate',
        icon: 'bolt'
    },
     {
        title: `${prefix}.forum`,
        descriptionTranslationKey: `${prefix}.forum_description`,
        categoryTranslationKey: `${prefix}.community`,
        href: 'forum',
        icon: 'chat'
    }
];