export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';

import BlogIndexClient from './BlogIndexClient';

export const metadata: Metadata = {
  title: 'Blog & Actualités Telecom Maroc | MonForfait.ma',
  description:
    'Guides, comparatifs et astuces pour bien choisir votre forfait internet et mobile au Maroc. Restez informé des dernières promos Orange, Inwi et IAM.',
};

export default function BlogPage() {
  return <BlogIndexClient />;
}
