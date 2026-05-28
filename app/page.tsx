import { HomeClient } from './HomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MonForfait.ma - Comparateur d\'offres internet et mobile au Maroc',
  description: 'Trouvez le meilleur forfait internet ou mobile au Maroc. Comparez les offres de Maroc Telecom, Inwi et Orange.',
};

export default function Home() {
  return <HomeClient />;
}
