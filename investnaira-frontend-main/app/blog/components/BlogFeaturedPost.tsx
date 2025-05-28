"use client";

import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { GoArrowRight } from "react-icons/go";
import { fetchBlogPosts, BlogPostType } from "@/sanity/lib/fetchBlogPosts";
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

const BlogFeaturedPost = () => {
  const [featuredPost, setFeaturedPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeaturedPost = async () => {
      try {
        const posts = await fetchBlogPosts();
        setFeaturedPost(posts[0] || null);
      } catch (error) {
        console.error("Error fetching featured post:", error);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedPost();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-8 sm:px-10 lg:px-20 mt-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8 items-center">
            <div className="space-y-4">
              {/* Title skeleton */}
              <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
              {/* Content skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              {/* Button skeleton */}
              <div className="h-12 bg-gray-200 rounded-full w-40"></div>
            </div>
            {/* Image skeleton */}
            <div className="relative h-[300px] md:h-[400px] bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredPost) {
    return null;
  }

  return (
    <div className="container mx-auto px-8 sm:px-10 lg:px-20 mt-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-9 p-6 md:p-12 items-center">
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-start">
              {featuredPost.title}
            </h2>
            <div className="text-gray-600 line-clamp-5">
              <PortableText value={featuredPost.body} />
            </div>
            <Link 
              href={`/blog/${featuredPost.slug?.current}`} 
             className='bg-primary rounded-full py-3 px-6 text-white flex items-center justify-between  w-56 transition ease-in-out duration-300 hover:bg-[#45a049] cursor-pointer shadow-md'
            >
              <span className="font-semibold">Read More</span>
              <div className='bg-white size-7 flex items-center justify-center rounded-full relative'>
              <GoArrowRight className="text-primary size-6 absolute right-2" />
              </div>
            </Link>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            {featuredPost.imageUrl && (
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFeaturedPost;