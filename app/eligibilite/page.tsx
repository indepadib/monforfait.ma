import { Metadata } from 'next';
import EligibilityContent from './EligibilityContent';

export const metadata: Metadata = {
    title: "Test d'Éligibilité Fibre Optique & ADSL Maroc | MonForfait.ma",
    description: "Vérifiez instantanément la couverture réseau de votre adresse (IAM, Orange, Inwi) et accédez aux offres secrètes réservées à votre quartier.",
};

export default function EligibilityPage() {
    return <EligibilityContent />;
}
