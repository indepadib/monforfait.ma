# monforfait.ma — Checklist de tests
## À valider avant la mise en production

---

## PHASE 1 — Tests unitaires (sans appels réels)

### Normalisation des numéros
Tester la fonction `normalizePhone()` avec ces entrées :

| Input            | Résultat attendu   | Pass ? |
|------------------|--------------------|--------|
| `0612345678`     | `+212612345678`    | ☐      |
| `212612345678`   | `+212612345678`    | ☐      |
| `+212612345678`  | `+212612345678`    | ☐      |
| `612345678`      | `+212612345678`    | ☐      |
| `0033123456789`  | `null`             | ☐      |
| ` 06 12 34 56`   | `null` ou error    | ☐      |

### Détection des horaires
| Heure simulée        | Résultat attendu   |
|----------------------|--------------------|
| Lundi 09h00          | `true` → OK        |
| Samedi 21h00         | `false` → Bloquer  |
| Vendredi 11h00       | `true` → OK        |
| Vendredi 12h00       | `false` → Bloquer  |

### Normalisation des opérateurs
| Input                  | Résultat attendu |
|------------------------|------------------|
| `Maroc Telecom`        | `IAM`            |
| `iam`                  | `IAM`            |
| `je suis chez Orange`  | `Orange`         |
| `Inwi depuis 2 ans`    | `Inwi`           |
| `Wana`                 | `Inwi`           |
| `méditel`              | `Orange`         |
| `je sais pas`          | `Inconnu`        |

---

## PHASE 2 — Tests d'intégration (sandbox Vapi)

### Test 1 — Formulaire → Webhook
1. Soumettre le formulaire avec ton propre numéro et consent coché
2. Vérifier en DB : `leads.consent_voice = 1`, `leads.voice_status = 'PENDING'`
3. Vérifier en DB : `voice_queue` contient le lead
4. Attendre l'appel sur ton téléphone ☐
5. Répondre et jouer le rôle d'un prospect IAM cherchant du mobile
6. Vérifier en DB : `voice_calls.status = 'CONFIRMED'`
7. Vérifier en DB : `voice_calls.q1_operator_norm = 'IAM'`
8. Vérifier en DB : `voice_calls.q2_service = 'mobile'`
9. Vérifier en DB : `voice_calls.target_operator_1 = 'Inwi'`
10. Vérifier dans Google Sheets : ligne ajoutée ☐

### Test 2 — Mauvais numéro
1. Ajouter un lead avec un numéro fictif (+212600000000)
2. Déclencher l'appel manuellement via `POST /api/voice/call/:id`
3. Vérifier que Vapi retourne une erreur ou que le webhook reçoit INVALID ☐

### Test 3 — Liste noire
1. Ajouter un numéro dans `voice_blacklist`
2. Tenter de déclencher un appel sur ce numéro
3. Vérifier que le système répond `400 Numéro sur liste noire` ☐

### Test 4 — DECLINED auto-blacklist
1. Recevoir un appel et dire "ne me rappellez plus"
2. Vérifier que `voice_calls.status = 'DECLINED'` ☐
3. Vérifier que le numéro est ajouté automatiquement à `voice_blacklist` ☐

### Test 5 — Webhook signature
1. Envoyer une requête POST à `/api/voice/webhook` avec une mauvaise signature
2. Vérifier que le serveur retourne `401 Unauthorized` ☐

---

## PHASE 3 — Test end-to-end sur 10 vrais leads

Prendre 10 leads récents de monforfait.ma (avec consentement).

| Métrique à mesurer       | Seuil minimum |
|--------------------------|---------------|
| Taux CONFIRMED           | > 55%         |
| Taux INVALID             | < 20%         |
| Durée moyenne            | < 90 secondes |
| Webhook reçu             | 100% des appels|
| Google Sheets mis à jour | 100% des appels|
| Routing opérateur correct| 100% des CONFIRMED|

### Si le taux CONFIRMED est < 50% :
- Vérifier la qualité des leads (ancienneté, source)
- Écouter 3 enregistrements → identifier les points de blocage
- Ajuster le prompt (ton trop formel ? trop rapide ?)

### Si les enregistrements ne remontent pas :
- Vérifier `recordingEnabled: true` dans Vapi config
- Vérifier que le champ `recording_url` est bien parsé dans le webhook

---

## PHASE 4 — Tests de charge (avant volume > 100 appels/jour)

```bash
# Simuler 20 appels en parallèle (côté DB uniquement, pas de vrais appels)
# Vérifier qu'il n'y a pas de race conditions sur la file d'attente

# Tester le verrouillage de la file (locked_until)
# Un lead ne doit être appelé qu'une seule fois en parallèle
```

---

## CHECKLIST GO-LIVE

- [ ] Migrations SQL exécutées en production
- [ ] Variables d'environnement configurées
- [ ] Webhook déployé et accessible en HTTPS
- [ ] URL webhook configurée dans Vapi Dashboard
- [ ] Test de signature webhook réussi
- [ ] 10 leads de test passés avec succès
- [ ] Google Sheets mis à jour automatiquement
- [ ] Dashboard admin accessible à l'équipe
- [ ] Formulaire frontend avec checkbox consentement
- [ ] Mention légale CNDP visible sur le site
- [ ] Horaires de blocage testés (08h-20h, vendredi)
- [ ] Liste noire fonctionnelle
- [ ] Monitoring des logs activé
