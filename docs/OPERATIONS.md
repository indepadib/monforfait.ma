# MonForfait.ma — Guide d'exploitation

**Statut :** plateforme technique de qualification et mise en relation, avec catalogue sourcé, suivi des demandes, CRM et espace partenaires. **Ce document ne signifie pas que des contrats commerciaux sont conclus ou que la conformité réglementaire est certifiée.**

## Assistance, vie privée et intégration

- **Formulaire /contact :** les demandes d'assistance sont conservées dans `monforfait_contact_messages` et non dans les prospects commerciaux. Un accord de traitement du message est requis. L'équipe doit consulter `/admin` → « Boîte de réception » et consigner le résultat ; aucun email automatique n'est prétendu envoyé.
- **Retrait du consentement :** le client conserve sa référence personnelle aléatoire de 48 caractères. Sur `/suivi`, « Retirer mon accord » appelle la fonction privée de retrait atomique, qui annule les nouveaux partages, révoque la visibilité des accès partenaires courants et conserve les justificatifs comptables nécessaires. Les anciens dossiers sans référence doivent passer par une vérification d'identité manuelle.
- **Concurrence :** `monforfait_release_sale` acquiert les verrous PostgreSQL dans le même ordre que le retrait du consentement : prospect puis dossier commercial. Le partenaire doit être sous contrat vérifié, avoir un compte autorisé, et seul un lead qualifié/consenti peut lui être attribué pour 30 jours. Aucune transmission en lecture libre.
- **Fiches opérateurs et offres :** `/operateurs/inwi`, `/operateurs/orange`, `/operateurs/iam` et `/offres/{uuid}` utilisent la table `plans`, les prix et sources disponibles. Les autres offres ne sont plus bloquées derrière des fausses promotions.
- **Widget :** `/widget` est une comparaison publique sans collecte d'identité, intégrable en iframe HTTPS. Code d'intégration disponible dans `/partenaires`. Vérifier régulièrement que les restrictions anti-clickjacking restent actives sur les pages privées.
- **Guide :** `/guide-internet-maroc.pdf` est accessible sans email. `/api/send-guide` GET redirige vers cette ressource. Le POST email reste explicitement indisponible faute de domaine d'envoi vérifié.
- **Transparence :** aucun support WhatsApp ni délai de réponse ne doit être affiché sans canal réel. Les mentions légales d'identification et la conformité CNDP restent à documenter par le responsable légal.

### Tests reproductibles

En plus de TypeScript, Deno et Next build, la CI démarre Next.js avec une configuration de test et exécute `node scripts/smoke-routes.mjs` pour vérifier les principales routes HTTP, sans envoyer de faux formulaires ni créer de prospects. Le test vérifie également que `/admin` est protégé du framing et que `/widget` peut être intégré.

## Parcours visiteur
- `/offers` : sélection d'offres actives. Chaque fiche comporte sa source officielle et sa date de vérification.
- `/quiz` et `/eligibilite` : demande volontaire, consentement explicite avant création de lead.
- `/results` : les offres répondant aux critères du quiz. Les offres peuvent être rattachées au dossier via une référence privée. Une sélection n'est pas une activation.
- `/suivi` : progression du dossier, avec une référence aléatoire hexadécimale de 48 caractères. Uniquement statut public + date. Aucune donnée personnelle ne peut être lue avec ce lien.
- Assistant : recherche dans la table `plans` active, formulaire de contact facultatif, consentement obligatoire.

Le client doit **conserver la référence** reçue à la création ; elle est aussi stockée dans son navigateur. Les dossiers créés avant cette fonctionnalité n'ont pas de référence rétroactive. Une nouvelle demande ne garantit ni la couverture réseau ni la disponibilité d'un installateur.

