import React from 'react'

const Hero = () => {
  return (
    <div className='hero flex flex-col items-center py-16 sm:py-24 md:py-32 lg:py-36 px-4 gap-4 sm:gap-6 md:gap-8 text-white'>
      <h1 className='font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-rowdies'>
        Who are we.
      </h1>
      <p className='max-w-[320px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[620px] text-center font-medium text-base sm:text-lg'>
        With our easy-to-use interface and advanced security features, you can
        be rest assured that your investment and transfers will be completed
        quickly and securely, giving you the peace of mind you deserve.
      </p>
    </div>
  )
}

export default Hero


