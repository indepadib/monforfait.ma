import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

type BreadcrumbItem = {
    label: string
    href: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    // Generate Schema.org BreadcrumbList
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: 'https://monforfait.ma'
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.label,
                item: `https://monforfait.ma${item.href}`
            }))
        ]
    }

    return (
        <nav className="flex items-center text-sm text-zinc-500 mb-6" aria-label="Breadcrumb">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center gap-2">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Accueil</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                        <Link
                            href={item.href}
                            className={`hover:text-blue-600 transition-colors ${index === items.length - 1 ? 'font-bold text-zinc-900 dark:text-white' : ''
                                }`}
                            aria-current={index === items.length - 1 ? 'page' : undefined}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
