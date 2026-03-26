import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { BLOG_POSTS, BlogPost } from '@/lib/blog-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Resource lists from the app structure
const CITIES = [
    'casablanca', 'rabat', 'marrakech', 'tanger', 'agadir', 
    'fes', 'meknes', 'oujda', 'kenitra', 'tetouan', 'safi'
];

const OPERATORS = ['inwi', 'orange', 'iam'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://monforfait.ma'

    // Static routes
    const staticRoutes = [
        '',
        '/quiz',
        '/offers',
        '/speedtest',
        '/blog',
        '/comparatif',
        '/compare',
        '/confiance',
        '/contact',
        '/eligibilite',
        '/fibre-optique-casablanca',
        '/forfait-mobile-pas-cher',
        '/observatoire',
        '/partenaires',
        '/offres',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Operator routes
    const operatorRoutes = OPERATORS.map((slug) => ({
        url: `${baseUrl}/operateurs/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // City routes
    const cityRoutes = CITIES.map((slug) => ({
        url: `${baseUrl}/ville/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Dynamic routes (Offers from DB)
    const { data: offers } = await supabase
        .from('plans')
        .select('id, updated_at')
        .eq('is_active', true)

    const offerRoutes = (offers || []).map((offer) => ({
        url: `${baseUrl}/offers/${offer.id}`,
        lastModified: new Date(offer.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Blog routes
    const blogRoutes = BLOG_POSTS.map((post: BlogPost) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticRoutes, ...operatorRoutes, ...cityRoutes, ...offerRoutes, ...blogRoutes]
}

