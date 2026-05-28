import { ResultsClient } from './ResultsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Résultats - MonForfait.ma',
  description: 'Vos résultats personnalisés.',
}

export default function ResultsPage() {
    return <ResultsClient />
}
