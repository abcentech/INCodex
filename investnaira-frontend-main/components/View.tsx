"use client";
import Image from 'next/image';
import React from 'react';
import layer from '../public/layer.png';
import leverage from '../public/leverage.png';
import transaction from '../public/transaction.png';
import { motion } from 'framer-motion';

const View = () => {
  return (
    <div className="flex flex-col items-center px-4 lg:py-8 md:px-8 lg:px-16 mb-32">
      {/* Leverage text in oval shape */}
      <motion.div
        className="relative w-full max-w-[880px] mb-14 md:mb-20"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="hidden md:block">
          <Image
            src={layer}
            alt="dashed line"
            width={400}
            height={10}
            className="absolute right-[82%] -bottom-28 md:-bottom-20 lg:bottom-8"
          />
        </div>
        <div className='lg:ml-56 md:ml-44 ml-28'>
          <Image
            src={leverage}
            alt="By leveraging technology, we aim to establish a secure & transparent environment that fosters trust & confidence among our users."
            layout="responsive"
            width={800}
            height={200}
            className="dark:opacity-90 dark:invert-[.05]" // Subtle adjustments for dark mode if needed
          />
        </div>
      </motion.div>

      {/* Transaction tab */}
      <motion.div
        className='w-full max-w-4xl'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          src={transaction}
          alt='transaction tab'
          layout="responsive"
          width={1000}
          height={600}
          className="rounded-3xl shadow-2xl dark:shadow-green-900/20"
        />
      </motion.div>
    </div>
  );
};

export default View;
