export type TranslationKeys = 
  // Navigation
  | 'nav_offers'
  | 'nav_comparator'
  | 'nav_quiz'
  | 'nav_client_space'
  | 'nav_pro_portal'
  | 'nav_btn_find'
  
  // Hero
  | 'hero_surtitle'
  | 'hero_title_normal'
  | 'hero_title_highlight'
  | 'hero_desc'
  | 'hero_approved'
  | 'hero_free'
  | 'hero_no_commitment'
  | 'hero_speed'
  | 'hero_btn_check'
  | 'hero_btn_offers'
  
  // Scam Detector
  | 'scam_title'
  | 'scam_subtitle'
  | 'scam_label_operator'
  | 'scam_label_price'
  | 'scam_select'
  | 'scam_btn_scan'
  | 'scam_scanning'
  | 'scam_step_connect'
  | 'scam_step_b2b'
  | 'scam_step_margin'
  | 'scam_step_report'
  | 'scam_alert_title'
  | 'scam_alert_desc'
  | 'scam_match_1'
  | 'scam_match_2'
  | 'scam_btn_prove'
  | 'scam_footer'
  
  // Promo Form / Unlocker
  | 'promo_title_b2c'
  | 'promo_desc_b2c'
  | 'promo_title_b2b'
  | 'promo_desc_b2b'
  | 'promo_savings'
  | 'promo_timer'
  | 'promo_step1_label1'
  | 'promo_step1_label2'
  | 'promo_btn_continue'
  | 'promo_btn_back'
  | 'promo_btn_submit_b2c'
  | 'promo_btn_submit_b2b'
  | 'promo_btn_submitting'
  | 'promo_secure'
  | 'promo_step2_name'
  | 'promo_step2_city'
  | 'promo_step2_phone'
  | 'promo_step2_phone_desc'
  | 'promo_success_title_b2c'
  | 'promo_success_desc_b2c'
  | 'promo_success_title_b2b'
  | 'promo_success_desc_b2b'
  
  // Footer
  | 'footer_desc'
  | 'footer_nav'
  | 'footer_popular'
  | 'footer_legal'
  | 'footer_rights'
  
  // FAQ Header
  | 'faq_badge'
  | 'faq_title'
  | 'faq_desc'
  | 'faq_box_title'
  | 'faq_box_desc'
  | 'faq_box_btn'
  
  // FAQ Questions
  | 'faq_q1' | 'faq_a1'
  | 'faq_q2' | 'faq_a2'
  | 'faq_q3' | 'faq_a3'
  | 'faq_q4' | 'faq_a4'
  | 'faq_q5' | 'faq_a5'
  | 'faq_q6' | 'faq_a6'
  | 'faq_q7' | 'faq_a7'
  | 'faq_q8' | 'faq_a8'

  // General & CTA
  | 'cta_ready'
  | 'cta_ready_desc'
  | 'cta_btn'
  
  // Promo Form Custom Extras
  | 'promo_badge_b2b'
  | 'promo_badge_b2c'
  | 'promo_success_check_b2b_1'
  | 'promo_success_check_b2b_2'
  | 'promo_success_check_b2b_3'
  | 'promo_success_check_b2c_1'
  | 'promo_success_check_b2c_2'
  | 'promo_success_check_b2c_3'
  | 'promo_step2_name_b2b'
  | 'promo_step2_name_placeholder_b2b'
  | 'promo_step2_name_placeholder_b2c'
  | 'promo_step2_city_placeholder'
  | 'promo_step2_phone_placeholder'
  | 'phone_error_invalid'
  | 'promo_need_fibre'
  | 'promo_need_mobile'
  | 'promo_need_adsl'
  | 'promo_need_box'
  | 'promo_bill_less_100'
  | 'promo_bill_100_199'
  | 'promo_bill_200_299'
  | 'promo_bill_more_300'

  // Eligibility Checker
  | 'elig_title'
  | 'elig_subtitle'
  | 'elig_need_fibre_title'
  | 'elig_need_fibre_desc'
  | 'elig_need_adsl_title'
  | 'elig_need_adsl_desc'
  | 'elig_need_box_title'
  | 'elig_need_box_desc'
  | 'elig_need_mobile_title'
  | 'elig_need_mobile_desc'
  | 'elig_reason_title'
  | 'elig_reason_desc'
  | 'elig_reason_moving'
  | 'elig_reason_cheaper'
  | 'elig_reason_faster'
  | 'elig_reason_new'
  | 'elig_loc_title'
  | 'elig_loc_desc'
  | 'elig_loc_btn'
  | 'elig_contact_title'
  | 'elig_contact_desc'
  | 'elig_contact_secure'
  | 'elig_contact_name_placeholder'
  | 'elig_contact_phone_placeholder'
  | 'elig_contact_delay'
  | 'elig_delay_asap'
  | 'elig_delay_1month'
  | 'elig_delay_checking'
  | 'elig_contact_comment'
  | 'elig_contact_comment_placeholder'
  | 'elig_contact_btn'
  | 'elig_scan_title'
  | 'elig_scan_desc'
  | 'elig_scan_connecting'
  | 'elig_res_title'
  | 'elig_res_encrypted'
  | 'elig_res_verified'
  | 'elig_res_desc'
  | 'elig_res_advisor_title'
  | 'elig_res_advisor_desc'
  | 'elig_res_btn';

