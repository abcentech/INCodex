"use client";

import React, { useState, useEffect } from "react";
import BlogHero from "./components/BlogHero";
import BlogPost from "./components/BlogPost";
import BlogFeaturedPost from "./components/BlogFeaturedPost";
import BlogCategories from "./components/BlogCategories";
import BlogPagination from "./components/BlogPagination";
import BlogFooter from "./components/BlogFooter";
import { fetchBlogPosts, BlogPostType } from "@/sanity/lib/fetchBlogPosts";
import { CategoryType } from "@/types";

const POSTS_PER_PAGE = 6;

const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.categories?.includes(activeCategory));

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="bg-[#FAE8FE] py-10 px-4">
        <BlogHero />
        <BlogFeaturedPost />
      </div>
      <div className="container mx-auto px-8 sm:px-10 lg:px-20 my-8 sm:my-12 lg:my-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 lg:gap-x-7 lg:gap-y-16">
          {loading ? (
            // Display skeleton loading state
            Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))
          ) : displayedPosts.length > 0 ? (
            displayedPosts.map((post) => <BlogPost key={post._id} post={post} />)
          ) : (
            <p className="text-center col-span-full">No blog posts available</p>
          )}
        </div>
      </div>
      <BlogCategories
        categories={["All", ...new Set(posts.flatMap((post) => post.categories || []))]}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <BlogFooter />
    </div>
  );
};

export default Blog;