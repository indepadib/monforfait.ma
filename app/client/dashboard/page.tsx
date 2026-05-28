import DashboardClient from './DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portail Client - MonForfait.ma',
  description: 'Suivez l\'état de votre raccordement et d\'éligibilité fibre.',
};

export default function ClientDashboardPage() {
  return <DashboardClient />;
}
