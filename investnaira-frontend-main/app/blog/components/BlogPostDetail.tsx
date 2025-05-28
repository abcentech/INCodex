'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { fetchBlogPosts, BlogPostType } from "@/sanity/lib/fetchBlogPosts";
import BlogFooter from "./BlogFooter";

interface BlogPostDetailProps {
  slug: string;
}

interface SanityImage {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  }

const BlogPostSkeleton = () => {
  return (
    <div className="container mx-auto px-6 md:px-44 lg:px-[365px] my-10 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-4 mb-11">
        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
      </div>

      {/* Image skeleton */}
      <div className="w-full h-[400px] bg-gray-200 rounded-lg mb-6"></div>

      {/* Content skeleton */}
      <div className="space-y-6">
        {/* Paragraph blocks */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>

        {/* Subheading */}
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>

        {/* More paragraphs */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-9/12"></div>
        </div>

        {/* Another subheading */}
        <div className="h-6 bg-gray-200 rounded w-2/5"></div>

        {/* Final paragraphs */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug }) => {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await fetchBlogPosts();
        const foundPost = posts.find((post) => post.slug?.current === slug);
        setPost(foundPost || null);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const components: PortableTextComponents = {

    types: {
        image: ({ value }: { value: SanityImage }) => {
          if (!value?.asset?._ref) {
            return null;
          }
          
          const ref = value.asset._ref;
          const [, id, dimensions, format] = ref.split('-');
          const [width, height] = dimensions ? dimensions.split('x') : [1920, 1080];
          
          const imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`;
  
          return (
            <div className="relative w-full h-[400px] my-6">
              <Image
                src={imageUrl}
                alt={value.alt || 'Blog post image'}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          );
        },
      },

    block: {
      normal: ({children}) => <p className="mb-6 text-base font-medium leading-relaxed text-gray-700 font-gilroy">{children}</p>,
      h1: ({children}) => <h1 className="text-4xl font-extrabold mb-6 mt-8 text-gray-900">{children}</h1>,
      h2: ({children}) => <h2 className="text-3xl font-extrabold mb-5 mt-8 text-gray-900">{children}</h2>,
      h3: ({children}) => <h3 className="text-2xl font-extrabold mb-4 mt-6 text-gray-900">{children}</h3>,
      h4: ({children}) => <h4 className="text-xl font-extrabold mb-4 mt-6 font-sans">{children}</h4>,
      blockquote: ({children}) => (
        <blockquote className="border-l-4 border-gray-200 pl-4 mb-6 italic text-gray-700">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
      em: ({children}) => <em className="italic text-gray-800">{children}</em>,
      code: ({children}) => (
        <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-gray-800">
          {children}
        </code>
      ),
      link: ({value, children}) => {
        const href = value?.href || ''
        const target = href.startsWith('http') ? '_blank' : undefined
        return (
          <a 
            href={href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {children}
          </a>
        )
      },

      
    },
    list: {
      bullet: ({children}) => (
        <ul className="list-disc list-outside mb-6 ml-6 space-y-2 text-gray-700">
          {children}
        </ul>
      ),
      number: ({children}) => (
        <ol className="list-decimal list-outside mb-6 ml-6 space-y-2 text-gray-700">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({children}) => <li className="text-base font-medium leading-relaxed">{children}</li>,
      number: ({children}) => <li className="text-base font-medium leading-relaxed">{children}</li>,
    },
  }

  if (loading) return <BlogPostSkeleton />;

  if (!post)
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600">
          The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
    );

  return (
    <div>
      <div className="container mx-auto px-6 md:px-44 lg:px-[365px] my-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-11 font-sans">{post.title}</h1>
        {post.imageUrl && (
          <div className="relative w-full h-[400px] mb-6">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )} 
        <div className="prose max-w-none text-base font-extrabold font-sans mb-16">
          <PortableText 
            value={post.body} 
            components={components}
          />
        </div>
      </div>
      <BlogFooter />
    </div>
  );
};

export default BlogPostDetail;