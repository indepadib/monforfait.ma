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
        slug: 'meilleure-fibre-optique-maroc-2026',
        title: 'Quelle est la Meilleure Fibre Optique au Maroc en 2026 ? Comparatif Orange, Inwi et IAM',
        excerpt: 'Découvrez notre comparatif complet pour choisir la meilleure offre de fibre optique au Maroc. Vitesse, prix, routeur inclus : tout ce qu\'il faut savoir avant de s\'abonner.',
        coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80',
        date: '2026-03-08',
        author: {
            name: 'Amine Alaoui',
            role: 'Expert Telecom',
            avatar: '/avatars/amine.jpg'
        },
        category: 'Comparatif',
        tags: ['Fibre Optique Maroc', 'Orange', 'Inwi', 'IAM', 'Internet Très Haut Débit'],
        content: `
      <h2>Pourquoi passer à la Fibre Optique au Maroc ?</h2>
      <p>Le marché de la <strong>fibre optique au Maroc</strong> a énormément évolué. Fini le temps des coupures ADSL : la technologie FTTH (Fiber to the Home) garantit aujourd'hui une vitesse ultra-rapide et symétrique. Que ce soit pour le télétravail, le gaming ou le streaming 4K, choisir la bonne offre internet est devenu crucial.</p>

      <h2>Comparatif des Offres Fibre 2026</h2>
      <p>Voici les trois leaders et leurs avantages respectifs :</p>
      
      <h3>1. Orange Maroc : Le champion du ping bas</h3>
      <p>L'offre <a href="/quiz" title="Tester mon éligibilité Orange Fibre">Orange Fibre Optique</a> démarre généralement à 249 DH/mois. Elle se distingue par :</p>
      <ul>
        <li><strong>Avantage :</strong> Routeur Livebox 6 performant, souvent offert sous promotion. Latence idéale pour le gaming en ligne.</li>
        <li><strong>Inconvénient :</strong> Le service client peut être saturé en période d'installation.</li>
      </ul>

      <h3>2. Inwi Fibre : Le rapport qualité/prix</h3>
      <p>La <a href="/quiz" title="Découvrir Inwi Fibre">Fibre Inwi</a> se positionne de manière très agressive avec des forfaits dès 249 DH/mois. Inwi brille souvent par des promos avec mois gratuits.</p>
      <ul>
        <li><strong>Avantage :</strong> Offres combinées (Internet + Forfait mobile Win) très économiques. Flexibilité d'abonnement.</li>
        <li><strong>Inconvénient :</strong> Couverture parfois inégale dans les quartiers très récents.</li>
      </ul>

      <h3>3. Maroc Telecom (IAM) : La couverture reine</h3>
      <p>Souvent plus chère, la fibre de Maroc Telecom (à partir de 500 DH/mois pour 100 Mbps) compense par le réseau le plus vaste du Royaume.</p>
      <ul>
        <li><strong>Avantage :</strong> Stabilité éprouvée, intervention technique rapide dans les grandes villes.</li>
        <li><strong>Inconvénient :</strong> Matériel (routeur) parfois vieillissant comparé aux concurrents, prix d'entrée élevé.</li>
      </ul>

      <h2>Comment tester son éligibilité ?</h2>
      <p>Le saviez-vous ? Avant de vous engager, il est essentiel de vérifier quelle ligne arrive jusqu'à votre immeuble. Utilisez notre <a href="/quiz">Assistant Choix d'Offre</a> pour trouver le meilleur abonnement internet selon votre rue, votre ville et vos besoins spécifiques.</p>
    `
    },
    {
        slug: 'adsl-vs-fibre-optique-que-choisir',
        title: 'ADSL vs Fibre Optique au Maroc : Lequel Choisir en 2026 ?',
        excerpt: 'Faut-il garder son abonnement ADSL ou migrer vers la fibre optique ? On vous explique les différences de débit, de prix et d\'installation.',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
        date: '2026-02-15',
        author: {
            name: 'Sarah Benamor',
            role: 'Conseillère Télécom',
            avatar: '/avatars/sarah.jpg'
        },
        category: 'Guide',
        tags: ['ADSL', 'Fibre Optique', 'Migration', 'Internet Fixe'],
        content: `
      <h2>Comprendre la différence technologique</h2>
      <p>L'<strong>ADSL</strong> utilise les fils de cuivre de la ligne téléphonique traditionnelle. La vitesse dépend de votre distance par rapport au central téléphonique (plus vous êtes loin, plus c'est lent). La <strong>Fibre Optique</strong> utilise des fils de verre conduisant la lumière, permettant des débits colossaux sans perte de signal sur de longues distances.</p>

      <h2>Les Débits : Un gouffre de performance</h2>
      <ul>
        <li><strong>Vitesse ADSL :</strong> Rarement plus de 12 à 20 Mbps au Maroc (téléchargement). Vitesse d'envoi très faible (upload).</li>
        <li><strong>Vitesse Fibre :</strong> Commence à 20 Mbps et peut monter jusqu'à 200 Mbps (téléchargement), avec un upload souvent symétrique. Parfait pour envoyer des fichiers lourds ou faire des appels vidéos pros.</li>
      </ul>

      <h2>Les Tarifs : L'écart se resserre</h2>
      <p>Historiquement, l'ADSL était le choix économique par excellence (à partir de 99 DH ou 199 DH pour du 8/12 Mega). Cependant, aujourd'hui, les opérateurs comme Inwi et Orange proposent des forfaits Fibre d'entrée de gamme à 249 DH/mois. Pour une différence de 50 DH, la stabilité et le débit sont multipliés par dix.</p>

      <h2>Notre Verdict</h2>
      <p>Si vous êtes éligible à la technologie FTTH dans votre quartier, <strong>la migration vers la Fibre est incontournable</strong>. Le cuivre (ADSL) est voué à disparaître. Pour trouver l'offre fibre la moins chère de votre opérateur actuel et gérer la migration, consultez notre <a href="/">comparateur de forfaits internet</a> complet.</p>
    `
    },
    {
        slug: 'top-forfaits-mobiles-pas-cher-maroc',
        title: 'Les Meilleurs Forfaits Mobiles Pas Cher au Maroc (Moins de 100 DH)',
        excerpt: 'Comment payer son forfait mobile moins cher ? Découvrez notre sélection des offres Inwi, Orange et IAM idéales pour les étudiants et petits budgets.',
        coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80',
        date: '2026-03-01',
        author: {
            name: 'Youssef Rami',
            role: 'Rédacteur Tech',
            avatar: '/avatars/youssef.jpg'
        },
        category: 'Astuce',
        tags: ['Forfait Mobile', 'Pas Cher', 'Inwi', 'Orange', 'Win'],
        content: `
      <h2>Trouver un bon forfait à moins de 100 DH</h2>
      <p>Le budget télécom des Marocains est important. Que vous soyez étudiant ou simplement à la recherche d'une offre économique, voici comment obtenir le maximum de Data et de minutes d'appel pour un budget de 49 DH à 99 DH/mois.</p>

      <h2>1. Les Forfaits 100% Digitaux (Recommandé)</h2>
      <p>La grande tendance est au digital. <strong>Win by Inwi</strong> est souvent cité comme l'un des meilleurs forfaits mobiles pas chers au Maroc. Pourquoi ? Parce qu'en l'absence de boutiques physiques, les coûts sont réduits. Pour 99 DH, vous obtenez régulièrement plus de 30 Go d'Internet 4G et suffisamment d'heures d'appels. Tout se gère depuis une application.</p>

      <h2>2. Les Forfaits Étudiants 49 DH - 59 DH</h2>
      <p>Les trois opérateurs (IAM, Orange, Inwi) proposent des paliers d'entrée de gamme autour de 49 DH ou 59 DH. Ces offres sont conçues pour la "survie" numérique :</p>
      <ul>
        <li>Généralement entre 5 Go et 10 Go d'internet.</li>
        <li>1 à 2 heures d'appels.</li>
        <li>Souvent avec un bonus d'activation via les applications des opérateurs.</li>
      </ul>

      <h2>Comment bien choisir ?</h2>
      <p>Réfléchissez à votre consommation : êtes-vous le roi du WiFi à la maison (dans ce cas, un forfait à 49 DH suffit) ou scrollez-vous TikTok toute la journée dans les transports ? Dans le deuxième cas, priorisez la Data avec un budget autour de 99 DH.</p>
      
      <p>💡 <em>Astuce :</em> Vous pouvez croiser plusieurs offres 4G et 5G en deux clics grâce à notre <strong><a href="/quiz">outil de recommandation intelligent</a></strong>, qui analysera vos habitudes pour vous proposer le seul abonnement qu'il vous faut.</p>
    `
    }
]
