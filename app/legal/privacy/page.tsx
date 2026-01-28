import { Navigation } from '@/components/Navigation'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 py-16 prose dark:prose-invert">
                <h1>Politique de Confidentialité</h1>
                <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

                <h2>1. Collecte des données</h2>
                <p>
                    Sur MonForfait.ma, la confidentialité de vos données est notre priorité.
                    Nous collectons uniquement les données strictement nécessaires au fonctionnement du service :
                </p>
                <ul>
                    <li>Réponses au quiz (anonymisées) pour personnaliser les offres.</li>
                    <li>Coordonnées (nom, téléphone) uniquement si vous remplissez volontairement un formulaire de contact/rappel.</li>
                    <li>Données techniques (cookies, IP) pour l'analyse d'audience via Google Analytics.</li>
                </ul>

                <h2>2. Utilisation des données</h2>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                    <li>Vous afficher les offres telecom les plus pertinentes.</li>
                    <li>Vous mettre en relation avec les opérateurs (uniquement sur votre demande explicite).</li>
                    <li>Améliorer nos services et détecter les bugs.</li>
                </ul>

                <h2>3. Partage des données</h2>
                <p>
                    <strong>Nous ne vendons pas vos données personnelles.</strong> Elles sont transmises aux opérateurs partenaires (Orange, Inwi, Maroc Telecom ou leurs distributeurs agréés) uniquement lorsque vous cliquez sur "Demander un rappel" ou "Souscrire".
                </p>

                <h2>4. Vos droits (loi 09-08)</h2>
                <p>
                    Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition.
                    Pour exercer ce droit, contactez-nous à : contact@monforfait.ma
                </p>

                <h2>5. Cookies</h2>
                <p>
                    Nous utilisons des cookies pour mémoriser vos préférences (thème, réponses quiz). Vous pouvez les désactiver à tout moment via notre bandeau de consentement ou les paramètres de votre navigateur.
                </p>
            </main>
        </div>
    )
}
