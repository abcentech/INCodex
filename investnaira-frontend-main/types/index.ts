//FAQ
export interface FAQType {
    id: number;
    question: string;
    answer: string;
    isOpen: boolean;
  }

//BLOG
export interface BlogType {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
}

export type CategoryType = 'All' | string;

