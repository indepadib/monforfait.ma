import { CompareClient } from './CompareClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparateur - MonForfait.ma',
  description: 'Comparez les offres internet et mobile au Maroc.',
}

export default function ComparePage() {
    return <CompareClient />
}
