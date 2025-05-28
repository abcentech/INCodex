import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import deposit from '../public/deposit.png'

const WalletManagement = () => {
  return (
    <div className='flex flex-col lg:flex-row items-center lg:items-start justify-between px-10 md:px-[82px] lg:px-24 mb-32 lg:mb-52 gap-8 lg:gap-32'>
      <div className='w-full lg:w-1/2'>
        <h2 className='text-[42px] leading-[45px] md:text-7xl font-extrabold font-rowdies mb-6 lg:mb-10 text-center lg:text-left'>
          Wallet <br className='hidden sm:inline' />
          Management
        </h2>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 text-center lg:text-left'>
          Our innovative wallet management features provide you with complete control over your funds.
        </p>
        <p className='font-medium text-base md:text-lg mb-6 lg:mb-8 text-center lg:text-left'>
          Easily deposit and withdraw money from your account using a variety of methods, including bank transfers, credit cards, and digital wallets.
        </p>
        <div className='text-center lg:text-left'>
          <Link href='/auth/create-account' className='inline-block text-lg font-bold text-tertiary text-[20px]'>
            Get Started &gt;&gt;&gt;
          </Link>
        </div>
      </div>
      <div className='w-full lg:w-[45%] mb-10 md:mb-14 lg:mb-0'>
        <Image
          src={deposit}
          alt='deposit'
          width={440}
          height={100}
          layout="responsive"
        />
      </div>
    </div>
  )
}

export default WalletManagement