'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SlArrowDown } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
      <div className="bg-[#FCEFFF] dark:bg-slate-800 rounded-lg overflow-hidden py-2 px-6 transition-colors">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={handleToggle}
        >
          <span className="text-tertiary dark:text-pink-300 font-bold">{question}</span>
          <SlArrowDown
            className={`text-black dark:text-white transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
              }`}
          />
        </div>
        <div
          ref={contentRef}
          className="transition-all duration-300 ease-in-out overflow-hidden px-4"
          style={{ maxHeight: isOpen ? contentHeight : 0 }}
        >
          <p className="text-tertiary dark:text-pink-100 leading-7 font-light pb-4">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<FAQType[]>([
    { id: 1, question: "How does InvestNaira work?", answer: "InvestNaira is a platform that connects anyone with opportunities to build wealth for the long term using technology. We do this by leveraging technology to help you save consistently, invest strategically, and reinvest returns to compound your wealth.", isOpen: false },
    { id: 2, question: "What kind of services do I get with InvestNaira?", answer: "Through our technology products, we create opportunities to build long-term wealth. You can use our platform to track your investments across multiple assets provided by our partners.", isOpen: false },
    { id: 3, question: "What is the minimum I can start with?", answer: "The minimum investment amount varies depending on the type of investment, but we have options starting as low as ₦5,000 to accommodate investors at all levels.", isOpen: false },
    { id: 4, question: "Why should I choose InvestNaira?", answer: "We aim to build wealth for generations. Using the principle of compounded interest, we believe that with time, patience, and consistency, we can develop technology tools that will preserve and multiply wealth.", isOpen: false },
    { id: 5, question: "When and how can I withdraw my investments?", answer: "We expect our clients to take a long-term approach to building wealth. However, extenuating circumstances can be addressed on an as-needed basis.", isOpen: false },
  ]);

  return (
    <>
      <div className="container mx-auto px-7 md:px-20 mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-rowdies dark:text-white">Have Questions?</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">We have answers to help you get started.</p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3 bg-[#FCEFFF] border border-tertiary/20 hover:bg-[#f8dffef0] dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-all rounded-xl text-sm text-tertiary dark:text-pink-300 font-bold shadow-lg hover:scale-105"
          >
            View FAQs &gt;&gt;&gt;
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl p-6 md:p-10 relative shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
              >
                <X className="text-gray-500 group-hover:text-red-500" />
              </button>

              <h2 className="text-2xl md:text-4xl font-extrabold mb-8 font-rowdies text-center dark:text-white">Frequently Asked Questions</h2>

              <div className="flex flex-col items-center gap-4">
                {data.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    setData={setData}
                    {...faq}
                  />
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Still have questions? <Link href="/contact" className="text-primary font-bold hover:underline">Contact Support</Link></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FAQList;