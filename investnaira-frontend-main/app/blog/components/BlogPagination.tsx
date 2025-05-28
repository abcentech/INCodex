import React from 'react'

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }

const BlogPagination = ({ currentPage, totalPages, onPageChange }: BlogPaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-16 mt-8 sm:mt-12 md:mt-16 mb-10 sm:mb-16 md:mb-20 px-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="border-b border-primary text-primary disabled:opacity-50 text-sm sm:text-base"
    >
      Previous
    </button>
    <div className="flex gap-4 sm:gap-4 md:gap-16">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`text-sm sm:text-base ${
            currentPage === number 
              ? 'text-primary border-b border-primary' 
              : 'text-dark hover:text-primary'
          }`}
        >
          {number}
        </button>
      ))}
    </div>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="border-b border-primary text-primary disabled:opacity-50 text-sm sm:text-base"
    >
      Next
    </button>
  </div>
  )
}

export default BlogPagination
