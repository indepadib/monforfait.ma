import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { BLOG_POSTS, BlogPost } from '@/lib/blog-data'
import { Calendar, User, ChevronLeft, Share2 } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = BLOG_POSTS.find(p => p.slug === params.slug)
    if (!post) return {}

    return {
        title: `${post.title} | Blog MonForfait.ma`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author.name],
        }
    }
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }))
}

export default function BlogPostPage({ params }: Props) {
    const post = BLOG_POSTS.find(p => p.slug === params.slug)

    if (!post) {
        notFound()
    }

    // Schema.org Article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        image: post.coverImage,
        datePublished: post.date,
        author: {
            '@type': 'Person',
            name: post.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MonForfait.ma',
            logo: {
                '@type': 'ImageObject',
                url: 'https://monforfait.ma/branding/logo-light.png'
            }
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Breadcrumbs items={[
                    { label: 'Blog', href: '/blog' },
                    { label: post.title, href: `/blog/${post.slug}` }
                ]} />
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour au blog
                </Link>

                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-white leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-zinc-500 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-zinc-200 rounded-full overflow-hidden relative">
                                {/* Avatar placeholder */}
                                <User className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <span className="font-medium text-zinc-900 dark:text-white">{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-a:text-blue-600 prose-headings:font-bold prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* CTA Box */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white sticky top-24">
                            <h3 className="text-xl font-bold mb-4">Trouvez votre forfait idéal</h3>
                            <p className="text-white/90 mb-6 text-sm">
                                Faites le quiz en 1 minute et découvrez les meilleures offres pour vous.
                            </p>
                            <Link
                                href="/quiz"
                                className="block w-full text-center py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all"
                            >
                                Commencer le Quiz
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* Footer CTA */}
            <div className="bg-zinc-50 dark:bg-zinc-900 py-20 mt-20 border-t border-zinc-200 dark:border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">
                        Pas encore sûr de votre choix ?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/offers"
                            className="px-8 py-4 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 font-bold rounded-xl"
                        >
                            Voir toutes les offres
                        </Link>
                        <Link
                            href="/compare"
                            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:shadow-lg"
                        >
                            Comparer les forfaits
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
