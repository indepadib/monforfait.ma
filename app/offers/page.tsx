export const dynamic = 'force-dynamic';

import { OffersClient } from './OffersClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toutes les Offres - MonForfait.ma',
  description: 'Parcourez toutes les offres internet et mobile.',
}

export default function OffersPage() {
    return <OffersClient />
}
