import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/private/', '/api/'],
            },
            {
                userAgent: 'GPTBot',
                disallow: ['/admin/', '/private/', '/api/'],
            }
        ],
        sitemap: 'https://monforfait.ma/sitemap.xml',
        host: 'https://monforfait.ma',
    }
}

