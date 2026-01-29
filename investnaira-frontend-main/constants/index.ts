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
    id: 'wealth-blueprint-2026',
    title: 'THE 2026 WEALTH BLUEPRINT: Grade A Premium Report',
    content: `
      <div class="space-y-12 max-w-4xl mx-auto">
        
        <!-- Executive Summary -->
        <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-12 shadow-sm">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 pb-4">Executive Summary: The Once-in-a-Generation Setup</h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            2026 represents the <strong class="text-primary font-bold">most asymmetric risk/reward environment in 15 years</strong> across commodities, cryptocurrencies, and currencies. We have identified <strong class="text-gray-900 dark:text-white">THREE MEGA-THEMES</strong> with 99% probability of materializing, each offering 50–300%+ returns.
          </p>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">THE THREE CERTAINTIES</h3>
          <div class="space-y-6">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
              <h4 class="text-lg font-bold text-primary mb-2">1. THE COPPER SUPER-CYCLE (99% Confidence)</h4>
              <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Structural deficit: 150,000–400,000 tonnes shortfall in 2026</li>
                <li>AI data centers consuming 500,000 tonnes annually by 2030</li>
                <li>Target: <span class="font-bold text-gray-900 dark:text-white">$12,000–$15,000/tonne</span> (+20–50%)</li>
              </ul>
            </div>

            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
              <h4 class="text-lg font-bold text-primary mb-2">2. THE NUCLEAR RENAISSANCE (99% Confidence)</h4>
              <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                <li>15 new reactors online in 2026 (vs. 2 in 2025)</li>
                <li>Big Tech committed: $10B+ in SMR partnerships</li>
                <li>Target: <span class="font-bold text-gray-900 dark:text-white">Uranium $120–$180/lb</span> (+100–200%)</li>
              </ul>
            </div>

            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
              <h4 class="text-lg font-bold text-primary mb-2">3. THE SILVER SHORTAGE CRISIS (99% Confidence)</h4>
              <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Fifth consecutive year of deficit with Solar demand now dominant</li>
                <li>Physical shortages across major vaults</li>
                <li>Target: <span class="font-bold text-gray-900 dark:text-white">$75–$120/oz</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Part 1: Commodities -->
        <div class="mb-12">
          <div class="flex items-center space-x-4 mb-6">
             <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Part I</span>
             <h2 class="text-3xl font-black text-gray-900 dark:text-white">COMMODITIES — The Physical Scarcity Revolution</h2>
          </div>
          
          <div class="space-y-8">
            <!-- Copper -->
            <div class="group">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-primary transition-colors">TIER 1: COPPER — The New Oil</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <span class="block text-xs uppercase text-gray-500 font-bold mb-1">Current Price</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">$10-11k</span>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <span class="block text-xs uppercase text-gray-500 font-bold mb-1">Target</span>
                    <span class="text-lg font-bold text-primary">$15,000+</span>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <span class="block text-xs uppercase text-gray-500 font-bold mb-1">Confidence</span>
                    <span class="text-lg font-bold text-green-600">99%</span>
                  </div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                The global copper market is entering an unprecedented structural deficit. Key constraints include mine development timelines of 10–16 years and declining ore grades. <strong class="text-gray-900 dark:text-white">AI Data Centers</strong> alone could consume 3 million tonnes annually by 2050.
              </p>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-800"></div>

            <!-- Uranium -->
            <div class="group">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-primary transition-colors">TIER 2: URANIUM — Nuclear Renaissance</h3>
               <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <span class="block text-xs uppercase text-gray-500 font-bold mb-1">Current Price</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">$58-62</span>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <span class="block text-xs uppercase text-gray-500 font-bold mb-1">Target</span>
                    <span class="text-lg font-bold text-primary">$150-180</span>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                     <span class="block text-xs uppercase text-gray-500 font-bold mb-1">Driver</span>
                     <span class="text-lg font-bold text-gray-900 dark:text-white">AI Power</span>
                  </div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Global electricity demand from AI data centers is projected to rise 160% by 2030. Nuclear power is the only scalable, carbon-free baseload solution capable of meeting this demand.
              </p>
            </div>
          </div>
        </div>

        <!-- Part 2: Crypto -->
        <div class="mb-12">
          <div class="flex items-center space-x-4 mb-6">
             <span class="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Part II</span>
             <h2 class="text-3xl font-black text-gray-900 dark:text-white">CRYPTOCURRENCIES</h2>
          </div>
           <div class="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden">
             <div class="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h3 class="text-2xl font-bold mb-2 relative z-10 text-white">Use Case: Bitcoin (Digital Treasury)</h3>
             <p class="text-lg text-gray-300 mb-6 relative z-10">Adoption by corporations and sovereign entities has entered a reflexive phase.</p>
             <div class="flex items-center space-x-8 relative z-10">
                <div>
                   <span class="text-sm text-gray-400 uppercase font-bold">Current</span>
                   <div class="text-3xl font-mono font-bold text-white">$93,300</div>
                </div>
                <div>
                   <span class="text-sm text-primary uppercase font-bold">Target (18m)</span>
                   <div class="text-3xl font-mono font-bold text-primary">$250,000</div>
                </div>
             </div>
           </div>
        </div>

        <!-- Part 4: Portfolio -->
        <div class="bg-primary/5 dark:bg-primary/10 rounded-3xl p-10 border border-primary/10">
           <h2 class="text-3xl font-black text-center text-gray-900 dark:text-white mb-8">Sample Portfolio Construction</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                 <h4 class="font-bold text-xl mb-4 text-center text-gray-900 dark:text-white">Allocation Strategy</h4>
                 <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <span class="font-medium text-gray-900 dark:text-gray-200">Commodities</span>
                    <span class="font-bold text-primary">60%</span>
                 </div>
                 <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <span class="font-medium text-gray-900 dark:text-gray-200">Crypto Assets</span>
                    <span class="font-bold text-primary">20%</span>
                 </div>
                 <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <span class="font-medium text-gray-900 dark:text-gray-200">FX / Cash</span>
                    <span class="font-bold text-primary">20%</span>
                 </div>
              </div>
              <div class="flex flex-col justify-center items-center text-center bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                 <div class="text-primary text-5xl font-black mb-2">+50-80%</div>
                 <div class="text-gray-500 font-medium uppercase tracking-wide text-sm">Expected Return (12-18m)</div>
                 <div class="mt-4 text-sm text-red-500 font-medium">Max Drawdown: -22%</div>
              </div>
           </div>
        </div>

        <p class="text-center text-gray-400 text-sm italic mt-12 border-t border-gray-100 dark:border-gray-800 pt-8">
          Disclaimer: This report is for informational purposes only. Do not construe this as financial advice. All investments carry risk.
        </p>

      </div>
    `,
    imageUrl: '/images/wealth-blueprint.jpg',
    category: 'Market Research'
  },
  {
    id: '1',
    title: 'INVEST NAIRA SECURES $12BILLION SEED FUNDING',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
    imageUrl: '/dummy-image.jpg',
    category: 'Company News'
  },
  {
    id: '2',
    title: 'How to Start Investing with Little Capital',
    content: 'Investing does not require millions. Start small, be consistent, and let compound interest do the rest.',
    imageUrl: '/dummy-image.jpg',
    category: 'Education'
  },
  {
    id: '3',
    title: 'Understanding the Nigerian Stock Market',
    content: 'A comprehensive guide to navigating the NGX and identifying value stocks.',
    imageUrl: '/dummy-image.jpg',
    category: 'Education'
  }
];

export const categories: CategoryType[] = ['All', 'Business Insider', 'Education', 'Company News', 'Products', 'Technology', 'Awards', 'Updates'];
