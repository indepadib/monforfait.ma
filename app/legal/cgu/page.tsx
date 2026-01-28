import { Navigation } from '@/components/Navigation'

export default function CGUPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 py-16 prose dark:prose-invert">
                <h1>Conditions Générales d'Utilisation (CGU)</h1>

                <h2>1. Objet</h2>
                <p>
                    Les présentes CGU régissent l'utilisation du site MonForfait.ma, comparateur indépendant d'offres telecom au Maroc.
                </p>

                <h2>2. Service de comparaison</h2>
                <p>
                    MonForfait.ma s'efforce de fournir des informations précises et à jour sur les offres de Orange, Inwi et Maroc Telecom.
                    Toutefois, nous ne pouvons garantir l'exactitude absolue des prix et conditions, qui sont sujets à modification par les opérateurs sans préavis.
                    L'utilisateur est invité à vérifier les conditions finales sur le site de l'opérateur avant toute souscription.
                </p>

                <h2>3. Responsabilité</h2>
                <p>
                    MonForfait.ma agit en tant qu'intermédiaire d'information. Nous ne sommes pas une partie au contrat entre l'utilisateur et l'opérateur.
                    Nous déclinons toute responsabilité en cas de litige entre l'utilisateur et l'opérateur.
                </p>

                <h2>4. Propriété intellectuelle</h2>
                <p>
                    Tous les contenus (textes, logos, design) de MonForfait.ma sont protégés par le droit d'auteur. Les marques des opérateurs cités appartiennent à leurs propriétaires respectifs.
                </p>

                <h2>5. Modification</h2>
                <p>
                    Nous nous réservons le droit de modifier les présentes CGU à tout moment.
                </p>
            </main>
        </div>
    )
}
