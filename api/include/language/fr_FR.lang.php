<?php
/*********************************************************************************
 * SugarCRM is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2010 SugarCRM Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * Contributor(s): www.synolia.com - sugar@synolia.com
 * You can contact SYNOLIA at 51 avenue Jean Jaures 69007 - LYON FRANCE
 * or at email address contact@synolia.com.
 ********************************************************************************/

$app_list_strings = [
    'language_pack_name' => 'français',
    'account_type_dom' => [
        '' => '',
        'Prospect' => 'Prospect',
        'Analyst' => 'Analyste',
        'Competitor' => 'Concurrent',
        'Customer' => 'Client',
        'Integrator' => 'Intégrateur',
        'Investor' => 'Investisseur',
        'Partner' => 'Partenaire',
        'Press' => 'Presse',
        'Reseller' => 'Revendeur',
        'Other' => 'Autre',
    ],
    'account_user_roles_dom' => [
        '' => '',
        'am' => 'Employé Ventes',
        'se' => 'Employé Support',
        'es' => 'Executive Sponsor'
    ],
    'events_account_roles_dom' => [
        '' => '',
        'organizer' => 'Organisateur',
        'sponsor' => 'Sponsor',
        'caterer' => 'Caterer'
    ],
    'events_contact_roles_dom' => [
        '' => '',
        'organizer' => 'Organisateur',
        'speaker' => 'Intervenant',
        'moderator' => 'Animateur',
    ],
    'userabsences_type_dom' => [
        '' => '',
        'Krankenstand' => 'Maladie',
        'Urlaub' => 'Congé',
    ],
    'industry_dom' =>
        [
            '' => '',
            'Government' => 'Administration',
            'Insurance' => 'Assurance',
            'Banking' => 'Banque',
            'Biotechnology' => 'Biotechnologie',
            'Retail' => 'Commerce détail',
            'Communications' => 'Communications',
            'Consulting' => 'Conseil',
            'Construction' => 'Construction - BTP',
            'Entertainment' => 'Culture-Presse',
            'Education' => 'Education',
            'Energy' => 'Energie',
            'Environmental' => 'Environnement',
            'Finance' => 'Finance',
            'Hospitality' => 'Hopitaux',
            'Chemicals' => 'Industrie Chimique',
            'Machinery' => 'Industrie lourde',
            'Manufacturing' => 'Industrie Manufact.',
            'Electronics' => 'Informatique - Electronique',
            'Engineering' => 'Ingénierie',
            'Recreation' => 'Loisir',
            'Media' => 'Média',
            'Not For Profit' => 'Sans but lucratif',
            'Healthcare' => 'Santé',
            'Utilities' => 'Services',
            'Shipping' => 'Transports',
            'Technology' => 'Technologie',
            'Telecommunications' => 'Télécommunications',
            'Apparel' => 'Textile',
            'Transportation' => 'Voyage-hôtellerie',
            'Other' => 'Autre',
        ],
    'lead_source_default_key' => 'généré automatiquement',
    'lead_source_dom' =>
        [
            '' => '',
            'Campaign' => 'Campagne',
            'Cold Call' => 'Appel entrant',
            'Conference' => 'Conférence',
            'Direct Mail' => 'Mailing',
            'Email' => 'Email',
            'Employee' => 'Employé',
            'Existing Customer' => 'Client existant',
            'Other' => 'Autre',
            'Partner' => 'Partenaire',
            'Public Relations' => 'Relation publique',
            'Self Generated' => 'Récurrent',
            'Support Portal User Registration' => 'Portail de support',
            'Trade Show' => 'Salon',
            'Web Site' => 'Site web',
            'Word of mouth' => 'Recommandé',
        ],
    'opportunity_type_dom' =>
        [
            '' => '',
            'Existing Business' => 'Récurrent',
            'New Business' => 'Nouvelle Opportunité',
        ],
    'roi_type_dom' =>
        [
            'Budget' => 'Budget',
            'Revenue' => 'Revenu',
            'Investment' => 'Investissement',
            'Expected_Revenue' => 'Revenu attendu',
        ],
    'opportunity_relationship_type_default_key' => 'Décideur principal',
    'opportunity_relationship_type_dom' =>
        [
            '' => '',
            'Primary Decision Maker' => 'Décideur Principal',
            'Business Decision Maker' => 'Acheteur',
            'Business Evaluator' => 'Chef de projet',
            'Technical Decision Maker' => 'Responsable technique',
            'Technical Evaluator' => 'Utilisateur',
            'Executive Sponsor' => 'Sponsor',
            'Influencer' => 'Influenceur',
            'Other' => 'Autre',
        ],
    'case_relationship_type_default_key' => 'Contact Principal',
    'case_relationship_type_dom' =>
        [
            '' => '',
            'Primary Contact' => 'Contact Principal',
            'Alternate Contact' => 'Contact Alternatif',
        ],
    'payment_terms' =>
        [
            '' => '',
            'Net 15' => 'Net 15',
            'Net 30' => 'Net 30',
        ],
    'fts_type' => [
        '' => '',
        'Elastic' => 'elasticsearch'
    ],
    'sales_stage_dom' =>
        [
// CR1000302 adapt to match opportunity spicebeanguidestages
//          'Prospecting' => 'Prospection',
            'Qualification' => 'Qualification',
            'Analysis' => 'Analyse des besoins',
            'Proposition' => 'Chiffrage',
//    'Id. Decision Makers' => 'Ident. Décideurs',
//    'Perception Analysis' => 'Evaluation',
            'Proposal' => 'Devis/Proposition',
            'Negotiation' => 'Négociation',
            'Closed Won' => 'Gagné',
            'Closed Lost' => 'Perdu',
            'Closed Discontinued' => 'Abandonné',
        ],
    'opportunityrevenuesplit_dom' => [
        'none' => 'aucun',
        'split' => 'Répartition',
        'rampup' => 'Rampup'
    ],
    'opportunity_relationship_buying_center_dom' => [
        '++' => 'très positif',
        '+' => 'positif',
        'o' => 'neutre',
        '-' => 'negatif',
        '--' => 'très negatif'
    ],
    'in_total_group_stages' => [
        'Draft' => 'Brouillon',
        'Negotiation' => 'Negociation',
        'Delivered' => 'Livré',
        'On Hold' => 'En attente',
        'Confirmed' => 'Confirmé',
        'Closed Accepted' => 'Terminé Accepté',
        'Closed Lost' => 'Terminé Perdu',
        'Closed Dead' => 'Terminé Mort',
    ],

    'sales_probability_dom' =>
        [
            'Prospecting' => '10',
            'Qualification' => '20',
            'Needs Analysis' => '25',
            'Value Proposition' => '30',
            'Id. Decision Makers' => '40',
            'Perception Analysis' => '50',
            'Proposal/Price Quote' => '65',
            'Negotiation/Review' => '80',
            'Closed Won' => '100',
            'Closed Lost' => '',
        ],


    'activity_dom' =>
        [
            'Call' => 'Call',
            'Meeting' => 'Meeting',
            'Task' => 'Task',
            'Email' => 'Email',
            'Note' => 'Note',
        ],
    'salutation_dom' =>
        [
            '' => '',
            // 'Dr.' => 'Dr.',
            // 'Prof.' => 'Prof.',
            'Mr.' => 'M.',
            'Ms.' => 'Mlle',
            // 'Mrs.' => 'Mme',
        ],
    'salutation_letter_dom' => [
        '' => '',
        'Mr.' => 'Monsieur',
        'Ms.' => 'Madame',
        //'Mrs.' => 'Frau',
        //'Dr.' => 'Dr.',
        //'Prof.' => 'Prof.',
    ],
    'gdpr_marketing_agreement_dom' => [
        '' => '',
        'r' => 'refusé',
        'g' => 'accepté'
    ],
    'uom_unit_dimensions_dom' => [
        '' => '',
        'none' => 'aucun',
        'weight' => 'Poids',
        'volume' => 'Volume',
        'area' => 'Surface',
        'time' => 'Temps',
    ],
    'personalinterests_dom' => [
        'sports' => 'Sport',
        'food' => 'Alimentation',
        'wine' => 'Vin',
        'culture' => 'Culture',
        'travel' => 'Voyages',
        'books' => 'Livres',
        'animals' => 'Animaux',
        'clothing' => 'Vêtements',
        'cooking' => 'Cuisine',
        'fashion' => 'Mode',
        'music' => 'Musique',
        'fitness' => 'Fitness'
    ],
    'questionstypes_dom' => [
        'rating' => 'Evaluation',
        'ratinggroup' => 'Groupe d\'évaluations',
        'binary' => 'Un de deux',
        'single' => 'Sélection unique',
        'multi' => 'Sélection multiple',
        'text' => 'Entrée de texte',
        'ist' => 'IST',
        'nps' => 'NPS (Net Promoter Score)'
    ],
    'evaluationtypes_dom' => [
        'default' => 'Standard',
        'avg_core' => 'Average',
        'spiderweb' => 'Toile',
    ],
    'evaluationsorting_dom' => [
        'categories' => 'par catégorie (ordre alphabétique)',
        'points asc' => 'par nom de points, ascendant',
        'points desc' => 'par nom de points, descendant'
    ],
    'contacts_title_dom' => [
        '' => '',
        'ceo' => 'CEO',
        'cfo' => 'CFO',
        'cto' => 'CTO',
        'cio' => 'CIO',
        'coo' => 'COO',
        'cmo' => 'CMO',
        'vp sales' => 'VP Sales',
        'vp engineering' => 'VP Engineering',
        'vp procurement' => 'VP Procurement',
        'vp finance' => 'VP Finance',
        'vp marketing' => 'VP Marketing',
        'sales' => 'Sales',
        'engineering' => 'Engineering',
        'procurement' => 'Procurement',
        'finance' => 'Finance',
        'marketing' => 'Marketing'
    ],
    //time is in seconds; the greater the time the longer it takes;

    'reminder_max_time' => 90000,
    'reminder_time_options' => [
        -1 => 'pas de rappel',
        60 => '1 minute avant',
        300 => '5 minutes avant',
        600 => '10 minutes avant',
        900 => '15 minutes avant',
        1800 => '30 minutes avant',
        3600 => '1 heure avant',
        7200 => '2 heures avant',
        10800 => '3 heures avant',
        18000 => '5 heures avant',
        86400 => '1 jour avant',
    ],
    'task_priority_default' => 'Moyenne',
    'task_priority_dom' =>
        [
            'High' => 'Haute',
            'Medium' => 'Moyenne',
            'Low' => 'Basse',
        ],
    'task_status_default' => 'Non démarrée',
    'task_status_dom' =>
        [
            'Not Started' => 'Non démarrée',
            'In Progress' => 'En cours',
            'Completed' => 'Réalisée',
            'Pending Input' => 'En attente',
            'Deferred' => 'Reportée',
        ],
    'meeting_status_default' => 'Planifiée',
    'meeting_status_dom' =>
        [
            'Planned' => 'Planifiée',
            'Held' => 'Tenue',
            'Not Held' => 'Annulée',
        ],

    'extapi_meeting_password' =>
        [
            'GoToMeeting' => 'GoToMeeting',
            'WebEx' => 'WebEx',
        ],
    'meeting_type_dom' =>
        [
            'Other' => 'Autre',
            'Sugar' => 'SugarCRM',
        ],
    'call_status_default' => 'Planifié',
    'call_status_dom' =>
        [
            'Planned' => 'Planifié',
            'Held' => 'Terminé',
            'Not Held' => 'Annulé',
        ],
    'call_direction_default' => 'Sortant',
    'call_direction_dom' =>
        [
            'Inbound' => 'Entrant',
            'Outbound' => 'Sortant',
        ],

    'lead_status_dom' =>
        [
            '' => '',
            'New' => 'Nouveau',
            'Assigned' => 'Assigné',
            'In Process' => 'En cours',
            'Converted' => 'Converti',
            'Recycled' => 'Réactivé',
            'Dead' => 'Mort',
        ],
    'lead_classification_dom' =>
        [
            'cold' => 'froid',
            'warm' => 'tiède',
            'hot' => 'chaud'
        ],
    'gender_list' => [
        'male' => 'masculin',
        'female' => 'féminin',
    ],

    'messenger_type_dom' =>
        [
            '' => '',
            'MSN' => 'MSN',
            'Yahoo!' => 'Yahoo!',
            'AOL' => 'AOL',
        ],
    'project_t
    ask_utilization_options' =>
        [
            '0' => 'aucun',
            '25' => '25',
            '50' => '50',
            '75' => '75',
            '100' => '100',
        ],
    'record_type_display' =>
        [
            '' => '',
            'Leads' => 'Lead',
            'Contacts' => 'Contacts',
            'Bugs' => 'Bug',
            'Accounts' => 'Compte',
            'Opportunities' => 'Opportunité',
            'Cases' => 'Ticket',
            'ProductTemplates' => 'Modèle Produit',
            'Quotes' => 'Devis',
            'Project' => 'Projet',
            'Prospects' => 'Suspect',
            'Tasks' => 'Tâche',
        ],
    'record_type_display_notes' =>
        [
            'Contacts' => 'Contact',
            'Emails' => 'Email',
            'Bugs' => 'Bug',
            'Leads' => 'Lead',
            'Accounts' => 'Compte',
            'Opportunities' => 'Opportunité',
            'Tasks' => 'Tâche',
            'ProductTemplates' => 'Modèle Produit',
            'Quotes' => 'Devis',
            'Products' => 'Produit',
            'Contracts' => 'Contrat',
            'Project' => 'Projet',
            'Prospects' => 'Suspect',
            'Cases' => 'Ticket',
            'Meetings' => 'Réunion',
            'Calls' => 'Appels',
        ],
    'parent_type_display' =>
        [
            'Contacts' => 'Contact',
            'Leads' => 'Lead',
            'Accounts' => 'Compte',
            'Tasks' => 'Tâche',
            'Opportunities' => 'Opportunité',
            'Products' => 'Produit',
            'Quotes' => 'Devis',
            'Bugs' => 'Suivi Bug',
            'Cases' => 'Ticket',
            'Project' => 'Projets',
            'Prospects' => 'Suspect',
        ],
    'tax_class_dom' =>
        [
            'Taxable' => 'Taxable',
            'Non-Taxable' => 'Non-Taxable',
        ],
    'quote_relationship_type_dom' =>
        [
            '' => '',
            'Primary Decision Maker' => 'Décideur Principal',
            'Business Decision Maker' => 'Décideur métier',
            'Business Evaluator' => 'Responsable business',
            'Technical Decision Maker' => 'Responsable technique',
            'Technical Evaluator' => 'Utilisateur',
            'Executive Sponsor' => 'Sponsor',
            'Influencer' => 'Influenceur',
            'Other' => 'Autre',
        ],
    'issue_priority_dom' =>
        [
            'Urgent' => 'Urgent',
            'High' => 'Haute',
            'Medium' => 'Moyenne',
            'Low' => 'Basse',
        ],
    'issue_resolution_dom' =>
        [
            '' => '',
            'Accepted' => 'Accepté',
            'Duplicate' => 'Doublon',
            'Closed' => 'Fermé',
            'Out of Date' => 'Périmé',
            'Invalid' => 'Invalide',
        ],
    'bug_priority_dom' =>
        [
            'Urgent' => 'Urgent',
            'High' => 'Haute',
            'Medium' => 'Moyenne',
            'Low' => 'Basse',
        ],
    'bug_resolution_dom' =>
        [
            '' => '',
            'Accepted' => 'Accepté',
            'Duplicate' => 'Doublon',
            'Fixed' => 'Fixé',
            'Out of Date' => 'Périmé',
            'Invalid' => 'Invalide',
            'Later' => 'Reporté',
        ],
    'case_type_dom' =>
        [
            'Administration' => 'Administration',
            'Product' => 'Produit',
            'User' => 'Utilisateur',
        ],
    'source_dom' =>
        [
            '' => '',
            'Forum' => 'Forum',
            'Web' => 'Web',
            'Internal' => 'Interne',
            'InboundEmail' => 'Email Entrant',
        ],
    'product_category_dom' =>
        [
            '' => '',
            'Contacts' => 'Contacts',
            'Documents' => 'Documents',
            'Emails' => 'Emails',
            'Leads' => 'Leads',
            'Notes' => 'Notes',
            'Releases' => 'Releases',
            'Studio' => 'Studio',
            'Accounts' => 'Comptes',
            'Activities' => 'Activités',
            'Bug Tracker' => 'Suivi Bugs',
            'Calendar' => 'Calendrier',
            'Calls' => 'Appels',
            'Campaigns' => 'Campagnes',
            'Cases' => 'Tickets',
            'Currencies' => 'Devises',
            'Dashboard' => 'Tableaux de bord',
            'Feeds' => 'Flux RSS',
            'Forecasts' => 'Prévisions',
            'Help' => 'Aide',
            'Home' => 'Accueil',
            'Meetings' => 'Réunions',
            'Opportunities' => 'Opportunités',
            'Outlook Plugin' => 'Plugin Outlook',
            'Product Catalog' => 'Catalogue Produits',
            'Products' => 'Produits',
            'Projects' => 'Projets',
            'Quotes' => 'Devis',
            'RSS' => 'Flux RSS',
            'Upgrade' => 'Mise à Jour',
            'Users' => 'Utilisateurs',
        ],
    'campaign_status_dom' =>
        [
            '' => '',
            'Planning' => 'Planifiée',
            'Active' => 'En cours',
            'Inactive' => 'Annulée',
            'Complete' => 'Terminée',
            'In Queue' => 'Dans la file d attente',
            'Sending' => 'Envoi en cours',
        ],
    'campaign_type_dom' =>
        [
            '' => '',
            'Email' => 'Email',
            'Web' => 'Web',
            'Radio' => 'Radio',
            'NewsLetter' => 'Newsletter',
            'Telesales' => 'Téléprospection',
            'Mail' => 'Courrier',
            'Print' => 'Impression',
            'Television' => 'Télévision',
        ],
    'newsletter_frequency_dom' =>
        [
            '' => '',
            'Weekly' => 'Hebdomadaire',
            'Monthly' => 'Mensuelle',
            'Quarterly' => 'Trimestrielle',
            'Annually' => 'Annuelle',
        ],
    'notifymail_sendtype' =>
        [
            'SMTP' => 'SMTP',
        ],
    'dom_cal_month_short' =>
        [
            '0' => '',
            '1' => 'Jan',
            '2' => 'Fev',
            '3' => 'Mars',
            '4' => 'Avr',
            '5' => 'Mai',
            '6' => 'Juin',
            '7' => 'Juil',
            '8' => 'Août',
            '9' => 'Sept',
            '10' => 'Oct',
            '11' => 'Nov',
            '12' => 'Déc',
        ],
    'dom_meridiem_lowercase' =>
        [
            'am' => 'am',
            'pm' => 'pm',
        ],
    'dom_meridiem_uppercase' =>
        [
            'AM' => 'AM',
            'PM' => 'PM',
        ],
    'dom_email_server_type' =>
        [
            '' => '--Aucun(e)--',
            'imap' => 'IMAP',
        ],
    'dom_email_distribution' =>
        [
            '' => '--Aucun(e)--',
            'direct' => 'Assignation directe',
            'roundRobin' => 'Round-Robin',
            'leastBusy' => 'Moins chargé',
        ],
    'dom_email_distribution_for_auto_create' =>
        [
            'roundRobin' => 'Round-Robin',
            'leastBusy' => 'Moins chargé',
        ],
    'job_period_dom' =>
        [
            'min' => 'Minutes',
            'hour' => 'Heures',
        ],
    'forecast_type_dom' =>
        [
            'Direct' => 'Direct',
            'Rollup' => 'Remontée info',
        ],
    'document_category_dom' =>
        [
            '' => '',
            'Marketing' => 'Marketing',
            'Knowledege Base' => 'Base de connaissance',
            'Sales' => 'Ventes',
        ],
    'document_subcategory_dom' =>
        [
            '' => '',
            'FAQ' => 'FAQ',
            'Marketing Collateral' => 'Marketing Secondaire',
            'Product Brochures' => 'Brochures Produits',
        ],
    'document_status_dom' =>
        [
            'Active' => 'Actif',
            'Draft' => 'Brouillon',
            'Expired' => 'Périmé',
            'Under Review' => 'En cours de révision',
        ],
    'document_template_type_dom' =>
        [
            '' => '',
            'eula' => 'EULA',
            'nda' => 'NDA',
            'mailmerge' => 'Publipostage',
            'license' => 'Termes de Licence',
        ],
    'width_type_dom' =>
        [
            'px' => 'Pixels (px)',
            '%' => 'Pourcentage (%)',
        ],
    'query_groupby_qualifier_qty_dom' =>
        [
            1 => '1',
            2 => '2',
            3 => '3',
            4 => '4',
            5 => '5',
            6 => '6',
            7 => '7',
            8 => '8',
            9 => '9',
            10 => '10',
            12 => '12',
            18 => '18',
            24 => '24',
        ],
    'query_groupby_qualifier_start_dom' =>
        [
            '0' => 'Now',
            '-1' => '-1',
            '-2' => '-2',
            '-3' => '-3',
            '-4' => '-4',
            '-5' => '-5',
            '-6' => '-6',
            '-7' => '-7',
            '-8' => '-8',
            '-9' => '-9',
            '-10' => '-10',
            '12' => '-12',
            '-18' => '-18',
            '-24' => '-24',
        ],
    'query_calc_type_dom' =>
        [
            'Standard' => 'Standard',
            'Math' => 'Calcul Math',
        ],
    'query_calc_oper_dom' =>
        [
            '+' => '(+) Plus',
            '-' => '(-) Moins',
            '*' => '(X) Multiplié par',
            '/' => '(/) Divisé par',
        ],
    'dataset_att_display_type_dom' =>
        [
            'Normal' => 'Normal',
            'Scalar' => 'Scalaire',
        ],
    'dataset_att_format_type_dom' =>
        [
            'Date' => 'Date',
            'Text' => 'Texte',
            'Accounting' => 'Numérique',
            'Datetime' => 'DateHeure',
        ],
    'dataset_style_dom' =>
        [
            'normal' => 'Normal',
            'bold' => 'Gras',
            'italic' => 'Italique',
        ],
    'wflow_alert_type_dom' =>
        [
            'Email' => 'Email',
            'Invite' => 'Invite JavaScript',
        ],
    'wflow_address_type_dom' =>
        [
            'cc' => 'CC:',
            'to' => 'A:',
            'bcc' => 'CCI:',
        ],
    'wflow_address_type_invite_dom' =>
        [
            'cc' => 'CC:',
            'to' => 'A:',
            'bcc' => 'CCI:',
            'invite_only' => '(Invite JavaScript Seulement)',
        ],
    'duration_intervals' =>
        [
            0 => '00',
            15 => '15',
            30 => '30',
            45 => '45',
        ],
    'repeat_type_dom' =>
        [
            '' => 'None',
            'Daily' => 'Quotidien',
            'Weekly' => 'Hebdomadaire',
            'Monthly' => 'Mensuel',
            'Yearly' => 'Annuel',
        ],
    'repeat_intervals' => [
        '' => '',
        'Daily' => 'jour(s)',
        'Weekly' => 'semaine(s)',
        'Monthly' => 'mois',
        'Yearly' => 'année(s)',
    ],

    'duration_dom' => [
        '' => 'None',
        '900' => '15 minutes',
        '1800' => '30 minutes',
        '2700' => '45 minutes',
        '3600' => '1 heure',
        '5400' => '1.5 heures',
        '7200' => '2 heures',
        '10800' => '3 heures',
        '21600' => '6 heures',
        '86400' => '1 jour',
        '172800' => '2 jours',
        '259200' => '3 jours',
        '604800' => '1 semaine',
    ],
    'prospect_list_type_dom' =>
        [
            'test' => 'Test',
            'default' => 'Cibles suivies',
            'seed' => 'Cibles non suivies',
            'exempt_domain' => 'Liste d&#39;exclusion de domaine',
            'exempt_address' => 'Liste d&#39;exclusion d&#39;emails',
            'exempt' => 'Exclusion',
        ],
    'email_settings_num_dom' =>
        [
            10 => '10',
            20 => '20',
            50 => '50',
        ],
    'email_marketing_status_dom' =>
        [
            '' => '',
            'active' => 'Actif',
            'inactive' => 'Inactif',
        ],
    'campainglog_activity_type_dom' =>
        [
            '' => '',
            'targeted' => 'Messages envoyés/tentés',
            'send error' => 'Bounces, Autre',
            'invalid email' => 'Bounces, Email invalide',
            'link' => 'Liens cliqués',
            'viewed' => 'Message lus',
            'removed' => 'Demande de Opt Out',
            'lead' => 'Leads créés',
            'contact' => 'Contacts créés',
            'blocked' => 'Messages non envoyés',
        ],
    'campainglog_target_type_dom' =>
        [
            'Contacts' => 'Contacts',
            'Leads' => 'Leads',
            'Users' => 'Utilisateurs',
            'Prospects' => 'Suspects',
            'Accounts' => 'Comptes',
        ],
    'navigation_paradigms' =>
        [
            'm' => 'Modules',
            'gm' => 'Modules Groupés',
        ],
    'oc_status_dom' =>
        [
            '' => '',
            'Active' => 'Actif',
            'Inactive' => 'Inactif',
        ],
    'chart_strings' =>
        [
            'pieWedgeName' => 'sections',
            'expandlegend' => 'Afficher la légende',
            'collapselegend' => 'Cacher la légende',
            'clickfordrilldown' => 'Cliquer pour développer',
            'drilldownoptions' => 'Options de masquage',
            'detailview' => 'Vue détaillée...',
            'piechart' => 'Graphique en camembert',
            'groupchart' => 'Groupe de graphique',
            'stackedchart' => 'Graphique empilé',
            'barchart' => 'Histogramme',
            'horizontalbarchart' => 'Diagramme horizontal',
            'linechart' => 'Graphique courbe',
            'noData' => 'Aucune donnée',
            'print' => 'Imprimer',
        ],
    'email_settings_for_ssl' =>
        [
            '0' => '',
            '1' => 'SSL',
            '2' => 'TLS',
        ],
    'import_enclosure_options' =>
        [
            '' => 'Aucun',
            '"' => 'Guillemets (")',
            '\'' => 'Apostrophe (&#39;)',
            'other' => 'Autre:',
        ],
    'import_delimeter_options' =>
        [
            ',' => ',',
            ';' => ';',
            '\t' => '\t',
            '.' => '.',
            ':' => ':',
            '|' => '|',
            'other' => 'Autre:',
        ],
    'library_type' =>
        [
            'DVD' => 'DVD',
            'Magazines' => 'Magazines',
            'Books' => 'Livre',
            'Music' => 'Musique',
        ],
    'kbdocument_attachment_option_dom' =>
        [
            '' => '',
            'some' => 'Avec Pièce(s) Jointe(s)',
            'none' => 'Sans Pièce Jointe',
            'mime' => 'Spécifier un Type Mime',
            'name' => 'Spécifier un Nom',
        ],
    'kbdocument_viewing_frequency_dom' =>
        [
            '' => '',
            'Top_5' => 'Top 5',
            'Top_10' => 'Top 10',
            'Top_20' => 'Top 20',
            'Bot_5' => 'Flop 5',
            'Bot_10' => 'Flop 10',
            'Bot_20' => 'Flop 20',
        ],
    'kbdocument_canned_search' =>
        [
            'faqs' => 'FAQs',
            'all' => 'Tout',
            'added' => 'Ajouts dans les 30 derniers jours',
            'pending' => 'En attente de validation',
            'updated' => 'Mis à jour dans les 30 derniers jours',
        ],
    'kbdocument_date_filter_options' =>
        [
            '' => '',
            'on' => 'Sur',
            'before' => 'Avant',
            'after' => 'Aprés',
            'between_dates' => 'Entre',
            'last_7_days' => 'Dans les 7 derniers jours',
            'next_7_days' => 'Dans les 7 prochains jours',
            'last_month' => 'Le mois dernier',
            'this_month' => 'Ce mois-ci',
            'next_month' => 'Le mois prochain',
            'last_30_days' => 'Dans les 30 derniers jours',
            'next_30_days' => 'Dans les 30 prochains jours',
            'last_year' => 'L&#39;année dernière',
            'this_year' => 'Cette année',
            'next_year' => 'L&#39;année prochaine',
            'isnull' => 'Vide',
        ],
    'countries_dom' =>
        [
            '' => '',
            'ABU DHABI' => 'ABU DHABI',
            'ADEN' => 'ADEN',
            'AFGHANISTAN' => 'AFGHANISTAN',
            'ANGOLA' => 'ANGOLA',
            'ARUBA' => 'ARUBA',
            'BAHAMAS' => 'BAHAMAS',
            'BANGLADESH' => 'BANGLADESH',
            'BELIZE' => 'BELIZE',
            'BOTSWANA' => 'BOTSWANA',
            'BRITISH ANTARCTICA TERRITORY' => 'BRITISH ANTARCTICA TERRITORY',
            'BRITISH WEST INDIES' => 'BRITISH WEST INDIES',
            'BURKINA FASO' => 'BURKINA FASO',
            'BURUNDI' => 'BURUNDI',
            'CANADA' => 'CANADA',
            'CANAL ZONE' => 'CANAL ZONE',
            'CANARY ISLAND' => 'CANARY ISLAND',
            'CEVLON' => 'CEVLON',
            'CHANNEL ISLAND UK' => 'CHANNEL ISLAND UK',
            'CONGO' => 'CONGO',
            'COSTA RICA' => 'COSTA RICA',
            'CUBA' => 'CUBA',
            'CURACAO' => 'CURACAO',
            'DAHOMEY' => 'DAHOMEY',
            'DJIBOUTI' => 'DJIBOUTI',
            'DUBAI' => 'DUBAI',
            'EL SALVADOR' => 'EL SALVADOR',
            'FRANCE' => 'FRANCE',
            'GABON' => 'GABON',
            'GHANA' => 'GHANA',
            'GIBRALTAR' => 'GIBRALTAR',
            'GUADELOUPE' => 'GUADELOUPE',
            'GUAM' => 'GUAM',
            'GUATEMALA' => 'GUATEMALA',
            'GUYANA' => 'GUYANA',
            'HONDURAS' => 'HONDURAS',
            'IFNI' => 'IFNI',
            'IRAQ' => 'IRAQ',
            'KAZAKHSTAN' => 'KAZAKHSTAN',
            'KENYA' => 'KENYA',
            'LAOS' => 'LAOS',
            'LEEWARD ISLANDS' => 'LEEWARD ISLANDS',
            'LESOTHO' => 'LESOTHO',
            'LIECHTENSTEIN' => 'LIECHTENSTEIN',
            'LUXEMBOURG' => 'LUXEMBOURG',
            'MACAO' => 'MACAO',
            'MADAGASCAR' => 'MADAGASCAR',
            'MALAWI' => 'MALAWI',
            'MALDIVES' => 'MALDIVES',
            'MALI' => 'MALI',
            'MARTINIQUE' => 'MARTINIQUE',
            'MELANESIA' => 'MELANESIA',
            'MONACO' => 'MONACO',
            'MOZAMBIQUE' => 'MOZAMBIQUE',
            'NETHERLANDS ANTILLES NEUTRAL ZONE' => 'NETHERLANDS ANTILLES NEUTRAL ZONE',
            'NEW HEBRIDES' => 'NEW HEBRIDES',
            'NICARAGUA' => 'NICARAGUA',
            'NIGER' => 'NIGER',
            'OMAN' => 'OMAN',
            'OTHER' => 'OTHER',
            'PACIFIC ISLAND' => 'PACIFIC ISLAND',
            'PAKISTAN' => 'PAKISTAN',
            'PANAMA' => 'PANAMA',
            'PARAGUAY' => 'PARAGUAY',
            'PHILIPPINES' => 'PHILIPPINES',
            'PORTUGAL' => 'PORTUGAL',
            'PORTUGUESE TIMOR' => 'PORTUGUESE TIMOR',
            'QATAR' => 'QATAR',
            'RUSSIA' => 'RUSSIA',
            'RWANDA' => 'RWANDA',
            'RYUKYU ISLANDS' => 'RYUKYU ISLANDS',
            'SABAH' => 'SABAH',
            'SEYCHELLES' => 'SEYCHELLES',
            'SIERRA LEONE' => 'SIERRA LEONE',
            'SOUTH YEMEN' => 'SOUTH YEMEN',
            'SPANISH SAHARA' => 'SPANISH SAHARA',
            'SRI LANKA' => 'SRI LANKA',
            'SWAZILAND' => 'SWAZILAND',
            'TONGA' => 'TONGA',
            'UKRAINE' => 'UKRAINE',
            'UPPER VOLTA' => 'UPPER VOLTA',
            'URUGUAY' => 'URUGUAY',
            'US PACIFIC ISLAND' => 'US PACIFIC ISLAND',
            'VANUATU' => 'VANUATU',
            'VENEZUELA' => 'VENEZUELA',
            'WAKE ISLAND' => 'WAKE ISLAND',
            'WEST INDIES' => 'WEST INDIES',
            'ZAIRE' => 'ZAIRE',
            'ZIMBABWE' => 'ZIMBABWE',
            'ALBANIA' => 'ALBANIE',
            'ALGERIA' => 'ALGÉRIE',
            'AMERICAN SAMOA' => 'SAMOA AMÉRICAINES',
            'ANDORRA' => 'ANDORRE',
            'ANTARCTICA' => 'ANTARCTIQUE',
            'ANTIGUA' => 'ANTIGUA-ET-BARBUDA',
            'ARGENTINA' => 'ARGENTINE',
            'ARMENIA' => 'ARMÉNIE',
            'AUSTRALIA' => 'AUSTRALIE',
            'AUSTRIA' => 'AUTRICHE',
            'AZERBAIJAN' => 'AZERBAÏDJAN',
            'BAHRAIN' => 'BAHREÏN',
            'BARBADOS' => 'BARBADE',
            'BELARUS' => 'BÉLARUS',
            'BELGIUM' => 'BELGIQUE',
            'BENIN' => 'BÉNIN',
            'BERMUDA' => 'BERMUDES',
            'BHUTAN' => 'BHOUTAN',
            'BOLIVIA' => 'BOLIVIE',
            'BOSNIA' => 'BOSNIE-HERZÉGOVINE',
            'BOUVET ISLAND' => 'BOUVET, ÎLE',
            'BRAZIL' => 'BRÉSIL',
            'BRITISH INDIAN OCEAN TERRITORY' => 'OCÉAN INDIEN, TERRITOIRE BRITANNIQUE',
            'BRITISH VIRGIN ISLANDS' => 'ÎLES VIERGES BRITANNIQUES',
            'BRUNEI' => 'BRUNÉI DARUSSALAM',
            'BULGARIA' => 'BULGARIE',
            'CAMBODIA' => 'CAMBODGE',
            'CAMEROON' => 'CAMEROUN',
            'CAPE VERDI ISLANDS' => 'CAP-VERT',
            'CAYMAN ISLANDS' => 'CAÏMANES, ÎLES',
            'CHAD' => 'TCHAD',
            'CHILE' => 'CHILI',
            'CHINA' => 'CHINE',
            'CHRISTMAS ISLAND' => 'CHRISTMAS, ÎLE',
            'COCOS (KEELING) ISLAND' => 'COCOS (KEELING), ÎLES',
            'COLOMBIA' => 'COLOMBIE',
            'COMORO ISLANDS' => 'COMORES',
            'CONGO KINSHASA' => 'CONGO, RÉPUBLIQUE DÉMOCRATIQUE DU',
            'COOK ISLANDS' => 'COOK, ÎLES',
            'CROATIA' => 'CROATIE',
            'CYPRUS' => 'CHYPRE',
            'CZECH REPUBLIC' => 'TCHÈQUE, RÉPUBLIQUE',
            'DENMARK' => 'DANEMARK',
            'DOMINICA' => 'DOMINIQUE',
            'DOMINICAN REPUBLIC' => 'DOMINICAINE, RÉPUBLIQUE',
            'ECUADOR' => 'ÉQUATEUR',
            'EGYPT' => 'ÉGYPTE',
            'EQUATORIAL GUINEA' => 'GUINÉE ÉQUATORIALE',
            'ESTONIA' => 'ESTONIE',
            'ETHIOPIA' => 'ÉTHIOPIE',
            'FAEROE ISLANDS' => 'FÉROÉ, ÎLES',
            'FALKLAND ISLANDS' => 'FALKLAND, ÎLES (MALVINAS)',
            'FIJI' => 'FIDJI',
            'FINLAND' => 'FINLANDE',
            'FRENCH GUIANA' => 'GUYANE FRANÇAISE',
            'FRENCH POLYNESIA' => 'POLYNÉSIE FRANÇAISE',
            'GAMBIA' => 'GAMBIE',
            'GEORGIA' => 'GÉORGIE',
            'GERMANY' => 'ALLEMAGNE',
            'GREECE' => 'GRÈCE',
            'GREENLAND' => 'GROENLAND',
            'GUINEA' => 'GUINÉE',
            'HAITI' => 'HAÏTI',
            'HONG KONG' => 'HONG-KONG',
            'HUNGARY' => 'HONGRIE',
            'ICELAND' => 'ISLANDE',
            'INDIA' => 'INDE',
            'INDONESIA' => 'INDONÉSIE',
            'IRAN' => 'IRAN, RÉPUBLIQUE ISLAMIQUE',
            'IRELAND' => 'IRLANDE',
            'ISRAEL' => 'ISRAËL',
            'ITALY' => 'ITALIE',
            'IVORY COAST' => 'CÔTE D IVOIRE',
            'JAMAICA' => 'JAMAÏQUE',
            'JAPAN' => 'JAPON',
            'JORDAN' => 'JORDANIE',
            'KOREA' => 'CORÉE, RÉPUBLIQUE POPULAIRE DÉMOCRATIQUE DE',
            'KOREA, SOUTH' => 'CORÉE, RÉPUBLIQUE DE',
            'KUWAIT' => 'KOWEÏT',
            'KYRGYZSTAN' => 'KIRGHIZISTAN',
            'LATVIA' => 'LETTONIE',
            'LEBANON' => 'LIBAN',
            'LIBYA' => 'LIBYENNE, JAMAHIRIYA ARABE',
            'LITHUANIA' => 'LITUANIE',
            'MACEDONIA' => 'MACÉDOINE, EX-RÉPUBLIQUE YOUGOSLAVE',
            'MALAYSIA' => 'MALAISIE',
            'MALTA' => 'MALTE',
            'MAURITANIA' => 'MAURITANIE',
            'MAURITIUS' => 'MAURICE',
            'MEXICO' => 'MEXIQUE',
            'MOLDOVIA' => 'MOLDOVA, RÉPUBLIQUE DE',
            'MONGOLIA' => 'MONGOLIE',
            'MOROCCO' => 'MAROC',
            'MYANAMAR' => 'MYANMAR',
            'NAMIBIA' => 'NAMIBIE',
            'NEPAL' => 'NÉPAL',
            'NETHERLANDS' => 'PAYS-BAS',
            'NETHERLANDS ANTILLES' => 'ANTILLES NÉERLANDAISES',
            'NEW CALADONIA' => 'NOUVELLE-CALÉDONIE',
            'NEW ZEALAND' => 'NOUVELLE-ZÉLANDE',
            'NIGERIA' => 'NIGÉRIA',
            'NORFOLK ISLAND' => 'NORFOLK, ÎLE',
            'NORWAY' => 'NORVÈGE',
            'PAPUA NEW GUINEA' => 'PAPOUASIE-NOUVELLE-GUINÉE',
            'PERU' => 'PÉROU',
            'POLAND' => 'POLOGNE',
            'PUERTO RICO' => 'PORTO RICO',
            'REPUBLIC OF BELARUS' => 'BÉLARUS',
            'REPUBLIC OF SOUTH AFRICA' => 'AFRIQUE DU SUD',
            'REUNION' => 'RÉUNION',
            'ROMANIA' => 'ROUMANIE',
            'SAN MARINO' => 'SAINT-MARIN',
            'SAUDI ARABIA' => 'ARABIE SAOUDITE',
            'SENEGAL' => 'SÉNÉGAL',
            'SERBIA' => 'SERBIE',
            'SINGAPORE' => 'SINGAPOUR',
            'SLOVAKIA' => 'SLOVAQUIE',
            'SLOVENIA' => 'SLOVÉNIE',
            'SOMALILIAND' => 'SOMALIE',
            'SOUTH AFRICA' => 'AFRIQUE DU SUD',
            'SPAIN' => 'ESPAGNE',
            'ST. KITTS AND NEVIS' => 'SAINT-KITTS-ET-NEVIS',
            'ST. LUCIA' => 'SAINTE-LUCIE',
            'SUDAN' => 'SOUDAN',
            'SURINAM' => 'SURINAME',
            'SW AFRICA' => 'NAMIBIE',
            'SWEDEN' => 'SUÈDE',
            'SWITZERLAND' => 'SUISSE',
            'SYRIA' => 'SYRIENNE, RÉPUBLIQUE ARABE',
            'TAIWAN' => 'TAÏWAN, PROVINCE DE CHINE',
            'TAJIKISTAN' => 'TADJIKISTAN',
            'TANZANIA' => 'TANZANIE, RÉPUBLIQUE-UNIE DE',
            'THAILAND' => 'THAÏLANDE',
            'TRINIDAD' => 'TRINITÉ-ET-TOBAGO',
            'TUNISIA' => 'TUNISIE',
            'TURKEY' => 'TURQUIE',
            'UGANDA' => 'OUGANDA',
            'UNITED ARAB EMIRATES' => 'ÉMIRATS ARABES UNIS',
            'UNITED KINGDOM' => 'ROYAUME-UNI',
            'US VIRGIN ISLANDS' => 'ÎLES VIERGES DES ÉTATS-UNIS',
            'USA' => 'ÉTATS-UNIS',
            'UZBEKISTAN' => 'OUZBÉKISTAN',
            'VATICAN CITY' => 'SAINT-SIÈGE (ÉTAT DE LA CITÉ DU VATICAN)',
            'VIETNAM' => 'VIET NAM',
            'WESTERN SAHARA' => 'SAHARA OCCIDENTAL',
            'YEMEN' => 'YÉMEN',
            'ZAMBIA' => 'ZAMBIE',
        ],
    'charset_dom' =>
        [
            'BIG-5' => 'BIG-5 (Taiwan and Hong Kong)',
            /*'CP866'     => 'CP866', // ms-dos Cyrillic */
            /*'CP949'     => 'CP949 (Microsoft Korean)', */
            'CP1251' => 'CP1251 (MS Cyrillic)',
            'CP1252' => 'CP1252 (MS Western European & US)',
            'EUC-CN' => 'EUC-CN (Simplified Chinese GB2312)',
            'EUC-JP' => 'EUC-JP (Unix Japanese)',
            'EUC-KR' => 'EUC-KR (Korean)',
            'EUC-TW' => 'EUC-TW (Taiwanese)',
            'ISO-2022-JP' => 'ISO-2022-JP (Japanese)',
            'ISO-2022-KR' => 'ISO-2022-KR (Korean)',
            'ISO-8859-1' => 'ISO-8859-1 (Western European and US)',
            'ISO-8859-2' => 'ISO-8859-2 (Central and Eastern European)',
            'ISO-8859-3' => 'ISO-8859-3 (Latin 3)',
            'ISO-8859-4' => 'ISO-8859-4 (Latin 4)',
            'ISO-8859-5' => 'ISO-8859-5 (Cyrillic)',
            'ISO-8859-6' => 'ISO-8859-6 (Arabic)',
            'ISO-8859-7' => 'ISO-8859-7 (Greek)',
            'ISO-8859-8' => 'ISO-8859-8 (Hebrew)',
            'ISO-8859-9' => 'ISO-8859-9 (Latin 5)',
            'ISO-8859-10' => 'ISO-8859-10 (Latin 6)',
            'ISO-8859-13' => 'ISO-8859-13 (Latin 7)',
            'ISO-8859-14' => 'ISO-8859-14 (Latin 8)',
            'ISO-8859-15' => 'ISO-8859-15 (Latin 9)',
            'KOI8-R' => 'KOI8-R (Cyrillic Russian)',
            'KOI8-U' => 'KOI8-U (Cyrillic Ukranian)',
            'SJIS' => 'SJIS (MS Japanese)',
            'UTF-8' => 'UTF-8',
        ],
    'timezone_dom' =>
        [
            'Africa/Algiers' => 'Africa/Algiers',
            'Africa/Luanda' => 'Africa/Luanda',
            'Africa/Porto-Novo' => 'Africa/Porto-Novo',
            'Africa/Gaborone' => 'Africa/Gaborone',
            'Africa/Ouagadougou' => 'Africa/Ouagadougou',
            'Africa/Bujumbura' => 'Africa/Bujumbura',
            'Africa/Douala' => 'Africa/Douala',
            'Atlantic/Cape_Verde' => 'Atlantic/Cape_Verde',
            'Africa/Bangui' => 'Africa/Bangui',
            'Africa/Ndjamena' => 'Africa/Ndjamena',
            'Indian/Comoro' => 'Indian/Comoro',
            'Africa/Kinshasa' => 'Africa/Kinshasa',
            'Africa/Lubumbashi' => 'Africa/Lubumbashi',
            'Africa/Brazzaville' => 'Africa/Brazzaville',
            'Africa/Abidjan' => 'Africa/Abidjan',
            'Africa/Djibouti' => 'Africa/Djibouti',
            'Africa/Cairo' => 'Africa/Cairo',
            'Africa/Malabo' => 'Africa/Malabo',
            'Africa/Asmera' => 'Africa/Asmera',
            'Africa/Addis_Ababa' => 'Africa/Addis_Ababa',
            'Africa/Libreville' => 'Africa/Libreville',
            'Africa/Banjul' => 'Africa/Banjul',
            'Africa/Accra' => 'Africa/Accra',
            'Africa/Conakry' => 'Africa/Conakry',
            'Africa/Bissau' => 'Africa/Bissau',
            'Africa/Nairobi' => 'Africa/Nairobi',
            'Africa/Maseru' => 'Africa/Maseru',
            'Africa/Monrovia' => 'Africa/Monrovia',
            'Africa/Tripoli' => 'Africa/Tripoli',
            'Indian/Antananarivo' => 'Indian/Antananarivo',
            'Africa/Blantyre' => 'Africa/Blantyre',
            'Africa/Bamako' => 'Africa/Bamako',
            'Africa/Nouakchott' => 'Africa/Nouakchott',
            'Indian/Mauritius' => 'Indian/Mauritius',
            'Indian/Mayotte' => 'Indian/Mayotte',
            'Africa/Casablanca' => 'Africa/Casablanca',
            'Africa/El_Aaiun' => 'Africa/El_Aaiun',
            'Africa/Maputo' => 'Africa/Maputo',
            'Africa/Windhoek' => 'Africa/Windhoek',
            'Africa/Niamey' => 'Africa/Niamey',
            'Africa/Lagos' => 'Africa/Lagos',
            'Indian/Reunion' => 'Indian/Reunion',
            'Africa/Kigali' => 'Africa/Kigali',
            'Atlantic/St_Helena' => 'Atlantic/St_Helena',
            'Africa/Sao_Tome' => 'Africa/Sao_Tome',
            'Africa/Dakar' => 'Africa/Dakar',
            'Indian/Mahe' => 'Indian/Mahe',
            'Africa/Freetown' => 'Africa/Freetown',
            'Africa/Mogadishu' => 'Africa/Mogadishu',
            'Africa/Johannesburg' => 'Africa/Johannesburg',
            'Africa/Khartoum' => 'Africa/Khartoum',
            'Africa/Mbabane' => 'Africa/Mbabane',
            'Africa/Dar_es_Salaam' => 'Africa/Dar_es_Salaam',
            'Africa/Lome' => 'Africa/Lome',
            'Africa/Tunis' => 'Africa/Tunis',
            'Africa/Kampala' => 'Africa/Kampala',
            'Africa/Lusaka' => 'Africa/Lusaka',
            'Africa/Harare' => 'Africa/Harare',
            'Antarctica/Casey' => 'Antarctica/Casey',
            'Antarctica/Davis' => 'Antarctica/Davis',
            'Antarctica/Mawson' => 'Antarctica/Mawson',
            'Indian/Kerguelen' => 'Indian/Kerguelen',
            'Antarctica/DumontDUrville' => 'Antarctica/DumontDUrville',
            'Antarctica/Syowa' => 'Antarctica/Syowa',
            'Antarctica/Vostok' => 'Antarctica/Vostok',
            'Antarctica/Rothera' => 'Antarctica/Rothera',
            'Antarctica/Palmer' => 'Antarctica/Palmer',
            'Antarctica/McMurdo' => 'Antarctica/McMurdo',
            'Asia/Kabul' => 'Asia/Kabul',
            'Asia/Yerevan' => 'Asia/Yerevan',
            'Asia/Baku' => 'Asia/Baku',
            'Asia/Bahrain' => 'Asia/Bahrain',
            'Asia/Dhaka' => 'Asia/Dhaka',
            'Asia/Thimphu' => 'Asia/Thimphu',
            'Indian/Chagos' => 'Indian/Chagos',
            'Asia/Brunei' => 'Asia/Brunei',
            'Asia/Rangoon' => 'Asia/Rangoon',
            'Asia/Phnom_Penh' => 'Asia/Phnom_Penh',
            'Asia/Beijing' => 'Asia/Beijing',
            'Asia/Harbin' => 'Asia/Harbin',
            'Asia/Shanghai' => 'Asia/Shanghai',
            'Asia/Chongqing' => 'Asia/Chongqing',
            'Asia/Urumqi' => 'Asia/Urumqi',
            'Asia/Kashgar' => 'Asia/Kashgar',
            'Asia/Hong_Kong' => 'Asia/Hong_Kong',
            'Asia/Taipei' => 'Asia/Taipei',
            'Asia/Macau' => 'Asia/Macau',
            'Asia/Nicosia' => 'Asia/Nicosia',
            'Asia/Tbilisi' => 'Asia/Tbilisi',
            'Asia/Dili' => 'Asia/Dili',
            'Asia/Calcutta' => 'Asia/Calcutta',
            'Asia/Jakarta' => 'Asia/Jakarta',
            'Asia/Pontianak' => 'Asia/Pontianak',
            'Asia/Makassar' => 'Asia/Makassar',
            'Asia/Jayapura' => 'Asia/Jayapura',
            'Asia/Tehran' => 'Asia/Tehran',
            'Asia/Baghdad' => 'Asia/Baghdad',
            'Asia/Jerusalem' => 'Asia/Jerusalem',
            'Asia/Tokyo' => 'Asia/Tokyo',
            'Asia/Amman' => 'Asia/Amman',
            'Asia/Almaty' => 'Asia/Almaty',
            'Asia/Qyzylorda' => 'Asia/Qyzylorda',
            'Asia/Aqtobe' => 'Asia/Aqtobe',
            'Asia/Aqtau' => 'Asia/Aqtau',
            'Asia/Oral' => 'Asia/Oral',
            'Asia/Bishkek' => 'Asia/Bishkek',
            'Asia/Seoul' => 'Asia/Seoul',
            'Asia/Pyongyang' => 'Asia/Pyongyang',
            'Asia/Kuwait' => 'Asia/Kuwait',
            'Asia/Vientiane' => 'Asia/Vientiane',
            'Asia/Beirut' => 'Asia/Beirut',
            'Asia/Kuala_Lumpur' => 'Asia/Kuala_Lumpur',
            'Asia/Kuching' => 'Asia/Kuching',
            'Indian/Maldives' => 'Indian/Maldives',
            'Asia/Hovd' => 'Asia/Hovd',
            'Asia/Ulaanbaatar' => 'Asia/Ulaanbaatar',
            'Asia/Choibalsan' => 'Asia/Choibalsan',
            'Asia/Katmandu' => 'Asia/Katmandu',
            'Asia/Muscat' => 'Asia/Muscat',
            'Asia/Karachi' => 'Asia/Karachi',
            'Asia/Gaza' => 'Asia/Gaza',
            'Asia/Manila' => 'Asia/Manila',
            'Asia/Qatar' => 'Asia/Qatar',
            'Asia/Riyadh' => 'Asia/Riyadh',
            'Asia/Singapore' => 'Asia/Singapore',
            'Asia/Colombo' => 'Asia/Colombo',
            'Asia/Damascus' => 'Asia/Damascus',
            'Asia/Dushanbe' => 'Asia/Dushanbe',
            'Asia/Bangkok' => 'Asia/Bangkok',
            'Asia/Ashgabat' => 'Asia/Ashgabat',
            'Asia/Dubai' => 'Asia/Dubai',
            'Asia/Samarkand' => 'Asia/Samarkand',
            'Asia/Tashkent' => 'Asia/Tashkent',
            'Asia/Saigon' => 'Asia/Saigon',
            'Asia/Aden' => 'Asia/Aden',
            'Australia/Darwin' => 'Australia/Darwin',
            'Australia/Perth' => 'Australia/Perth',
            'Australia/Brisbane' => 'Australia/Brisbane',
            'Australia/Lindeman' => 'Australia/Lindeman',
            'Australia/Adelaide' => 'Australia/Adelaide',
            'Australia/Hobart' => 'Australia/Hobart',
            'Australia/Currie' => 'Australia/Currie',
            'Australia/Melbourne' => 'Australia/Melbourne',
            'Australia/Sydney' => 'Australia/Sydney',
            'Australia/Broken_Hill' => 'Australia/Broken_Hill',
            'Indian/Christmas' => 'Indian/Christmas',
            'Pacific/Rarotonga' => 'Pacific/Rarotonga',
            'Indian/Cocos' => 'Indian/Cocos',
            'Pacific/Fiji' => 'Pacific/Fiji',
            'Pacific/Gambier' => 'Pacific/Gambier',
            'Pacific/Marquesas' => 'Pacific/Marquesas',
            'Pacific/Tahiti' => 'Pacific/Tahiti',
            'Pacific/Guam' => 'Pacific/Guam',
            'Pacific/Tarawa' => 'Pacific/Tarawa',
            'Pacific/Enderbury' => 'Pacific/Enderbury',
            'Pacific/Kiritimati' => 'Pacific/Kiritimati',
            'Pacific/Saipan' => 'Pacific/Saipan',
            'Pacific/Majuro' => 'Pacific/Majuro',
            'Pacific/Kwajalein' => 'Pacific/Kwajalein',
            'Pacific/Truk' => 'Pacific/Truk',
            'Pacific/Ponape' => 'Pacific/Ponape',
            'Pacific/Kosrae' => 'Pacific/Kosrae',
            'Pacific/Nauru' => 'Pacific/Nauru',
            'Pacific/Noumea' => 'Pacific/Noumea',
            'Pacific/Auckland' => 'Pacific/Auckland',
            'Pacific/Chatham' => 'Pacific/Chatham',
            'Pacific/Niue' => 'Pacific/Niue',
            'Pacific/Norfolk' => 'Pacific/Norfolk',
            'Pacific/Palau' => 'Pacific/Palau',
            'Pacific/Port_Moresby' => 'Pacific/Port_Moresby',
            'Pacific/Pitcairn' => 'Pacific/Pitcairn',
            'Pacific/Pago_Pago' => 'Pacific/Pago_Pago',
            'Pacific/Apia' => 'Pacific/Apia',
            'Pacific/Guadalcanal' => 'Pacific/Guadalcanal',
            'Pacific/Fakaofo' => 'Pacific/Fakaofo',
            'Pacific/Tongatapu' => 'Pacific/Tongatapu',
            'Pacific/Funafuti' => 'Pacific/Funafuti',
            'Pacific/Johnston' => 'Pacific/Johnston',
            'Pacific/Midway' => 'Pacific/Midway',
            'Pacific/Wake' => 'Pacific/Wake',
            'Pacific/Efate' => 'Pacific/Efate',
            'Pacific/Wallis' => 'Pacific/Wallis',
            'Europe/London' => 'Europe/London',
            'Europe/Dublin' => 'Europe/Dublin',
            'WET' => 'WET',
            'CET' => 'CET',
            'MET' => 'MET',
            'EET' => 'EET',
            'Europe/Tirane' => 'Europe/Tirane',
            'Europe/Andorra' => 'Europe/Andorra',
            'Europe/Vienna' => 'Europe/Vienna',
            'Europe/Minsk' => 'Europe/Minsk',
            'Europe/Brussels' => 'Europe/Brussels',
            'Europe/Sofia' => 'Europe/Sofia',
            'Europe/Prague' => 'Europe/Prague',
            'Europe/Copenhagen' => 'Europe/Copenhagen',
            'Atlantic/Faeroe' => 'Atlantic/Faeroe',
            'America/Danmarkshavn' => 'America/Danmarkshavn',
            'America/Scoresbysund' => 'America/Scoresbysund',
            'America/Godthab' => 'America/Godthab',
            'America/Thule' => 'America/Thule',
            'Europe/Tallinn' => 'Europe/Tallinn',
            'Europe/Helsinki' => 'Europe/Helsinki',
            'Europe/Paris' => 'Europe/Paris',
            'Europe/Berlin' => 'Europe/Berlin',
            'Europe/Gibraltar' => 'Europe/Gibraltar',
            'Europe/Athens' => 'Europe/Athens',
            'Europe/Budapest' => 'Europe/Budapest',
            'Atlantic/Reykjavik' => 'Atlantic/Reykjavik',
            'Europe/Rome' => 'Europe/Rome',
            'Europe/Riga' => 'Europe/Riga',
            'Europe/Vaduz' => 'Europe/Vaduz',
            'Europe/Vilnius' => 'Europe/Vilnius',
            'Europe/Luxembourg' => 'Europe/Luxembourg',
            'Europe/Malta' => 'Europe/Malta',
            'Europe/Chisinau' => 'Europe/Chisinau',
            'Europe/Monaco' => 'Europe/Monaco',
            'Europe/Amsterdam' => 'Europe/Amsterdam',
            'Europe/Oslo' => 'Europe/Oslo',
            'Europe/Warsaw' => 'Europe/Warsaw',
            'Europe/Lisbon' => 'Europe/Lisbon',
            'Atlantic/Azores' => 'Atlantic/Azores',
            'Atlantic/Madeira' => 'Atlantic/Madeira',
            'Europe/Bucharest' => 'Europe/Bucharest',
            'Europe/Kaliningrad' => 'Europe/Kaliningrad',
            'Europe/Moscow' => 'Europe/Moscow',
            'Europe/Samara' => 'Europe/Samara',
            'Asia/Yekaterinburg' => 'Asia/Yekaterinburg',
            'Asia/Omsk' => 'Asia/Omsk',
            'Asia/Novosibirsk' => 'Asia/Novosibirsk',
            'Asia/Krasnoyarsk' => 'Asia/Krasnoyarsk',
            'Asia/Irkutsk' => 'Asia/Irkutsk',
            'Asia/Yakutsk' => 'Asia/Yakutsk',
            'Asia/Vladivostok' => 'Asia/Vladivostok',
            'Asia/Sakhalin' => 'Asia/Sakhalin',
            'Asia/Magadan' => 'Asia/Magadan',
            'Asia/Kamchatka' => 'Asia/Kamchatka',
            'Asia/Anadyr' => 'Asia/Anadyr',
            'Europe/Belgrade' => 'Europe/Belgrade',
            'Europe/Madrid' => 'Europe/Madrid',
            'Africa/Ceuta' => 'Africa/Ceuta',
            'Atlantic/Canary' => 'Atlantic/Canary',
            'Europe/Stockholm' => 'Europe/Stockholm',
            'Europe/Zurich' => 'Europe/Zurich',
            'Europe/Istanbul' => 'Europe/Istanbul',
            'Europe/Kiev' => 'Europe/Kiev',
            'Europe/Uzhgorod' => 'Europe/Uzhgorod',
            'Europe/Zaporozhye' => 'Europe/Zaporozhye',
            'Europe/Simferopol' => 'Europe/Simferopol',
            'America/New_York' => 'America/New_York',
            'America/Chicago' => 'America/Chicago',
            'America/North_Dakota/Center' => 'America/North_Dakota/Center',
            'America/Denver' => 'America/Denver',
            'America/Los_Angeles' => 'America/Los_Angeles',
            'America/Juneau' => 'America/Juneau',
            'America/Yakutat' => 'America/Yakutat',
            'America/Anchorage' => 'America/Anchorage',
            'America/Nome' => 'America/Nome',
            'America/Adak' => 'America/Adak',
            'Pacific/Honolulu' => 'Pacific/Honolulu',
            'America/Phoenix' => 'America/Phoenix',
            'America/Boise' => 'America/Boise',
            'America/Indiana/Indianapolis' => 'America/Indiana/Indianapolis',
            'America/Indiana/Marengo' => 'America/Indiana/Marengo',
            'America/Indiana/Knox' => 'America/Indiana/Knox',
            'America/Indiana/Vevay' => 'America/Indiana/Vevay',
            'America/Kentucky/Louisville' => 'America/Kentucky/Louisville',
            'America/Kentucky/Monticello' => 'America/Kentucky/Monticello',
            'America/Detroit' => 'America/Detroit',
            'America/Menominee' => 'America/Menominee',
            'America/St_Johns' => 'America/St_Johns',
            'America/Goose_Bay' => 'America/Goose_Bay',
            'America/Halifax' => 'America/Halifax',
            'America/Glace_Bay' => 'America/Glace_Bay',
            'America/Montreal' => 'America/Montreal',
            'America/Toronto' => 'America/Toronto',
            'America/Thunder_Bay' => 'America/Thunder_Bay',
            'America/Nipigon' => 'America/Nipigon',
            'America/Rainy_River' => 'America/Rainy_River',
            'America/Winnipeg' => 'America/Winnipeg',
            'America/Regina' => 'America/Regina',
            'America/Swift_Current' => 'America/Swift_Current',
            'America/Edmonton' => 'America/Edmonton',
            'America/Vancouver' => 'America/Vancouver',
            'America/Dawson_Creek' => 'America/Dawson_Creek',
            'America/Pangnirtung' => 'America/Pangnirtung',
            'America/Iqaluit' => 'America/Iqaluit',
            'America/Coral_Harbour' => 'America/Coral_Harbour',
            'America/Rankin_Inlet' => 'America/Rankin_Inlet',
            'America/Cambridge_Bay' => 'America/Cambridge_Bay',
            'America/Yellowknife' => 'America/Yellowknife',
            'America/Inuvik' => 'America/Inuvik',
            'America/Whitehorse' => 'America/Whitehorse',
            'America/Dawson' => 'America/Dawson',
            'America/Cancun' => 'America/Cancun',
            'America/Merida' => 'America/Merida',
            'America/Monterrey' => 'America/Monterrey',
            'America/Mexico_City' => 'America/Mexico_City',
            'America/Chihuahua' => 'America/Chihuahua',
            'America/Hermosillo' => 'America/Hermosillo',
            'America/Mazatlan' => 'America/Mazatlan',
            'America/Tijuana' => 'America/Tijuana',
            'America/Anguilla' => 'America/Anguilla',
            'America/Antigua' => 'America/Antigua',
            'America/Nassau' => 'America/Nassau',
            'America/Barbados' => 'America/Barbados',
            'America/Belize' => 'America/Belize',
            'Atlantic/Bermuda' => 'Atlantic/Bermuda',
            'America/Cayman' => 'America/Cayman',
            'America/Costa_Rica' => 'America/Costa_Rica',
            'America/Havana' => 'America/Havana',
            'America/Dominica' => 'America/Dominica',
            'America/Santo_Domingo' => 'America/Santo_Domingo',
            'America/El_Salvador' => 'America/El_Salvador',
            'America/Grenada' => 'America/Grenada',
            'America/Guadeloupe' => 'America/Guadeloupe',
            'America/Guatemala' => 'America/Guatemala',
            'America/Port-au-Prince' => 'America/Port-au-Prince',
            'America/Tegucigalpa' => 'America/Tegucigalpa',
            'America/Jamaica' => 'America/Jamaica',
            'America/Martinique' => 'America/Martinique',
            'America/Montserrat' => 'America/Montserrat',
            'America/Managua' => 'America/Managua',
            'America/Panama' => 'America/Panama',
            'America/Puerto_Rico' => 'America/Puerto_Rico',
            'America/St_Kitts' => 'America/St_Kitts',
            'America/St_Lucia' => 'America/St_Lucia',
            'America/Miquelon' => 'America/Miquelon',
            'America/St_Vincent' => 'America/St_Vincent',
            'America/Grand_Turk' => 'America/Grand_Turk',
            'America/Tortola' => 'America/Tortola',
            'America/St_Thomas' => 'America/St_Thomas',
            'America/Argentina/Buenos_Aires' => 'America/Argentina/Buenos_Aires',
            'America/Argentina/Cordoba' => 'America/Argentina/Cordoba',
            'America/Argentina/Tucuman' => 'America/Argentina/Tucuman',
            'America/Argentina/La_Rioja' => 'America/Argentina/La_Rioja',
            'America/Argentina/San_Juan' => 'America/Argentina/San_Juan',
            'America/Argentina/Jujuy' => 'America/Argentina/Jujuy',
            'America/Argentina/Catamarca' => 'America/Argentina/Catamarca',
            'America/Argentina/Mendoza' => 'America/Argentina/Mendoza',
            'America/Argentina/Rio_Gallegos' => 'America/Argentina/Rio_Gallegos',
            'America/Argentina/Ushuaia' => 'America/Argentina/Ushuaia',
            'America/Aruba' => 'America/Aruba',
            'America/La_Paz' => 'America/La_Paz',
            'America/Noronha' => 'America/Noronha',
            'America/Belem' => 'America/Belem',
            'America/Fortaleza' => 'America/Fortaleza',
            'America/Recife' => 'America/Recife',
            'America/Araguaina' => 'America/Araguaina',
            'America/Maceio' => 'America/Maceio',
            'America/Bahia' => 'America/Bahia',
            'America/Sao_Paulo' => 'America/Sao_Paulo',
            'America/Campo_Grande' => 'America/Campo_Grande',
            'America/Cuiaba' => 'America/Cuiaba',
            'America/Porto_Velho' => 'America/Porto_Velho',
            'America/Boa_Vista' => 'America/Boa_Vista',
            'America/Manaus' => 'America/Manaus',
            'America/Eirunepe' => 'America/Eirunepe',
            'America/Rio_Branco' => 'America/Rio_Branco',
            'America/Santiago' => 'America/Santiago',
            'Pacific/Easter' => 'Pacific/Easter',
            'America/Bogota' => 'America/Bogota',
            'America/Curacao' => 'America/Curacao',
            'America/Guayaquil' => 'America/Guayaquil',
            'Pacific/Galapagos' => 'Pacific/Galapagos',
            'Atlantic/Stanley' => 'Atlantic/Stanley',
            'America/Cayenne' => 'America/Cayenne',
            'America/Guyana' => 'America/Guyana',
            'America/Asuncion' => 'America/Asuncion',
            'America/Lima' => 'America/Lima',
            'Atlantic/South_Georgia' => 'Atlantic/South_Georgia',
            'America/Paramaribo' => 'America/Paramaribo',
            'America/Port_of_Spain' => 'America/Port_of_Spain',
            'America/Montevideo' => 'America/Montevideo',
            'America/Caracas' => 'America/Caracas',
        ],
    'eapm_list' =>
        [
            'Box' => 'Box.net',
            'Facebook' => 'Facebook',
            'GoToMeeting' => 'GoToMeeting',
            'Google' => 'Google Docs',
            'IBMSmartCloud' => 'IBM SmartCloud',
            'Sugar' => 'Sugar',
            'Twitter' => 'Twitter',
            'WebEx' => 'WebEx',
        ],
    'eapm_list_import' =>
        [
            'Google' => 'Google Contacts',
        ],
    'eapm_list_documents' =>
        [
            'Google' => 'Google Docs',
        ],
    'token_status' =>
        [
            1 => 'Request',
            2 => 'Access',
            3 => 'Invalid',
        ],
    'product_status_quote_key' => 'Quotes',
    'in_total_group_stages' =>
        [
            'Draft' => 'Brouillon',
            'Negotiation' => 'Négociation',
            'Delivered' => 'Délivré',
            'On Hold' => 'Suspendu',
            'Confirmed' => 'Confirmé',
            'Closed Accepted' => 'Clos Accepté',
            'Closed Lost' => 'Perdu',
            'Closed Dead' => 'Clos Abandonné',
        ],

    'call_status_dom' =>
        [
            'Planned' => 'Planifié',
            'Held' => 'Terminé',
            'Not Held' => 'Annulé',
        ],
    'call_direction_dom' =>
        [
            'Inbound' => 'Entrant',
            'Outbound' => 'Sortant',
        ],
    'gender_list' =>
        [
            'male' => 'Homme',
            'female' => 'Femme',
        ],
    'case_status_dom' =>
        [
            'New' => 'Nouveau',
            'Assigned' => 'Assigné',
            'Closed' => 'Fermé',
            'Pending Input' => 'En attente',
            'Rejected' => 'Rejeté',
            'Duplicate' => 'Doublon',
        ],
    'case_priority_dom' =>
        [
            'P1' => 'Haute',
            'P2' => 'Moyenne',
            'P3' => 'Basse',
        ],
    'user_type_dom' =>
        [
            'RegularUser' => 'Utilisateur normal',
            'Administrator' => 'Administrateur',
        ],
    'user_status_dom' =>
        [
            'Active' => 'Actif',
            'Inactive' => 'Inactif',
        ],

    'knowledge_status_dom' => [
        'Draft' => 'Brouillon',
        'Released' => 'Publié',
        'Retired' => 'Retiré',
    ],
    'employee_status_dom' =>
        [
            'Active' => 'Actif',
            'Terminated' => 'Inactif',
            'Leave of Absence' => 'Absence temporaire',
        ],
    'project_task_priority_default' => 'Moyenne',
    'project_task_priority_options' =>
        [
            'High' => 'Haute',
            'Medium' => 'Moyenne',
            'Low' => 'Basse',
        ],
    'project_task_status_options' =>
        [
            'Not Started' => 'Non démarrée',
            'In Progress' => 'En cours',
            'Completed' => 'Terminée',
            'Pending Input' => 'En attente',
            'Deferred' => 'Reportée',
        ],
    'project_status_dom' =>
        [
            'Draft' => 'Brouillon',
            'In Review' => 'En relecture',
            'Published' => 'Publié',
        ],
    'project_duration_units_dom' =>
        [
            'Days' => 'Jours',
            'Hours' => 'Heures',
        ],
    'project_priority_options' =>
        [
            'High' => 'Haute',
            'Medium' => 'Moyen',
            'Low' => 'Bas',
        ],
    'product_status_dom' =>
        [
            'Quotes' => 'Devis fait',
            'Orders' => 'Commandé',
            'Ship' => 'Livré',
        ],
    'pricing_formula_dom' =>
        [
            'Fixed' => 'Prix Fixe',
            'ProfitMargin' => 'Marge sur Prix Final',
            'PercentageMarkup' => 'Marge sur le Prix de Revient',
            'PercentageDiscount' => 'Remise sur Prix Public',
            'IsList' => 'Même que Prix Public',
        ],
    'product_template_status_dom' =>
        [
            'Available' => 'En Stock',
            'Unavailable' => 'Hors Stock',
        ],
    'support_term_dom' =>
        [
            '+6 months' => '6 mois',
            '+1 year' => '1 an',
            '+2 years' => '2 ans',
        ],
    'quote_type_dom' =>
        [
            'Quotes' => 'Devis Fait',
            'Orders' => 'Commande',
        ],
    'quote_stage_dom' =>
        [
            'Draft' => 'Brouillon',
            'Negotiation' => 'Négociation',
            'Delivered' => 'Délivré',
            'On Hold' => 'Suspendu',
            'Confirmed' => 'Confirmé',
            'Closed Accepted' => 'Clos Accepté',
            'Closed Lost' => 'Perdu',
            'Closed Dead' => 'Clos Abandonné',
        ],
    'order_stage_dom' =>
        [
            'Pending' => 'En attente',
            'Confirmed' => 'Confirmé',
            'On Hold' => 'Suspendu',
            'Shipped' => 'Livré',
            'Cancelled' => 'Annulé',
        ],
    'layouts_dom' =>
        [
            'Standard' => 'Devis',
            'Invoice' => 'Facture',
            'Terms' => 'Selon Conditions',
        ],
    'issue_status_dom' =>
        [
            'New' => 'Nouveau',
            'Assigned' => 'Assigné',
            'Closed' => 'Fermé',
            'Pending' => 'En attente',
            'Rejected' => 'Rejeté',
        ],
    'bug_status_dom' =>
        [
            'New' => 'Nouveau',
            'Assigned' => 'Assigné',
            'Closed' => 'Fermé',
            'Pending' => 'En attente',
            'Rejected' => 'Rejeté',
        ],
    'bug_type_dom' =>
        [
            'Defect' => 'Défaut',
            'Feature' => 'Fonctionnalité',
        ],
    'dom_cal_month_long' =>
        [
            0 => '',
            1 => 'Janvier',
            2 => 'Février',
            3 => 'Mars',
            4 => 'Avril',
            5 => 'Mai',
            6 => 'Juin',
            7 => 'Juillet',
            8 => 'Août',
            9 => 'Septembre',
            10 => 'Octobre',
            11 => 'Novembre',
            12 => 'Décembre',
        ],
    'dom_cal_day_long' =>
        [
            0 => '',
            1 => 'Dimanche',
            2 => 'Lundi',
            3 => 'Mardi',
            4 => 'Mercredi',
            5 => 'Jeudi',
            6 => 'Vendredi',
            7 => 'Samedi',
        ],
    'dom_cal_day_short' =>
        [
            0 => '',
            1 => 'Dim',
            2 => 'Lun',
            3 => 'Mar',
            4 => 'Mer',
            5 => 'Jeu',
            6 => 'Ven',
            7 => 'Sam',
        ],
    'dom_report_types' =>
        [
            'tabular' => 'Standard',
            'summary' => 'Consolidé',
            'detailed_summary' => 'Consolidé avec détails',
            'Matrix' => 'Matrice',
        ],
    'dom_email_types' =>
        [
            'out' => 'Envoyé',
            'archived' => 'Archivé',
            'draft' => 'Brouillon',
            'inbound' => 'Entrant',
            'campaign' => 'Campagne',
        ],
    'dom_email_status' =>
        [
            'archived' => 'Archivé',
            'closed' => 'Fermé',
            'draft' => 'Brouillon',
            'read' => 'Lu',
            'replied' => 'Répondu',
            'sent' => 'Envoyé',
            'send_error' => 'Erreur Envoi',
            'unread' => 'Non Lu',
        ],
    'dom_email_archived_status' =>
        [
            'archived' => 'Archivé',
        ],
    'dom_mailbox_type' =>
        [
            'pick' => '-- Aucun --',
            'createcase' => 'Créer un Ticket',
            'bounce' => 'Gestion des Bounces',
        ],
    'dom_email_errors' =>
        [
            1 => 'Sélectionner 1 seul utilisateur quand vous assignez des éléments directement.',
            2 => 'Vous pouvez seulement assigner des éléments cochés lorsque vous souhaitez assigner directement des éléments.',
        ],
    'dom_email_bool' =>
        [
            'bool_true' => 'Oui',
            'bool_false' => 'Non',
        ],
    'dom_int_bool' =>
        [
            1 => 'Oui',
        ],
    'dom_switch_bool' =>
        [
            'on' => 'Oui',
            'off' => 'Non',
            '' => 'Non',
        ],
    'dom_email_link_type' =>
        [
            'sugar' => 'Client Mail SugarCRM',
            'mailto' => 'Client Mail Externe',
        ],
    'dom_email_editor_option' =>
        [
            '' => 'Format email par défaut',
            'html' => 'Email HTML',
            'plain' => 'Email Texte Brut',
        ],
    'jobtask_status_dom' =>
        [
            'active' => 'active',
            'running' => 'running',
            'on_hold' => 'on hold'
        ],
    'job_status_dom' =>
        [
            'Active' => 'Actif',
            'Inactive' => 'Inactif',
            'OnHold' => 'On hold',
            'Running' => 'Running',
        ],
    'forecast_schedule_status_dom' =>
        [
            'Active' => 'Actif',
            'Inactive' => 'Inactif',
        ],
    'dom_meeting_accept_options' =>
        [
            'accept' => 'Accepter',
            'decline' => 'Décliner',
            'tentative' => 'Incertain',
        ],
    'dom_meeting_accept_status' =>
        [
            'accept' => 'Accepté',
            'decline' => 'Décliné',
            'tentative' => 'Incertain',
            'none' => 'Indéfini',
        ],
    'report_maker_status_dom' =>
        [
            'Single Module' => 'Module Simple',
            'Multi Module' => 'Multi-Module',
        ],
    'report_align_dom' =>
        [
            'left' => 'Gauche',
            'center' => 'Centre',
            'right' => 'Droite',
        ],
    'report_color_dom' =>
        [
            '' => 'Defaut',
            'black' => 'Noir',
            'green' => 'Vert',
            'blue' => 'Bleu',
            'red' => 'Rouge',
            'white' => 'Blanc',
            'DarkGreen' => 'Vert foncé',
            'LightGray' => 'Gris clair',
            'DodgerBlue' => 'Bleu',
            'LightBlue' => 'Bleu clair',
        ],
    'font_size_dom' =>
        [
            -5 => 'Plus petit (-5)',
            -4 => 'Plus petit (-4)',
            -3 => 'Plus petit (-3)',
            -2 => 'Plus petit (-2)',
            -1 => 'Plus petit (-1)',
            'Default' => 'Defaut',
            1 => 'Plus grand (+1)',
            2 => 'Plus grand (+2)',
            3 => 'Plus grand (+3)',
            4 => 'Plus grand (+4)',
            5 => 'Plus grand (+5)',
        ],
    'query_type_dom' =>
        [
            'Main Query' => 'Requête principale',
        ],
    'query_column_type_dom' =>
        [
            'Display' => 'Affichage',
            'Calculation' => 'Calcul',
        ],
    'query_display_type_dom' =>
        [
            'Default' => 'Defaut',
            'Custom' => 'Personnalisé',
            'Hidden' => 'Caché',
        ],
    'query_groupby_qualifier_dom' =>
        [
            'Day' => 'Jour',
            'Week' => 'Semaine',
            'Month' => 'Mois',
            'Quarter' => 'Trimestre',
            'Year' => 'Année',
        ],
    'query_groupby_calc_type_dom' =>
        [
            'SUM' => 'SOMME',
            'AVG' => 'MOYENNE',
            'COUNT' => 'COMPTEUR',
            'STDDEV' => 'ECART-TYPE',
            'VARIANCE' => 'VARIANCE',
        ],
    'query_groupby_type_dom' =>
        [
            'Field' => 'Champ Standard',
            'Time' => 'Intervalle de Temps',
        ],
    'query_groupby_axis_dom' =>
        [
            'Rows' => 'Lignes (Y-Axis)',
            'Columns' => 'Colonnes (X-Axis)',
        ],
    'query_calc_calc_type_dom' =>
        [
            'SUM' => 'SOMME',
            'AVG' => 'MOYENNE',
            'MAX' => 'MAXIMUM',
            'MIN' => 'MINIMUM',
            'COUNT' => 'COMPTEUR',
            'STDDEV' => 'ECART-TYPE',
            'VARIANCE' => 'VARIANCE',
        ],
    'query_calc_leftright_type_dom' =>
        [
            'Field' => 'Champ',
            'Value' => 'Valeur',
            'Group' => 'Groupe',
        ],
    'dataset_layout_type_dom' =>
        [
            'Column' => 'Colonne',
        ],
    'custom_layout_dom' =>
        [
            'Disabled' => 'Désactivé',
            'Enabled' => 'Activé',
        ],
    'dataset_att_format_type_scalar_dom' =>
        [
            'Year' => 'Année',
            'Quarter' => 'Trimestre',
            'Month' => 'Mois',
            'Week' => 'Semaine',
            'Day' => 'Jour',
        ],
    'wflow_type_dom' =>
        [
            'Normal' => 'Quand enregistrement sauvegardé',
            'Time' => 'Aprés un délai dépassé',
        ],
    'mselect_type_dom' =>
        [
            'Equals' => 'Est',
            'in' => 'Contient',
        ],
    'mselect_multi_type_dom' =>
        [
            'in' => 'Fait partie de',
            'not_in' => 'Ne fait pas partie de',
        ],
    'cselect_type_dom' =>
        [
            'Equals' => 'Egal',
            'Does not Equal' => 'Différent de',
        ],
    'dselect_type_dom' =>
        [
            'Equals' => 'Egal',
            'Less Than' => 'Inférieur à',
            'More Than' => 'Supérieur à',
            'Does not Equal' => 'Différent de',
        ],
    'bselect_type_dom' =>
        [
            'bool_true' => 'Oui',
            'bool_false' => 'Non',
        ],
    'bopselect_type_dom' =>
        [
            'Equals' => 'Egal',
        ],
    'tselect_type_dom' =>
        [
            '0' => '0 heure',
            '14440' => '4 heures',
            '28800' => '8 heures',
            '43200' => '12 heures',
            '86400' => '1 jour',
            '172800' => '2 jours',
            '259200' => '3 jours',
            '345600' => '4 jours',
            '432000' => '5 jours',
            '604800' => '1 semaine',
            '1209600' => '2 semaines',
            '1814400' => '3 semaines',
            '2592000' => '30 jours',
            '5184000' => '60 jours',
            '7776000' => '90 jours',
            '10368000' => '120 jours',
            '12960000' => '150 jours',
            '15552000' => '180 jours',
        ],
    'dtselect_type_dom' =>
        [
            'More Than' => 'est supérieur à',
            'Less Than' => 'est inférieur à',
        ],
    'wflow_source_type_dom' =>
        [
            'Normal Message' => 'Message Normal',
            'Custom Template' => 'Modèle personnalisé',
            'System Default' => 'Systéme par Default',
        ],
    'wflow_user_type_dom' =>
        [
            'current_user' => 'Utilisateurs actuels',
            'rel_user' => 'Utilisateurs rattachés',
            'rel_user_custom' => 'Utilisateur personnalisé rattaché',
            'specific_team' => 'Equipe spécifique',
            'specific_role' => 'Rôle spécifique',
            'specific_user' => 'Utilisateur spécifique',
        ],
    'wflow_array_type_dom' =>
        [
            'future' => 'Nouvelle valeur',
            'past' => 'Ancienne valeur',
        ],
    'wflow_relate_type_dom' =>
        [
            'Self' => 'Assigné à',
            'Manager' => 'Responsable de l&#39;utilisateur',
        ],
    'wflow_address_type_to_only_dom' =>
        [
            'to' => 'A:',
        ],
    'wflow_action_type_dom' =>
        [
            'update' => 'Mise à jour de l&#39;enregistrement',
            'update_rel' => 'Mise à jour de l&#39;enregistrement associé',
            'new' => 'Nouvel enregistrement',
        ],
    'wflow_action_datetime_type_dom' =>
        [
            'Triggered Date' => 'Date déclenchée',
            'Existing Value' => 'Valeur existante',
        ],
    'wflow_set_type_dom' =>
        [
            'Basic' => 'Options de base',
            'Advanced' => 'Options avancées',
        ],
    'wflow_adv_user_type_dom' =>
        [
            'assigned_user_id' => 'Utilisateur assigné à l&#39;enregistrement déclenché',
            'modified_user_id' => 'Utilisateur qui a, en dernier, modifié l&#39;enregistrement déclenché',
            'created_by' => 'Utilisateur qui a créé l&#39;enregistrement déclenché',
            'current_user' => 'Utilisateur connecté',
        ],
    'wflow_adv_team_type_dom' =>
        [
            'team_id' => 'Equipe actuelle de l&#39;enregistrement déclenché',
            'current_team' => 'Equipe de l&#39;utilisateur connecté',
        ],
    'wflow_adv_enum_type_dom' =>
        [
            'retreat' => 'Remonter dans la liste déroulante de',
            'advance' => 'Descendre dans la liste déroulante de',
        ],
    'wflow_record_type_dom' =>
        [
            'All' => 'Enregistrements nouveaux et existants',
            'New' => 'Nouveaux enregistrements seulement',
            'Update' => 'Enregistrements existant seulement',
        ],
    'wflow_rel_type_dom' =>
        [
            'all' => 'Toutes les associations',
            'filter' => 'Filtrage par champ pour: ',
        ],
    'wflow_relfilter_type_dom' =>
        [
            'all' => 'Toute liaison au module',
            'any' => 'n&#39;importe quelle liaison au module',
        ],
    'wflow_fire_order_dom' =>
        [
            'alerts_actions' => 'Alertes puis Actions',
            'actions_alerts' => 'Actions puis Alertes',
        ],
    'merge_operators_dom' =>
        [
            'like' => 'contient',
            'exact' => 'est exactement',
            'start' => 'commence par',
        ],
    'custom_fields_importable_dom' =>
        [
            'true' => 'Oui',
            'false' => 'Non',
            'required' => 'Requis',
        ],
    'Elastic_boost_options' => [
        '0' => 'Désactivé',
        '1' => 'Boost faible',
        '2' => 'Boost moyen',
        '3' => 'Boost élevé',
    ],
    'custom_fields_merge_dup_dom' =>
        [
            0 => 'Désactivé',
            1 => 'Uniquement Fusionnable',
            2 => 'Utilisable dans la recherche de doublons et Fusionnable',
            3 => 'Utilisable dans la recherche de doublons (séléctionné par défaut) et Fusionnable',
            4 => 'Utilisable dans la recherche de doublons mais NON Fusionnable',
        ],
    'contract_status_dom' =>
        [
            'notstarted' => 'Non démarré',
            'inprogress' => 'En cours',
            'signed' => 'Signé',
        ],
    'contract_payment_frequency_dom' =>
        [
            'monthly' => 'Mensuel',
            'quarterly' => 'Trimestriel',
            'halfyearly' => '6 mois',
            'yearly' => 'Annuel',
        ],
    'contract_expiration_notice_dom' =>
        [
            1 => '1 Jour',
            3 => '3 Jours',
            5 => '5 Jours',
            7 => '1 Semaine',
            14 => '2 Semaines',
            21 => '3 Semaines',
            31 => '1 Mois',
        ],
    'projects_priority_options' =>
        [
            'high' => 'Haut',
            'medium' => 'Moyen',
            'low' => 'Bas',
        ],
    'projects_status_options' =>
        [
            'notstarted' => 'Non démarré',
            'inprogress' => 'En Cours',
            'completed' => 'Terminé',
        ],
    'pipeline_chart_dom' =>
        [
            'fun' => 'Entonnoir',
            'hbar' => 'Barre Horizontale',
        ],
    'release_status_dom' =>
        [
            'Active' => 'Actif',
            'Inactive' => 'Inactif',
        ],
    'link_target_dom' =>
        [
            '_blank' => 'Nouvelle fenêtre',
            '_self' => 'Fenêtre courante',
        ],
    'dashlet_auto_refresh_options' =>
        [
            -1 => 'Manuellement',
            30 => '30 secondes',
            60 => '1 minute',
            180 => '3 minutes',
            300 => '5 minutes',
            600 => '10 minutes',
        ],
    'dashlet_auto_refresh_options_admin' =>
        [
            -1 => 'Jamais',
            30 => 'Toutes les 30 secondes',
            60 => 'Toutes les 1 minute',
            180 => 'Toutes les 3 minutes',
            300 => 'Toutes les 5 minutes',
            600 => 'Toutes les 10 minutes',
        ],
    'date_range_search_dom' =>
        [
            '=' => 'Le',
            'not_equal' => 'Différent du',
            'greater_than' => 'Après le',
            'less_than' => 'Avant le',
            'last_7_days' => 'Dans les 7 derniers jours',
            'next_7_days' => 'Dans les 7 prochains jours',
            'last_30_days' => 'Dans les 30 derniers jours',
            'next_30_days' => 'Dans les 30 prochains jours',
            'last_month' => 'Le mois dernier',
            'this_month' => 'Ce mois-ci',
            'next_month' => 'Le mois prochain',
            'last_year' => 'L&#39;année dernière',
            'this_year' => 'Cette année',
            'next_year' => 'L&#39;année prochaine',
            'between' => 'Entre',
        ],
    'numeric_range_search_dom' =>
        [
            '=' => 'Egal',
            'not_equal' => 'Différent de',
            'greater_than' => 'Supérieur à',
            'greater_than_equals' => 'Supérieur ou égal à',
            'less_than' => 'Inférieur à',
            'less_than_equals' => 'Inférieur ou égal à',
            'between' => 'Entre',
        ],
    'lead_conv_activity_opt' =>
        [
            'copy' => 'Copier',
            'move' => 'Déplacer',
            'donothing' => 'Ne rien faire',
        ],

    'salesdoc_doccategories' => [
        'QT' => 'Offre',
        'OR' => 'Commande',
        'IV' => 'Facture',
        'CT' => 'Contrat'
    ],

    'kbdocument_status_dom' =>
        [
            'Draft' => 'Brouillon',
            'Expired' => 'Obsolète',
            'In Review' => 'En validation',
            'Published' => 'Publié',
        ],
    'kbadmin_actions_dom' =>
        [
            '' => '-- Actions --',
            'Create New Tag' => 'Créé un nouveau Tag',
            'Delete Tag' => 'Supprimer un Tag',
            'Rename Tag' => 'Renommer un Tag',
            'Move Selected Articles' => 'Déplacer les articles sélectionnés',
            'Apply Tags On Articles' => 'Appliquer les Tags aux articles sélectionnés',
            'Delete Selected Articles' => 'Supprimer les articles sélectionnés',
        ],
    'commit_stage_binary_dom' =>
        [
            'exclude' => 'Exclue',
            'include' => 'Incluse',
        ],
    'commit_stage_custom_dom' =>
        [
            'include' => 'Incluse',
            'customRange0' => 'Perso 1',
            'customRange1' => 'Perso 2',
            'customRange2' => 'Perso 3',
            'exclude' => 'Exclue',
        ],
    'commit_stage_dom' =>
        [
            'include' => 'Incluse',
            'exclude' => 'Exclue',
            'upside' => 'A côté',
        ],
    'forecasts_chart_options_dataset' =>
        [
            'likely' => 'Réaliste',
            'best' => 'Meilleur',
            'worst' => 'Pire',
        ],
    'forecasts_chart_options_group' =>
        [
            'forecast' => 'Prévisions incluses',
            'sales_stage' => 'Phase de vente',
            'probability' => 'Probabilité',
        ],
    'forecasts_config_ranges_options_dom' =>
        [
            'show_binary' => '2 intervalles',
            'show_buckets' => '3 intervalles',
        ],
    'forecasts_timeperiod_options_dom' =>
        [
            'Annual' => 'Annuel (sous-périodes trimestrielles)',
            'Quarter' => 'Trimestriel (sous-périodes mensuelles)',
        ],
    'forecasts_timeperiod_types_dom' =>
        [
            'chronological' => 'Par année',
        ],
    'oauth_client_type_dom' =>
        [
            'support_portal' => 'Portail de support',
            'user' => 'Utilisateur Sugar',
        ],
    'oauth_type_dom' =>
        [
            'oauth1' => 'OAuth 1.0',
            'oauth2' => 'OAuth 2.0',
        ],
    'state_dom' =>
        [
            'AK' => 'Alaska',
            'AL' => 'Alabama',
            'AR' => 'Arkansas',
            'AZ' => 'Arizona',
            'CA' => 'California',
            'CO' => 'Colorado',
            'CT' => 'Connecticut',
            'DC' => 'District Of Columbia',
            'DE' => 'Delaware',
            'FL' => 'Florida',
            'GA' => 'Georgia',
            'HI' => 'Hawaii',
            'IA' => 'Iowa',
            'ID' => 'Idaho',
            'IL' => 'Illinois',
            'IN' => 'Indiana',
            'KS' => 'Kansas',
            'KY' => 'Kentucky',
            'LA' => 'Louisiana',
            'MA' => 'Massachusetts',
            'MD' => 'Maryland',
            'ME' => 'Maine',
            'MI' => 'Michigan',
            'MN' => 'Minnesota',
            'MO' => 'Missouri',
            'MS' => 'Mississippi',
            'MT' => 'Montana',
            'NC' => 'North Carolina',
            'ND' => 'North Dakota',
            'NE' => 'Nebraska',
            'NH' => 'New Hampshire',
            'NJ' => 'New Jersey',
            'NM' => 'New Mexico',
            'NV' => 'Nevada',
            'NY' => 'New York',
            'OH' => 'Ohio',
            'OK' => 'Oklahoma',
            'OR' => 'Oregon',
            'PA' => 'Pennsylvania',
            'RI' => 'Rhode Island',
            'SC' => 'South Carolina',
            'SD' => 'South Dakota',
            'TN' => 'Tennessee',
            'TX' => 'Texas',
            'UT' => 'Utah',
            'VA' => 'Virginia',
            'VT' => 'Vermont',
            'WA' => 'Washington',
            'WI' => 'Wisconsin',
            'WV' => 'West Virginia',
            'WY' => 'Wyoming',
        ],
];
$app_list_strings ['emailTemplates_type_list'] = [
    '' => '',
    'campaign' => 'Campagne',
    'email' => 'Email',
    'workflow' => 'Workflow',
];

