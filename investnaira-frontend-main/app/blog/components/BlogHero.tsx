import React from 'react'
import Subscribe from './Subscribe'

const BlogHero = () => {
  return (
    <div className='py-8 sm:py-12 px-4 sm:px-6 lg:px-8'>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center text-dark font-rowdies">
        Our Blog
      </h1>
      <p className="text-center my-4 sm:my-6 font-medium text-sm sm:text-base tracking-wide max-w-2xl mx-auto">
        Get the latest news from the InvestNaira team, and knowledge you need to make profitable investments
      </p>
      <Subscribe />
    </div>
  )
}

export default BlogHero
