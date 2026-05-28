import { ContactClient } from './ContactClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - MonForfait.ma',
  description: 'Contactez-nous pour toute question.',
}

export default function ContactPage() {
    return <ContactClient />
}