$app_list_strings ['emailTemplates_type_list_campaigns'] = [
    '' => '',
    'campaign' => 'Campagne',
];

$app_list_strings ['emailTemplates_type_list_no_workflow'] = [
    '' => '',
    'campaign' => 'Campagne',
    'email' => 'Email',
];
$app_strings ['documentation'] = [
    'LBL_DOCS' => 'Documentation',
    'ULT' => '02_Sugar_Ultimate',
    'ENT' => '02_Sugar_Enterprise',
    'CORP' => '03_Sugar_Corporate',
    'PRO' => '04_Sugar_Professional',
    'COM' => '05_Sugar_Community_Edition',
];


//EventRegistrations module
$app_list_strings['eventregistration_status_dom'] = [
    'interested' => 'indisponible',
    'tentative' => 'peut-être',
    'registered' => 'inscrit',
    'unregistered' => 'désinscrit',
    'attended' => 'a participé',
    'notattended' => 'n\' pas participé'
];

//ProjectWBSs module
$app_list_strings['wbs_status_dom'] = [
    '0' => 'créé',
    '1' => 'commencé',
    '2' => 'terminé'
];

//ProductAttributes
$app_list_strings['productattributedatatypes_dom'] = [
    'di' => 'Dropdown',
    'f' => 'Checkbox',
    'n' => 'nombre',
    's' => 'Sélection multiple',
    'vc' => 'Texte'
];
$app_list_strings['productattribute_usage_dom'] = [
    'required' => 'obligatoire',
    'optional' => 'optionnel',
    'none' => 'aucun',
    'hidden' => 'caché'
];

