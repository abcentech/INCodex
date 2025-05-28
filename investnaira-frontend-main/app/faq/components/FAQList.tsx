'use client'
import {useState} from 'react';
import FAQItem from './FAQItem';
import { faqData } from '../../../constants';
import { FAQType } from '@/types';

const FAQList = () => {
    const [data, setData] = useState<FAQType[]>(faqData);
  return (
    <div className="container mx-auto px-4 my-16">
    <div className="flex flex-col items-center gap-8 md:gap-16">
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