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
  | 'elig_res_btn'

  // Offers Page
  | 'offers_title'
  | 'offers_subtitle'
  | 'offers_filters'
  | 'offers_category'
  | 'offers_all'
  | 'offers_internet_only'
  | 'offers_mobile_only'
  | 'offers_operator'
  | 'offers_all_ops'
  | 'offers_sort_by'
  | 'offers_sort_price_asc'
  | 'offers_sort_price_desc'
  | 'offers_sort_speed_desc'
  | 'offers_none_found'
  | 'offers_none_found_desc'
  | 'offers_best_choice'
  | 'offers_locked_badge'
  | 'offers_locked_title'
  | 'offers_locked_desc'
  | 'offers_locked_check_1'
  | 'offers_locked_check_2'

  // Offer Card
  | 'card_unlimited'
  | 'card_pro_quote'
  | 'card_view_offer'
  | 'card_order'
  | 'card_added_compare'
  | 'card_compare'
  | 'card_max_compare_alert'
  | 'card_data'
  | 'card_calls'
  | 'card_techno'
  | 'card_per_month'

  // Compare Page
  | 'compare_title'
  | 'compare_subtitle'
  | 'compare_back'
  | 'compare_loading'
  | 'compare_criterion'
  | 'compare_price'
  | 'compare_category'
  | 'compare_download'
  | 'compare_upload'
  | 'compare_tech'
  | 'compare_data'
  | 'compare_calls'
  | 'compare_setup'
  | 'compare_commitment'
  | 'compare_subscribe'
  | 'compare_add_more'

  // Results Page
  | 'res_personalized'
  | 'res_title'
  | 'res_at_city'
  | 'res_subtitle'
  | 'res_loading'
  | 'res_not_convinced'
  | 'res_not_convinced_desc'
  | 'res_btn_all'
  | 'res_btn_redo'
  | 'res_match_score'
  | 'res_reason_family'
  | 'res_reason_fastest'
  | 'res_reason_cheapest'
  | 'res_reason_best_value'
  | 'res_reason_default'

  // Quiz Page
  | 'quiz_step_title'
  | 'quiz_city_title'
  | 'quiz_city_question'
  | 'quiz_city_placeholder'
  | 'quiz_lead_title'
  | 'quiz_lead_desc'
  | 'quiz_lead_name'
  | 'quiz_lead_name_placeholder'
  | 'quiz_lead_phone'
  | 'quiz_lead_email'
  | 'quiz_lead_address'
  | 'quiz_lead_address_placeholder'
  | 'quiz_lead_consent'
  | 'quiz_lead_btn'
  | 'quiz_lead_preparing'
  | 'quiz_skip'
  | 'quiz_q1_question'
  | 'quiz_q1_o1_label'
  | 'quiz_q1_o1_desc'
  | 'quiz_q1_o2_label'
  | 'quiz_q1_o2_desc'
  | 'quiz_q1_o3_label'
  | 'quiz_q1_o3_desc'
  | 'quiz_q2_question'
  | 'quiz_q2_o1_label'
  | 'quiz_q2_o1_desc'
  | 'quiz_q2_o2_label'
  | 'quiz_q2_o2_desc'
  | 'quiz_q2_o3_label'
  | 'quiz_q2_o3_desc'
  | 'quiz_q2_o4_label'
  | 'quiz_q2_o4_desc'
  | 'quiz_q3_question'
  | 'quiz_q3_o1_label'
  | 'quiz_q3_o1_desc'
  | 'quiz_q3_o2_label'
  | 'quiz_q3_o2_desc'
  | 'quiz_q3_o3_label'
  | 'quiz_q3_o3_desc'

  // Contact Page
  | 'contact_title'
  | 'contact_title_highlight'
  | 'contact_desc'
  | 'contact_hq'
  | 'contact_hq_desc'
  | 'contact_need_help'
  | 'contact_need_help_desc'
  | 'contact_btn_start'
  | 'contact_form_title'
  | 'contact_form_name'
  | 'contact_form_name_placeholder'
  | 'contact_form_email'
  | 'contact_form_email_placeholder'
  | 'contact_form_subject'
  | 'contact_form_subject_placeholder'
  | 'contact_form_message'
  | 'contact_form_message_placeholder'
  | 'contact_form_btn'
  | 'contact_success_title'
  | 'contact_success_desc'
  | 'contact_success_another'
  | 'contact_error'

  // Speedtest Page
  | 'speed_title'
  | 'speed_subtitle'
  | 'speed_btn_run'
  | 'speed_testing'
  | 'speed_phase_ping'
  | 'speed_phase_download'
  | 'speed_phase_upload'
  | 'speed_phase_complete'
  | 'speed_download'
  | 'speed_upload'
  | 'speed_ping'
  | 'speed_jitter'
  | 'speed_res_title'
  | 'speed_res_good'
  | 'speed_res_medium'
  | 'speed_res_bad'
  | 'speed_form_title'
  | 'speed_form_desc'
  | 'speed_form_name'
  | 'speed_form_phone'
  | 'speed_form_city'
  | 'speed_form_address'
  | 'speed_form_reason'
  | 'speed_form_reason_slow'
  | 'speed_form_reason_price'
  | 'speed_form_reason_moving'
  | 'speed_form_reason_first'
  | 'speed_form_timing'
  | 'speed_form_timing_asap'
  | 'speed_form_timing_1month'
  | 'speed_form_timing_checking'
  | 'speed_form_btn'
  | 'speed_form_success'
  | 'speed_form_success_desc'
  | 'speed_card1_title'
  | 'speed_card1_desc'
  | 'speed_card2_title'
  | 'speed_card2_desc'
  | 'speed_card3_title'
  | 'speed_card3_desc'

  // Confiance Page
  | 'conf_title'
  | 'conf_desc'
  | 'conf_sec1_title'
  | 'conf_sec1_p1'
  | 'conf_sec1_p2'
  | 'conf_sec2_title'
  | 'conf_sec2_p1'
  | 'conf_sec2_quote'
  | 'conf_sec3_title_obj'
  | 'conf_sec3_desc_obj'
  | 'conf_sec3_title_trans'
  | 'conf_sec3_desc_trans'
  | 'conf_sec4_title'
  | 'conf_sec4_desc'
  | 'conf_sec4_btn'

  // Partenaires Page
  | 'part_title'
  | 'part_desc'
  | 'part_btn_partner'
  | 'part_sec1_title'
  | 'part_sec1_desc'
  | 'part_sec1_btn'
  | 'part_sec2_title'
  | 'part_sec2_desc'
  | 'part_sec2_btn'
  | 'part_sec3_title'
  | 'part_sec3_desc'

  // Eligibilite Page
  | 'elig_page_surtitle'
  | 'elig_page_title'
  | 'elig_page_desc'
  | 'elig_page_secure'
  | 'elig_page_stat'
  | 'elig_page_why'
  | 'elig_page_reason1_title'
  | 'elig_page_reason1_desc'
  | 'elig_page_reason2_title'
  | 'elig_page_reason2_desc'
  | 'elig_page_reason3_title'
  | 'elig_page_reason3_desc'

  // Observatoire Page
  | 'obs_surtitle'
  | 'obs_title'
  | 'obs_desc'
  | 'obs_avg_fibre'
  | 'obs_analyzed'
  | 'obs_live'
  | 'obs_overcharge'
  | 'obs_chart_title'
  | 'obs_chart_desc'
  | 'obs_press_title'
  | 'obs_press_desc'
  | 'obs_press_btn'

  // Offres details slug Page
  | 'detail_home'
  | 'detail_offers'
  | 'detail_loading'
  | 'detail_not_found'
  | 'detail_advantages'
  | 'detail_price_label'
  | 'detail_verify_btn'
  | 'detail_free_note'
  | 'detail_desc'

  // CookieConsent & Widgets
  | 'cookie_title'
  | 'cookie_desc'
  | 'cookie_accept'
  | 'cookie_refuse'
  | 'compbar_selected'
  | 'compbar_add_more'
  | 'compbar_max'
  | 'compbar_clear'
  | 'compbar_btn'
  | 'sticky_btn'
  | 'recent_title'
  | 'toast_save'
  | 'toast_from'
  | 'toast_action_0'
  | 'toast_action_1'
  | 'toast_action_2'
  | 'toast_action_3'
  | 'consent_checkbox_label'
  | 'consent_checkbox_error'

  // Missing Offers
  | 'offers_title_all'
  | 'offers_search_placeholder'
  | 'offers_results_count'
  | 'offers_sort_recommended'
  | 'offers_sort_data_desc'
  | 'offers_no_results'
  | 'offers_adjust_filters'
  | 'offers_reset_filters'

  // Missing Results
  | 'results_alternatives'
  | 'results_alternatives_desc'
  | 'results_analyzing'
  | 'results_analyzing_desc'
  | 'results_best_match'
  | 'results_claim_btn'
  | 'results_claim_short'
  | 'results_next_steps'
  | 'results_promo_desc'
  | 'results_promo_title'
  | 'results_step1_desc'
  | 'results_step1_title'
  | 'results_step2_desc'
  | 'results_step2_title'
  | 'results_step3_desc'
  | 'results_step3_title'
  | 'results_subtitle'
  | 'results_success_badge'
  | 'results_title'
  | 'results_whatsapp_msg';

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
    hero_surtitle: "Comparateur indépendant des offres télécom au Maroc",
    hero_title_normal: "Comparez les offres",
    hero_title_highlight: "Internet et mobile au Maroc.",
    hero_desc: "Consultez les tarifs publics des opérateurs, puis demandez une mise en relation si vous le souhaitez. Les prix et l'éligibilité sont à confirmer.",
    hero_approved: "Tarifs publics avec liens vers les opérateurs",
    hero_free: '100% Gratuit',
    hero_no_commitment: 'Sans Engagement',
    hero_speed: "Parcours simple",
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
    promo_title_b2c: "Comparer les offres Internet et mobile",
    promo_desc_b2c: "Indiquez votre besoin et votre ville pour consulter les tarifs publics et demander une mise en relation avec votre accord.",
    promo_title_b2b: "Demander une offre télécom entreprise",
    promo_desc_b2b: "Précisez vos besoins professionnels. Nous enregistrons votre demande et recherchons un partenaire adapté, sans promesse de réduction.",
    promo_savings: "Économie éventuelle selon l'offre et votre situation",
    promo_timer: "Tarifs susceptibles d'évoluer",
    promo_step1_label1: '1. Que recherchez-vous ?',
    promo_step1_label2: '2. Combien payez-vous actuellement ?',
    promo_btn_continue: 'Continuer',
    promo_btn_back: 'Retour',
    promo_btn_submit_b2c: "Consulter les offres disponibles",
    promo_btn_submit_b2b: 'Demander le devis gratuit',
    promo_btn_submitting: "Enregistrement...",
    promo_secure: "Transmission de vos coordonnées uniquement avec votre accord",
    promo_step2_name: 'Nom Complet',
    promo_step2_city: 'Ville',
    promo_step2_phone: 'Numéro de téléphone',
    promo_step2_phone_desc: "Numéro utilisé pour vous recontacter si un partenaire correspondant à votre demande est disponible.",
    promo_success_title_b2c: "Demande enregistrée",
    promo_success_desc_b2c: "Votre demande a été reçue. Vous pouvez consulter les offres publiques.",
    promo_success_title_b2b: "Demande professionnelle enregistrée",
    promo_success_desc_b2b: "Votre demande a été enregistrée. Une prise de contact dépend de la disponibilité d'un partenaire.",

    // Footer
    footer_desc: "Comparez les offres publiées par Orange Maroc, inwi et Maroc Telecom. Les tarifs et la couverture doivent être confirmés avant toute souscription.",
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
    faq_a1: "MonForfait.ma présente une sélection d'offres publiques et aide à exprimer un besoin. Les tarifs sont sourcés et la couverture doit être vérifiée auprès de l'opérateur.",
    faq_q2: 'Est-ce vraiment gratuit ?',
    faq_a2: "La consultation est gratuite. Une mise en relation peut donner lieu à une rémunération de MonForfait.ma par un partenaire, uniquement dans le cadre d'un accord approprié.",
    faq_q3: 'Les prix sont-ils à jour ?',
    faq_a3: "Les fiches indiquent la source officielle et la date de vérification. Les prix peuvent changer : confirmez toujours le tarif avant de souscrire.",
    faq_q4: 'Puis-je changer d\'opérateur facilement ?',
    faq_a4: "Les conditions de changement d'opérateur et de portabilité dépendent de votre contrat et du service concerné. Vérifiez les démarches auprès de votre opérateur.",
    faq_q5: 'Quelle différence entre Fibre et ADSL ?',
    faq_a5: 'La fibre optique (FTTH) offre des vitesses jusqu\'à 1 Gbps avec une latence très faible, idéale pour le streaming 4K et le gaming. L\'ADSL est limité à ~20 Mbps mais disponible partout. Notre speed test vous aide à savoir ce dont vous avez besoin.',
    faq_q6: 'Comment utiliser le speed test ?',
    faq_a6: "Notre page Speed Test renvoie à un outil de mesure réel externe. Un résultat dépend de votre appareil, de votre réseau et des conditions de test.",
    faq_q7: 'Mes données sont-elles protégées ?',
    faq_a7: "Vos coordonnées sont protégées et ne sont communiquées à un opérateur ou distributeur partenaire qu'avec votre accord explicite. Consultez notre politique de confidentialité.",
    faq_q8: 'Proposez-vous des forfaits Pro ?',
    faq_a8: "Vous pouvez demander une offre professionnelle ; la disponibilité d'un partenaire et du service demandé doit être confirmée.",

    // CTA
    cta_ready: 'Prêt à économiser sur votre facture ?',
    cta_ready_desc: 'Répondez à 3 questions et découvrez vos offres personnalisées',
    cta_btn: 'Commencer maintenant (60 sec)',

    // Promo Form Custom Extras
    promo_badge_b2b: "Demandes professionnelles",
    promo_badge_b2c: "Comparer avant de souscrire",
    promo_success_check_b2b_1: "Besoin professionnel pris en compte",
    promo_success_check_b2b_2: "Couverture à confirmer",
    promo_success_check_b2b_3: "Devis sous réserve de partenaire",
    promo_success_check_b2c_1: "Comparaison des tarifs publics",
    promo_success_check_b2c_2: "Couverture à confirmer",
    promo_success_check_b2c_3: "Conditions auprès de l'opérateur",
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
    elig_reason_desc: "Votre situation nous aide à comprendre la nature de votre demande.",
    elig_reason_moving: 'Je déménage prochainement',
    elig_reason_cheaper: 'Je veux payer moins cher',
    elig_reason_faster: 'Mon débit actuel est trop lent',
    elig_reason_new: 'Nouveau raccordement / 1ère box',
    elig_loc_title: 'Où habitez-vous ?',
    elig_loc_desc: 'Recherchez votre adresse puis glissez le marqueur pour ajuster précisément votre position.',
    elig_loc_btn: "Confirmer l'adresse",
    elig_contact_title: 'Dernière étape',
    elig_contact_desc: "Comment un partenaire peut-il vous joindre pour étudier votre demande ?",
    elig_contact_secure: "Vos coordonnées ne seront communiquées à un partenaire qu'avec votre accord explicite.",
    elig_contact_name_placeholder: 'Votre nom complet',
    elig_contact_phone_placeholder: 'Votre numéro de téléphone',
    elig_contact_delay: 'Délai souhaité',
    elig_delay_asap: 'Dès que possible (Urgent)',
    elig_delay_1month: "D'ici 1 mois",
    elig_delay_checking: 'Simple comparaison',
    elig_contact_comment: 'Commentaire (Optionnel)',
    elig_contact_comment_placeholder: "Ex: Je cherche la fibre pour du gaming, ou j'ai besoin d'une IP fixe...",
    elig_contact_btn: "Envoyer ma demande",
    elig_scan_title: "Demande en cours d'enregistrement",
    elig_scan_desc: "Enregistrement de la demande pour {address}",
    elig_scan_connecting: "Enregistrement en cours...",
    elig_res_title: 'Analyse Terminée !',
    elig_res_encrypted: 'Data encrypted',
    elig_res_verified: 'Verified Address',
    elig_res_desc: "Votre demande pour {address} a été enregistrée. La couverture reste à confirmer par un opérateur.",
    elig_res_advisor_title: 'Un conseiller vous contactera',
    elig_res_advisor_desc: '"Un expert va analyzer les raccordements exacts devant votre porte et vous proposera les offres de rétention exclusives sous 24h."',
    elig_res_btn: "Comparer les tarifs publics",

    // Offers Page
    offers_title: 'Toutes les offres au Maroc',
    offers_subtitle: "{count} offres consultables • Tarifs publics indicatifs",
    offers_filters: 'Filtres',
    offers_category: 'Catégorie',
    offers_all: 'Toutes',
    offers_internet_only: 'Internet uniquement',
    offers_mobile_only: 'Mobile uniquement',
    offers_operator: 'Opérateur',
    offers_all_ops: 'Tous',
    offers_sort_by: 'Trier par',
    offers_sort_price_asc: 'Prix croissant',
    offers_sort_price_desc: 'Prix décroissant',
    offers_sort_speed_desc: 'Vitesse/Data décroissant',
    offers_none_found: 'Aucune offre trouvée',
    offers_none_found_desc: 'Essayez de modifier vos filtres',
    offers_best_choice: 'Meilleur Choix',
    offers_locked_badge: "Vérifier avant de souscrire",
    offers_locked_title: "Consultez des tarifs et demandez une mise en relation",
    offers_locked_desc: "Les tarifs et la disponibilité doivent être confirmés par chaque opérateur. Aucune offre secrète n'est garantie.",
    offers_locked_check_1: "Comparaison gratuite",
    offers_locked_check_2: "Conditions confirmées auprès de l'opérateur",

    // Offer Card
    card_unlimited: 'Illimité',
    card_pro_quote: 'Demander un devis',
    card_view_offer: "Voir l'offre",
    card_order: 'Commander',
    card_added_compare: 'Ajouté à la comparaison',
    card_compare: 'Comparer',
    card_max_compare_alert: 'Maximum 3 offres pour la comparaison',
    card_data: 'Data',
    card_calls: 'Appels',
    card_techno: 'Techno',
    card_per_month: 'mois',

    // Compare Page
    compare_title: 'Comparaison des offres',
    compare_subtitle: "Comparez jusqu'à 3 forfaits côte à côte",
    compare_back: 'Retour aux offres',
    compare_loading: 'Chargement de la comparaison...',
    compare_criterion: 'Critère',
    compare_price: 'Prix mensuel',
    compare_category: 'Catégorie',
    compare_download: 'Débit descendant',
    compare_upload: 'Débit montant',
    compare_tech: 'Technologie',
    compare_data: 'Data mobile',
    compare_calls: 'Appels',
    compare_setup: "Frais d'installation",
    compare_commitment: 'Engagement',
    compare_subscribe: 'Souscrire',
    compare_add_more: "Ajouter plus d'offres à la comparaison",

    // Results Page
    res_personalized: 'Résultats personnalisés',
    res_title: 'Vos offres sur mesure',
    res_at_city: 'à {city}',
    res_subtitle: 'Basé sur vos réponses, voici les {count} meilleures options pour vous',
    res_loading: 'Analyse de vos besoins...',
    res_not_convinced: 'Pas convaincu ?',
    res_not_convinced_desc: 'Parcourez toutes nos offres ou refaites le quiz pour affiner vos résultats',
    res_btn_all: 'Voir toutes les offres',
    res_btn_redo: 'Refaire le quiz',
    res_match_score: '{score}% de correspondance',
    res_reason_family: 'Idéal pour votre famille : la fibre garantit 0 coupure même si tous les appareils sont connectés.',
    res_reason_fastest: 'Recommandé pour la vitesse : {speed} Mbps pour télécharger instantanément.',
    res_reason_cheapest: "Meilleur budget : l'offre la plus économique à seulement {price} DH.",
    res_reason_best_value: 'Rapport qualité/prix imbattable avec appels illimités inclus.',
    res_reason_default: 'Excellente offre correspondant à votre profil de consommation.',

    // Quiz Page
    quiz_step_title: 'Étape {step} sur {total}',
    quiz_city_title: 'Dernière étape !',
    quiz_city_question: 'Dans quelle ville êtes-vous situé ?',
    quiz_city_placeholder: 'Ex: Casablanca, Rabat, Marrakech...',
    quiz_lead_title: 'Vos offres sont prêtes !',
    quiz_lead_desc: 'Pour accéder à vos recommandations personnalisées, complétez ces informations',
    quiz_lead_name: 'Nom complet *',
    quiz_lead_name_placeholder: 'Votre nom',
    quiz_lead_phone: 'Téléphone *',
    quiz_lead_email: 'Email *',
    quiz_lead_address: 'Adresse complète *',
    quiz_lead_address_placeholder: 'Numéro, rue, quartier, ville',
    quiz_lead_consent: "En continuant, j'accepte de recevoir des offres personnalisées par email, SMS ou téléphone. Je peux me désinscrire à tout moment.",
    quiz_lead_btn: 'Voir mes offres personnalisées',
    quiz_lead_preparing: 'Préparation de vos offres...',
    quiz_skip: 'Passer et parcourir toutes les offres →',
    quiz_q1_question: 'De quoi avez-vous besoin ?',
    quiz_q1_o1_label: 'Internet (Fibre/Box)',
    quiz_q1_o1_desc: 'Pour la maison ou le bureau',
    quiz_q1_o2_label: 'Forfait Mobile',
    quiz_q1_o2_desc: 'Appels, SMS, Data',
    quiz_q1_o3_label: 'Les deux',
    quiz_q1_o3_desc: 'Pack complet',
    quiz_q2_question: 'Qui va utiliser le service ?',
    quiz_q2_o1_label: 'Juste moi',
    quiz_q2_o1_desc: '1 personne',
    quiz_q2_o2_label: 'Ma famille',
    quiz_q2_o2_desc: '2-5 personnes',
    quiz_q2_o3_label: 'Petit bureau',
    quiz_q2_o3_desc: '5-20 employés',
    quiz_q2_o4_label: 'Entreprise',
    quiz_q2_o4_desc: '+20 employés',
    quiz_q3_question: 'Quelle est votre priorité ?',
    quiz_q3_o1_label: 'Le moins cher',
    quiz_q3_o1_desc: 'Budget serré',
    quiz_q3_o2_label: 'Le plus rapide',
    quiz_q3_o2_desc: 'Performance max',
    quiz_q3_o3_label: 'Meilleur rapport qualité/prix',
    quiz_q3_o3_desc: 'Équilibre',

    // Contact Page
    contact_title: 'Parlons de votre',
    contact_title_highlight: 'projet',
    contact_desc: 'Une question sur un forfait ? Un projet de partenariat ? Notre équipe est à votre écoute pour vous accompagner.',
    contact_hq: 'Siège Social',
    contact_hq_desc: 'Casablanca, Maroc',
    contact_need_help: "Besoin d'aide immédiate ?",
    contact_need_help_desc: 'Utilisez notre comparateur intelligent pour trouver la meilleure offre en moins de 2 minutes.',
    contact_btn_start: 'Démarrer le Quiz',
    contact_form_title: 'Envoyez-nous un message',
    contact_form_name: 'Nom complet',
    contact_form_name_placeholder: 'Votre nom',
    contact_form_email: 'Email',
    contact_form_email_placeholder: 'votre@email.com',
    contact_form_subject: 'Sujet',
    contact_form_subject_placeholder: 'Ex: Partenariat, Problème technique...',
    contact_form_message: 'Votre message',
    contact_form_message_placeholder: 'Comment pouvons-nous vous aider ?',
    contact_form_btn: 'Envoyer mon message',
    contact_success_title: 'Message envoyé !',
    contact_success_desc: 'Merci de nous avoir contactés. Nous reviendrons vers vous dans les plus brefs délais sur {email}.',
    contact_success_another: 'Envoyer un autre message',
    contact_error: 'Une erreur est survenue. Veuillez réessayer plus tard.',

    // Speedtest Page
    speed_title: 'Testez votre vitesse Internet',
    speed_subtitle: 'Mesurez votre download, upload et ping en un clic pour savoir si vous êtes surfacturé.',
    speed_btn_run: 'Lancer le Test',
    speed_testing: 'Test en cours...',
    speed_phase_ping: 'Mesure du Ping...',
    speed_phase_download: 'Mesure du Téléchargement...',
    speed_phase_upload: "Mesure de l'Envoi...",
    speed_phase_complete: 'Analyse des résultats...',
    speed_download: 'Téléchargement',
    speed_upload: 'Envoi (Upload)',
    speed_ping: 'Ping',
    speed_jitter: 'Jitter',
    speed_res_title: "Analyse de votre débit par l'IA",
    speed_res_good: 'Votre connexion est excellente !',
    speed_res_medium: 'Connexion moyenne. Vous pourriez avoir de la Fibre pour le même prix.',
    speed_res_bad: 'Débit insuffisant. Votre opérateur vous surfacture par rapport aux débits actuels.',
    speed_form_title: 'Vérifiez si la Fibre est disponible chez vous',
    speed_form_desc: 'Remplissez ce formulaire pour planifier un raccordement ou négocier un meilleur forfait.',
    speed_form_name: 'Nom complet',
    speed_form_phone: 'Téléphone',
    speed_form_city: 'Ville',
    speed_form_address: 'Adresse complète',
    speed_form_reason: 'Motif du test',
    speed_form_reason_slow: 'Mon débit actuel est trop lent',
    speed_form_reason_price: 'Je veux payer moins cher',
    speed_form_reason_moving: 'Je déménage prochainement',
    speed_form_reason_first: 'Premier abonnement Fibre',
    speed_form_timing: 'Délai souhaité',
    speed_form_timing_asap: 'Dès que possible (Urgent)',
    speed_form_timing_1month: "D'ici 1 mois",
    speed_form_timing_checking: 'Simple comparaison',
    speed_form_btn: 'Vérifier mon éligibilité',
    speed_form_success: 'Demande enregistrée !',
    speed_form_success_desc: 'Un conseiller va analyser votre éligibilité et vous recontactera sous peu.',
    speed_card1_title: 'Hyper-Précis',
    speed_card1_desc: 'Algorithme de mesure multi-point pour une précision chirurgicale.',
    speed_card2_title: 'Audit Fibre',
    speed_card2_desc: 'Vérification technique de raccordement incluse après le test.',
    speed_card3_title: 'Totalement Gratuit',
    speed_card3_desc: 'Service offert par notre plateforme pour garantir votre confort.',

    // Confiance Page
    conf_title: 'Votre Allié Telecom Indépendant',
    conf_desc: 'Chez MonForfait.ma, notre mission est simple : aider chaque Marocain à payer le juste prix pour sa connexion.',
    conf_sec1_title: 'Indépendance Totale',
    conf_sec1_p1: "Contrairement aux sites d'opérateurs, nous ne sommes pas là pour vous vendre un forfait spécifique. Nous sommes un média indépendant. Notre algorithme de comparaison classe les offres selon des critères objectifs : prix, volume data, durée d'engagement et qualité réseau.",
    conf_sec1_p2: "Nous n'appartenons à aucun opérateur. Ni IAM, ni Orange, ni Inwi ne dictent nos classements.",
    conf_sec2_title: 'Notre Modèle Économique',
    conf_sec2_p1: "Pour maintenir ce service gratuit pour vous, nous utilisons l'affiliation. Lorsqu'un utilisateur souscrit à un abonnement après avoir cliqué sur un lien de notre site, l'opérateur nous verse parfois une commission.",
    conf_sec2_quote: "Cette commission n'augmente jamais le prix de votre forfait. Au contraire, nous négocions souvent des offres exclusives pour nos lecteurs.",
    conf_sec3_title_obj: 'Objectivité',
    conf_sec3_desc_obj: 'Nous listons TOUS les forfaits disponibles sur le marché, même ceux pour lesquels nous ne touchons aucune commission.',
    conf_sec3_title_trans: 'Transparence',
    conf_sec3_desc_trans: 'Si une offre est sponsorisée, elle est clairement identifiée par un label "Annonce". Elle n\'influence pas les résultats de vos recherches personnalisées.',
    conf_sec4_title: 'On se bat pour vous',
    conf_sec4_desc: 'Un problème avec un opérateur ? Un doute sur vos frais de résiliation ? Nos experts surveillent le marché quotidiennement pour dénoncer les abus.',
    conf_sec4_btn: "Besoin d'aide ? Contactez un expert sur WhatsApp",

    // Missing Offers & Results
    offers_title_all: 'Toutes les offres',
    offers_search_placeholder: 'Rechercher une offre...',
    offers_results_count: '{count} offres trouvées',
    offers_sort_recommended: 'Recommandé',
    offers_sort_data_desc: 'Data décroissant',
    offers_no_results: 'Aucun résultat',
    offers_adjust_filters: 'Veuillez ajuster vos filtres.',
    offers_reset_filters: 'Réinitialiser les filtres',
    results_alternatives: 'Alternatives',
    results_alternatives_desc: 'Voici quelques alternatives',
    results_analyzing: 'Analyse en cours',
    results_analyzing_desc: 'Veuillez patienter...',
    results_best_match: 'Meilleur match',
    results_claim_btn: 'Réclamer cette offre',
    results_claim_short: 'Réclamer',
    results_next_steps: 'Prochaines étapes',
    results_promo_desc: 'Promotion exclusive',
    results_promo_title: 'Offre Promo',
    results_step1_desc: 'Description étape 1',
    results_step1_title: 'Étape 1',
    results_step2_desc: 'Description étape 2',
    results_step2_title: 'Étape 2',
    results_step3_desc: 'Description étape 3',
    results_step3_title: 'Étape 3',
    results_subtitle: 'Vos résultats',
    results_success_badge: 'Succès',
    results_title: 'Résultats',
    results_whatsapp_msg: 'Envoyer sur WhatsApp',

    // Partenaires Page
    part_title: 'Programme Partenaires & Médias',
    part_desc: "Opérateurs, distributeurs agréés et intégrateurs télécom : échangeons sur des pilotes d'acquisition mesurables, sans promesse de volume ni de conversion.",
    part_btn_partner: 'Devenir Partenaire',
    part_sec1_title: 'Intégration du Widget (Dofollow)',
    part_sec1_desc: 'Vous gérez un blog tech ou un site d\'actualité marocaine ? Intégrez notre widget "Test d\'éligibilité" sur vos pages. En échange, le widget contient un lien Dofollow naturel vers notre site, ce qui renforce nos SEO respectifs.',
    part_sec1_btn: 'Voir le widget',
    part_sec2_title: 'Échange d\'Articles & Backlinks',
    part_sec2_desc: 'Nous sommes ouverts aux articles invités (Guest Blogging) et aux échanges d\'articles de qualité (DR > 20). Nous publions sur le thème des télécoms, de l\'internet et des technologies au Maroc.',
    part_sec2_btn: 'Proposer un échange',
    part_sec3_title: 'Données de l\'Observatoire',
    part_sec3_desc: 'Journalistes et analystes : vous pouvez utiliser librement les données de notre Observatoire des Prix dans vos publications, à condition de citer MonForfait.ma avec un lien hypertexte direct.',

    // Eligibilite Page
    elig_page_surtitle: "Demande de vérification de couverture",
    elig_page_title: "La fibre est-elle disponible à votre adresse ?",
    elig_page_desc: "Décrivez votre besoin et votre adresse pour demander à un opérateur ou distributeur de confirmer la couverture. Aucun test technique instantané n'est effectué sur cette page.",
    elig_page_secure: "Transmission avec votre accord",
    elig_page_stat: "Éligibilité à confirmer",
    elig_page_why: 'Pourquoi tester votre éligibilité ?',
    elig_page_reason1_title: "Clarifiez votre besoin",
    elig_page_reason1_desc: "Expliquez votre usage, votre ville et votre délai de raccordement.",
    elig_page_reason2_title: "Comparez les prix publics",
    elig_page_reason2_desc: "Consultez les tarifs affichés sur les sites officiels des opérateurs, sans promotions privées inventées.",
    elig_page_reason3_title: "Vérification par un partenaire",
    elig_page_reason3_desc: "Si un partenaire est disponible, il pourra confirmer la couverture et les conditions du raccordement.",

    // Observatoire Page
    obs_surtitle: "Tarifs publics vérifiés",
    obs_title: "Observatoire des offres télécom",
    obs_desc: "Un aperçu des offres publiques référencées, sans prétendre mesurer les factures privées ou les économies réelles des consommateurs.",
    obs_avg_fibre: 'Prix Moyen Fibre (100M)',
    obs_analyzed: 'Factures Analysées',
    obs_live: 'En direct',
    obs_overcharge: 'Surfacturation Estimée (Maroc)',
    obs_chart_title: 'Évolution des prix cachés (Fibre Optique)',
    obs_chart_desc: "Comparaison ponctuelle des tarifs publics référencés. Aucune série historique n'est inférée.",
    obs_press_title: 'Presse & Médias : Intégrez nos données',
    obs_press_desc: 'Nos données sont accessibles en Open Data pour les journalistes. Citez \'Source: MonForfait.ma\' avec un lien hypertexte pour réutiliser nos analyses.',
    obs_press_btn: 'Accéder à l\'API Presse',

    // Offres details slug Page
    detail_home: 'Accueil',
    detail_offers: 'Offres',
    detail_loading: 'Chargement...',
    detail_not_found: 'Offre Introuvable',
    detail_advantages: 'Avantages de cette offre',
    detail_price_label: 'Prix Mensuel',
    detail_verify_btn: "Vérifier l'éligibilité",
    detail_free_note: '100% gratuit • Réponse immédiate',
    detail_desc: 'Découvrez en détail le forfait {name} de {provider}. Idéal pour vos besoins en télécommunication, cette offre est conçue pour offrir le meilleur rapport qualité/prix au Maroc.',

    // CookieConsent & Widgets
    cookie_title: 'Cookies 🍪',
    cookie_desc: 'Nous utilisons des cookies pour analyser le trafic et personnaliser votre expérience.',
    cookie_accept: 'Accepter',
    cookie_refuse: 'Refuser',
    compbar_selected: '{count} offre{plural} sélectionnée{plural}',
    compbar_add_more: "Ajoutez jusqu'à {count} offre{plural} supplémentaire{plural}",
    compbar_max: 'Maximum atteint',
    compbar_clear: 'Tout effacer',
    compbar_btn: 'Comparer maintenant',
    sticky_btn: 'Voir mes promos cachées',
    recent_title: 'Vu récemment',
    toast_save: 'Économie: {save} DH / mois !',
    toast_from: 'de',
    toast_action_0: 'vient de débloquer une offre secrète Fibre',
    toast_action_1: 'a économisé sur son forfait mobile',
    toast_action_2: 'vient de comparer les offres ADSL',
    toast_action_3: 'a trouvé un forfait Pro 50% moins cher',
    consent_checkbox_label: "J'accepte d'être recontacté(e) par téléphone par un conseiller de monforfait.ma pour affiner ma recherche. Mes données sont traitées conformément à notre politique de confidentialité et à la loi 09-08.",
    consent_checkbox_error: "Vous devez accepter d'être recontacté pour continuer.",
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
    hero_surtitle: "مقارنة مستقلة لعروض الاتصالات في المغرب",
    hero_title_normal: "قارن عروض",
    hero_title_highlight: "الإنترنت والهاتف في المغرب",
    hero_desc: "اطّلع على الأسعار المعلنة لدى المشغلين، ثم اطلب التواصل مع شريك بموافقتك. يجب تأكيد السعر والتغطية قبل الاشتراك.",
    hero_approved: "تعرف على مصادر الأسعار الرسمية",
    hero_free: 'مجاني 100%',
    hero_no_commitment: 'بدون التزام',
    hero_speed: "خطوات بسيطة",
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
    promo_title_b2c: "قارن عروض الإنترنت والهاتف",
    promo_desc_b2c: "حدد حاجتك ومدينتك للاطلاع على الأسعار المعلنة وطلب التواصل بموافقتك.",
    promo_title_b2b: "طلب عرض اتصالات للمقاولات",
    promo_desc_b2b: "وضح احتياجات شركتك. نسجل الطلب ونبحث عن شريك مناسب دون ضمان تخفيض محدد.",
    promo_savings: "التوفير المحتمل يعتمد على العرض والظروف",
    promo_timer: "قد تتغير الأسعار",
    promo_step1_label1: '1. ما الذي تبحث عنه ؟',
    promo_step1_label2: '2. كم تدفع حالياً شهرياً ؟',
    promo_btn_continue: 'استمرار',
    promo_btn_back: 'رجوع',
    promo_btn_submit_b2c: "عرض الأسعار المتاحة",
    promo_btn_submit_b2b: 'طلب تسعيرة مجانية',
    promo_btn_submitting: "جارٍ التسجيل...",
    promo_secure: "لا تتم مشاركة بياناتك إلا بموافقتك",
    promo_step2_name: 'الاسم الكامل',
    promo_step2_city: 'المدينة',
    promo_step2_phone: 'رقم الهاتف',
    promo_step2_phone_desc: "يستخدم رقمك للتواصل معك إذا توفر شريك مناسب لطلبك.",
    promo_success_title_b2c: "تم تسجيل طلبك",
    promo_success_desc_b2c: "تم تسجيل طلبك. يمكنك الآن مقارنة الأسعار العامة.",
    promo_success_title_b2b: "تم تسجيل طلب الشركة",
    promo_success_desc_b2b: "تم تسجيل طلبك. يعتمد التواصل على توفر شريك مناسب.",

    // Footer
    footer_desc: "قارن عروض أورنج وإنوي واتصالات المغرب المعلنة. يجب التأكد من الأسعار والتغطية قبل الاشتراك.",
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
    faq_a1: "يعرض الموقع مجموعة من العروض العامة ويساعدك على تحديد حاجتك. ينبغي التحقق من الأسعار والتغطية لدى المشغل.",
    faq_q2: 'هل الخدمة مجانية حقاً ؟',
    faq_a2: "المقارنة مجانية. قد يحصل الموقع على مقابل عند الربط بشريك وفق اتفاق تجاري مناسب.",
    faq_q3: 'هل الأسعار المعروضة محدثة ؟',
    faq_a3: "نعرض مصدر الأسعار الرسمي وتاريخ التحقق. قد تتغير الأسعار، لذلك تحقق منها قبل الاشتراك.",
    faq_q4: 'هل يمكنني تغيير شركة الاتصالات بسهولة مع الاحتفاظ برقمي ؟',
    faq_a4: "تختلف شروط تغيير المشغل ونقل الرقم حسب العقد والخدمة. تحقق من الإجراءات لدى المشغل.",
    faq_q5: 'ما الفرق بين الألياف البصرية (Fibre) والـ ADSL ؟',
    faq_a5: 'تمنحك الألياف البصرية سرعات فائقة تصل إلى 1 جيجابت في الثانية واستجابة سريعة جداً مثالية للألعاب والبث. أما الـ ADSL فسرعته محدودة بـ 20 ميجابت لكنه متوفر في كل مكان. اختبار السرعة لدينا سيساعدك على تحديد الخيار الأنسب.',
    faq_q6: 'كيف أستخدم اختبار سرعة الإنترنت ؟',
    faq_a6: "تحيل صفحة قياس السرعة إلى أداة قياس خارجية حقيقية. تتأثر النتائج بجهازك والشبكة وظروف الاختبار.",
    faq_q7: 'هل بياناتي الشخصية آمنة ؟',
    faq_a7: "نحمي معلوماتك ولا نشاركها مع شريك تجاري إلا بموافقتك الصريحة. راجع سياسة الخصوصية.",
    faq_q8: 'هل تقدمون عروضاً خاصة بالشركات والمهنيين ؟',
    faq_a8: "يمكنك طلب عرض مهني، لكن توفر الخدمة والشريك يخضع للتأكيد.",

    // CTA
    cta_ready: 'مستعد لتخفيض فاتورة الإنترنت والهاتف ؟',
    cta_ready_desc: 'أجب عن 3 أسئلة سريعة واكتشف العروض الحصرية المناسبة لبيتك',
    cta_btn: 'ابدأ الاختبار الآن (60 ثانية)',

    // Promo Form Custom Extras
    promo_badge_b2b: "طلبات المقاولات",
    promo_badge_b2c: "قارن قبل الاشتراك",
    promo_success_check_b2b_1: "تم تسجيل احتياجات الشركة",
    promo_success_check_b2b_2: "يجب تأكيد التغطية",
    promo_success_check_b2b_3: "العرض حسب توفر شريك",
    promo_success_check_b2c_1: "مقارنة الأسعار المعلنة",
    promo_success_check_b2c_2: "يجب تأكيد التغطية",
    promo_success_check_b2c_3: "الشروط تؤكد لدى المشغل",
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
    elig_reason_desc: "يساعدنا وضعك على فهم طلبك بشكل أفضل.",
    elig_reason_moving: 'سأنقل سكني قريباً',
    elig_reason_cheaper: 'أريد دفع مبلغ أقل للفاتورة',
    elig_reason_faster: 'صبيب الإنترنت الحالي لدي بطيء جداً',
    elig_reason_new: 'اشتراك جديد / أول جهاز إنترنت',
    elig_loc_title: 'أين يقع بيتكم ؟',
    elig_loc_desc: 'ابحث عن عنوانك أو ضع علامة تحديد الموقع على الخريطة بدقة.',
    elig_loc_btn: 'تأكيد موقع السكن',
    elig_contact_title: 'الخطوة الأخيرة',
    elig_contact_desc: "كيف يمكن لشريك مناسب التواصل معك لدراسة طلبك؟",
    elig_contact_secure: "لا نشارك معلومات اتصالك مع الشريك إلا بموافقتك الصريحة.",
    elig_contact_name_placeholder: 'الاسم الكامل الخاص بكم',
    elig_contact_phone_placeholder: 'رقم هاتفكم المحمول',
    elig_contact_delay: 'المدة المرغوب فيها للتركيب',
    elig_delay_asap: 'في أقرب وقت ممكن (عاجل)',
    elig_delay_1month: 'خلال شهر',
    elig_delay_checking: 'مقارنة بسيطة فقط',
    elig_contact_comment: 'ملاحظات إضافية (اختياري)',
    elig_contact_comment_placeholder: 'مثال: أبحث عن سرعة للعب أونلاين، أو أحتاج عنوان IP ثابت...',
    elig_contact_btn: "إرسال طلبي",
    elig_scan_title: "جارٍ تسجيل الطلب",
    elig_scan_desc: "جارٍ تسجيل الطلب للعنوان {address}",
    elig_scan_connecting: "التسجيل جارٍ...",
    elig_res_title: 'انتهى فحص التغطية بنجاح !',
    elig_res_encrypted: 'بيانات مشفرة وآمنة',
    elig_res_verified: 'موقع مؤكد ومطابق',
    elig_res_desc: "تم تسجيل طلبك للعنوان {address}. يجب تأكيد التغطية لدى المشغل.",
    elig_res_advisor_title: 'مستشار اتصالات سيتواصل معكم قريباً',
    elig_res_advisor_desc: '"سيقوم خبير بتحليل دقيق للتمديدات الخارجية لبيتكم وتقديم أفضل عرض تخفيض حصري خلال 24 ساعة."',
    elig_res_btn: "مقارنة الأسعار المعلنة",

    // Offers Page
    offers_title: 'جميع عروض الاتصالات في المغرب',
    offers_subtitle: "{count} عرض متاح للمقارنة • أسعار استرشادية",
    offers_filters: 'تصفية العروض',
    offers_category: 'الصنف',
    offers_all: 'الكل',
    offers_internet_only: 'إنترنت فقط',
    offers_mobile_only: 'مكالمات وإنترنت محمول',
    offers_operator: 'مشغل الاتصالات',
    offers_all_ops: 'جميع المشغلين',
    offers_sort_by: 'ترتيب حسب',
    offers_sort_price_asc: 'الثمن: من الأقل إلى الأكثر',
    offers_sort_price_desc: 'الثمن: من الأكثر إلى الأقل',
    offers_sort_speed_desc: 'السرعة والبيانات: من الأكثر إلى الأقل',
    offers_none_found: 'لم يتم العثور على أي عرض',
    offers_none_found_desc: 'يرجى تغيير خيارات التصفية والبحث',
    offers_best_choice: 'أفضل خيار متاح',
    offers_locked_badge: "تحقق قبل الاشتراك",
    offers_locked_title: "قارن الأسعار واطلب التواصل",
    offers_locked_desc: "يجب تأكيد السعر والتغطية لدى المشغل. لا نضمن وجود عروض سرية.",
    offers_locked_check_1: "مقارنة مجانية",
    offers_locked_check_2: "تأكيد الشروط لدى المشغل",

    // Offer Card
    card_unlimited: 'غير محدود',
    card_pro_quote: 'طلب تسعيرة',
    card_view_offer: 'عرض الاشتراك',
    card_order: 'طلب الآن',
    card_added_compare: 'تمت الإضافة للمقارنة',
    card_compare: 'مقارنة',
    card_max_compare_alert: 'الحد الأقصى 3 عروض للمقارنة',
    card_data: 'إنترنت',
    card_calls: 'مكالمات',
    card_techno: 'تكنولوجيا',
    card_per_month: 'شهرياً',

    // Compare Page
    compare_title: 'مقارنة العروض',
    compare_subtitle: 'قارن ما يصل إلى 3 اشتراكات جنباً إلى جنب',
    compare_back: 'العودة إلى العروض',
    compare_loading: 'جاري تحميل المقارنة...',
    compare_criterion: 'المعيار',
    compare_price: 'السعر الشهري',
    compare_category: 'الصنف',
    compare_download: 'سرعة التحميل',
    compare_upload: 'سرعة الرفع',
    compare_tech: 'التكنولوجيا',
    compare_data: 'بيانات المحمول',
    compare_calls: 'المكالمات',
    compare_setup: 'مصاريف التركيب',
    compare_commitment: 'الالتزام',
    compare_subscribe: 'اشتراك',
    compare_add_more: 'إضافة المزيد من العروض للمقارنة',

    // Results Page
    res_personalized: 'نتائج مخصصة',
    res_title: 'عروضك المخصصة',
    res_at_city: 'في {city}',
    res_subtitle: 'بناءً على إجاباتك، إليك أفضل {count} خيارات مناسبة لك',
    res_loading: 'جاري تحليل احتياجاتك...',
    res_not_convinced: 'غير مقتنع ؟',
    res_not_convinced_desc: 'تصفح جميع عروضنا أو أعد الاختبار لتحديد نتائجك بدقة',
    res_btn_all: 'عرض جميع العروض',
    res_btn_redo: 'إعادة الاختبار',
    res_match_score: 'نسبة تطابق {score}%',
    res_reason_family: 'مثالي لعائلتك: تضمن لك الألياف البصرية اتصالاً مستمراً ودون انقطاع حتى مع اتصال كافة الأجهزة.',
    res_reason_fastest: 'موصى به للسرعة: {speed} ميغابت في الثانية للتحميل الفوري.',
    res_reason_cheapest: 'أفضل ميزانية: العرض الأكثر اقتصادية بسعر {price} درهم فقط.',
    res_reason_best_value: 'قيمة ممتازة مقابل السعر مع مكالمات غير محدودة شاملة.',
    res_reason_default: 'عرض ممتاز يتوافق مع نمط استهلاكك.',

    // Quiz Page
    quiz_step_title: 'الخطوة {step} من {total}',
    quiz_city_title: 'الخطوة الأخيرة !',
    quiz_city_question: 'في أي مدينة تتواجد ؟',
    quiz_city_placeholder: 'مثال: الدار البيضاء، الرباط، مراكش...',
    quiz_lead_title: 'عروضك جاهزة !',
    quiz_lead_desc: 'للوصول إلى العروض المخصصة لك، يرجى إدخل البيانات التالية',
    quiz_lead_name: 'الاسم الكامل *',
    quiz_lead_name_placeholder: 'اسمك الكامل',
    quiz_lead_phone: 'رقم الهاتف *',
    quiz_lead_email: 'البريد الإلكتروني *',
    quiz_lead_address: 'العنوان الكامل *',
    quiz_lead_address_placeholder: 'رقم الشقة، الشارع، الحي، المدينة',
    quiz_lead_consent: 'بالاستمرار، فإنك توافق على تلقي العروض المخصصة عبر البريد الإلكتروني أو الرسائل القصيرة أو الهاتف. يمكنك إلغاء الاشتراك في أي وقت.',
    quiz_lead_btn: 'عرض عروضي المخصصة',
    quiz_lead_preparing: 'جاري إعداد العروض الخاصة بك...',
    quiz_skip: 'تخطي وتصفح جميع العروض ←',
    quiz_q1_question: 'ما الذي تحتاج إليه ؟',
    quiz_q1_o1_label: 'إنترنت (ألياف بصرية/Box)',
    quiz_q1_o1_desc: 'للمنزل أو المكتب',
    quiz_q1_o2_label: 'اشتراك هاتف محمول',
    quiz_q1_o2_desc: 'مكالمات، رسائل، إنترنت',
    quiz_q1_o3_label: 'كلاهما معاً',
    quiz_q1_o3_desc: 'باقة متكاملة',
    quiz_q2_question: 'من سيستخدم الخدمة ؟',
    quiz_q2_o1_label: 'أنا فقط',
    quiz_q2_o1_desc: 'شخص واحد',
    quiz_q2_o2_label: 'عائلتي',
    quiz_q2_o2_desc: '2 إلى 5 أشخاص',
    quiz_q2_o3_label: 'مكتب صغير',
    quiz_q2_o3_desc: '5 إلى 20 موظفاً',
    quiz_q2_o4_label: 'مقاولة / شركة',
    quiz_q2_o4_desc: 'أكثر من 20 موظفاً',
    quiz_q3_question: 'ما هي أولويتك ؟',
    quiz_q3_o1_label: 'السعر الأقل',
    quiz_q3_o1_desc: 'ميزانية محدودة',
    quiz_q3_o2_label: 'الصبيب الأسرع',
    quiz_q3_o2_desc: 'أداء أقصى',
    quiz_q3_o3_label: 'أفضل قيمة مقابل السعر',
    quiz_q3_o3_desc: 'متوازن',

    // Contact Page
    contact_title: 'فلنتحدث عن',
    contact_title_highlight: 'مشروعك',
    contact_desc: 'لديك سؤال حول اشتراك ما؟ مشروع شراكة؟ فريقنا في الاستماع لمرافقتك.',
    contact_hq: 'المقر الرئيسي',
    contact_hq_desc: 'الدار البيضاء، المغرب',
    contact_need_help: 'هل تحتاج إلى مساعدة فورية ؟',
    contact_need_help_desc: 'استخدم المقارن الذكي للعثور على أفضل عرض في أقل من دقيقتين.',
    contact_btn_start: 'ابدأ الاختبار',
    contact_form_title: 'أرسل لنا رسالة',
    contact_form_name: 'الاسم الكامل',
    contact_form_name_placeholder: 'اسمك الكامل',
    contact_form_email: 'البريد الإلكتروني',
    contact_form_email_placeholder: 'votre@email.com',
    contact_form_subject: 'الموضوع',
    contact_form_subject_placeholder: 'مثال: شراكة، مشكل تقني...',
    contact_form_message: 'رسالتك',
    contact_form_message_placeholder: 'كيف يمكننا مساعدتك ؟',
    contact_form_btn: 'إرسال الرسالة',
    contact_success_title: 'تم إرسال الرسالة بنجاح !',
    contact_success_desc: 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن على {email}.',
    contact_success_another: 'إرسال رسالة أخرى',
    contact_error: 'حدث خطأ ما، يرجى المحاولة لاحقاً.',

    // Speedtest Page
    speed_title: 'اختبر سرعة الإنترنت لديك',
    speed_subtitle: 'قم بقياس سرعة التحميل والرفع والاستجابة بنقرة واحدة لمعرفة ما إذا كنت تدفع أكثر من اللازم.',
    speed_btn_run: 'ابدأ الاختبار',
    speed_testing: 'جاري الاختبار...',
    speed_phase_ping: 'جاري قياس الاستجابة...',
    speed_phase_download: 'جاري قياس التحميل...',
    speed_phase_upload: 'جاري قياس الرفع...',
    speed_phase_complete: 'جاري تحليل النتائج...',
    speed_download: 'التحميل',
    speed_upload: 'الرفع',
    speed_ping: 'الاستجابة',
    speed_jitter: 'التذبذب',
    speed_res_title: 'تحليل سرعة الإنترنت بالذكاء الاصطناعي',
    speed_res_good: 'اتصالك بالإنترنت ممتاز !',
    speed_res_medium: 'اتصال متوسط. يمكنك الحصول على ألياف بصرية بنفس السعر.',
    speed_res_bad: 'سرعة غير كافية. مشغلك الحالي يفرض عليك سعراً مرتفعاً مقارنة بالصبيب الفعلي.',
    speed_form_title: 'تحقق من توفر الألياف البصرية بمنزلك',
    speed_form_desc: 'املأ هذه الاستمارة لجدولة التوصيل أو للتفاوض على اشتراك أفضل.',
    speed_form_name: 'الاسم الكامل',
    speed_form_phone: 'رقم الهاتف',
    speed_form_city: 'المدينة',
    speed_form_address: 'العنوان الكامل',
    speed_form_reason: 'سبب الاختبار',
    speed_form_reason_slow: 'صبيب الإنترنت الحالي بطيء جداً',
    speed_form_reason_price: 'أريد دفع سعر أقل',
    speed_form_reason_moving: 'سأنقل سكني قريباً',
    speed_form_reason_first: 'أول اشتراك بالألياف البصرية',
    speed_form_timing: 'المدة المرغوبة',
    speed_form_timing_asap: 'في أقرب وقت ممكن (عاجل)',
    speed_form_timing_1month: 'في غضون شهر',
    speed_form_timing_checking: 'مقارنة بسيطة',
    speed_form_btn: 'التحقق من الأهلية',
    speed_form_success: 'تم تسجيل طلبك بنجاح !',
    speed_form_success_desc: 'سيتصل بك مستشار بعد تحليل أهليتك للإنترنت.',
    speed_card1_title: 'دقة عالية',
    speed_card1_desc: 'خوارزمية قياس متعددة النقاط لدقة متناهية.',
    speed_card2_title: 'تدقيق الألياف البصرية',
    speed_card2_desc: 'فحص فني للتوصيل مشمول بعد الاختبار.',
    speed_card3_title: 'مجاني بالكامل',
    speed_card3_desc: 'خدمة مقدمة من منصتنا لضمان راحتك.',

    // Confiance Page
    conf_title: 'حليفك المستقل في قطاع الاتصالات',
    conf_desc: 'في MonForfait.ma، مهمتنا بسيطة: مساعدة كل مواطن مغربي على دفع السعر العادل للاشتراك.',
    conf_sec1_title: 'استقلالية تامة',
    conf_sec1_p1: 'على عكس المواقع الرسمية للشركات، نحن لا نسعى لبيع اشتراك معين. نحن منصة مستقلة، يعتمد نظام المقارنة لدينا على معايير موضوعية: السعر، حجم البيانات، مدة الالتزام وجودة الشبكة.',
    conf_sec1_p2: 'نحن لا نتبع لأي مشغل للاتصالات. لا اتصالات المغرب، ولا أورنج ولا إنوي تتدخل في تصنيفاتنا.',
    conf_sec2_title: 'نموذجنا الاقتصادي',
    conf_sec2_p1: 'للحفاظ على مجانية الخدمة، نعتمد على عمولات تسويقية. عندما يشترك مستخدم في باقة بعد الضغط على روابط موقعنا، قد نتلقى عمولة بسيطة من المشغل.',
    conf_sec2_quote: 'هذه العمولة لا تزيد أبداً من سعر اشتراكك. بل على العكس، نتفاوض غالباً للحصول على عروض حصرية لمتابعينا.',
    conf_sec3_title_obj: 'موضوعية',
    conf_sec3_desc_obj: 'نقوم بإدراج جميع الاشتراكات المتوفرة في السوق، حتى تلك التي لا نتلقى عنها أي عمولة.',
    conf_sec3_title_trans: 'شفافية',
    conf_sec3_desc_trans: 'إذا كان العرض ممولاً، فسنوضح ذلك بملصق "إعلان". وهذا لا يؤثر على نتائج بحثك المخصص.',
    conf_sec4_title: 'نحن هنا من أجلك',
    conf_sec4_desc: 'تواجه مشكلة مع مشغل؟ لديك شكوك حول مصاريف الإلغاء؟ يراقب خبراؤنا السوق يومياً للحد من التجاوزات.',
    conf_sec4_btn: 'هل تحتاج للمساعدة؟ تواصل مع خبير عبر واتساب',

    // Missing Offers & Results
    offers_title_all: 'كل العروض',
    offers_search_placeholder: 'ابحث عن عرض...',
    offers_results_count: '{count} عروض موجودة',
    offers_sort_recommended: 'موصى به',
    offers_sort_data_desc: 'البيانات (تنازلي)',
    offers_no_results: 'لا يوجد نتائج',
    offers_adjust_filters: 'الرجاء تعديل الفلاتر.',
    offers_reset_filters: 'إعادة ضبط الفلاتر',
    results_alternatives: 'بدائل',
    results_alternatives_desc: 'إليك بعض البدائل',
    results_analyzing: 'جاري التحليل',
    results_analyzing_desc: 'يرجى الانتظار...',
    results_best_match: 'أفضل تطابق',
    results_claim_btn: 'اطلب هذا العرض',
    results_claim_short: 'اطلب',
    results_next_steps: 'الخطوات التالية',
    results_promo_desc: 'عرض ترويجي حصري',
    results_promo_title: 'عرض ترويجي',
    results_step1_desc: 'وصف الخطوة 1',
    results_step1_title: 'الخطوة 1',
    results_step2_desc: 'وصف الخطوة 2',
    results_step2_title: 'الخطوة 2',
    results_step3_desc: 'وصف الخطوة 3',
    results_step3_title: 'الخطوة 3',
    results_subtitle: 'نتائجك',
    results_success_badge: 'نجاح',
    results_title: 'النتائج',
    results_whatsapp_msg: 'إرسال عبر واتساب',

    // Partenaires Page
    part_title: 'برنامج الشراكات والإعلام',
    part_desc: "المشغلون والموزعون المعتمدون وشركات التركيب: تواصلوا معنا لدراسة تجربة اكتساب عملاء بنتائج قابلة للقياس ودون ضمان مسبق للحجم.",
    part_btn_partner: 'كن شريكاً معنا',
    part_sec1_title: 'دمج الأداة (رابط Dofollow)',
    part_sec1_desc: 'هل تدير مدونة تقنية أو موقعاً إخبارياً مغربياً؟ ادمج أداة "فحص الأهلية" في موقعك. في المقابل، تحتوي الأداة على رابط Dofollow لموقعنا مما يعزز أداء محركات البحث لكلا الموقعين.',
    part_sec1_btn: 'معاينة الأداة',
    part_sec2_title: 'تبادل المقالات والروابط',
    part_sec2_desc: 'نرحب بالمقالات الضيفة وتبادل المقالات عالية الجودة. ننشر مواضيع تخص الاتصالات، الإنترنت والتقنيات الحديثة بالمغرب.',
    part_sec2_btn: 'اقتراح تبادل',
    part_sec3_title: 'بيانات المرصد التقني',
    part_sec3_desc: 'للصحفيين والمحللين: يمكنكم استخدام بيانات مرصد الأسعار الخاص بنا بحرية في منشوراتكم بشرط الإشارة لـ MonForfait.ma كرابط مباشر.',

    // Eligibilite Page
    elig_page_surtitle: "طلب التحقق من التغطية",
    elig_page_title: "هل الألياف البصرية متاحة في عنوانك؟",
    elig_page_desc: "حدد حاجتك وعنوانك لطلب تأكيد التغطية من مشغل أو موزع. لا يجري هذا الموقع فحصاً تقنياً فورياً.",
    elig_page_secure: "مشاركة المعلومات بموافقتك",
    elig_page_stat: "التغطية تتطلب التأكيد",
    elig_page_why: 'لماذا يجب فحص الأهلية والتغطية ؟',
    elig_page_reason1_title: "وضح احتياجك",
    elig_page_reason1_desc: "حدد الاستخدام والمدينة والموعد المناسب للتركيب.",
    elig_page_reason2_title: "قارن الأسعار المعلنة",
    elig_page_reason2_desc: "تعرف على الأسعار المنشورة لدى المشغلين دون عروض سرية غير مثبتة.",
    elig_page_reason3_title: "تأكيد من شريك مناسب",
    elig_page_reason3_desc: "إذا توفر شريك مناسب، يمكنه تأكيد التغطية والشروط.",

    // Observatoire Page
    obs_surtitle: "أسعار عامة تم التحقق منها",
    obs_title: "مرصد عروض الاتصالات",
    obs_desc: "نظرة على الأسعار العامة المرجعية دون الادعاء بتحليل فواتير خاصة أو توفير فعلي.",
    obs_avg_fibre: 'متوسط سعر الألياف (100 ميغا)',
    obs_analyzed: 'الفواتير المحللة',
    obs_live: 'مباشر',
    obs_overcharge: 'تقدير المبالغ الزائدة بالمغرب',
    obs_chart_title: 'تطور الأسعار المخفية (الألياف البصرية)',
    obs_chart_desc: "مقارنة آنية للأسعار المعلنة دون إنشاء سلسلة تاريخية غير موجودة.",
    obs_press_title: 'الصحافة والإعلام: دمج البيانات لدينا',
    obs_press_desc: 'بياناتنا متاحة للصحفيين. يرجى ذكر المصدر MonForfait.ma برابط مباشر عند استخدام التحليلات.',
    obs_press_btn: 'الولوج إلى API الصحافة',

    // Offres details slug Page
    detail_home: 'الرئيسية',
    detail_offers: 'العروض',
    detail_loading: 'جاري التحميل...',
    detail_not_found: 'العرض غير موجود',
    detail_advantages: 'مزايا هذا العرض',
    detail_price_label: 'السعر الشهري',
    detail_verify_btn: 'التحقق من الأهلية',
    detail_free_note: 'مجاني 100% • استجابة فورية',
    detail_desc: 'اكتشف بالتفصيل اشتراك {name} من {provider}. هذا العرض مصمم لتقديم أفضل قيمة مقابل السعر بالمغرب لتلبية احتياجاتك.',

    // CookieConsent & Widgets
    cookie_title: 'ملفات تعريف الارتباط 🍪',
    cookie_desc: 'نستخدم ملفات تعريف الارتباط لتحليل حركة المرور وتحسين تجربتك.',
    cookie_accept: 'قبول',
    cookie_refuse: 'رفض',
    compbar_selected: '{count} عرض تم اختياره',
    compbar_add_more: 'أضف ما يصل إلى {count} عرض إضافي',
    compbar_max: 'تم الوصول للحد الأقصى',
    compbar_clear: 'مسح الكل',
    compbar_btn: 'قارن الآن',
    sticky_btn: 'عرض عروضي الترويجية المخفية',
    recent_title: 'شوهد مؤخراً',
    toast_save: 'التوفير: {save} درهم / شهرياً !',
    toast_from: 'من',
    toast_action_0: 'قام للتو بفتح عرض سري للألياف البصرية',
    toast_action_1: 'وفر في اشتراك هاتفه المحمول',
    toast_action_2: 'قام للتو بمقارنة عروض ADSL',
    toast_action_3: 'عثر على اشتراك مهني أرخص بـ 50%',
    consent_checkbox_label: "أوافق على أن يتم الاتصال بي هاتفياً من قبل مستشار monforfait.ma لتحديد بحثي. تتم معالجة بياناتي وفقًا لسياسة الخصوصية الخاصة بنا والقانون 09-08.",
    consent_checkbox_error: "يجب عليك قبول الاتصال بك للمتابعة."
  }
};