export const translations: Record<'fr' | 'ar', Record<TranslationKeys, string>> = {
  fr: {
    // Navigation
    nav_offers: 'Offres',
    nav_comparator: 'Comparateur',
    nav_quiz: 'Quiz',
    nav_client_space: 'Espace Client',
    nav_pro_portal: 'Portail Pro',
    nav_btn_find: 'Trouver mon forfait',

    // Hero
    hero_surtitle: 'Comparateur Télécom N°1 au Maroc',
    hero_title_normal: 'Ne vous faites plus',
    hero_title_highlight: 'arnaquer par votre opérateur.',
    hero_desc: 'Trouvez la meilleure fibre optique et le forfait mobile le moins cher au Maroc. Ne payez plus le prix fort chez IAM, Inwi ou Orange. Passez notre détecteur d\'arnaque et débloquez les offres privées B2B.',
    hero_approved: 'Approuvé pour trouver le meilleur forfait',
    hero_free: '100% Gratuit',
    hero_no_commitment: 'Sans Engagement',
    hero_speed: 'En 60 Secondes',
    hero_btn_check: 'Vérifier mon éligibilité',
    hero_btn_offers: 'Voir les offres',

    // Scam Detector
    scam_title: 'Détecteur d\'Arnaque',
    scam_subtitle: 'Analyse en temps réel de votre facture',
    scam_label_operator: 'Votre opérateur actuel',
    scam_label_price: 'Combien payez-vous par mois ? (DH)',
    scam_select: 'Sélectionnez...',
    scam_btn_scan: 'Lancer le diagnostic',
    scam_scanning: 'Analyse en cours...',
    scam_step_connect: 'Connexion aux serveurs opérateurs...',
    scam_step_b2b: 'Comparaison avec les offres cachées B2B...',
    scam_step_margin: 'Analyse des marges de l\'opérateur...',
    scam_step_report: 'Génération du rapport d\'économie...',
    scam_alert_title: 'Alerte Rouge !',
    scam_alert_desc: 'Vos {price} DH / mois chez {operator} sont injustifiés. Vous payez en ce moment environ 45% trop cher par rapport aux prix réels du marché.',
    scam_match_1: 'Nous avons trouvé 2 offres identiques sur notre base secrète B2B.',
    scam_match_2: 'Économie estimée : {savings} DH / an',
    scam_btn_prove: 'Prouvez-le moi',
    scam_footer: 'Scan anonyme. 100% Gratuit.',

    // Promo Form
    promo_title_b2c: 'Test d\'éligibilité aux promotions',
    promo_desc_b2c: 'Remplissez ce formulaire pour savoir si votre numéro est éligible aux réductions jusqu\'à -50% et voir le classement secret.',
    promo_title_b2b: 'Déléguez la Négociation B2B',
    promo_desc_b2b: 'Indiquez-nous vos besoins professionnels. Nos experts négocient directement avec les opérateurs pour obtenir les meilleurs tarifs flotte et fibre entreprise (-30% en moyenne).',
    promo_savings: 'Jusqu\'à {savings} DH d\'économies par an',
    promo_timer: 'Offre expire dans : {time}',
    promo_step1_label1: '1. Que recherchez-vous ?',
    promo_step1_label2: '2. Combien payez-vous actuellement ?',
    promo_btn_continue: 'Continuer',
    promo_btn_back: 'Retour',
    promo_btn_submit_b2c: 'Débloquer le comparatif',
    promo_btn_submit_b2b: 'Demander le devis gratuit',
    promo_btn_submitting: 'Vérification...',
    promo_secure: 'Vos données sont 100% sécurisées.',
    promo_step2_name: 'Nom Complet',
    promo_step2_city: 'Ville',
    promo_step2_phone: 'Numéro de téléphone',
    promo_step2_phone_desc: 'Requis uniquement pour tester l\'éligibilité technique de votre ligne avec les opérateurs (Fibre/5G).',
    promo_success_title_b2c: 'Promos débloquées !',
    promo_success_desc_b2c: 'Préparation de vos offres secrètes en cours...',
    promo_success_title_b2b: 'Demande de Devis Envoyée !',
    promo_success_desc_b2b: 'Un expert B2B vous contactera sous 2h pour négocier votre flotte.',

    // Footer
    footer_desc: 'Le comparateur telecom N°1 au Maroc. Nous analysons quotidiennement les offres de Orange, Inwi et Maroc Telecom pour vous faire économiser.',
    footer_nav: 'Navigation',
    footer_popular: 'Recherches populaires',
    footer_legal: 'Légal',
    footer_rights: 'MonForfait.ma • Fait avec ❤️ au Maroc',

    // FAQ Header
    faq_badge: 'Questions Fréquentes',
    faq_title: 'Tout ce que vous devez savoir',
    faq_desc: 'Vous avez une question ? Nous avons la réponse.',
    faq_box_title: 'Vous avez une autre question ?',
    faq_box_desc: 'Notre équipe est là pour vous aider',
    faq_box_btn: 'Contactez-nous',

    // FAQ Questions
    faq_q1: 'Comment fonctionne MonForfait.ma ?',
    faq_a1: 'MonForfait.ma compare automatiquement tous les forfaits disponibles chez Orange, Inwi et Maroc Telecom. Répondez à notre quiz de 60 secondes pour obtenir des recommandations personnalisées basées sur vos besoins réels.',
    faq_q2: 'Est-ce vraiment gratuit ?',
    faq_a2: 'Oui, 100% gratuit ! MonForfait.ma est un comparateur indépendant financé par des partenariats avec les opérateurs. Vous ne payez rien et n\'avez aucune obligation d\'achat.',
    faq_q3: 'Les prix sont-ils à jour ?',
    faq_a3: 'Nos prix sont mis à jour quotidiennement grâce à notre système automatique de scraping. Vous voyez toujours les tarifs les plus récents et les promotions en cours.',
    faq_q4: 'Puis-je changer d\'opérateur facilement ?',
    faq_a4: 'Oui ! Au Maroc, vous pouvez changer d\'opérateur en conservant votre numéro (portabilité). Le processus prend généralement 2-3 jours ouvrables. Nous vous guidons dans toutes les étapes.',
    faq_q5: 'Quelle différence entre Fibre et ADSL ?',
    faq_a5: 'La fibre optique (FTTH) offre des vitesses jusqu\'à 1 Gbps avec une latence très faible, idéale pour le streaming 4K et le gaming. L\'ADSL est limité à ~20 Mbps mais disponible partout. Notre speed test vous aide à savoir ce dont vous avez besoin.',
    faq_q6: 'Comment utiliser le speed test ?',
    faq_a6: 'Cliquez sur \'Speed Test\' dans le menu. Notre outil mesure votre vitesse actuelle (download, upload, ping) et vous recommande les forfaits adaptés à vos besoins. Gratuit et illimité !',
    faq_q7: 'Mes données sont-elles protégées ?',
    faq_a7: 'Absolument. Nous utilisons un cryptage SSL et respectons le RGPD. Vos données ne sont jamais vendues. Elles servent uniquement à personnaliser vos recommandations.',
    faq_q8: 'Proposez-vous des forfaits Pro ?',
    faq_a8: 'Oui ! Nous comparons aussi les offres professionnelles : fibre avec IP statique, flottes mobiles, solutions Cloud. Sélectionnez \'Professionnel\' dans notre quiz.',

    // CTA
    cta_ready: 'Prêt à économiser sur votre facture ?',
    cta_ready_desc: 'Répondez à 3 questions et découvrez vos offres personnalisées',
    cta_btn: 'Commencer maintenant (60 sec)',

    // Promo Form Custom Extras
    promo_badge_b2b: 'Service Grands Comptes',
    promo_badge_b2c: 'Offres Cachées Actives',
    promo_success_check_b2b_1: 'Audit Facture Flotte',
    promo_success_check_b2b_2: 'Fibre Dédiée PME',
    promo_success_check_b2b_3: 'Tarifs Grossiste',
    promo_success_check_b2c_1: 'Éligibilité 4G/5G',
    promo_success_check_b2c_2: 'Fibre Optique Zone',
    promo_success_check_b2c_3: 'Promotions cachées',
    promo_step2_name_b2b: "Nom de l'Entreprise / Contact",
    promo_step2_name_placeholder_b2b: 'ex: TechSolutions / Yassine',
    promo_step2_name_placeholder_b2c: 'ex: Yassine B.',
    promo_step2_city_placeholder: 'Ville (ex: Casa)',
    promo_step2_phone_placeholder: '06 XX XX XX XX (Pour recevoir les offres)',
    phone_error_invalid: 'Veuillez entrer un numéro de téléphone valide',
    promo_need_fibre: 'Internet Fibre Optique',
    promo_need_mobile: 'Forfait Mobile',
    promo_need_adsl: 'Internet ADSL',
    promo_need_box: 'Box 4G/5G',
    promo_bill_less_100: 'Moins de 100 DH / mois',
    promo_bill_100_199: 'Entre 100 et 199 DH / mois',
    promo_bill_200_299: 'Entre 200 et 299 DH / mois',
    promo_bill_more_300: 'Plus de 300 DH / mois',

    // Eligibility Checker
    elig_title: "Test d'Éligibilité National",
    elig_subtitle: 'Quel est votre besoin principal à domicile ?',
    elig_need_fibre_title: 'Fibre Optique (Très Haut Débit)',
    elig_need_fibre_desc: 'Idéal pour le streaming et télétravail',
    elig_need_adsl_title: 'ADSL / Box standard',
    elig_need_adsl_desc: 'Couverture nationale maximale',
    elig_need_box_title: 'Box 4G / 5G (Sans fil)',
    elig_need_box_desc: 'Là où la fibre ne passe pas',
    elig_need_mobile_title: 'Forfait Mobile seul',
    elig_need_mobile_desc: 'Meilleure couverture réseau',
    elig_reason_title: 'Quelle est votre situation ?',
    elig_reason_desc: 'Cela nous aide à trouver les meilleures offres de bienvenue ou de rétention.',
    elig_reason_moving: 'Je déménage prochainement',
    elig_reason_cheaper: 'Je veux payer moins cher',
    elig_reason_faster: 'Mon débit actuel est trop lent',
    elig_reason_new: 'Nouveau raccordement / 1ère box',
    elig_loc_title: 'Où habitez-vous ?',
    elig_loc_desc: 'Recherchez votre adresse puis glissez le marqueur pour ajuster précisément votre position.',
    elig_loc_btn: "Confirmer l'adresse",
    elig_contact_title: 'Dernière étape',
    elig_contact_desc: 'Où devons-nous vous envoyer le résultat de la couverture réseau ?',
    elig_contact_secure: 'Vos données sont sécurisées et serviront uniquement à vous informer sur la disponibilité de la fibre.',
    elig_contact_name_placeholder: 'Votre nom complet',
    elig_contact_phone_placeholder: 'Votre numéro de téléphone',
    elig_contact_delay: 'Délai souhaité',
    elig_delay_asap: 'Dès que possible (Urgent)',
    elig_delay_1month: "D'ici 1 mois",
    elig_delay_checking: 'Simple comparaison',
    elig_contact_comment: 'Commentaire (Optionnel)',
    elig_contact_comment_placeholder: "Ex: Je cherche la fibre pour du gaming, ou j'ai besoin d'une IP fixe...",
    elig_contact_btn: 'Lancer le Test de Couverture',
    elig_scan_title: 'Analyse des bornes...',
    elig_scan_desc: "Vérification de l'adresse : {address}",
    elig_scan_connecting: 'Connexion aux bases opérateurs...',
    elig_res_title: 'Analyse Terminée !',
    elig_res_encrypted: 'Data encrypted',
    elig_res_verified: 'Verified Address',
    elig_res_desc: 'Votre adresse ({address}) est bien située dans une zone couverte par le Très Haut Débit.',
    elig_res_advisor_title: 'Un conseiller vous contactera',
    elig_res_advisor_desc: '"Un expert va analyzer les raccordements exacts devant votre porte et vous proposera les offres de rétention exclusives sous 24h."',
    elig_res_btn: 'Débloquer les prix secrets'
  },
  ar: {
    // Navigation
    nav_offers: 'العروض',
    nav_comparator: 'المقارن',
    nav_quiz: 'الاختبار',
    nav_client_space: 'فضاء الزبون',
    nav_pro_portal: 'بوابة المهنيين',
    nav_btn_find: 'اعثر على اشتراكي',

    // Hero
    hero_surtitle: 'مقارن الإتصالات رقم 1 في المغرب',
    hero_title_normal: 'لا تدع بعد الآن',
    hero_title_highlight: 'شركات الاتصالات تخدعك.',
    hero_desc: 'اعثر على أفضل عرض للألياف البصرية (Fibre) وأرخص اشتراك هاتف محمول في المغرب. لا تدفع السعر المرتفع لدى اتصالات المغرب، إنوي أو أورنج. جرب كاشف الاحتيال ووفر أموالك الآن.',
    hero_approved: 'معتمد للعثور على أفضل اشتراك شهري',
    hero_free: 'مجاني 100%',
    hero_no_commitment: 'بدون التزام',
    hero_speed: 'في 60 ثانية',
    hero_btn_check: 'التحقق من التغطية ببيتي',
    hero_btn_offers: 'عرض الاشتراكات',

    // Scam Detector
    scam_title: 'كاشف الاحتيال والأثمنة المرتفعة',
    scam_subtitle: 'تحليل فاتورتك في الوقت الفعلي',
    scam_label_operator: 'مشغلك الحالي',
    scam_label_price: 'كم تدفع شهرياً؟ (بالدرهم)',
    scam_select: 'اختر المشغل...',
    scam_btn_scan: 'ابدأ الفحص والتحليل',
    scam_scanning: 'جاري التحليل والفحص...',
    scam_step_connect: 'الاتصال بخوادم شركات الاتصال...',
    scam_step_b2b: 'مقارنة الفاتورة مع العروض المخفية والمشتركة...',
    scam_step_margin: 'تحليل هامش أرباح الشركة على حسابك...',
    scam_step_report: 'إنشاء تقرير التوفير المالي الخاص بك...',
    scam_alert_title: 'تنبيه هام !',
    scam_alert_desc: 'مبلغ {price} درهم/شهر لشركة {operator} غير مبرر. أنت تدفع حالياً حوالي 45% أكثر من السعر الفعلي المناسب في السوق.',
    scam_match_1: 'عثرنا على عرضين متطابقين تماماً في قاعدة بياناتنا السرية للمهنيين.',
    scam_match_2: 'التوفير السنوي المتوقع : {savings} درهم / سنة',
    scam_btn_prove: 'برهن لي على ذلك',
    scam_footer: 'فحص مجهول. مجاني 100%.',

    // Promo Form
    promo_title_b2c: 'اختبار الأهلية للتخفيضات والعروض',
    promo_desc_b2c: 'املأ الاستمارة لمعرفة ما إذا كان رقمك مؤهلاً لتخفيضات تصل إلى -50% ولرؤية الترتيب السري للعروض.',
    promo_title_b2b: 'تفويض التفاوض للشركات B2B',
    promo_desc_b2b: 'أخبرنا باحتياجات شركتك. يتفاوض خبراؤنا مباشرة مع شركات الاتصال للحصول على أفضل الأسعار لأسطول الهواتف وألياف الشركات (توفير -30% في المتوسط).',
    promo_savings: 'توفير يصل إلى {savings} درهم سنوياً',
    promo_timer: 'تنتهي صلاحية العرض بعد : {time}',
    promo_step1_label1: '1. ما الذي تبحث عنه ؟',
    promo_step1_label2: '2. كم تدفع حالياً شهرياً ؟',
    promo_btn_continue: 'استمرار',
    promo_btn_back: 'رجوع',
    promo_btn_submit_b2c: 'كشف الترتيب والمقارنة',
    promo_btn_submit_b2b: 'طلب تسعيرة مجانية',
    promo_btn_submitting: 'جاري التحقق...',
    promo_secure: 'معلوماتك آمنة ومحمية بنسبة 100%.',
    promo_step2_name: 'الاسم الكامل',
    promo_step2_city: 'المدينة',
    promo_step2_phone: 'رقم الهاتف',
    promo_step2_phone_desc: 'مطلوب فقط للتحقق من التغطية التقنية لخطك مع شركات الاتصالات (Fibre/5G).',
    promo_success_title_b2c: 'تم كشف التخفيضات !',
    promo_success_desc_b2c: 'جاري إعداد العروض السرية الخاصة بك...',
    promo_success_title_b2b: 'تم إرسال طلبك بنجاح !',
    promo_success_desc_b2b: 'سيتصل بك أحد خبراء الشركات في أقل من ساعتين لمناقشة أسطولك وتخفيض الفاتورة.',

    // Footer
    footer_desc: 'المقارن الأول لخدمات الاتصالات في المغرب. نقوم بتحليل يومي لعروض أورنج، إنوي واتصالات المغرب لمساعدتك على التوفير المالي.',
    footer_nav: 'خريطة الموقع',
    footer_popular: 'عمليات البحث الشائعة',
    footer_legal: 'قوانين',
    footer_rights: 'MonForfait.ma • صنع بـ ❤️ في المغرب',

    // FAQ Header
    faq_badge: 'الأسئلة الشائعة',
    faq_title: 'كل ما تحتاج لمعرفته',
    faq_desc: 'لديك سؤال؟ لدينا الإجابة الوافية.',
    faq_box_title: 'لديك سؤال آخر لم تجد إجابته؟',
    faq_box_desc: 'فريق الدعم لدينا مستعد للإجابة عليك فوراً',
    faq_box_btn: 'تواصل معنا الآن',

    // FAQ Questions
    faq_q1: 'كيف يعمل موقع MonForfait.ma ؟',
    faq_a1: 'يقوم موقعنا بمقارنة تلقائية لجميع الاشتراكات المتاحة لدى أورنج، إنوي واتصالات المغرب. أجب عن أسئلة الاختبار البسيط (60 ثانية) للحصول على ترشيح مخصص لاحتياجاتك الفعلية وبأرخص سعر.',
    faq_q2: 'هل الخدمة مجانية حقاً ؟',
    faq_a2: 'نعم، مجانية 100%! موقعنا مستقل ويتم تمويله من خلال شراكات مع شركات الاتصالات. لن تدفع أي رسوم للموقع ولا يوجد أي التزام بالشراء.',
    faq_q3: 'هل الأسعار المعروضة محدثة ؟',
    faq_a3: 'نعم، نقوم بتحديث الأسعار والعروض الترويجية بشكل يومي وتلقائي من مواقع الشركات الرسمية لضمان دقة المعلومات.',
    faq_q4: 'هل يمكنني تغيير شركة الاتصالات بسهولة مع الاحتفاظ برقمي ؟',
    faq_a4: 'نعم بكل تأكيد! يمكنك الانتقال إلى مشغل آخر مع الاحتفاظ برقمك الحالي (خدمة Portabilité). يستغرق الأمر عادةً من يومين إلى 3 أيام عمل ونحن نرافقك في كافة الخطوات مجاناً.',
    faq_q5: 'ما الفرق بين الألياف البصرية (Fibre) والـ ADSL ؟',
    faq_a5: 'تمنحك الألياف البصرية سرعات فائقة تصل إلى 1 جيجابت في الثانية واستجابة سريعة جداً مثالية للألعاب والبث. أما الـ ADSL فسرعته محدودة بـ 20 ميجابت لكنه متوفر في كل مكان. اختبار السرعة لدينا سيساعدك على تحديد الخيار الأنسب.',
    faq_q6: 'كيف أستخدم اختبار سرعة الإنترنت ؟',
    faq_a6: 'اضغط على "اختبار السرعة" في القائمة العلوية. سيسجل نظامنا سرعة التحميل والرفع والاستجابة للإنترنت الحالي لديك ويرشح لك فوراً الترقية المناسبة وبسعر أرخص.',
    faq_q7: 'هل بياناتي الشخصية آمنة ؟',
    faq_a7: 'تماما. نستخدم تشفيراً آمناً ونحترم الخصوصية بشكل صارم. لن نبيع بياناتك أبداً، وتستخدم فقط لعرض التغطية والاشتراك المناسب بمدينتك.',
    faq_q8: 'هل تقدمون عروضاً خاصة بالشركات والمهنيين ؟',
    faq_a8: 'نعم! نقارن أيضاً عروض المهنيين والشركات: الألياف البصرية المخصصة، أساطيل الهواتف والحلول السحابية. يرجى اختيار "مهني/شركة" في بداية الاختبار.',

    // CTA
    cta_ready: 'مستعد لتخفيض فاتورة الإنترنت والهاتف ؟',
    cta_ready_desc: 'أجب عن 3 أسئلة سريعة واكتشف العروض الحصرية المناسبة لبيتك',
    cta_btn: 'ابدأ الاختبار الآن (60 ثانية)',

    // Promo Form Custom Extras
    promo_badge_b2b: 'خدمة الحسابات الكبرى',
    promo_badge_b2c: 'العروض المخفية النشطة',
    promo_success_check_b2b_1: 'تدقيق فاتورة الأسطول',
    promo_success_check_b2b_2: 'ألياف بصرية مخصصة للمقاولات',
    promo_success_check_b2b_3: 'أسعار الجملة الحصرية',
    promo_success_check_b2c_1: 'أهلية شبكة 4G/5G',
    promo_success_check_b2c_2: 'تغطية الألياف البصرية بالمنطقة',
    promo_success_check_b2c_3: 'العروض والتخفيضات السرية',
    promo_step2_name_b2b: 'اسم الشركة / جهة الاتصال',
    promo_step2_name_placeholder_b2b: 'مثال: حلول تقنية / ياسين',
    promo_step2_name_placeholder_b2c: 'مثال: ياسين ب.',
    promo_step2_city_placeholder: 'المدينة (مثال: الدار البيضاء)',
    promo_step2_phone_placeholder: '06 XX XX XX XX (لتلقي العروض)',
    phone_error_invalid: 'يرجى إدخال رقم هاتف صالح',
    promo_need_fibre: 'إنترنت الألياف البصرية (Fibre)',
    promo_need_mobile: 'اشتراك الهاتف المحمول',
    promo_need_adsl: 'إنترنت ADSL',
    promo_need_box: 'جهاز Box 4G/5G',
    promo_bill_less_100: 'أقل من 100 درهم / شهرياً',
    promo_bill_100_199: 'بين 100 و 199 درهم / شهرياً',
    promo_bill_200_299: 'بين 200 و 299 درهم / شهرياً',
    promo_bill_more_300: 'أكثر من 300 درهم / شهرياً',

    // Eligibility Checker
    elig_title: 'اختبار الأهلية الوطني للإنترنت',
    elig_subtitle: 'ما هي حاجتك الأساسية لبيتكم ؟',
    elig_need_fibre_title: 'الألياف البصرية (صبيب فائق السرعة)',
    elig_need_fibre_desc: 'مثالي لمشاهدة الفيديوهات والعمل والتعليم عن بعد',
    elig_need_adsl_title: 'إنترنت ADSL / خط عادي',
    elig_need_adsl_desc: 'أوسع تغطية وطنية في المغرب',
    elig_need_box_title: 'جهاز Box 4G / 5G (بدون أسلاك)',
    elig_need_box_desc: 'مثالي للمناطق التي لا تغطيها الألياف البصرية',
    elig_need_mobile_title: 'اشتراك هاتف محمول فقط',
    elig_need_mobile_desc: 'أفضل تغطية شبكة للمكالمات والإنترنت',
    elig_reason_title: 'ما هي وضعيتك الحالية ؟',
    elig_reason_desc: 'هذا يساعدنا على تحديد العروض والتخفيضات الأنسب لخطكم.',
    elig_reason_moving: 'سأنقل سكني قريباً',
    elig_reason_cheaper: 'أريد دفع مبلغ أقل للفاتورة',
    elig_reason_faster: 'صبيب الإنترنت الحالي لدي بطيء جداً',
    elig_reason_new: 'اشتراك جديد / أول جهاز إنترنت',
    elig_loc_title: 'أين يقع بيتكم ؟',
    elig_loc_desc: 'ابحث عن عنوانك أو ضع علامة تحديد الموقع على الخريطة بدقة.',
    elig_loc_btn: 'تأكيد موقع السكن',
    elig_contact_title: 'الخطوة الأخيرة',
    elig_contact_desc: 'أين نرسل لكم نتائج فحص التغطية والشبكة بالمنطقة ؟',
    elig_contact_secure: 'بياناتك الشخصية آمنة ومشفرة بالكامل وتستخدم فقط لإرسال التقرير.',
    elig_contact_name_placeholder: 'الاسم الكامل الخاص بكم',
    elig_contact_phone_placeholder: 'رقم هاتفكم المحمول',
    elig_contact_delay: 'المدة المرغوب فيها للتركيب',
    elig_delay_asap: 'في أقرب وقت ممكن (عاجل)',
    elig_delay_1month: 'خلال شهر',
    elig_delay_checking: 'مقارنة بسيطة فقط',
    elig_contact_comment: 'ملاحظات إضافية (اختياري)',
    elig_contact_comment_placeholder: 'مثال: أبحث عن سرعة للعب أونلاين، أو أحتاج عنوان IP ثابت...',
    elig_contact_btn: 'بدء اختبار التغطية والسرعة',
    elig_scan_title: 'جاري فحص وتحديد المواقع والشبكة...',
    elig_scan_desc: 'التحقق من العنوان: {address}',
    elig_scan_connecting: 'الاتصال بقواعد بيانات الفاعلين للاتصالات...',
    elig_res_title: 'انتهى فحص التغطية بنجاح !',
    elig_res_encrypted: 'بيانات مشفرة وآمنة',
    elig_res_verified: 'موقع مؤكد ومطابق',
    elig_res_desc: 'موقعكم ({address}) مغطى تماماً بالإنترنت ذي الصبيب فائق السرعة.',
    elig_res_advisor_title: 'مستشار اتصالات سيتواصل معكم قريباً',
    elig_res_advisor_desc: '"سيقوم خبير بتحليل دقيق للتمديدات الخارجية لبيتكم وتقديم أفضل عرض تخفيض حصري خلال 24 ساعة."',
    elig_res_btn: 'كشف الأسعار المخفية الحصرية'
  }
};
