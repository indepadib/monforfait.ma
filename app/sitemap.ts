import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { BLOG_POSTS } from '@/lib/blog-data';
export const dynamic = 'force-dynamic';

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

  // Only active, published and sourced tariffs belong in the sitemap.
  // Individual offer pages are routable at /offres/<uuid> and can be crawled.
  let offerRoutes: MetadataRoute.Sitemap = [];
  try {
    const {data:plans,error}=await supabase.from('plans')
      .select('id,source_checked_at,source_url')
      .eq('is_active',true).not('source_url','is',null).limit(300)
    if(!error && plans){
      offerRoutes=plans.filter(plan=>/^[a-f0-9-]{36}$/i.test(plan.id)).map(plan=>({
        url:baseUrl+'/offres/'+plan.id,
        lastModified:plan.source_checked_at && Number.isFinite(Date.parse(plan.source_checked_at))
          ?new Date(plan.source_checked_at):new Date(),
        changeFrequency:'weekly' as const,
        priority:0.65
      }))
    }
  }catch{}
  return [...defaultRoutes,...blogRoutes,...offerRoutes];

}