//AccountCCDetails
$app_list_strings['abccategory_dom'] = [
    '' => '',
    'A' => 'A',
    'B' => 'B',
    'C' => 'C',
];

$app_list_strings['logicoperators_dom'] = [
    'and' => 'et',
    'or' => 'ou',
];

$app_list_strings['comparators_dom'] = [
    'equal' => 'égale à',
    'unequal' => 'non égale à',
    'greater' => 'supérieur à ',
    'greaterequal' => 'supérieur ou égale à',
    'less' => 'inférieur',
    'lessequal' => 'inférieur ou égale à',
    'contain' => 'contient',
    'ncontain' => 'non contient',
    'empty' => 'vide',
    'nempty' => 'non vide',
    'regex' => 'matches regex',
    'notregex' => 'does not match regex'
];

$app_list_strings['moduleList']['AccountKPIs'] = 'Key Performance Indicators';

if (file_exists('extensions/modules/ServiceOrders/ServiceOrder.php')) {
    $app_list_strings['serviceorder_status_dom'] = [
        'new' => 'Nouvelle',
        'planned' => 'Planifiée',
        'completed' => 'Terminée',
        'cancelled' => 'Annulée',
        'signed' => 'Signée',
    ];
    $app_list_strings['parent_type_display']['ServiceOrders'] = 'Service Commandes';
    $app_list_strings['record_type_display']['ServiceOrders'] = 'Service Commandes';
    $app_list_strings['record_type_display_notes']['ServiceOrders'] = 'Service Commandes';
}
if (file_exists('modules/ServiceTickets/ServiceTicket.php')) {
    $app_list_strings['serviceticket_status_dom'] = [
        'New' => 'Nouveau',
        'Assigned' => 'Assigné',
        'Closed' => 'Terminé',
        'Pending Input' => 'Réponse en attente',
        'Rejected' => 'Refusé',
        'Duplicate' => 'Dublon',
    ];

    $app_list_strings['serviceticket_class_dom'] = [
        'P1' => 'haute',
        'P2' => 'moyenne',
        'P3' => 'basse',
    ];
    $app_list_strings['serviceticket_resaction_dom'] = [
        '' => '',
        'credit' => 'Créer un avoir',
        'replace' => 'Remplacer',
        'return' => 'Article va être renvoyé'
    ];
    $app_list_strings['parent_type_display']['ServiceTickets'] = 'Service Tickets';
    $app_list_strings['record_type_display']['ServiceTickets'] = 'Service Tickets';
    $app_list_strings['record_type_display_notes']['ServiceTickets'] = 'Service Tickets';
}

