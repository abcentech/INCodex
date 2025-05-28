import React from 'react';
import { CategoryType } from '@/types';

interface BlogCategoriesProps {
  categories: CategoryType[];
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const BlogCategories = ({ categories, activeCategory, onCategoryChange }: BlogCategoriesProps) => {
  return (
    <div className="mx-auto max-w-6xl my-10 sm:my-20 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 outline-dashed p-4 sm:p-6 rounded-lg outline-green-200 outline-1">
        {categories.map((category, index) => (
          <button
            key={index} // Using index as fallback if category is invalid
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-light transition-colors ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-green-50 text-primary hover:bg-green-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;
