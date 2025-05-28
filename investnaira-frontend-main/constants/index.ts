import { FAQType } from '../types';
import { BlogType } from '../types';
import { CategoryType } from '../types';

//NAVIGATION
export const NAV_LINKS = [
  { href: '/', key: 'personal', label: 'Personal' },
  { href: '/business', key: 'business', label: 'Business' },
  { href: '/about', key: 'the arkbuilders', label: 'The Arkbuilders' },
  { href: '/faq', key: 'faq\'s', label: 'FAQ\'s' },
];

//FOOTER
export const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Personal", href: "/" },
      { label: "Business", href: "/business" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ's", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "invest@investnaira.com", href: "mailto:invest@investnaira.com" },
      { label: "+234-905-166-7728", href: "tel:+234-905-166-7728" },
    ],
  },
];

export const socialLinks = [
  { href: "https://twitter.com", icon: "/x.svg" },
  { href: "https://wa.me/2349051667728", icon: "/whatsapp.svg" },
  { href: "https://t.me", icon: "/telegram.svg" },
  { href: "https://instagram.com", icon: "/instagram.svg" },
  { href: "https://youtube.com", icon: "/youtube.svg" },
];


//Products
export const tabs = [
  { href: "/products", label: "Personal" },
  { href: "/products/business", label: "Business" },
  { href: "/products/students", label: "Students" },
  { href: "/products/parents", label: "Parents" },
]


// FAQ
export const faqData: FAQType[] = [
  {
    id: 1,
    question: "How does InvestNaira work?",
    answer: "InvestNaira is a platform that connects anyone with opportunities to build wealth for the long term using technology. We do this by leveraging technology to help you save consistently, invest strategically, and reinvest returns to compound your wealth.",
    isOpen: false
  },
  {
    id: 2,
    question: "What kind of services do I get with InvestNaira?",
    answer: "Through our technology products, we create opportunities to build long-term wealth. You can use our platform to track your investments across multiple assets provided by our partners.",
    isOpen: false
  },
  {
    id: 3,
    question: "What is the minimum Investment amount I can start with?",
    answer: "The minimum investment amount varies depending on the type of investment, but we have options starting as low as ₦5,000 to accommodate investors at all levels.",
    isOpen: false
  },
  {
    id: 4,
    question: "Why should I choose InvestNaira?",
    answer: "We aim to build wealth for generations. Using the principle of compounded interest, we believe that with time, patience, and consistency, we can develop technology tools that will preserve and multiply wealth.",
    isOpen: false
  },
  {
    id: 5,
    question: "When and how can I withdraw my investments?",
    answer: "We expect our clients to take a long-term approach to building wealth. However, extenuating circumstances can be addressed on an as-needed basis.",
    isOpen: false
  },
  {
    id: 6,
    question: "Can I fund my account regularly and at intervals?",
    answer: "Yes, you can fund your account by setting up an automated recurring debit instruction or by making one-time deposits at intervals when you have the funds.",
    isOpen: false
  },
  {
    id: 7,
    question: "How Secure is my Investment?",
    answer: "All investments come with the possibility of loss. However, we select only the highest quality, long-term growth assets. We adhere to the principles of conservative estimates and thorough due diligence.",
    isOpen: false
  },
  {
    id: 8,
    question: "Can I withdraw money anytime?",
    answer: "Yes, you can initiate a withdrawal at any time. However, please note that some investments may have specific terms or lock-in periods that could affect immediate withdrawal.",
    isOpen: false
  },
  {
    id: 9,
    question: "What are your returns on investment like?",
    answer: "Returns are based on the opportunities as aggregated on the platform. However, governments issued securities tend to have rates published by the central bank. ",
    isOpen: false
  }
];

//Blog
export const dummyPosts: BlogType[] = [
  {
    id: '1',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '2',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '3',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '4',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '5',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '6',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '7',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '8',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '9',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '10',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '11',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Awards'
  },
  {
    id: '12',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Updates'
  },
  {
    id: '13',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '14',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
];

export const categories: CategoryType[] = ['All', 'Business Insider', 'Education', 'Company News', 'Products', 'Technology', 'Awards', 'Updates'];
