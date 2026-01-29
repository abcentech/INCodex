"use client";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import receipt from '../public/receipt.png'
import { motion } from 'framer-motion'

const Pot = () => {
  return (
    <motion.div
      className='flex flex-col lg:flex-row items-center lg:items-start justify-between px-10 md:px-[82px] lg:px-24 mb-16 lg:mb-32'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className='w-full lg:w-[45%] mb-10 md:mb-14 lg:mb-0 order-2 lg:order-1'>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
          <Image
            src={receipt}
            alt='receipt'
            width={440}
            height={500}
            layout="responsive"
          />
        </motion.div>
      </div>
      <div className='mb-12 w-full lg:w-1/2 lg:pl-8 order-1 lg:order-2 md:mt-0 mt-24y'>
        <h2 className=' text-[42px] leading-[45px] md:text-7xl lg:text-5xl font-extrabold font-rowdies mb-6 lg:mb-10 text-center lg:text-left dark:text-white'>
          Automated Wealth <br className='hidden sm:inline' />
          Accumulation
        </h2>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 lg:text-left text-center text-gray-700 dark:text-gray-300'>
          Imagine setting a clear, long-term financial goal and watching it gradually become a reality, virtually effortlessly. With Automated Wealth Accumulation, this is possible.
        </p>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 lg:text-left text-center text-gray-700 dark:text-gray-300'>
          By leveraging the powerful concept of compounding, our platform takes the guesswork out of investing, allowing you to focus on your life while your wealth grows steadily over time.
        </p>
        <Link href='/auth/create-account' className='block text-center lg:text-left text-[20px] font-bold text-primary hover:text-green-400 transition-colors'>
          Get Started &gt;&gt;&gt;
        </Link>
      </div>
    </motion.div>
  )
}

export default Pot