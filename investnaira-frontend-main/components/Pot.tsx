import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import receipt from '../public/receipt.png'

const Pot = () => {
  return (
    <div className='flex flex-col lg:flex-row items-center lg:items-start justify-between  px-10 md:px-[82px] lg:px-24 mb-16 lg:mb-32'>
      <div className='w-full lg:w-[45%] mb-10 md:mb-14 lg:mb-0 order-2 lg:order-1'>
        <Image
          src={receipt}
          alt='receipt'
          width={440}
          height={500}
          layout="responsive"
        />
      </div>
      <div className='mb-12 w-full lg:w-1/2 lg:pl-8 order-1 lg:order-2 md:mt-0 mt-24y'>
        <h2 className=' text-[42px] leading-[45px] md:text-7xl lg:text-5xl font-extrabold font-rowdies mb-6 lg:mb-10 text-center lg:text-left'>
          Automated Wealth <br className='hidden sm:inline' />
          Accumulation
        </h2>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 lg:text-left text-center'>
          Imagine setting a clear, long-term financial goal and watching it gradually become a reality, virtually effortlessly. With Automated Wealth Accumulation, this is possible.
        </p>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 lg:text-left text-center'>
          By leveraging the powerful concept of compounding, our platform takes the guesswork out of investing, allowing you to focus on your life while your wealth grows steadily over time.
        </p>
        <Link href='/auth/create-account' className='block text-center lg:text-left text-[20px] font-bold text-primary'>
          Get Started &gt;&gt;&gt;
        </Link>
      </div>
    </div>
  )
}

export default Pot