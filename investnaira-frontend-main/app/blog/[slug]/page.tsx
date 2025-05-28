"use client";

import { useParams } from "next/navigation";
import BlogPostDetail from "../components/BlogPostDetail";

const BlogPostPage = () => {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';

  if (!slug) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No Post Selected</h1>
        <p className="text-gray-600">Please select a blog post to view.</p>
      </div>
    );
  }

  return <BlogPostDetail slug={slug} />;
};

export default BlogPostPage;