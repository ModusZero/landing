import type { IconName } from "./icon-name";

export type FutureNewsConfig = {
  title: string;
  subtitle: string;
  items: {
    label: string;
    title: string;
    description: string;
    icon: IconName
    color: string;
    className?: string;
  }[]
}