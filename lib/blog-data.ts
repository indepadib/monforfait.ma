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
            avatar: 'https://ui-avatars.com/api/?name=Amine+Alaoui&background=2563EB&color=fff'
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
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Benamor&background=9333EA&color=fff'
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
            avatar: 'https://ui-avatars.com/api/?name=Youssef+Rami&background=10B981&color=fff'
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
    },
    {
        slug: 'comment-resilier-abonnement-internet-maroc',
        title: 'Comment Résilier son Abonnement Internet au Maroc ? (Guide Pratique)',
        excerpt: 'Démarches, préavis de résiliation, frais cachés : le guide ultime pour changer d\'opérateur ou couper votre ligne en toute tranquillité.',
        coverImage: 'https://images.unsplash.com/photo-1554252116-431bf4eb7b79?auto=format&fit=crop&q=80',
        date: '2026-03-05',
        author: {
            name: 'Sarah Benamor',
            role: 'Conseillère Télécom',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Benamor&background=9333EA&color=fff'
        },
        category: 'Guide',
        tags: ['Résiliation', 'Contrat', 'Changement d\'opérateur', 'Litige'],
        content: `
      <h2>Les règles d'or de la résiliation au Maroc</h2>
      <p>Résilier une ligne Fibre ou ADSL peut parfois être un parcours du combattant si l'on ne connaît pas ses droits. L'ANRT (Agence Nationale de Réglementation des Télécommunications) encadre strictement ces pratiques.</p>

      <h2>L'Engagement : Le piège n°1</h2>
      <p>La majorité des offres Internet fixes (Box, Fibre, ADSL) sont soumises à un engagement de 12 mois. <strong>Si vous résiliez avant la fin de cet engagement</strong>, l'opérateur est en droit de vous facturer l'intégralité des mois restants.</p>
      <p><em>Exemple :</em> Vous résiliez au 10ème mois un abonnement à 250 DH/mois. L'opérateur vous facturera 2 x 250 DH = 500 DH de frais de pénalité.</p>

      <h2>Les étapes de la résiliation</h2>
      <ol>
        <li>Vérifier sa date de fin d'engagement sur sa facture ou l'espace client.</li>
        <li>Rédiger une lettre de résiliation manuscrite ou tapuscrite (l'opérateur fournit souvent un formulaire en agence).</li>
        <li>Se présenter physiquement en agence muni de sa CIN et éventuellement la restitution du matériel (routeur).</li>
        <li>Exiger un reçu ou une décharge prouvant la demande de résiliation !</li>
      </ol>

      <h2>Conservation de son numéro mobile (Portabilité)</h2>
      <p>Si vous souhaitez changer d'opérateur mobile sans perdre votre numéro (06XX...), <strong>ne résiliez surtout pas vous-même.</strong> Demandez simplement la portabilité au nouvel opérateur que vous avez choisi via notre <a href="/#comparateur">comparateur</a>, c'est lui qui se chargera techniquement de la résiliation avec votre ancien fournisseur.</p>
    `
    },
    {
        slug: '5g-maroc-deploiement-villes-compatibles',
        title: 'La 5G au Maroc : Date de lancement, Forfaits et Villes Compatibles',
        excerpt: 'Où en est le déploiement de la 5G par Inwi, Orange et Maroc Telecom ? Tout savoir sur les débits monstrueux de la nouvelle norme réseau mobile.',
        coverImage: 'https://images.unsplash.com/photo-1614064641913-6b70aca1ce03?auto=format&fit=crop&q=80',
        date: '2026-02-28',
        author: {
            name: 'Amine Alaoui',
            role: 'Expert Telecom',
            avatar: 'https://ui-avatars.com/api/?name=Amine+Alaoui&background=2563EB&color=fff'
        },
        category: 'Astuce',
        tags: ['5G', 'Technologie Mobile', 'Nouveauté'],
        content: `
      <h2>L'arrivée très attendue de la 5G</h2>
      <p>Prévue pour l'horizon de la Coupe du Monde 2030, la 5G est la prochaine révolution des télécommunications au Maroc. Elle promet des débits jusqu'à 10 fois supérieurs à l'actuelle 4G+ et un ping ultra-bas (latence de quelques millisecondes).</p>

      <h2>Quels seront les forfaits 5G ?</h2>
      <p>Pour l'instant, aucun opérateur ne commercialise commercialement d'offres "100% 5G" sur le marché grand public marocain, bien que des phases de tests géolocalisées soient en cours dans les grandes métropoles (Casablanca, Rabat, Tanger).</p>
      <p>Le futur marché proposera très probablement des <strong>Box 5G</strong> domestiques qui viendront concurrencer frontalement les abonnements à la Fibre Optique dans les zones rurales ou périurbaines où il est difficile de tirer des câbles.</p>

      <h2>Comment s'y préparer ?</h2>
      <p>Inutile de se précipiter sur le changement de forfait. Par contre, si vous achetez un nouveau smartphone cette année, veillez absolument à ce qu'il soit certifié "5G Ready". Ainsi, le jour où les offres <a href="/offers">Forfaits Mobiles Premium</a> s'activeront, votre puce basculera automatiquement sur le nouveau réseau ultra-rapide.</p>
    `
    },
    {
        slug: 'optimiser-wifi-maison-box-operateur',
        title: 'Routeur Fibre : 5 Astuces pour Booster et Étendre votre WiFi à la Maison',
        excerpt: 'Votre débit fibre est excellent mais votre WiFi coupe dans la chambre ? Découvrez comment optimiser le routeur de votre opérateur sans vous ruiner.',
        coverImage: 'https://images.unsplash.com/photo-1558237910-1c3906353380?auto=format&fit=crop&q=80',
        date: '2026-02-10',
        author: {
            name: 'Youssef Rami',
            role: 'Rédacteur Tech',
            avatar: 'https://ui-avatars.com/api/?name=Youssef+Rami&background=10B981&color=fff'
        },
        category: 'Astuce',
        tags: ['WiFi', 'Routeur', 'Maison Connectée', 'Réseau'],
        content: `
      <h2>Le problème n'est pas (toujours) votre offre Fibre</h2>
      <p>Beaucoup de clients optent pour les meilleures offres identifiées sur notre <a href="/quiz">outil de diagnostic de forfaits</a>, souscrivent à du 100 Mega, et sont déçus car Netflix bufferise dans la télévision du salon. Dans 90% des cas, c'est le signal WiFi de la box qui peine à traverser les murs épais marocains.</p>

      <h2>Les 5 règles d'or d'un bon réseau intérieur</h2>
      <ul>
        <li><strong>L'emplacement du routeur :</strong> Ne cachez JAMAIS votre Livebox ou routeur FTTH IAM dans un placard ou derrière une télé. Le signal Radio est absorbé par les parois. Placez-le en hauteur, au centre de l'appartement.</li>
        <li><strong>5 GHz vs 2.4 GHz :</strong> Connectez toujours vos Smarts TVs et consoles sur le réseau 5GHz ! Il a moins de portée mais délivre le plein potentiel de la fibre. Laissez les smartphones sur le 2.4 GHz.</li>
        <li><strong>Les CPL (Courant Porteur en Ligne) :</strong> Pour une chambre éloignée, utilisez des prises CPL filaires plutôt que des répéteurs WiFi qui divisent la bande passante par deux.</li>
        <li><strong>Changez le canal d'émission :</strong> Si vous habitez dans un immeuble dense, les routeurs des voisins créent des interférences. Dans l'administration de la box (192.168.1.1), fixez le canal WiFi sur le 1, 6 ou 11 pour éviter les embouteillages d'ondes.</li>
        <li><strong>Passez au système Mesh :</strong> Pour les grandes villas ou duplex, c'est l'investissement ultime (comptez entre 1500 et 3000 DH). Des boitiers intelligents gèrent le "roaming" transparent dans toute la maison avec un débit à 100%.</li>
      </ul>
      <p>Avant d'acheter du matériel, assurez-vous simplement de bénéficier de la meilleure fondation possible : comparez les fournisseurs sur <strong>MonForfait.ma</strong>.</p>
    `
    }
]
