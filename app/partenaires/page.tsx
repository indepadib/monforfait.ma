import { Metadata } from 'next';
import PartenairesContent from './PartenairesContent';

export const metadata: Metadata = {
    title: "Partenaires et Échange de Liens | MonForfait.ma",
    description: "Devenez partenaire de MonForfait.ma. Découvrez notre programme d'échange de visibilité (backlinks) pour les blogs tech, médias et influenceurs marocains.",
};

export default function PartenairesPage() {
    return <PartenairesContent />;
}
