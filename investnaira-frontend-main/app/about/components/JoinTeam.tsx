import Button from '@/components/Button'
import React from 'react'

const JoinTeam = () => {
  return (
    <div className="bg-green-50 py-8 sm:py-12 rounded-xl mb-8 lg:mx-20 md:mx-10">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center px-4">Join the Team</h2>
      <div className='flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 text-base sm:text-lg text-dark gap-4 sm:gap-6'>
        <p className="text-center">
          At InvestNaira, we believe hiring should be like building a long-lasting relationship. Two people come together and speak, the first time.
        </p>
        <p className="text-center">
          Then each person asks how the other party would add value. If there is no value in the relationship, you just let it fizzle or remain &apos;hi-hi&apos; buddies. However, if the value lies, then it should be nurtured, daily, consistently, for the long term.
        </p>
        <div className="mt-4">
          <Button
            title='Become an Ark Builder'
            type='button'
            className='bg-primary rounded-xl py-2 sm:py-[10px] px-4 sm:px-6 text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-90 hover:bg-[#409f43] duration-300 cursor-pointer shadow-md font-semibold text-sm sm:text-base'
          />
        </div>
      </div>
      <div className='bus rounded-xl h-[220px] sm:h-[320px] md:h-[440px] mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-6 sm:my-8 md:my-10'>
        {/* Content for the 'bus' div */}
      </div>
    </div>
  )
}

export default JoinTeam