if (file_exists('extensions/modules/ServiceFeedbacks/ServiceFeedback.php')) {
    $app_list_strings['service_satisfaction_scale_dom'] = [
        1 => '1 - insatisfait',
        2 => '2',
        3 => '3',
        4 => '4',
        5 => '5 - très satisfait',
    ];
    $app_list_strings['servicefeedback_status_dom'] = [
        'sent' => 'envoyé',
        'completed' => 'complété',
    ];
    $app_list_strings['servicefeedback_parent_type_display'] = [
        'ServiceTickets' => 'Service Tickets',
        'ServiceOrders' => 'Service Commandes',
        'ServiceCalls' => 'Service Appels',
    ];
    $app_list_strings['record_type_display'] = [
        'ServiceTickets' => 'Service Tickets',
        'ServiceOrders' => 'Service Commandes',
        'ServiceCalls' => 'Service Appels',
    ];
}

$app_list_strings['mailboxes_transport_dom'] = [
    'imap' => 'IMAP/SMTP',
    'mailgun' => 'Mailgun',
    'sendgrid' => 'Sendgrid',
    'twillio' => 'Twillio',
];

$app_list_strings['mailboxes_outbound_comm'] = [
    'no' => 'Nicht erlaubt',
    'single' => 'courriel individuel',
    'mass' => 'courriels individuels et courriels de masse',
    'single_sms' => 'SMS individuel',
    'mass_sms' => 'SMS individuels et SMS de masse',
];

