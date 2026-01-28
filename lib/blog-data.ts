export type BlogPost = {
    slug: string
    title: string
    excerpt: string
    coverImage: string
    date: string
    author: {
        name: string
        role: string
        avatar: string
    }
    category: 'Guide' | 'Comparatif' | 'Astuce'
    content: string // HTML or Markdown
    tags: string[]
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'comparatif-fibre-optique-maroc-2026',
        title: 'Comparatif Fibre Optique 2026 : Orange vs Inwi vs IAM',
        excerpt: 'Quel opérateur offre le meilleur débit internet au Maroc ? Nous avons testé les offres fibre de Orange, Inwi et Maroc Telecom. Découvrez le vainqueur.',
        coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80',
        date: '2026-01-25',
        author: {
            name: 'Amine Alaoui',
            role: 'Expert Telecom',
            avatar: '/avatars/amine.jpg'
        },
        category: 'Comparatif',
        tags: ['Fibre Optique', 'Orange', 'Inwi', 'IAM', 'Internet'],
        content: `
      <h2>Introduction</h2>
      <p>Le marché de la fibre optique au Maroc est en pleine expansion. Avec trois opérateurs majeurs se disputant la première place, il est difficile de choisir. Dans ce comparatif complet, nous analysons les débits, les prix et le service client de Orange, Inwi et Maroc Telecom.</p>

      <h2>1. Les Offres Fibre du Moment</h2>
      <p>Voici un résumé des offres d'entrée de gamme (20 Mbps / 50 Mbps) :</p>
      <ul>
        <li><strong>Orange Fibre</strong> : À partir de 249 DH/mois. Frais d'installation souvent offerts.</li>
        <li><strong>Inwi Fibre</strong> : À partir de 249 DH/mois. Inclut souvent un routeur dernière génération.</li>
        <li><strong>IAM Fibre</strong> : À partir de 500 DH/mois (pour 100 Mbps). Réseau le plus étendu.</li>
      </ul>

      <h2>2. Performance et Débit</h2>
      <p>D'après nos tests SpeedTest effectués à Casablanca, Rabat et Marrakech :</p>
      <blockquote>
        "Orange offre la latence la plus faible (ping < 10ms), idéal pour le gaming. Maroc Telecom reste le plus stable dans les zones reculées."
      </blockquote>

      <h2>3. Le Verdict</h2>
      <p>Si vous êtes en zone urbaine, <strong>Orange</strong> et <strong>Inwi</strong> offrent le meilleur rapport qualité/prix. Pour les zones rurales, <strong>IAM</strong> reste incontournable.</p>

      <h3>Notre recommandation</h3>
      <p>Utilisez notre <a href="/quiz">Quiz Fibre</a> pour tester votre éligibilité et trouver la meilleure offre pour votre adresse précise.</p>
    `
    },
    {
        slug: 'comment-resilier-contrat-internet-sans-frais',
        title: 'Comment résilier son contrat internet sans frais au Maroc ?',
        excerpt: 'Votre connexion est lente ? Vous déménagez ? Voici la procédure légale pour résilier votre abonnement internet (Orange, Inwi, IAM) sans payer de pénalités.',
        coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
        date: '2026-01-20',
        author: {
            name: 'Sarah Benamor',
            role: 'Juriste',
            avatar: '/avatars/sarah.jpg'
        },
        category: 'Guide',
        tags: ['Résiliation', 'Contrat', 'Droit Consommateur'],
        content: `
      <h2>Les Motifs Légitimes de Résiliation</h2>
      <p>Au Maroc, vous pouvez résilier sans frais dans les cas suivants :</p>
      <ul>
        <li>Déménagement dans une zone non couverte</li>
        <li>Modification unilatérale des tarifs par l'opérateur</li>
        <li>Service non conforme (débit très inférieur au contrat)</li>
      </ul>

      <h2>La Procédure Étape par Étape</h2>
      <ol>
        <li><strong>Appelez le Service Client</strong> : Tentez une négociation amiable.</li>
        <li><strong>Envoyez un Recommandé</strong> : Une lettre avec accusé de réception est obligatoire.</li>
        <li><strong>Restituez le Matériel</strong> : Rendez la box/routeur en boutique contre un reçu.</li>
      </ol>

      <h2>Modèle de Lettre de Résiliation</h2>
      <pre>
        [Nom Prénom]
        [Adresse]
        [Numéro Client]

        À l'attention du Service Résiliation [Opérateur]
        
        Objet : Résiliation de contrat pour motif légitime...
      </pre>
    `
    },
    {
        slug: 'top-5-forfaits-mobiles-illimites',
        title: 'Top 5 des forfaits mobiles illimités (Data & Voix)',
        excerpt: 'Ne soyez plus jamais à court de data. Comparatif des meilleurs forfaits illimités pour les gros consommateurs de streaming et réseaux sociaux.',
        coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80',
        date: '2026-01-15',
        author: {
            name: 'Amine Alaoui',
            role: 'Expert Telecom',
            avatar: '/avatars/amine.jpg'
        },
        category: 'Comparatif',
        tags: ['Mobile', '4G', '5G', 'Data Illimitée'],
        content: `
      <h2>Pourquoi passer à l'illimité ?</h2>
      <p>Avec l'arrivée de la 5G et la consommation vidéo (TikTok, YouTube), un forfait 20Go part très vite. L'illimité devient la norme.</p>

      <h2>Le Classement 2026</h2>
      
      <h3>1. Win by Inwi - Illimité</h3>
      <p>Le 100% digital. C'est souvent l'option la moins chère du marché car sans engagement et sans boutique physique.</p>

      <h3>2. Orange Yo - Forfait Youtube Illimité</h3>
      <p>Une offre hybride intéressante si votre consommation est principalement vidéo.</p>

      <h3>3. IAM Forfaits Mobiles</h3>
      <p>La meilleure couverture réseau sur les routes nationales.</p>

      <div class="bg-blue-50 p-6 rounded-xl border border-blue-100 my-6">
        <h4 class="font-bold text-blue-900">Le saviez-vous ?</h4>
        <p class="text-blue-800">En comparant sur MonForfait.ma, les utilisateurs économisent en moyenne 1500 DH/an sur leur facture mobile.</p>
      </div>
    `
    }
]
