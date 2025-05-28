'use client'
import { useState, useEffect, useRef } from 'react';
import { FAQType } from '../../../types';
import { SlArrowDown } from "react-icons/sl";

interface FAQProps extends FAQType {
	setData: React.Dispatch<React.SetStateAction<FAQType[]>>;
}

const FAQItem = ({ id, question, answer, isOpen, setData }: FAQProps) => {
//   const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen);

const [contentHeight, setContentHeight] = useState(0);
const contentRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
    }
}, [answer]);

const handleToggle = () => {
    setData((prevData) =>
        prevData.map((accordion) => {
            return { ...accordion, isOpen: accordion.id === id ? !isOpen : false };
        })
    );
};

return (
    <div className="w-full max-w-6xl">
    <div className="bg-green-50 shadow-sm shadow-slate-100 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-5 cursor-pointer"
        onClick={handleToggle}
      >
        <span className="text-primary font-semibold text-base md:text-lg">{question}</span>
        <SlArrowDown 
          color="#4CAF50"
          size={13}
          className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
        />
      </div>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden px-5"
        style={{ maxHeight: isOpen ? contentHeight : 0 }}
      >
        <p className="text-primary leading-7 font-light pb-5">{answer}</p>
      </div>
    </div>
  </div>
);
};


export default FAQItem;