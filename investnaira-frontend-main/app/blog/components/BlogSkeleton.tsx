import React from 'react';

const BlogPostSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-4 left-4">
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 space-y-4">
        {/* Date */}
        <div className="h-4 w-24 bg-gray-200 rounded"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Author section */}
        <div className="flex items-center space-x-3 pt-4">
          {/* Author avatar */}
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;