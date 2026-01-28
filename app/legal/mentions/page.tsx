import { Navigation } from '@/components/Navigation'

export default function MentionsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 py-16 prose dark:prose-invert">
                <h1>Mentions Légales</h1>

                <h2>1. Éditeur du site</h2>
                <p>
                    Le site <strong>MonForfait.ma</strong> est édité par une équipe indépendante de développeurs et passionnés de telecom basés au Maroc.
                </p>
                <p>
                    <strong>Contact :</strong> contact@monforfait.ma
                </p>

                <h2>2. Hébergement</h2>
                <p>
                    Le site est hébergé par :<br />
                    <strong>Netlify, Inc.</strong><br />
                    2325 3rd Street, Suite 215<br />
                    San Francisco, California 94107
                </p>

                <h2>3. Propriété intellectuelle</h2>
                <p>
                    L'ensemble de ce site relève de la législation marocaine et internationale sur le droit d'auteur et la propriété intellectuelle.
                </p>
            </main>
        </div>
    )
}
