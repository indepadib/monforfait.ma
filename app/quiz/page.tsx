import { QuizClient } from './QuizClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz - MonForfait.ma',
  description: 'Trouvez le forfait parfait pour vos besoins.',
}

export default function QuizPage() {
    return <QuizClient />
}
