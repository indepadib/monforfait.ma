import { SpeedTestClient } from './SpeedTestClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Speedtest AI - MonForfait.ma',
  description: 'Testez votre connexion internet en temps réel.',
}

export default function SpeedTestPage() {
    return <SpeedTestClient />
}
