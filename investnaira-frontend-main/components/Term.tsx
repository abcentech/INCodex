import Image from 'next/image'
import React from 'react'
import group1 from '../public/group1.png'
import group2 from '../public/group2.png'
import group3 from '../public/group3.png'
import group4 from '../public/group4.png'
import lines from '../public/lines.png'

const Term = () => {
  return (
    <div className=' px-6 md:px-14 lg:mb-44'>
        <p className='text-[42px] leading-[45px] md:text-7xl text-center font-rowdies mb-20'>We are <span className=' text-primary'>Building Generational Wealth</span> for <span className='text-tertiary'>The Long Term</span></p>
        <div className='flex lg:flex-row flex-col justify-center items-center relative lg:pl-40 lg:px-0 px-4 gap-8'>
            <div className='w-full lg:w-[50%] absolute -left-[10%] mr-20 hidden lg:block'>
                <Image
                src={lines}
                alt='lines'
                width={400}
                height={300}
                className=''
                />


            </div>
            <div className='w-full lg:w-[70%]'>
                <Image
                src={group1}
                alt='Financial increment'
                width={465}
                height={300}
                className='lg:block hidden'
                />
            <div className=' lg:hidden block'>
                <Image
                src={group3}
                alt='Financial increment'
                width={785}
                height={300}
             />
            </div>

            </div>
            <div className='w-full lg:w-[70%] '>
                <Image
                src={group2}
                alt='Financial increment'
                width={463}
                height={300}
                className='lg:block hidden'
                />
                <Image
                src={group4}
                alt='Financial increment'
                width={785}
                height={300}
                className='lg:hidden block'
                />

            </div>
            
        </div>
      
    </div>
  )
}

export default Term
