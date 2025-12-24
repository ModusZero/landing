import type { IconName } from "./icon-name";

export type DropMenuItem = {
    title: string;
    descriptionTranslationKey: string;
    href: string;
    categoryTranslationKey?: string;
    icon: IconName;
};