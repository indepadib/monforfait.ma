import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { BLOG_POSTS } from '@/lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://monforfait.ma';

  const defaultRoutes = [
    '',
    '/offers',
    '/compare',
    '/speedtest',
    '/eligibilite',
    '/observatoire',
    '/contact',
    '/confiance',
    '/partenaires',
    '/quiz',
    '/blog'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch blogs for dynamic sitemap
  let blogRoutes: any[] = [];
  try {
    const { data: blogs } = await supabase.from('blogs').select('slug, published_at');
    if (blogs && blogs.length > 0) {
      blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    } else {
      blogRoutes = BLOG_POSTS.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch(e) {}

  // Offer IDs are not routable at /offers/<uuid>. Index the canonical /offers page instead.
  // Add individual offers here only when an actual public URL is implemented and verified.
  return [...defaultRoutes, ...blogRoutes];

}