$app_list_strings['output_template_types'] = [
    '' => '',
    'email' => 'Courriel',
    'pdf' => 'PDF',
];

$app_list_strings['languages'] = [
    '' => '',
    'de' => 'Deutsch',
    'en' => 'Englisch',
    'fr' => 'français',
];


$app_list_strings['spiceaclobjects_types_dom'] = [
    '0' => 'standard',
    '1' => 'restrict (all)',
    '2' => 'exclude (all)',
    '3' => 'limit activity'
    //'4' => 'restrict (profile)',
    //'5' => 'exclude (profile)'
];

// CR1000333
$app_list_strings['cruser_role_dom'] = [
    'developer' => 'Développeur',
    'tester' => 'Testeur',
];

$app_list_strings['crstatus_dom'] = [
    '-1' => 'backlog',
    '0' => 'créé',
    '1' => 'mise en oeuvre',
    '2' => 'unit tested',
    '3' => 'integration test',
    '4' => 'terminé', // was 3 before CR1000333
    '5' => 'annulé / repoussé' // was 4 before CR1000333
];

$app_list_strings['crtype_dom'] = [
    '0' => 'bug',
    '1' => 'feature request',
    '2' => 'change request',
    '3' => 'hotfix'
];

// CR1000333
$app_list_strings['deploymentrelease_status_dom'] = [
    '' => '',
    'plan' => 'planification', // value was planned before CR1000333
    'develop' => 'développement',
    'prepare' => 'environment',
    'test' => 'test',
    'release' => 'publication',
    'closed completed' => 'terminé', // value was released before CR1000333
    'closed canceled' => 'annulé',
];


