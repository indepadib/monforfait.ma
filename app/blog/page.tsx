import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { BLOG_POSTS } from '@/lib/blog-data'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Blog & Actualités Telecom Maroc | MonForfait.ma',
    description: 'Guides, comparatifs et astuces pour bien choisir votre forfait internet et mobile au Maroc. Restez informé des dernières promos Orange, Inwi et IAM.',
}

import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />
            </div>

            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900 dark:text-white">
                        Le Blog Telecom
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Décryptez les offres, comparez les débits et économisez sur vos factures avec nos experts.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.date).toLocaleDateString('fr-MA')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {post.author.name}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Lire l'article
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
