import React from "react";
import Image from "next/image";
import { BlogPostType } from "@/sanity/lib/fetchBlogPosts";
import Button from "@/components/Button";
import { GoArrowRight } from "react-icons/go";
import { PortableText } from '@portabletext/react';


interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const slugUrl = post?.slug?.current || '';
  
  if (!slugUrl) {
    console.warn(`Post "${post.title}" has no slug`);
    return null;
  }

  
  return (
    <div className="bg-green-50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 bg-gray-300">
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      <div className="p-4 sm:p-6 text-center text-dark flex-grow flex flex-col items-center">
        <h2 className="text-base sm:text-xl font-extrabold mb-2 sm:mb-3 mt-2 sm:mt-4">
          {post.title}
        </h2>
        <p className="text-sm sm:text-base font-medium mb-4 sm:mb-5 line-clamp-4">
        <PortableText value={post.body} />
        </p>
        <a 
  href={`/blog/${slugUrl}`} 
  className="bg-primary rounded-full py-3 px-6 text-white flex items-center justify-between w-48 transition ease-in-out duration-300 hover:bg-[#45a049] cursor-pointer shadow-md mb-10"
>
  <span className="text-base font-semibold">Read More</span>
  <div className="bg-white size-7 flex items-center justify-center rounded-full relative">
    <GoArrowRight className="text-primary size-6 absolute right-2" />
  </div>
</a>
      </div>
    </div>
  );
};

export default BlogPost;