$app_list_strings['product_status_dom'] = [
    'draft' => 'brouillon',
    'active' => 'actif',
    'inactive' => 'inactif',
];

$app_list_strings['textmessage_direction'] = [
    'i' => 'entrant',
    'o' => 'sortant',
];

$app_list_strings['textmessage_delivery_status'] = [
    'draft' => 'brouillon',
    'sent' => 'envoyé',
    'failed' => 'erreur',
    'transmitting' => 'Transmitting',
];

$app_list_strings['event_status_dom'] = [
    'planned' => 'planifié',
    'active' => 'actif',
    'canceled' => 'annulé'
];

$app_list_strings['event_category_dom'] = [
    'presentations' => 'Présentations',
    'seminars' => 'Seminaires',
    'conferences' => 'Conférences'
];

$app_list_strings['incoterms_dom'] = [
    'EXW' => 'Ex works',
    'FCA' => 'Free carrier',
    'FAS' => 'Free alongside ship',
    'FOB' => 'Free on board',
    'CFR' => 'Costs and freight',
    'CIF' => 'Costs, insurance & freight',
    'CPT' => 'Carriage paid to',
    'CIP' => 'Carriage and insurance paid',
    'DAT' => 'Delivered at Terminal',
    'DAP' => 'Delivered at Place',
    'DDP' => 'Delivered duty paid',
];
