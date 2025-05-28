import Image from 'next/image'
import React from 'react'

const CoreValues = () => {
  const values = [
    { name: 'Stewardship', bg: "bg-[url('/images/transparent-green.png')]", avatar: '/images/avatar-4.png' },
    { name: 'Action', bg: "bg-[url('/images/transparent-blue.png')]", avatar: '/images/avatar-1.png' },
    { name: 'Grit', bg: "bg-[url('/images/transparent-pink.png')]", avatar: '/images/avatar-3.png' },
    { name: 'Energy', bg: "bg-[url('/images/transparent-black.png')]", avatar: '/images/avatar-2.png' }
  ]

  return (
    <div className="my-12 sm:my-16 md:my-20 lg:my-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col lg:flex-row justify-center lg:gap-12 xl:gap-28">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 lg:mb-0 text-center lg:text-left font-rowdies">
          Core <br className="hidden sm:inline" />Values
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 w-full p-4 lg:w-auto">
          {values.map((value, index) => (
            <div 
              key={index} 
              className={`${value.bg} bg-cover bg-center p-20 sm:p-12 md:p-16 lg:p-16 xl:p-20 rounded-lg text-center flex flex-col gap-4 justify-between items-center`}
            >
              <Image
              src={value.avatar}
              alt='avatar'
              width={72}
              height={1}
              />
              <span className="text-lg sm:text-xl md:text-3xl text-white font-semibold font-gilroy">{value.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CoreValues