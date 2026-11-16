# Auth partagé : redirections sûres par application

Supabase gpoylrecftylldgslkdh est utilisé par plusieurs applications. Il possède
une URL de site par défaut, mais chaque application doit imposer sa propre
URL de retour après connexion. Une seule redirection globale vers une app
casserait les flux de connexion des autres.

## Actions à réaliser dans Supabase Dashboard

URL : https://supabase.com/dashboard/project/gpoylrecftylldgslkdh/auth/url-configuration

1. Ne pas modifier la Site URL existante avant d'avoir audité les autres
   applications qui partagent Auth.
2. Ajouter à Authentication > URL Configuration > Redirect URLs :
   - https://monforfait.ma/auth/callback?next=%2Fadmin
   - https://monforfait.ma/auth/callback?next=%2Fespace-partenaire
   Ajouter séparément les origines locales de développement si nécessaire.
   Si la configuration exige un motif générique, utiliser une portée
   restreinte à https://monforfait.ma/auth/callback** après validation
   du comportement wildcard dans la documentation Supabase.
3. Dans Authentication > Email Templates > Magic Link, vérifier que
   le lien du bouton utilise la variable {{ .ConfirmationURL }}.
   Elle transporte le redirect_to transmis par signInWithOtp.
   Éviter de construire un lien avec {{ .SiteURL }} ou le domaine d'une
   autre application, sinon l'utilisateur peut y être envoyé.
4. Contrôler également Confirm signup, Invite user et Reset password.
   Ces modèles sont partagés au niveau du projet et peuvent casser les
   autres parcours d'authentification.
5. Ne jamais activer des redirections ouvertes ou transmettre des jetons
   de session à travers une URL vers une autre entité.

## Contrôle technique MonForfait

- /login spécifie l'origine MonForfait et la destination autorisée.
- /auth/callback finalise la session sur le bon domaine.
- Seules les destinations /admin et /espace-partenaire sont acceptées.
- L'Edge Function valide indépendamment les droits admin/partenaire.
- Une identité créée dans une autre entité ne vaut pas autorisation.

## Test à réaliser avec un vrai lien

1. Demander un lien de connexion MonForfait pour un compte autorisé.
2. Examiner le domaine final dans le lien reçu, sans partager les tokens.
3. Vérifier que le retour aboutit à /auth/callback puis /admin.
4. Refaire l'essai en mode partenaire et avec un compte non autorisé.
5. Contrôler ensuite les connexions des autres applications Supabase.

## Limites

La configuration Supabase Auth et les modèles email ne peuvent pas être
modifiés par le connecteur disponible. Ces réglages nécessitent une
vérification manuelle dans le tableau de bord Supabase.

Une erreur Netlify « Site not found » affichée à l'ouverture de la page
publique peut être indépendante des redirections Supabase Auth.

Documentation :
https://supabase.com/docs/guides/auth/redirect-urls
https://supabase.com/docs/guides/auth/auth-email-templates
