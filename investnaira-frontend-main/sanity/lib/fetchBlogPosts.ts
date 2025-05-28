import client from "../lib/client";

export interface BlogPostType {
  _id: string;
  title: string;
  body: any[];
  imageUrl?: string;
  slug: {
    current : string;
  }
  categories?: string;
}

export const fetchBlogPosts = async (): Promise<BlogPostType[]> => {
  const query = `
    *[_type == "post"]{
      _id,
      title,
      slug,
      body,
      "imageUrl": mainImage.asset->url,
      "categories": categories[]->title
    }
  `;
  const posts = await client.fetch<BlogPostType[]>(query);
  return posts;
};
