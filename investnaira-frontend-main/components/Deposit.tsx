"use client";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import deposit from '../public/deposit.png'
import { motion } from 'framer-motion'

const WalletManagement = () => {
  return (
    <motion.div
      className='flex flex-col lg:flex-row items-center lg:items-start justify-between px-10 md:px-[82px] lg:px-24 mb-32 lg:mb-52 gap-8 lg:gap-32'
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className='w-full lg:w-1/2'>
        <h2 className='text-[42px] leading-[45px] md:text-7xl font-extrabold font-rowdies mb-6 lg:mb-10 text-center lg:text-left dark:text-white'>
          Wallet <br className='hidden sm:inline' />
          Management
        </h2>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 text-center lg:text-left text-gray-700 dark:text-gray-300'>
          Our innovative wallet management features provide you with complete control over your funds.
        </p>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 text-center lg:text-left text-gray-700 dark:text-gray-300'>
          Easily deposit and withdraw money from your account using a variety of methods, including bank transfers, credit cards, and digital wallets.
        </p>
        <div className='text-center lg:text-left'>
          <Link href='/auth/create-account' className='inline-block text-lg font-bold text-tertiary dark:text-pink-400 text-[20px] hover:text-pink-500 transition-colors'>
            Get Started &gt;&gt;&gt;
          </Link>
        </div>
      </div>
      <div className='w-full lg:w-[45%] mb-10 md:mb-14 lg:mb-0'>
        <motion.div whileHover={{ rotate: 2 }} transition={{ duration: 0.5 }}>
          <Image
            src={deposit}
            alt='deposit'
            width={440}
            height={100}
            layout="responsive"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WalletManagement