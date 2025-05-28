'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SlArrowDown } from "react-icons/sl";

interface FAQType {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface FAQItemProps extends FAQType {
  setData: React.Dispatch<React.SetStateAction<FAQType[]>>;
}

const FAQItem: React.FC<FAQItemProps> = ({ id, question, answer, isOpen, setData }) => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [answer]);

  const handleToggle = () => {
    setData((prevData) =>
      prevData.map((accordion) => ({
        ...accordion,
        isOpen: accordion.id === id ? !isOpen : false
      }))
    );
  };

  return (
    <div className="w-full mb-4">
      <div className="bg-[#FCEFFF] rounded-lg overflow-hidden py-2 px-6">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={handleToggle}
        >
          <span className="text-tertiary font-bold">{question}</span>
          <SlArrowDown 
            className={`text-black transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
        <div
          ref={contentRef}
          className="transition-all duration-300 ease-in-out overflow-hidden px-4"
          style={{ maxHeight: isOpen ? contentHeight : 0 }}
        >
          <p className="text-tertiary leading-7 font-light pb-4">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQList: React.FC = () => {
  const [data, setData] = useState<FAQType[]>([
    { id: 1, question: "How does InvestNaira work?", answer: "InvestNaira is a platform that connects anyone with opportunities to build wealth for the long term using technology. We do this by leveraging technology to help you save consistently, invest strategically, and reinvest returns to compound your wealth.", isOpen: false },
    { id: 2, question: "What kind of services do I get with InvestNaira?", answer: "Through our technology products, we create opportunities to build long-term wealth. You can use our platform to track your investments across multiple assets provided by our partners.", isOpen: false },
    { id: 3, question: "What is the minimum I can start with?", answer: "The minimum investment amount varies depending on the type of investment, but we have options starting as low as ₦5,000 to accommodate investors at all levels.", isOpen: false },
    { id: 4, question: "Why should I choose InvestNaira?", answer: "We aim to build wealth for generations. Using the principle of compounded interest, we believe that with time, patience, and consistency, we can develop technology tools that will preserve and multiply wealth.", isOpen: false },
    { id: 5, question: "When and how can I withdraw my investments?", answer: "We expect our clients to take a long-term approach to building wealth. However, extenuating circumstances can be addressed on an as-needed basis.", isOpen: false },
  ]);

  return (
    <div className="container mx-auto px-7 md:px-20 mb-24">
      <div className='flex flex-row justify-between items-center mb-10 md:mb-16'>
        <div> </div>
        <h2 className=" md:ml-0 ml-12 text-3xl md:text-6xl font-extrabold mb-0 font-rowdies">FAQ&apos;s</h2>
        <Link href='/faq' className="md:px-8 md:py-3 px-6 py-2 bg-[#FCEFFF] hover:bg-[#f8dffef0] transition-colors rounded-xl text-[10px] md:text-sm text-tertiary font-bold">
          View More &gt;&gt;&gt;
        </Link>
      </div>
      <div className="flex flex-col items-center gap-8">
        {data.map((faq) => (
          <FAQItem
            key={faq.id}
            setData={setData}
            {...faq}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQList;