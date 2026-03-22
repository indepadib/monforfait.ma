import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { BLOG_POSTS, BlogPost } from '@/lib/blog-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://monforfait.ma'

    // Static routes
    const routes = [
        '',
        '/quiz',
        '/offers',
        '/speedtest',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes (Offers)
    const { data: offers } = await supabase
        .from('plans')
        .select('id, created_at')
        .eq('is_active', true)

    const offerRoutes = (offers || []).map((offer) => ({
        url: `${baseUrl}/offers/${offer.id}`,
        lastModified: new Date(offer.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    // Blog routes
    const blogRoutes = BLOG_POSTS.map((post: BlogPost) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...routes, ...offerRoutes, ...blogRoutes]
}
