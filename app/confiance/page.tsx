import { Metadata } from 'next'
import ConfianceContent from './ConfianceContent'

export const metadata: Metadata = {
    title: 'Pourquoi nous faire confiance ? | MonForfait.ma',
    description: 'Découvrez notre mission, notre méthodologie de comparaison et notre modèle économique transparent. Nous sommes votre allié face aux opérateurs.',
}

export default function ConfiancePage() {
    return <ConfianceContent />
}
