export type FutureNewsConfig = {
  title: string;
  subtitle: string;
  items: {
    label: string;
    title: string;
    description: string;
    color?: string;
    className?: string;
  }[]
}