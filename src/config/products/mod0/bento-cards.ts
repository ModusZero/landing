import { type BentoCardProps } from "@/components/islands/MagicBento";

const translationPrefix = 'products.mod0.bento.';

export const cards: BentoCardProps[] = [
  {
    color: '#060010',
    title: `${translationPrefix}context.title`,
    description: `${translationPrefix}context.description`,
    label: `${translationPrefix}context.label`
  },
  {
    color: '#060010',
    title: `${translationPrefix}debug.title`,
    description: `${translationPrefix}debug.description`,
    label: `${translationPrefix}debug.label`
  },
  {
    color: '#060010',
    title: `${translationPrefix}mesh.title`,
    description: `${translationPrefix}mesh.description`,
    label: `${translationPrefix}mesh.label`
  },
  {
    color: '#060010',
    title: `${translationPrefix}terminal.title`,
    description: `${translationPrefix}terminal.description`,
    label: `${translationPrefix}terminal.label`
  },
  {
    color: '#060010',
    title: `${translationPrefix}vcs.title`,
    description: `${translationPrefix}vcs.description`,
    label: `${translationPrefix}vcs.label`
  },
  {
    color: '#060010',
    title: `${translationPrefix}deploy.title`,
    description: `${translationPrefix}deploy.description`,
    label: `${translationPrefix}deploy.label`
  }
];