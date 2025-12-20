export type FAQConfig = {
  title: string,
  subtitle: string,
  items: {
    question: string;
    answer: string;
  }[];
};