## Gestionnaire / administration
1. Se connecter via `/login?tab=admin` : seuls les utilisateurs enregistrés dans la table privée `monforfait_admins` peuvent accéder aux actions. Ne jamais ajouter les autorisations depuis le navigateur.
2. `/admin` : suivre le nombre réel de demandes, les consentements et la tendance des 30 derniers jours. Les sources sont celles déclarées dans `needs_details`.
3. Qualifier chaque lead avec statut, date de contact, résumé de vérification. Les statuts sensibles nécessitent une note. Les anciens leads sans consentement ne doivent **jamais** être vendus ou transmis en masse.
4. Catalogue : vérifier chaque prix sur la page officielle de l'opérateur, puis entrer l'URL et actualiser les valeurs techniques et le prix. Archiver les anciennes références plutôt que les supprimer. L'outil signale les fiches non revérifiées depuis 30 jours. Les sources seules ne prouvent pas le prix : contrôle humain requis.
5. Partenaires : enregistrement d'une candidature ne signifie pas contrat. Le statut `contracted` ou `active` exige la référence d'un **contrat réellement signé** et la vérification manuelle. Ne jamais inventer cette référence pour activer un compte.
6. Le partenaire s'authentifie à `/login?tab=partner` avec l'email professionnel enregistré et validé ; l'admin associe explicitement ce compte à la société, après contrat.
7. Proposer un dossier **uniquement** si le client est qualifié et son consentement documenté. La proposition n'ouvre pas les données personnelles au partenaire.
8. Lorsque la proposition est acceptée, l'admin peut partager explicitement **un dossier** avec le distributeur contractuel, pour **30 jours**. La référence du contrat de partage est consignée. Aucun export global des leads vers les partenaires.
9. Le distributeur voit uniquement ses dossiers attribués non expirés dans `/espace-partenaire` ; il saisit ses retours, qui n'enregistrent automatiquement ni activation ni chiffre d'affaires.
10. Les changements des dossiers sont enregistrés : proposé → accepté → activé (sur preuve) → facturé (référence de facture) → payé (référence d'encaissement). Une proposition de 300 DH n'est **pas** 300 DH de CA encaissé.

## API et sécurité
- Tous les accès PII/CRM par `supabase/functions/leads-gateway`, authentification Supabase et allowlists côté serveur.
- Tables `leads`, `monforfait_partners`, `monforfait_partner_users`, `monforfait_lead_sales`, `monforfait_partner_feedback`, `monforfait_lead_activity`, `monforfait_catalog_audit` protégées RLS et sans SELECT anon/authenticated.
- `/api/health` : seul statut du catalogue, sans secrets ni coordonnées.
- Aucun `SUPABASE_SERVICE_ROLE_KEY` dans `NEXT_PUBLIC_*`.
- Le tracking public utilise un secret aléatoire stocké en base uniquement sous empreinte SHA-256. La référence est un secret : ne pas la publier sur les réseaux.
- Politique de cookies avec refus ou acceptation, les scripts GA/Ads ne chargent qu'après acceptation. Vérifier avec le conseil juridique la politique CNDP, les transferts de données et la conservation.

## Vérification avant chaque release
- `npm install --no-audit --no-fund`
- `npx tsc --noEmit`
- `deno check supabase/functions/leads-gateway/index.ts`
- `deno test supabase/functions/leads-gateway/rules.test.ts`
- `npm run build`
- Fusion du PR seulement quand le CI est vert.
- Déployer les 3 fichiers de fonction Edge (`index.ts`, `rules.ts`, `deno.json`) en `verify_jwt:true` et vérifier qu'elle est ACTIVE.
- Vérifier Netlify déployé sur le même SHA que GitHub main.
- Smoke test sans créer de fausses données : GET `/`, `/offers`, `/quiz`, `/suivi`, `/espace-partenaire`, `/admin`, `/api/health`. Sur une demande réelle explicitement consentie, vérifier création, référence, sélection, CRM et statut.
- Vérifier `/admin` et `/espace-partenaire` avec des sessions autorisées ; une compilation réussie n'est pas une preuve de test E2E.

## Limitations opérationnelles / dépendances externes
- **0 partenaire contracté** et **0 facture** tant qu'aucune relation commerciale réelle n'existe.
- Tarifs et couverture : les opérateurs doivent fournir accès APIs ou données à jour ; le catalogue exige la revalidation des informations publiées. Aucune carte d'éligibilité technique automatisée n'est présentée.
- Notification email/SMS, réinitialisation de compte, automatisations de suivi et solution de paiement ne sont pas activées sans fournisseurs vérifiés et conditions contractuelles. Les anciens endpoints non sécurisés restent désactivés.
- Vérifier l'existence de `contact@monforfait.ma`, le domaine expéditeur et les URL de redirection Supabase Auth avant d'ouvrir le portail aux partenaires.
- Formalités CNDP et contrats de sous-traitance / transfert Maroc doivent être confirmés par conseil juridique avant transmission à des tiers.
- Protection antispam : anti-duplication par téléphone et honeypot du formulaire partenaires ; prévoir solution de protection serveur/CAPTCHA si le trafic augmente.
- Le chiffre d'affaires affiché est un **registre de montants déclarés** avec justificatifs manuels, et non un rapprochement bancaire.

## Priorités métier
**Premières preuves à obtenir :** 2 partenaires pilotes, modalités CPL/CPA écrites, réception attestée des premiers leads consentis, mesure des taux de contact → activation → paiement. Piloter CAC et marge nette avant de dépenser en acquisition.

Les fonctionnalités abandonnées ou factices (voix automatique sans opt-in, faux paiement, faux speed test, faux avis et faux robots de remises) ne doivent pas être réactivées sans vraie intégration et audit.
