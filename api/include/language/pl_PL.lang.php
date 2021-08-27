<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
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
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

/*********************************************************************************
 * Description:  Defines the English language pack for the base application.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

//the left value is the key stored in the db and the right value is ie display value
//to translate, only modify the right value in each key/value pair
$app_list_strings = [
    'language_pack_name' => 'Polski',

    'customer_type_dom' => [
        'B' => 'Klient biznesowy',
        'C' => 'Klient indywidualny',
    ],

    //e.g. en fran?is 'Analyst'=>'Analyste',
   'account_type_dom' => [
      '' => '',
      'Analyst' => 'Analityk',
      'Competitor' => 'Konkurencja',
      'Customer' => 'Klient',
      'Integrator' => 'Integrator',
      'Investor' => 'Inwestor',
      'Partner' => 'Partner',
      'Press' => 'Prasa',
      'Prospect' => 'Potencjalny kontrahent',
      'Reseller' => 'Reseller',
      'Other' => 'Pozostali',
    ],
    'account_user_roles_dom' => [
        '' => '',
        'am' => 'Account Manager',
        'se' => 'Support Engineer',
        'es' => 'Executive Sponsor'
    ],
    'events_account_roles_dom' => [
        '' => '',
        'organizer' => 'Organizator',
        'sponsor' => 'Sponsor',
        'caterer' => 'Dostawca'
    ],
    'events_contact_roles_dom' =>        [
        '' => '',
        'organizer' => 'Organizator',
        'speaker' => 'Prelegent',
        'moderator' => 'Moderator',
    ],
    'events_consumer_roles_dom' => [
        '' => '',
        'organizer' => 'Organizator',
        'speaker' => 'Prelegent',
        'moderator' => 'Moderator',
    ],
    'userabsences_type_dom' => [
        '' => '',
        'Sick leave' => 'Choroba',
        'Vacation' => 'Urlop',
        'HomeOffice' => 'Praca zdalna',
    ],
    'userabsences_status_dom' => [
        '' => '',
        'created' => 'Utwórzono',
        'submitted' => 'Zgłoszono',
        'approved' => 'Zaakceptowano',
        'rejected' => 'Odrzucono',
        'revoked' => 'Odwolano',
        'cancel_requested' => 'Zażądano anulowania'
    ],

    //e.g. en espa 'Apparel'=>'Ropa',
    'industry_dom' => [
      '' => '',
      'Apparel' => 'Branża odzieżowa',
      'Banking' => 'Bankowość',
      'Biotechnology' => 'Biotechnologia',
      'Chemicals' => 'Branża chemiczna',
      'Communications' => 'Komunikacja',
      'Construction' => 'Budownictwo',
      'Consulting' => 'Doradztwo',
      'Education' => 'Edukacja',
      'Electronics' => 'Branża elektroniczna',
      'Energy' => 'Branża energetyczna',
      'Engineering' => 'Inżynieria',
      'Entertainment' => 'Branża rozrywkowa',
      'Environmental' => 'Ochrona środowiska',
      'Finance' => 'Usługi finansowe',
      'Government' => 'Instytucje publiczne',
      'Healthcare' => 'Ochrona zdrowia',
      'Hospitality' => 'Hotelarstwo',
      'Insurance' => 'Ubezpieczenia',
      'Machinery' => 'Przemysł maszynowy',
      'Manufacturing' => 'Przemysł wytwórczy',
      'Media' => 'Media',
      'Not For Profit' => 'Organizacje non-profit',
      'Recreation' => 'Turystyka i rekreacja',
      'Retail' => 'Sprzedaż detaliczna',
      'Shipping' => 'Spedycja',
      'Technology' => 'Branża IT',
      'Telecommunications' => 'Telekomunikacja',
      'Transportation' => 'Transport',
      'Utilities' => 'Usługi',
      'Other' => 'Pozostałe',
    ],
    'lead_source_default_key' => 'Self Generated',
    'lead_source_dom' => [
      '' => '',
      'Cold Call' => 'Telemarketing',
      'Existing Customer' => 'Istniejący kontrahent',
      'Self Generated' => 'Inicjatywa własna',
      'Employee' => 'Pracownik',
      'Partner' => 'Partner',
      'Public Relations' => 'Public Relations',
      'Direct Mail' => 'Reklama bezpośrednia',
      'Conference' => 'Uczestnik konferencji',
      'Trade Show' => 'Uczestnik prezentacji',
      'Web Site' => 'Ze strony WWW',
      'Word of mouth' => 'Z polecenia',
      'Email' => 'Z wiadomości e-mail',
      'Campaign' => 'Z kampanii',
      'Other' => 'Inne',
    ],
    'opportunity_type_dom' => [
      '' => '',
      'Existing Business' => 'Istniejący projekt',
      'New Business' => 'Nowy projekt',
    ],
    'roi_type_dom' => [
      'Revenue' => 'Przychód',
      'Investment' => 'Inwestycja',
      'Expected_Revenue' => 'Oczekiwany przychód',
      'Budget' => 'Budżet',

    ],
   //Note:  do not translate opportunity_relationship_type_default_key
//       it is the key for the default opportunity_relationship_type_dom value
   'opportunity_relationship_type_default_key' => 'Primary Decision Maker',
   'opportunity_relationship_type_dom' =>
    [
      '' => '',
      'Primary Decision Maker' => 'Opiniodawca wstępny',
      'Business Decision Maker' => 'Decydent biznesowy',
      'Business Evaluator' => 'Opiniodawca biznesowy',
      'Technical Decision Maker' => 'Decydent techniczny',
      'Technical Evaluator' => 'Opiniodawca techniczny',
      'Executive Sponsor' => 'Executive Sponsor',
      'Influencer' => 'Influencer',
      'Project Manager' => 'Project Manager',
      'Other' => 'Inny',
    ],
    'opportunity_urelationship_type_dom' =>
    [
        '' => '',
        'Account Manager' => 'Account Manager',
        'Solution Manager' => 'Solution Manager',
        'Success Manager' => 'Success Manager',
        'Executive Sponsor' => 'Executive Sponsor',
        'Other' => 'Inny',
    ],
    //Note:  do not translate case_relationship_type_default_key
//       it is the key for the default case_relationship_type_dom value
    'case_relationship_type_default_key' => 'Primary Contact',
    'case_relationship_type_dom' =>
    [
        '' => '',
        'Primary Contact' => 'Kontakt podstawowy',
        'Alternate Contact' => 'Kontakt alternatywny',
    ],
    'payment_terms' =>
    [
        '' => '',
        'Net 15' => 'Netto 15',
        'Net 30' => 'Netto 30',
    ],
    'sales_stage_default_key' => 'Prospecting',
    'fts_type' => [
        '' => '',
        'Elastic' => 'Elasticsearch'
    ],
     'sales_stage_dom' => [
// CR1000302 adapt to match opportunity spicebeanguidestages
//        'Prospecting' => 'Prospecting',
        'Qualification' => 'Kwlifikacja',
        'Analysis' => 'Analiza wymgań',
        'Proposition' => 'Propozycja wartości',
//        'Id. Decision Makers' => 'Id. Decision Makers',
//        'Perception Analysis' => 'Perception Analysis',
        'Proposal' => 'Oferta',
        'Negotiation' => 'Negocjacje',
        'Closed Won' => 'Zakończona - Sukcesem',
        'Closed Lost' => 'Zakończona - Porażką',
        'Closed Discontinued' => 'Zakończona - Rezygnacja z zakupu'
    ],
    'opportunityrevenuesplit_dom' => [
        'none' => 'Brak',
        'split' => 'Podzielony',
        'rampup' => 'Przyrostowy'
    ],
    'opportunity_relationship_buying_center_dom' => [
         '++' => 'Bardzo pozytywny',
        '+' => 'Pozytywny',
        'o' => 'Neutralny',
        '-' => 'Negatywny',
        '--' => 'Bardzo negatywny'
    ],
    'in_total_group_stages' => [
        'Draft' => 'Wersja robocza',
        'Negotiation' => 'Negocjacje',
        'Delivered' => 'Dostarczono',
        'On Hold' => 'Oczekuje',
        'Confirmed' => 'Zatwierdzono',
        'Closed Accepted' => 'Zamknięta - Wygrana',
        'Closed Lost' => 'Zamknięta - Utracona',
        'Closed Dead' => 'Zamknięta - Ubita',
    ],
    'sales_probability_dom' => // keys must be the same as sales_stage_dom
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
      'Closed Lost' => '0',
    ],
    'competitive_threat_dom' => [
         '++' => 'Bardzo wysoki',
        '+' => 'Wysoki',
        'o' => 'Neutralny',
        '-' => 'Niski',
        '--' => 'Bardzo niski'
    ],
    'competitive_status_dom' => [
        'active' => 'Aktywna',
        'withdrawn' => 'Wycofana',
        'rejected' => 'Odrzucona przez klienta'
    ],
    'activity_dom' => [
        'Call' => 'Rozmowa tel.',
        'Meeting' => 'Spotkanie',
        'Task' => 'Zadanie',
        'Email' => 'E-mail',
        'Note' => 'Notatka',
   ],
    'salutation_dom' => [
        '' => '',
        'Mr.' => 'Sz. Pan',
        'Ms.' => 'Sz. Pani',
        //'Mrs.' => 'Sz. Pani',
        //'Dr.' => 'Dr',
        //'Prof.' => 'Prof.',
    ],
    'salutation_letter_dom' => [
        '' => '',
        'Mr.' => 'Sz. Pan',
        'Ms.' => 'Sz. Pani',
        // 'Mrs.' => 'Mrs.',
        // 'Dr.' => 'Dr.',
        //  'Prof.' => 'Prof.',
    ],
    'gdpr_marketing_agreement_dom' => [
        '' => '',
        'r' => 'Zgoda wyrażona',
        'g' => 'Zgoda odrzucona',
    ],
    'uom_unit_dimensions_dom' => [
        '' => '',
        'none' => 'none',
        'weight' => 'Waga',
        'volume' => 'Objętość',
        'area' => 'Powierzchnia',
        'time' => 'Czas',
    ],
    'contacts_title_dom' => [
        '' => '',
        'ceo' => 'CEO',
        'cfo' => 'CFO',
        'cto' => 'CTO',
        'cio' => 'CIO',
        'coo' => 'COO',
        'cmo' => 'CMO',
        'vp sales' => 'Dyrektor Sprzedaży',
        'vp engineering' => 'Dyrektor IT',
        'vp procurement' => 'Dyrektor Zaopatrzenia',
        'vp finance' => 'Dyrektor Finansowy',
        'vp marketing' => 'Dyrektor Marketingu',
        'sales' => 'Handlowiec',
        'engineering' => 'Specjalista ds. Produkcji',
        'procurement' => 'Specjalista ds. Zaopatrzenia',
        'finance' => 'Księgowy',
        'marketing' => 'Specjalista ds. Marketingu'
    ],
    'personalinterests_dom' => [
        'sports' => 'Sport',
        'food' => 'Żywienie',
        'wine' => 'Wino',
        'culture' => 'Kultura',
        'travel' => 'Podróże',
        'books' => 'Książki',
        'animals' => 'Zwierzęta',
        'clothing' => 'Styl',
        'cooking' => 'Gotowanie',
        'fashion' => 'Moda',
        'music' => 'Muzyka',
        'fitness' => 'Fitness'
    ],
    'questionstypes_dom' => [
        'rating' => 'Ocena',
        'ratinggroup' => 'Ocena grupowa',
        'binary' => 'Tak lub nie',
        'single' => 'Pojedynczy wybór',
        'multi' => 'Wielokrotny wybór',
        'text' => 'Pytanie otwarte',
        'ist' => 'IST',
        'nps' => 'NPS'
    ],
    'questionsettypes_dom' => [
        'various' => 'Róznorodne (domyślne)',
        'ratinggroup' => 'Ocena grupowa',
    ],
    'evaluationtypes_dom' => [
        'default' => 'Standard',
        'avg_core' => 'Średnia z',
        'spiderweb' => 'Spiderweb'
    ],
    'evaluationsorting_dom' => [
        'categories' => 'wg kategorii (alfabetycznie)',
        'points asc' => 'wg punktów, rosnąco',
        'points desc' => 'wg punktów, malejąco'
    ],
    'interpretationsuggestions_dom' => [
        'top3' => 'pierwsze 3',
        'top3_bottom2' => 'pierwsze 3 i ostatnie 2',
        'top5' => 'pierwsze 5',
        'over20' => 'powyżej 20 punktów',
        'over30' => 'powyżej 30 punktów',
        'over40' => 'powyżej 40 punktów',
        'top3_upfrom20' => 'pierwsze 3 lub powyżej 20 punktów',
        'top5_upfrom20' => 'pierwsze 5 lub powyżej 20 punktów',
        'top3_upfrom30' => 'pierwsze 3 lub powyżej 30 punktów',
        'top5_upfrom30' => 'pierwsze 5 lub powyżej 30 punktów',
        'top3_upfrom40' => 'pierwsze 3 lub powyżej 40 punktów',
        'top5_upfrom40' => 'pierwsze 5 lub powyżej 40 punktów',
        'all' => 'Wszystkie interpretacje',
        'mbti' => 'MBTI'
    ],
    //time is in seconds; the greater the time the longer it takes;
    'reminder_max_time' => 90000,
    'reminder_time_options' => [
        -1 => 'Bez powiadomienia',
        60 => '1 minutę wcześniej',
        300 => '5 minut wcześniej',
        600 => '10 minut wcześniej',
        900 => '15 minut wcześniej',
        1800 => '30 minut wcześniej',
        3600 => '1 godzinę wcześniej',
        7200 => '2 godziny wcześniej',
        10800 => '3 godziny wcześniej',
        18000 => '5 godzin wcześniej',
        86400 => '1 dzień wcześniej',
    ],

    'task_priority_default' => 'Medium',
    'task_priority_dom' =>
    [
        'High' => 'Wysoki',
        'Medium' => 'Średni',
        'Low' => 'Niski',
    ],
    'task_status_default' => 'Not Started',
    'task_status_dom' =>
    [
        'Not Started' => 'Nierozpoczęte',
        'In Progress' => 'W trakcie',
        'Completed' => 'Zakończone',
        'Pending Input' => 'Oczekujące',
        'Deferred' => 'Odroczone',
    ],
    'meeting_status_default' => 'Planned',
    'meeting_status_dom' =>
    [
        'Planned' => 'Planowane',
        'Held' => 'Przeprowadzone',
        'Cancelled' => 'Anulowane',
        'Not Held' => 'Nieprzeprowadzone',
    ],
    'extapi_meeting_password' =>
    [
        'WebEx' => 'WebEx',
    ],
    'meeting_type_dom' =>
    [
        'Other' => 'Inne',
        'Spice' => 'SpiceCRM',
    ],
   'call_status_default' => 'Planned',
   'call_status_dom' =>
    [
        'Planned' => 'Planowana',
        'Held' => 'Przeprowadzona',
        'Cancelled' => 'Anulowana',
        'Not Held' => 'Nieprzeprowadzona',
    ],
    'call_direction_default' => 'Outbound',
    'call_direction_dom' =>
    [
        'Inbound' => 'Przychodząca',
        'Outbound' => 'Wychodząca',
    ],
   'lead_status_dom' =>
    [
      '' => '',
      'New' => 'Nowy',
      'Assigned' => 'Przydzielony',
      'In Process' => 'W trakcie',
      'Converted' => 'Przekształcony',
      'Recycled' => 'Odzyskany',
      'Dead' => 'Utracony',
    ],
    'lead_classification_dom' => [
        'cold' => 'Zimny',
        'warm' => 'Ciepły',
        'hot' => 'Gorący'
    ],
    'lead_type_dom' => [
        'b2b' => 'Klient biznesowy',
        'b2c' => 'Klient indywidualny'
    ],
    'gender_list' =>
    [
        'male' => 'Mężczyzna',
        'female' => 'Kobieta',
    ],
        //Note:  do not translate case_status_default_key
//       it is the key for the default case_status_dom value
    'case_status_default_key' => 'New',
    'case_status_dom' =>
    [
        'New' => 'Nowe',
        'Assigned' => 'Przydzielone',
        'Closed' => 'Zamknięte',
        'Pending Input' => 'Oczekuje na odpowiedź',
        'Rejected' => 'Odrzucone',
        'Duplicate' => 'Duplikat',
    ],
    'case_priority_default_key' => 'P2',
    'case_priority_dom' =>
    [
        'P1' => 'Wysoki',
        'P2' => 'Średni',
        'P3' => 'Niski',
    ],
    'user_type_dom' =>
    [
        'RegularUser' => 'Zwykły użytkownik',
        'PortalUser' => 'Użytkownik portalu',
        'Administrator' => 'Administrator',
    ],
    'user_status_dom' =>
    [
        'Active' => 'Aktywny',
        'Inactive' => 'Nieaktywny',
    ],
    'calendar_type_dom' =>
    [
        'Full' => 'Całościowy',
        'Day' => 'Dzienny',
    ],
    'knowledge_status_dom' =>
    [
        'Draft' => 'Wersja robocza',
        'Released' => 'Opublikowano',
        'Retired' => 'Zarchiwizowano',
    ],
   'employee_status_dom' =>
    [
        'Active' => 'Aktywny',
        'Terminated' => 'Nie pracuje',
        'Leave of Absence' => 'Nieobecny',
    ],
    'messenger_type_dom' =>
    [
        '' => '',
        'MSN' => 'MSN',
        'Yahoo!' => 'Yahoo!',
        'AOL' => 'Skype',
    ],
   'project_task_priority_options' => [
        'High' => 'Wysoki',
        'Medium' => 'Średni',
        'Low' => 'Niski',
    ],
    'project_task_priority_default' => 'Medium',

    'project_task_status_options' => [
        'Not Started' => 'Nierozpoczęte',
        'In Progress' => 'W realizacji',
        'Completed' => 'Zakończone',
        'Pending Input' => 'Oczekujące',
        'Deferred' => 'Przerwane',
    ],
    'project_task_utilization_options' => [
        '0' => 'zero',
        '25' => '25',
        '50' => '50',
        '75' => '75',
        '100' => '100',
    ],
    'project_type_dom' => [
        'customer' => 'Kliencki',
        'development' => 'Development',
        'sales' => 'Sprzedaż',
        'admin' => 'Wewnetrzny',
    ],
    'project_status_dom' => [
       'planned' => 'Planowany',
        'active' => 'Aktywny',
        'completed' => 'Zakończonu',
        'cancelled' => 'Anulowany',
        'Draft' => 'Wersja robocza',
        'In Review' => 'W trakcie recenzji',
        'Published' => 'Opublikowany',
    ],
    'project_duration_units_dom' => [
        'Days' => 'Dni',
        'Hours' => 'Godziny',
    ],
    'project_priority_options' => [
        'High' => 'Wysoki',
        'Medium' => 'Średni',
        'Low' => 'Niski',
    ],
    'projects_activity_status_dom' => [
        'created' => 'Utworzona',
        'settled' => 'Wykonana'
    ],
    'mailbox_message_types' => [
        'sms' => 'SMS',
        'email' => 'E-mail',
    ],
    /*Added entries 'Queued' and 'Sending' for 4.0 release..*/
    'campaign_status_dom' =>
    [
        '' => '',
        'Planning' => 'Planowana',
        'Active' => 'Aktywna',
        'Inactive' => 'Nieaktywna',
        'Complete' => 'Zakończona',
        'In Queue' => 'W kolejce',
        'Sending' => 'Wysłana',
    ],
    'campaign_type_dom' => [
        '' => '',
        'Event' => 'Wydarzenie',
        'Telesales' => 'Telesprzedaż',
        'Mail' => 'Poczta tradycyjna',
        'Email' => 'E-mail',
        'Print' => 'Ulotki',
        'Web' => 'Strona internetowa',
        'Radio' => 'Radio',
        'Television' => 'Telewizja',
        'NewsLetter' => 'Newsletter',
    ],
    'campaigntask_type_dom' => [
        '' => '',
        'Event' => 'Event',
        'Telesales' => 'Telesprzedaż',
        'Mail' => 'Poczta tradycyjna',
        'Email' => 'E-mail',
        'Feedback' => 'Feedback',
        'Print' => 'Ulotki',
        'Web' => 'Strona internetowa',
        'Radio' => 'Radio',
        'Television' => 'Telewizja',
        'NewsLetter' => 'Newsletter',
    ],
    'newsletter_frequency_dom' =>
    [
        '' => '',
        'Weekly' => 'Tygodniowo',
        'Monthly' => 'Miesięcznie',
        'Quarterly' => 'Kwartalnie',
        'Annually' => 'Rocznie',
    ],
    'servicecall_type_dom' => [
        'info' => 'Zapytanie o informację',
        'complaint' => 'Reklamacja',
        'return' => 'Zwrot',
        'service' => 'Zlecenie serwisowe',
    ],
    'dom_cal_month_long' => [
        '0' => '',
        '1' => 'Styczeń',
        '2' => 'Luty',
        '3' => 'Marzec',
        '4' => 'Kwiecień',
        '5' => 'Maj',
        '6' => 'Czerwiec',
        '7' => 'Lipiec',
        '8' => 'Sierpień',
        '9' => 'Wrzesień',
        '10' => 'Październik',
        '11' => 'Listopad',
        '12' => 'Grudzień',
    ],
    'dom_cal_month_short' => [
        '0' => "",
        '1' => "Sty",
        '2' => "Lut",
        '3' => "Mar",
        '4' => "Kwi",
        '5' => "Maj",
        '6' => "Cze",
        '7' => "Lip",
        '8' => "Sie",
        '9' => "Wrz",
        '10' => "Paź",
        '11' => "Lis",
        '12' => "Gru",
    ],
    'dom_cal_day_long' => [
        '0' => "",
        '1' => "Niedziela",
        '2' => "Poniedziałek",
        '3' => "Wtorek",
        '4' => "Środa",
        '5' => "Czwartek",
        '6' => "Piątek",
        '7' => "Sobota",
    ],
    'dom_cal_day_short' => [
        '0' => "",
        '1' => "Nie",
        '2' => "Pon",
        '3' => "Wt",
        '4' => "Śr",
        '5' => "Czw",
        '6' => "Pt",
        '7' => "Sob",
    ],
    'dom_meridiem_lowercase' => [
        'am' => "am",
        'pm' => "pm"
    ],
    'dom_meridiem_uppercase' => [
        'AM' => 'AM',
        'PM' => 'PM'
    ],
    'dom_email_types' => [
        'out' => 'Wysłane',
        'archived' => 'Zarchiwizowany',
        'draft' => 'Wersja robocza',
        'inbound' => 'Przychodzący',
        'campaign' => 'Kampania'
    ],
    'dom_email_status' => [
        'archived' => 'Zarchiwizowany',
        'closed' => 'Zamknięty',
        'draft' => 'Wersja robocza',
        'read' => 'Przeczytany',
        'opened' => 'Otworzony',
        'replied' => 'Odpowiedziano',
        'sent' => 'Wysłany',
        'delivered' => 'Dostarczony',
        'send_error' => 'Błąd wysyłki',
        'unread' => 'Nieprzeczytany',
        'bounced' => 'Zwrot/Niedoręczeny'
    ],
    'dom_textmessage_status' => [
        'archived' => 'Zarchiwizowany',
        'closed' => 'Zamknięty',
        'draft' => 'Szkic',
        'read' => 'Przeczytany',
        'replied' => 'Odpowiedziano',
        'sent' => 'Wysłany',
        'send_error' => 'Błąd wysyłki',
        'unread' => 'Nieprzeczytany',
    ],
    'dom_email_archived_status' => [
        'archived' => 'Zarchiwizowany',
    ],
    'dom_email_openness' => [
        'open' => 'Otwarto',
        'user_closed' => 'Zamknięto przez użytkownika',
        'system_closed' => 'Zamknięto przez system'
    ],
    'dom_textmessage_openness' => [
        'open' => 'Otwarto',
        'user_closed' => 'Zamknięto przez użytkownika',
        'system_closed' => 'Zamknięto przez system'
    ],
    'dom_email_server_type' => [ '' => '-- Nie wybrano --',
        'imap' => 'IMAP',
    ],
    'dom_mailbox_type' => [ /* ''			=> '--Nie wybrano--', */
        'pick' => '--Brak--',
        'createcase' => 'Utwórz zgłoszenie',
        'bounce' => 'Zwrot w przypadku niedoręczenia',
    ],
    'dom_email_distribution' => ['' => '-- Nie wybrano --',
        'direct' => 'Przydziel bezpośrednio',
        'roundRobin' => 'Algorytm Round-Robin',
        'leastBusy' => 'Najmniej zajęty',
    ],
    'dom_email_distribution_for_auto_create' => ['roundRobin' => 'Algorytm Round-Robin',
        'leastBusy' => 'Najmniej zajęty',
    ],
    'jobtask_status_dom' => [
        'active' => 'active',
        'running' => 'running',
        'on_hold' => 'on hold'
    ],
    'job_status_dom' =>
    [
        'Active' => 'Aktywny',
        'Inactive' => 'Nieaktywny',
        'OnHold' => 'On hold',
        'Running' => 'Running',
    ],
    'job_period_dom' =>
    [
        'min' => 'Minuty',
        'hour' => 'Godziny',
    ],
    'document_category_dom' => [
        '' => '',
        'Marketing' => 'Marketing',
        'Knowledege Base' => 'Baza wiedzy',
        'Sales' => 'Sprzedaż',
    ],
    'document_subcategory_dom' => [
        '' => '',
        'Marketing Collateral' => 'Materiały marketingowe',
        'Product Brochures' => 'Broszury produktowe',
        'FAQ' => 'FAQ',
    ],
   'document_status_dom' => [
        'Active' => 'Aktywny',
        'Draft' => 'Wersja robocza',
        'Expired' => 'Przedawniony',
        'Under Review' => 'W recenzji',
    ],
    'document_template_type_dom' => [
        '' => '',
        'mailmerge' => 'Scalanie poczty',
        'eula' => 'Warunki udzielenia licencji końcowemu użytkownikowi (EULA)',
        'nda' => 'Umowa o poufności (NDA)',
        'license' => 'Umowa licencyjna',
    ],
    'document_revisionstatus_dom' => [
        'c' => 'created',
        'r' => 'released',
        'a' => 'archived',
    ],
    'dom_meeting_accept_options' => [
        'accept' => 'Akceptuj',
        'decline' => 'Odrzuć',
        'tentative' => 'Wstępna akceptacja',
    ],
    'dom_meeting_accept_status' => [
        'accept' => 'Zaakceptowano',
        'decline' => 'Odrzucono',
        'tentative' => 'Wstępnie zaakceptowano',
        'none' => 'Brak',
    ],
    'duration_intervals' => [      '0' => '00',
        '15' => '15',
        '30' => '30',
        '45' => '45',
    ],
    'repeat_type_dom' => [
        '' => 'Brak',
        'Daily' => 'Codziennie',
        'Weekly' => 'Co tydzień',
        'Monthly' => 'Co miesiąc',
        'Yearly' => 'Co rok',
    ],

    'repeat_intervals' => [
        '' => '',
        'Daily' => 'dni',
        'Weekly' => 'tygodni(e)',
        'Monthly' => 'miesiąc(e)',
        'Yearly' => 'rok/lata',
    ],

    'duration_dom' => [
        '' => 'Brak',
        '900' => '15 minut',
        '1800' => '30 minut',
        '2700' => '45 minut',
        '3600' => '1 godzinę',
        '5400' => '1.5 godziny',
        '7200' => '2 godziny',
        '10800' => '3 godziny',
        '21600' => '6 godzin',
        '86400' => '1 dzień',
        '172800' => '2 dni',
        '259200' => '3 dni',
        '604800' => '1 tydzień',
    ],

 // deferred
    /*// QUEUES MODULE DOMs
    'queue_type_dom' => [
        'Users' => 'Users',
        'Mailbox' => 'Mailbox',
    ],
    */
//prospect list type dom
    'prospect_list_type_dom' =>
    [
        'default' => 'Domyślny',
        'seed' => 'Recenzenci',
        'exempt_domain' => 'Lista wykluczonych po domenie',
        'exempt_address' => 'Lista wykluczonych po adresie e-mail',
        'exempt' => 'Lista wykluczonych po ID',
        'test' => 'Test',
    ],

    'email_settings_num_dom' =>
    [
        '10' => '10',
        '20' => '20',
        '50' => '50'
    ],
    'email_marketing_status_dom' =>
    [
        '' => '',
        'active' => 'Aktywny',
        'inactive' => 'Nieaktywny'
    ],

    'campainglog_activity_type_dom' =>
    [
        '' => '',
        'queued' => 'Zakolejkowane',
        'sent' => 'Wysłane',
        'delivered' => 'Odebrane',
        'opened' => 'Otwarte',
        'deferred' => 'Odroczone',
        'bounced' => 'Zwrócone',
        'targeted' => 'Wiadomości wysłane',
        'send error' => 'Wiadomości zwrócone (błąd wysyłania)',
        'invalid e-mail' => 'Wiadomości zwrócone (nieprawidłowy adres e-mail)',
        'link' => 'Link przekierowania',
        'viewed' => 'Wiadomości przeczytane',
        'removed' => 'Wypisy z kampanii',
        'lead' => 'Utworzone namiary',
        'contact' => 'Utworzone kontakty',
        'blocked' => 'Odrzucone z powodu adresu lub domeny',
        'error' => 'Błąd',
        'noemail' => 'Brak adresu e-mail'
    ],

    'campainglog_target_type_dom' =>
    [
        'Contacts' => 'Kontakty',
        'Users' => 'Użytkownicy',
        'Prospects' => 'Odbiorcy',
        'Leads' => 'Namiary',
        'Accounts' => 'Kontrahenci',
    ],
    'projects_priority_options' => [
        'high' => 'Wysoki',
        'medium' => 'Średni',
        'low' => 'Niski',
    ],
    'projects_status_options' => [
        'notstarted' => 'Nierozpoczęty',
        'inprogress' => 'W trakcie',
        'completed' => 'Zrealizowany',
    ],
    'salesdoc_doccategories' => [
        'QT' => 'Oferta',
        'OR' => 'Zamówienie',
        'IV' => 'Faktura',
        'CT' => 'Umowa',
        'VS' => 'Sprzedaż z kuponem' //?? 'Voucher Sale'
    ],
    'salesdoc_docparties' => [
        'I' => 'Klient indywidualny',
        'B' => 'Klient biznesowy',
        'C' => 'Odbiorca',// 'Consumer'
    ],
    'salesdoc_uoms' => [
        'm2' => 'm²',
        'PC' => 'PC'
    ],
    'salesdocs_paymentterms' => [
        '7DN' => '7 dni',
        '14DN' => '14 dni',
        '30DN' => '30 dni',
        '30DN7D3' => '30 dni, 7 dni 3%',
        '60DN' => '60 dni',
        '60DN7D3' => '60 dni, 7 dni 3%',
    ],
    'salesdocitem_rejection_reasons_dom' => [
        'tooexpensive' => 'Za drogo',
        'nomatch' => 'Nie spełnia wymagań',
        'deliverydate' => 'Proponowana dostawa za późno'
    ],
    'salesvoucher_type_dom' => [
        'v' => 'Kwotowy',
        'p' => 'Procentowy'
    ],
    'salesdoc_status_dom' => [
        'vsnew' => 'Nowe',
        'vscreated' => 'Utworzono',
        'vspaid' => 'Opłacono',
        'vscancelled' => 'Anulowano'
    ],
    'salesvoucher_status_dom' => [
        'created' => 'Utworzony',
        'paid' => 'Opłacony',
        'redeemed' => 'Wykorzystany',
        'canceled' => 'Anulowany'
    ],
    'resource_status_dom' => [
        'planned' => 'Planowany',
        'active' => 'Aktywny',
        'retired' => 'Wycofany',
    ],
    'resource_type_dom' => [
        'room' => 'Miejsce',
        'equipment' => 'Sprzęt',
        'vehicle' => 'Pojazd',
    ],
    // currently not necessary:
    /*
    'mediatypes_dom' => array(
        1 => 'Bild',
        2 => 'Audio',
        3 => 'Video'
    ),
    */
    'workflowftastktypes_dom' => [
        'task' => 'Zadanie',
        'decision' => 'Bramka decyzyjna',
        'email' => 'E-mail',
        'system' => 'System',
    ],
    'workflowdefinition_status' => [
        'active' => 'Aktywny',
        'active_once' => 'Aktywny (jedno wykonanie)',
        'active_scheduled' => 'Aktywny zaharmonogramowany',
        'active_scheduled_once' => 'Aktywny zaharmonogramowany (jedno wykonanie)',
        'inactive' => 'Nieaktywny'
    ],
    'workflowdefinition_precondition' => [
        'a' => 'Zawsze',
        'u' => 'Tylko aktualizowane rekordy',
        'n' => 'Tylko nowe rekordy'
    ],
    'workflowdefinition_emailtypes' => [
        '1' => 'Użytkownik przypisany do zadania',
        '2' => 'Użytkownik przypisany do rekordu',
        '3' => 'Użytkownik utworzył rekord',//'user created Bean',
        '4' => 'Zwierzchnik użytkownika przypisanego do rekordu',
        '5' => 'Zwierzchnik użytkownika tworzącego rekord',
        '6' => 'Adres e-mail',
        '7' => 'Algorytm',
        '8' => 'Użytkownik tworzący rekord',//'user creator to Bean',
        '9' => 'Podstawowy adres e-mail z rekordu nadrzędnego',
        'A' => 'Podstawowy adres e-mail z rekordu nadrzędnego do nadrzędnego',//'email1 of parent of parent bean',
        'B' => 'Podstawowy adres e-mail z rekordu nadrzędnego do nadrzędnego'//??'email1 of parent of parent bean',
    ],
    'workflowdefinition_assgintotypes' => [
        '1' => 'Użytkownik',
        '2' => 'Grupa',
        '3' => 'Użytkownik przypisany do rekordu nadrzędnego',
        '4' => 'Zwierzchnik użytkownika przypisanego do rekordu nadrzędnego',
        '5' => 'Algorytm',
        '6' => 'Twórca rekordu',
    ],
    'workflowdefinition_conditionoperators' => [
        'EQ' => '=',
        'NE' => '≠',
        'GT' => '>',
        'GE' => '≥',
        'LT' => '<',
        'LE' => '≤',
    ],
    'workflowtask_status' => [
        '5' => 'Zaplanowany',
        '10' => 'Nowy',
        '20' => 'W trakcie',
        '30' => 'Zakończony',
        '40' => 'Zakończony przez system'
    ],
    'page_sizes_dom' => [
        'A3' => 'A3',
        'A4' => 'A4',
        'A5' => 'A5',
        'A6' => 'A6'
    ],
    'page_orientation_dom' => [
        'P' => 'Pionowa',
        'L' => 'Pozioma'
    ],
    // dropdown status for costcenter module
    'costcenter_status_dom' => [
        'active' => 'Aktywne',
        'inactive' => 'Nieaktywne'
    ],
    // dropdown status for serviceorderitems module
    'serviceorderitem_status_dom' => [
        'active' => 'Aktywny',
        'inactive' => 'Nieaktywny'
    ]
];
$app_list_strings['project_priority_default'] = 'Medium';
$app_list_strings['project_priority_options'] = [
   'High' => 'Wysoki',
   'Medium' => 'Średni',
   'Low' => 'Niski',
];


$app_list_strings['kbdocument_status_dom'] = [
    'Draft' => 'Szkic',
    'Expired' => 'Przedawniony',
    'In Review' => 'W recenzji',
    'Published' => 'Ipublikowany',
];

$app_list_strings['kbadmin_actions_dom'] =
[
    '' => '--Akcja administracyjna--',
    'Create New Tag' => 'Utwórz nowy Tag',
    'Delete Tag' => 'Usuń Tag',
    'Rename Tag' => 'Zmień nazwę Tagu',
    'Move Selected Articles' => 'Przenieś zaznaczone artykuły',
    'Apply Tags On Articles' => 'Przypisz Tagi do artykułów',
    'Delete Selected Articles' => 'Usuń zaznaczone artykuły',
];


$app_list_strings['kbdocument_attachment_option_dom'] =
[
    '' => '',
    'some' => 'Posiada załaczniki',
    'none' => 'Nie posiada załacznikiów',
    'mime' => 'Wskazane typy plików',
    'name' => 'Wskazane nazwy',
];

$app_list_strings['moduleList']['KBDocuments'] = 'Baza wiedzy';
$app_strings['LBL_CREATE_KB_DOCUMENT'] = 'Utwórz artykuł';
$app_list_strings['kbdocument_viewing_frequency_dom'] =
[
    '' => '',
    'Top_5' => 'Pierwsze 5',
    'Top_10' => 'Pierwsze 10',
    'Top_20' => 'Pierwsze 20',
    'Bot_5' => 'Ostatnie 5',
    'Bot_10' => 'Ostatnie 10',
    'Bot_20' => 'Ostatnie 20',
];

$app_list_strings['kbdocument_canned_search'] =
[
    'all' => 'Wszystkie',
    'added' => 'Dodane w ciągu ostatnich 30 dni',
    'pending' => 'Czekające na moją akceptację',
    'updated' => 'Zaktualizowane w ciągu ostatnich 30 dni',
    'faqs' => 'Typu FAQ',
];
$app_list_strings['kbdocument_date_filter_options'] =
    [
        '' => '',
        'on' => 'Równa',
        'before' => 'Przed',
        'after' => 'Po',
        'between_dates' => 'Pomiędzy',
        'last_7_days' => 'Ostatnie 7 dni',
        'next_7_days' => 'Następne 7 dni',
        'last_month' => 'Poprzedni miesiąc',
        'this_month' => 'Ten miesiąc',
        'next_month' => 'Następny miesiąc',
        'last_30_days' => 'Ostatnie 30 dni',
        'next_30_days' => 'Następne 30 dni',
        'last_year' => 'Poprzedni rok',
        'this_year' => 'Ten rok',
        'next_year' => 'Następny rok',
        'isnull' => 'Puste',
    ];

$app_list_strings['countries_dom'] = [
    '' => '',
    'ABU DHABI' => 'ABU DHABI',
    'ADEN' => 'ADEN',
    'AFGHANISTAN' => 'AFGHANISTAN',
    'ALBANIA' => 'ALBANIA',
    'ALGERIA' => 'ALGERIA',
    'AMERICAN SAMOA' => 'AMERICAN SAMOA',
    'ANDORRA' => 'ANDORRA',
    'ANGOLA' => 'ANGOLA',
    'ANTARCTICA' => 'ANTARCTICA',
    'ANTIGUA' => 'ANTIGUA',
    'ARGENTINA' => 'ARGENTINA',
    'ARMENIA' => 'ARMENIA',
    'ARUBA' => 'ARUBA',
    'AUSTRALIA' => 'AUSTRALIA',
    'AUSTRIA' => 'AUSTRIA',
    'AZERBAIJAN' => 'AZERBAIJAN',
    'BAHAMAS' => 'BAHAMAS',
    'BAHRAIN' => 'BAHRAIN',
    'BANGLADESH' => 'BANGLADESH',
    'BARBADOS' => 'BARBADOS',
    'BELARUS' => 'BELARUS',
    'BELGIUM' => 'BELGIUM',
    'BELIZE' => 'BELIZE',
    'BENIN' => 'BENIN',
    'BERMUDA' => 'BERMUDA',
    'BHUTAN' => 'BHUTAN',
    'BOLIVIA' => 'BOLIVIA',
    'BOSNIA' => 'BOSNIA',
    'BOTSWANA' => 'BOTSWANA',
    'BOUVET ISLAND' => 'BOUVET ISLAND',
    'BRAZIL' => 'BRAZIL',
    'BRITISH ANTARCTICA TERRITORY' => 'BRITISH ANTARCTICA TERRITORY',
    'BRITISH INDIAN OCEAN TERRITORY' => 'BRITISH INDIAN OCEAN TERRITORY',
    'BRITISH VIRGIN ISLANDS' => 'BRITISH VIRGIN ISLANDS',
    'BRITISH WEST INDIES' => 'BRITISH WEST INDIES',
    'BRUNEI' => 'BRUNEI',
    'BULGARIA' => 'BULGARIA',
    'BURKINA FASO' => 'BURKINA FASO',
    'BURUNDI' => 'BURUNDI',
    'CAMBODIA' => 'CAMBODIA',
    'CAMEROON' => 'CAMEROON',
    'CANADA' => 'CANADA',
    'CANAL ZONE' => 'CANAL ZONE',
    'CANARY ISLAND' => 'CANARY ISLAND',
    'CAPE VERDI ISLANDS' => 'CAPE VERDI ISLANDS',
    'CAYMAN ISLANDS' => 'CAYMAN ISLANDS',
    'CEVLON' => 'CEVLON',
    'CHAD' => 'CHAD',
    'CHANNEL ISLAND UK' => 'CHANNEL ISLAND UK',
    'CHILE' => 'CHILE',
    'CHINA' => 'CHINA',
    'CHRISTMAS ISLAND' => 'CHRISTMAS ISLAND',
    'COCOS (KEELING) ISLAND' => 'COCOS (KEELING) ISLAND',
    'COLOMBIA' => 'COLOMBIA',
    'COMORO ISLANDS' => 'COMORO ISLANDS',
    'CONGO' => 'CONGO',
    'CONGO KINSHASA' => 'CONGO KINSHASA',
    'COOK ISLANDS' => 'COOK ISLANDS',
    'COSTA RICA' => 'COSTA RICA',
    'CROATIA' => 'CROATIA',
    'CUBA' => 'CUBA',
    'CURACAO' => 'CURACAO',
    'CYPRUS' => 'CYPRUS',
    'CZECH REPUBLIC' => 'CZECH REPUBLIC',
    'DAHOMEY' => 'DAHOMEY',
    'DENMARK' => 'DENMARK',
    'DJIBOUTI' => 'DJIBOUTI',
    'DOMINICA' => 'DOMINICA',
    'DOMINICAN REPUBLIC' => 'DOMINICAN REPUBLIC',
    'DUBAI' => 'DUBAI',
    'ECUADOR' => 'ECUADOR',
    'EGYPT' => 'EGYPT',
    'EL SALVADOR' => 'EL SALVADOR',
    'EQUATORIAL GUINEA' => 'EQUATORIAL GUINEA',
    'ESTONIA' => 'ESTONIA',
    'ETHIOPIA' => 'ETHIOPIA',
    'FAEROE ISLANDS' => 'FAEROE ISLANDS',
    'FALKLAND ISLANDS' => 'FALKLAND ISLANDS',
    'FIJI' => 'FIJI',
    'FINLAND' => 'FINLAND',
    'FRANCE' => 'FRANCE',
    'FRENCH GUIANA' => 'FRENCH GUIANA',
    'FRENCH POLYNESIA' => 'FRENCH POLYNESIA',
    'GABON' => 'GABON',
    'GAMBIA' => 'GAMBIA',
    'GEORGIA' => 'GEORGIA',
    'GERMANY' => 'GERMANY',
    'GHANA' => 'GHANA',
    'GIBRALTAR' => 'GIBRALTAR',
    'GREECE' => 'GREECE',
    'GREENLAND' => 'GREENLAND',
    'GUADELOUPE' => 'GUADELOUPE',
    'GUAM' => 'GUAM',
    'GUATEMALA' => 'GUATEMALA',
    'GUINEA' => 'GUINEA',
    'GUYANA' => 'GUYANA',
    'HAITI' => 'HAITI',
    'HONDURAS' => 'HONDURAS',
    'HONG KONG' => 'HONG KONG',
    'HUNGARY' => 'HUNGARY',
    'ICELAND' => 'ICELAND',
    'IFNI' => 'IFNI',
    'INDIA' => 'INDIA',
    'INDONESIA' => 'INDONESIA',
    'IRAN' => 'IRAN',
    'IRAQ' => 'IRAQ',
    'IRELAND' => 'IRELAND',
    'ISRAEL' => 'ISRAEL',
    'ITALY' => 'ITALY',
    'IVORY COAST' => 'IVORY COAST',
    'JAMAICA' => 'JAMAICA',
    'JAPAN' => 'JAPAN',
    'JORDAN' => 'JORDAN',
    'KAZAKHSTAN' => 'KAZAKHSTAN',
    'KENYA' => 'KENYA',
    'KOREA' => 'KOREA',
    'KOREA, SOUTH' => 'KOREA, SOUTH',
    'KUWAIT' => 'KUWAIT',
    'KYRGYZSTAN' => 'KYRGYZSTAN',
    'LAOS' => 'LAOS',
    'LATVIA' => 'LATVIA',
    'LEBANON' => 'LEBANON',
    'LEEWARD ISLANDS' => 'LEEWARD ISLANDS',
    'LESOTHO' => 'LESOTHO',
    'LIBYA' => 'LIBYA',
    'LIECHTENSTEIN' => 'LIECHTENSTEIN',
    'LITHUANIA' => 'LITHUANIA',
    'LUXEMBOURG' => 'LUXEMBOURG',
    'MACAO' => 'MACAO',
    'MACEDONIA' => 'MACEDONIA',
    'MADAGASCAR' => 'MADAGASCAR',
    'MALAWI' => 'MALAWI',
    'MALAYSIA' => 'MALAYSIA',
    'MALDIVES' => 'MALDIVES',
    'MALI' => 'MALI',
    'MALTA' => 'MALTA',
    'MARTINIQUE' => 'MARTINIQUE',
    'MAURITANIA' => 'MAURITANIA',
    'MAURITIUS' => 'MAURITIUS',
    'MELANESIA' => 'MELANESIA',
    'MEXICO' => 'MEXICO',
    'MOLDOVIA' => 'MOLDOVIA',
    'MONACO' => 'MONACO',
    'MONGOLIA' => 'MONGOLIA',
    'MOROCCO' => 'MOROCCO',
    'MOZAMBIQUE' => 'MOZAMBIQUE',
    'MYANAMAR' => 'MYANAMAR',
    'NAMIBIA' => 'NAMIBIA',
    'NEPAL' => 'NEPAL',
    'NETHERLANDS' => 'NETHERLANDS',
    'NETHERLANDS ANTILLES' => 'NETHERLANDS ANTILLES',
    'NETHERLANDS ANTILLES NEUTRAL ZONE' => 'NETHERLANDS ANTILLES NEUTRAL ZONE',
    'NEW CALADONIA' => 'NEW CALADONIA',
    'NEW HEBRIDES' => 'NEW HEBRIDES',
    'NEW ZEALAND' => 'NEW ZEALAND',
    'NICARAGUA' => 'NICARAGUA',
    'NIGER' => 'NIGER',
    'NIGERIA' => 'NIGERIA',
    'NORFOLK ISLAND' => 'NORFOLK ISLAND',
    'NORWAY' => 'NORWAY',
    'OMAN' => 'OMAN',
    'OTHER' => 'OTHER',
    'PACIFIC ISLAND' => 'PACIFIC ISLAND',
    'PAKISTAN' => 'PAKISTAN',
    'PANAMA' => 'PANAMA',
    'PAPUA NEW GUINEA' => 'PAPUA NEW GUINEA',
    'PARAGUAY' => 'PARAGUAY',
    'PERU' => 'PERU',
    'PHILIPPINES' => 'PHILIPPINES',
    'POLAND' => 'POLAND',
    'PORTUGAL' => 'PORTUGAL',
    'PORTUGUESE TIMOR' => 'PORTUGUESE TIMOR',
    'PUERTO RICO' => 'PUERTO RICO',
    'QATAR' => 'QATAR',
    'REPUBLIC OF BELARUS' => 'REPUBLIC OF BELARUS',
    'REPUBLIC OF SOUTH AFRICA' => 'REPUBLIC OF SOUTH AFRICA',
    'REUNION' => 'REUNION',
    'ROMANIA' => 'ROMANIA',
    'RUSSIA' => 'RUSSIA',
    'RWANDA' => 'RWANDA',
    'RYUKYU ISLANDS' => 'RYUKYU ISLANDS',
    'SABAH' => 'SABAH',
    'SAN MARINO' => 'SAN MARINO',
    'SAUDI ARABIA' => 'SAUDI ARABIA',
    'SENEGAL' => 'SENEGAL',
    'SERBIA' => 'SERBIA',
    'SEYCHELLES' => 'SEYCHELLES',
    'SIERRA LEONE' => 'SIERRA LEONE',
    'SINGAPORE' => 'SINGAPORE',
    'SLOVAKIA' => 'SLOVAKIA',
    'SLOVENIA' => 'SLOVENIA',
    'SOMALILIAND' => 'SOMALILIAND',
    'SOUTH AFRICA' => 'SOUTH AFRICA',
    'SOUTH YEMEN' => 'SOUTH YEMEN',
    'SPAIN' => 'SPAIN',
    'SPANISH SAHARA' => 'SPANISH SAHARA',
    'SRI LANKA' => 'SRI LANKA',
    'ST. KITTS AND NEVIS' => 'ST. KITTS AND NEVIS',
    'ST. LUCIA' => 'ST. LUCIA',
    'SUDAN' => 'SUDAN',
    'SURINAM' => 'SURINAM',
    'SW AFRICA' => 'SW AFRICA',
    'SWAZILAND' => 'SWAZILAND',
    'SWEDEN' => 'SWEDEN',
    'SWITZERLAND' => 'SWITZERLAND',
    'SYRIA' => 'SYRIA',
    'TAIWAN' => 'TAIWAN',
    'TAJIKISTAN' => 'TAJIKISTAN',
    'TANZANIA' => 'TANZANIA',
    'THAILAND' => 'THAILAND',
    'TONGA' => 'TONGA',
    'TRINIDAD' => 'TRINIDAD',
    'TUNISIA' => 'TUNISIA',
    'TURKEY' => 'TURKEY',
    'UGANDA' => 'UGANDA',
    'UKRAINE' => 'UKRAINE',
    'UNITED ARAB EMIRATES' => 'UNITED ARAB EMIRATES',
    'UNITED KINGDOM' => 'UNITED KINGDOM',
    'UPPER VOLTA' => 'UPPER VOLTA',
    'URUGUAY' => 'URUGUAY',
    'US PACIFIC ISLAND' => 'US PACIFIC ISLAND',
    'US VIRGIN ISLANDS' => 'US VIRGIN ISLANDS',
    'USA' => 'USA',
    'UZBEKISTAN' => 'UZBEKISTAN',
    'VANUATU' => 'VANUATU',
    'VATICAN CITY' => 'VATICAN CITY',
    'VENEZUELA' => 'VENEZUELA',
    'VIETNAM' => 'VIETNAM',
    'WAKE ISLAND' => 'WAKE ISLAND',
    'WEST INDIES' => 'WEST INDIES',
    'WESTERN SAHARA' => 'WESTERN SAHARA',
    'YEMEN' => 'YEMEN',
    'ZAIRE' => 'ZAIRE',
    'ZAMBIA' => 'ZAMBIA',
    'ZIMBABWE' => 'ZIMBABWE',
];

$app_list_strings['charset_dom'] = [
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
];

$app_list_strings['emailTemplates_type_list'] = [
    '' => '',
    'campaign' => 'Kampania',
    'email' => 'E-mail',
    'notification' => 'Powiadomienie',
    'bean2mail' => 'Wysyła rekordu mailem',
    'sendCredentials' => 'Wysyłka danych do logowania',
    'sendTokenForNewPassword' => 'Wysyłka tokenu w przypadku zapomnianego hasła'
];

/** KReporter **/
$app_list_strings['kreportstatus'] = [
    '1' => 'Szkic',
    '2' => 'Limitowany',
    '3' => 'Opublikowany publicznie'
];

$app_list_strings['report_type_dom'] = [
    'standard' => 'Standard',
    'admin' => 'Admin',
    'system' => 'System'
];

/** Proposals */
$app_list_strings['proposalstatus_dom'] = [
    '1' => 'Szkic',
    '2' => 'Wysłana',
    '3' => 'Zaakceptowana',
    '4' => 'Odrzucona',
];

//KREST mobile
$addAppStrings = [
    'LBL_CALENDAR' => 'Kalendarz',
    'LBL_SETTINGS' => 'Ustawienia',
    'LBL_RECENT' => 'Ostatnio oglądane',
    'LBL_ACTION_EDIT' => 'Edytuj',
    'LBL_ACTION_CALL' => 'Rozmowa tel.',
    'LBL_ACTION_SMS' => 'SMS',
    'LBL_ACTION_MAP' => 'Mapa',
    'LBL_ACTION_DELETE' => 'Usuń',
    'LBL_CANCEL' => 'Anuluj',
    'LBL_OK' => 'OK',
    'LBL_SELECT' => 'Wybierz',
    'LBL_SEL_PARENTTYPE' => 'Wybierz typ relacji',
    'LBL_DASHBOARDS' => 'Dashboardy',
    'LBL_ABOUT' => 'O programie',
    'LBL_CONNECTION' => 'Połączenie',
    'LBL_BACKEND' => 'Backend',
    'LBL_CONNECTIONDATA' => 'Połączenie i Login',
    'LBL_ADDRESSFORMAT' => 'Format adresu',
    'LBL_ADRFORMATLOCALE' => 'Region',
    'LBL_CALENDAR_DAYS' => 'Wyświetlaj dni',
    'LBL_CALENDAR_WEEKSTART' => 'Początek tygodnia',
    'LBL_THEME' => 'Styl',
    'LBL_CALENDAR_SETTINGS' => 'Ustawienia kalendarza',
    'LBL_CALENDAR_STARTTIME' => 'początek dnia',
    'LBL_CALENDAR_ENDTIME' => 'koniec dnia',
    'LBL_USERNAME' => 'Nazwa użytkownika',
    'LBL_PWD_VALIDITY' => 'Ważnośc hasła',
    'LBL_AUTOLOGIN' => 'Autologowanie',
    'LBL_LOADING_LANGUAGE' => 'Ładowanie języka',
    'LBL_LANGUAGE' => 'Język',
    'LBL_ENTERPASSWORD' => 'Wprowadź hasło',
    'LBL_YOURPASSWORD' => 'Twoje hasło',
    'LBL_ACTION_SAVE' => 'Zapisz',
    'LBL_ACTION_CAPTURECARD' => 'Czytaj kartę',
    'LBL_ACTION_QRCVCF' => 'Czytaj kod QR',
    'LBL_ACTION_CAPTUREIMAGE' => 'Zrób zdjęcie',
    'LBL_OPEN_MEETINGS' => 'Otwarte spotkania',
    'LBL_OVD_MEETINGS' => 'Przeterminowane spotkania',
    'LBL_OPEN_CALLS' => 'Otwarte rozmowy tel.',
    'LBL_OPEN_TASKS' => 'Otwarte zadania',
    'LBL_CHOOSE_EVENTTYPE' => 'Wybierz typ wydarzenia',
    'LBL_NEXT_SYNC' => 'następna synchronizacja',
    'LBL_OBJECTS' => 'Obiekty',
    'LBL_RELATIONSHIPS' => 'Dane relacji',
    'LBL_APPDATA' => 'Dane aplikacji',
    'LBL_SYNCED' => 'zsynchronizowane',
    'LBL_ENTRIES' => 'Wpisy',
    'LBL_SYNC_SHORT' => 'Zsynchronizuj',
    'LBL_DB_SHORT' => 'DB',
    'LBL_DATAMONITOR' => 'Monitor',
    'LBL_SYNCACTIVE' => 'aktywny',
    'LBL_UNLINK' => 'Odepnij rekord',
    'LBL_CONFIRM_UNLINK' => 'Czy jesteś pewien, że chcesz usunąć relację z tym rekordem?',
    'LBL_DELETE' => 'Usuń',
    'LBL_CONFIRM_DELETE' => 'Czy jesteś pewien, że chcesz usunąć ten rekord?',
    'LBL_SORT_BY' => 'Sortuj po',
    'LBL_ACTION_IMPORTCONTACT' => 'import z telefonu',
    'LBL_CALENDAR_LOCALCALENDARS' => 'Lokalne kalendarze',
    'LBL_TIMEOUT' => 'Timeout',
    'LBL_MYACCOUNTS' => 'Moi kontrahenci',
    'LBL_MYFAVACCOUNTS' => 'Moi ulubieni kontrahenci',
    'LBL_MYCONTACTS' => 'Moje kontakty',
    'LBL_MYFAVCONTACTS' => 'Moje ulubione kontakty',
    'LBL_OPEN_OPPORTUNITIES' => 'Otwarte szanse',
    'LBL_FAVORITE_OPPORTUNITIES' => 'Ulubione szanse',
    'LBL_OPEN_CASES' => 'Otwarte zgłoszenia',
    'LBL_MYOPEN_CASES' => 'Moje otwarte zgłoszenia',
    'LBL_OPENMYLEADS' => 'Moje otwarte namiary',
    'LBL_MYFAVLEADS' => 'Moje ulubione namiary',
    'LBL_GEO_SETTINGS' => 'GEO Dane',
    'LBL_DISTANCE_UNIT' => 'Jednostka',
    'LBL_DEFAULT_HOME_LAT' => 'Dom - szerokość geogr.',
    'LBL_DEFAULT_HOME_LON' => 'Dom - długość geogr.',
    'LBL_SET_HOME' => 'Ustaw dom',
    'LBL_ADVANCED_SETTINGS' => 'Zaawansowane ustawienia',
    'LBL_SEARCH_DELAY' => 'Opóźnienie wyszukiwania',
    'LBL_GEO_SETTINGS' => 'Ustawienia geokodowanie',
    'LBL_DISTANCE_UNIT' => 'Jednostka',
    'LBL_DEFAULT_HOME_LAT' => 'Dom - szerokość geogr.',
    'LBL_DEFAULT_HOME_LON' => 'Dom - długość geogr.',
    'LBL_SET_HOME' => 'Ustaw dom',
    'LBL_ADVANCED_SETTINGS' => 'Zaawansowane ustawienia',
    'LBL_SEARCH_DELAY' => 'Opóźnienie wyszukiwania',
    'LBL_TIMESTREAM' => 'Timestream',
    'LBL_TASKMANAGER' => 'Menadżer zadań',
    'LBL_ACOUNTCCDETAILS_LINK' => 'Szczegóły kodu firmy',
];

// CR1000333
$app_list_strings['cruser_role_dom'] = [
    'developer' => 'Developer',
    'tester' => 'Tester',
];

$app_list_strings['crstatus_dom'] = [
    '-1' => 'backlog',
    '0' => 'Utworzone',
    '1' => 'W toku',
    '2' => 'Testy jednostkowe',
    '3' => 'Testy integracyjne',
    '4' => 'Ukończone', // was 3 before CR1000333
    '5' => 'Anulowane/Odroczone' // was 4 before CR1000333
];

$app_list_strings['crtype_dom'] = [
    '0' => 'Bug',
    '1' => 'Feature reuest',
    '2' => 'Change request',
    '3' => 'Hotfix'
];

$app_list_strings['scrum_status_dom'] = [
    'created' => 'Utworzono',
    'in_progress' => 'W toku',
    'in_test' => 'Testy',
    'completed' => 'Ukończono',
    'backlog' => 'Backlog'
];

$app_list_strings['emailschedule_status_dom'] = [
    'queued' => 'Zaplanowano',
    'sent' => 'Wysłano',
];

$app_list_strings['email_schedule_status_dom'] = [
    'open' => 'open',
    'done' => 'done',
];
$app_list_strings['moduleList']['KReleasePackages'] = 'K Releasepackages';

$app_list_strings['rpstatus_dom'] = [
    '0' => 'Utworzono',
    '1' => 'W toku',
    '2' => 'Zakończono',
    '3' => 'Testy',
    '4' => 'Dostarczono',
    '5' => 'Pobrano',
    '6' => 'Wdrożono',
    '7' => 'Wydano'
];

$app_list_strings['rptype_dom'] = [
    '0' => 'Patch',
    '1' => 'Feature package',
    '2' => 'Wydanie',
    '3' => 'Software package',
    '4' => 'Import'
];

$app_list_strings['systemdeploymentpackage_repair_dom'] = [
    'repairDatabase' => 'Nabraw DB',
    'rebuildExtensions' => 'Przebuduj Rozszerzenia (Ext)',
    'clearTpls' => 'Wyczyść Szablony',
    'clearJsFiles' => 'Wyczyść pliki Js',
    'clearDashlets' => 'Wyczyść Dashlety',
    'clearSugarFeedCache' => 'Wyczyść Sugar-Feed-Cache',
    'clearThemeCache' => 'Wyczyść Theme-Cache',
    'clearVardefs' => 'Wyczyść Vardefsy',
    'clearJsLangFiles' => 'Wyczyść pliki Js-Lang',
    'rebuildAuditTables' => 'Przebuduj Audit-Tables',
    'clearSearchCache' => 'Wyczyść Search-Cache',
    'clearAll' => 'Wyczyść wszystko',
];


$app_list_strings['moduleList']['KDeploymentMWs'] = 'Deployment Maintenance Windows';
$app_list_strings['mwstatus_dom'] = [
    'planned' => 'Planowane',
    'active' => 'Aktywne',
    'completed' => 'Ukończone'
];

$app_list_strings['kdeploymentsystems_type_dom'] = [
    "repo" => "software repo",
    "ext" => "external",
    "dev" => "development",
    "test" => "test",
    "qc" => "quality",
    "prod" => "production"
];

//EventRegistrations module
$app_list_strings['eventregistration_status_dom'] = [
    'interested' => 'Brak dostępu',
    'tentative' => 'Zainteresowany',
    'registered' => 'Zarejestrowany',
    'unregistered' => 'Niezarejestrowany',
    'attended' => 'Brał udział',
    'notattended' => 'Nie pojawił się'
];

//ProjectWBSs module
$app_list_strings['wbs_status_dom'] = [
    '0' => 'Utworzony',
    '1' => 'W toku',
    '2' => 'Zakończony'
];
//Projectactivities
$app_list_strings['projects_activity_types_dom'] = [
    'consulting' => 'Konsultacja',
    'dev' => 'Development',
    'support' => 'Serwis'
];
$app_list_strings['projects_activity_levels_dom'] = [
    'standard' => 'Standard',
    'senior' => 'Senior',
];
//Projectmilestones
$app_list_strings['projects_milestone_status_dom'] = [
    'not startet' => 'Standard',
    'senior' => 'Senior',
];
$app_list_strings['projects_activity_status_dom'] = [
    'created' => 'Utworzono',
    'billed' => 'Zafakturowano',
];

//ProductAttributes
$app_list_strings['productattributedatatypes_dom'] = [
    'di' => 'Lista rozwijalna',
    'f' => 'Checkbox',
    'n' => 'Liczba',
    's' => 'Lista wielokrotnego wyboru',
    'vc' => 'Tekst'
];
$app_list_strings['productattribute_usage_dom'] = [
    'required' => 'Wymagany',
    'optional' => 'Opcjonalny',
    'none' => 'Brak',
    'hidden' => 'Ukryty'
];

//AccountCCDetails
$app_list_strings['abccategory_dom'] = [
    '' => '',
    'A' => 'A',
    'B' => 'B',
    'C' => 'C',
];

$app_list_strings['logicoperators_dom'] = [
    'and' => 'i',
    'or' => 'lub',
];

$app_list_strings['comparators_dom'] = [
    'equal' => 'równe',
    'unequal' => 'różne',
    'greater' => 'większe niż',
    'greaterequal' => 'większe lub równe',
    'less' => 'mniejsze niż',
    'lessequal' => 'mniejsze lub równe',
    'contain' => 'zawiera',
    'ncontain' => 'nie zawiera',
    'empty' => 'puste',
    'nempty' => 'nie puste',
    'null' => 'null',
    'notnull' => 'not null',
    'regex' => 'pasuje do wyrażenia regularnego',
    'notregex' => 'nie pasuje do wyrażenia regularnego'
];

$app_list_strings['moduleList']['AccountKPIs'] = 'KPI Kontrakentów';

$app_list_strings['moduleList']['Mailboxes'] = 'Skrzynki pocztowe';

$app_list_strings['mailboxes_imap_pop3_protocol_dom'] = [
    'imap' => 'IMAP',
    'pop3' => 'POP3',
];

$app_list_strings['mailboxes_imap_pop3_encryption_dom'] = [
    'ssl_enable' => 'Włącz SSL',
    'ssl_disable' => 'Wyłącz SSL'
];

$app_list_strings['mailboxes_smtp_encryption_dom'] = [
    'none' => 'Brak',
    'ssl' => 'SSL',
    'tls' => 'TLS/STARTTLS',
];

$app_strings = array_merge($app_strings, $addAppStrings);

if (file_exists('extensions/modules/ServiceEquipments/ServiceEquipment.php')) {
    $app_list_strings['serviceequipment_status_dom'] = [
        'new' => 'Nowy',
        'offsite' => 'Poza zakładem',
        'onsite' => 'Na miejscu',
        'inactive' => 'Nieaktywny',
    ];
    $app_list_strings['maintenance_cycle_dom'] = [
        '12' => 'Raz w roku',
        '6' => 'Dwa razy w roku',
        '3' => '3 razy w roku',
        '24' => 'Co drugi rok',
    ];
    $app_list_strings['counter_unit_dom'] = [ //uomunits value
        'M' => 'metry',
        'STD' => 'godziny',
    ];
}

if (file_exists('extensions/modules/ServiceOrders/ServiceOrder.php')) {
    $app_list_strings['serviceorder_status_dom'] = [
        'new' => 'Nowe',
        'planned' => 'Planowane',
        'completed' => 'Zakończone',
        'cancelled' => 'Anulowane',
        'signed' => 'Podpisane',
    ];
    $app_list_strings['parent_type_display']['ServiceOrders'] = 'Zlecenia serwisowe';
    $app_list_strings['record_type_display']['ServiceOrders'] = 'Zlecenia serwisowe';
    $app_list_strings['record_type_display_notes']['ServiceOrders'] = 'Zlecenia serwisowe';

    $app_list_strings['serviceorder_user_role_dom'] = [
        'operator' => 'Operator',
        'assistant' => 'Asystent',
    ];

    $app_list_strings['serviceorderitem_parent_type_display'] = [
        'Products' => 'Produkty',
        'ProductVariants' => 'Warianty produktów',
    ];
}
if (file_exists('modules/ServiceTickets/ServiceTicket.php')) {
    $app_list_strings['serviceticket_status_dom'] = [
        'New' => 'Nowa',
        'In Process' => 'W Toku',
        'Assigned' => 'Przydzielone',
        'Closed' => 'Zamknięta',
        'Pending Input' => 'Oczekiwanie na dane',
        'Rejected' => 'Odrzucona',
        'Duplicate' => 'Duplikat',
    ];
    $app_list_strings['serviceticket_class_dom'] = [
        'P1' => 'Wysoki',
        'P2' => 'Średni',
        'P3' => 'Niski',
    ];
    $app_list_strings['serviceticket_resaction_dom'] = [
        '' => '',
        'credit' => 'Korekta faktury',
        'replace' => 'Wysyłka zamiennika',
        'return' => 'Zwrot'
    ];
    $app_list_strings['servicenote_status_dom'] = [
        'read' => 'Przeczytana',
        'unread' => 'Nieprzeczytana'
    ];
    $app_list_strings['parent_type_display']['ServiceTickets'] = 'Zagadnienia serwisowe';
    $app_list_strings['record_type_display']['ServiceTickets'] = 'Zagadnienia serwisowe';
    $app_list_strings['record_type_display_notes']['ServiceTickets'] = 'Zagadnienia serwisowe';

}
if (file_exists('extensions/modules/ServiceFeedbacks/ServiceFeedback.php')) {
    $app_list_strings['service_satisfaction_scale_dom'] = [
        1 => '1 - brak satysfakcji',
        2 => '2',
        3 => '3',
        4 => '4',
        5 => '5 - zadowolony',
    ];
    $app_list_strings['servicefeedback_status_dom'] = [
        'created' => 'Utworzony',
        'sent' => 'Wysłany',
        'completed' => 'Ukończony',
    ];
    $app_list_strings['servicefeedback_parent_type_display'] = [
        'ServiceTickets' => 'Zagadnienia serwisowe',
        'ServiceOrders' => 'Zlecenia serwisowe',
        'ServiceCalls' => 'Zgłoszenia serwisowe',
    ];
    $app_list_strings['record_type_display'] = [
        'ServiceTickets' => 'Zagadnienia serwisowe',
        'ServiceOrders' => 'Zlecenia serwisowe',
        'ServiceCalls' => 'Zgłoszenia serwisowe',
    ];
}

$app_list_strings['mailboxes_transport_dom'] = [
    'imap' => 'IMAP/SMTP',
    'mailgun' => 'Mailgun',
    'sendgrid' => 'Sendgrid',
    'twillio'  => 'Twillio',
];

$app_list_strings['mailboxes_log_levels'] = [
    '0' => 'Brak',
    '1' => 'Error',
    '2' => 'Debug',
];

$app_list_strings['mailboxes_outbound_comm'] = [
    'no' => 'Niedozowolony',
    'single' => 'Tylko pojedyncze maile',
    'mass' => 'Pojedyncze i masowe maile',
    'single_sms' => 'Tylko pojedyncze wiadomości (SMS)',
    'mass_sms'   => 'Pojedyncze i masowe wiadomości (SMS)',
];

$app_list_strings['output_template_types'] = [
    '' => '',
    'email' => 'E-mail',
    'pdf' => 'PDF',
];

$app_list_strings['languages'] = [
    '' => '',
    'de' => 'Niemiecki',
    'en' => 'Angielski',
    'pl' => 'Polski',
];


$app_list_strings['spiceaclobjects_types_dom'] = [
    '0' => 'Standardowy',
    '1' => 'Restrykcyjny (wszystko)',
    '2' => 'Wykluczający (wszystko)',
    '3' => 'Limit aktywności'
    //'4' => 'restrict (profile)',
    //'5' => 'exclude (profile)'
];

// CR1000333
$app_list_strings['deploymentrelease_status_dom'] = [
    '' => '',
    'plan' => 'Planowany', // value was planned before CR1000333
    'develop' => 'Development',
    'prepare' => 'Przygotowanie',
    'test' => 'Testy',
    'release' => 'Wdrożony',
    'closed completed' => 'Zakończony', // value was released before CR1000333
    'closed canceled' => 'Anulowany',
];

$app_list_strings['product_status_dom'] = [
    'draft' => 'Szkic',
    'active' => 'Aktywny',
    'inactive' => 'Nieaktywny'
];

$app_list_strings['textmessage_direction'] = [
    'i' => 'Przychodzący',
    'o' => 'Wychodzący',
];

$app_list_strings['textmessage_delivery_status'] = [
    'draft'  => 'Szkic',
    'sent'   => 'Wysłany',
    'failed' => 'Błąd wysyłki',
    'transmitting' => 'Transmitowanie',
];

$app_list_strings['event_status_dom'] = [
    'planned' => 'Planowane',
    'active' => 'Aktywne',
    'canceled' => 'Anulowane'
];

$app_list_strings['event_category_dom'] = [
    'presentations' => 'Prezentacje',
    'seminars' => 'Seminaria',
    'conferences' => 'Konferencje'
];

$app_list_strings['incoterms_dom'] = [
    'EXW' => 'Z zakładu',
    'FCA' => 'Franco przewoźnik',
    'FAS' => 'Franco wzdłuż burty statku',
    'FOB' => 'Franco Statek',
    'CFR' => 'Koszt i Fracht',
    'CIF' => 'Koszt, Ubezpieczenie i Fracht',
    'CPT' => 'Przewoźne opłacone do',
    'CIP' => 'PPrzewoźne i Ubezpieczenie opłacone do',
    'DAT' => 'Dostarczony do terminalu',
    'DAP' => 'Dostarczony do miejsca',
    'DDP' => 'Dostarczony, cło opłacone',
];


$app_list_strings['sales_planning_characteristics_fieldtype_dom'] = [
    'char' => 'Tekst',
    'int' => 'Liczba całkowita',
    'float' => 'Liczba zmiennoprzecinkowa',
];

$app_list_strings['sales_planning_version_status_dom'] = [
    'd' => 'Utworzono',
    'a' => 'Aktywny',
    'c' => 'Zamknięty',
];

$app_list_strings['sales_planning_content_field_dom'] = [
    'percentage' => 'Procent',
    'currency' => 'Waluta',
    'character' => 'Tekst',
    'natural' => 'Liczba całkowita',
    'float' => 'Liczba zmiennoprzecinkowa',
];

$app_list_strings['sales_planning_periode_units_dom'] = [
    'days' => 'Dni',
    'weeks' => 'Tygodnie',
    'months' => 'Miesiące',
    'quarters' => 'Kwartały',
    'years' => 'Lata',
];

$app_list_strings['sales_planning_group_actions_dom'] = [
    '' => '',
    'sum' => 'Suma',
    'avg' => 'Średnia',
    'min' => 'Minimum',
    'max' => 'Maksimum'
];

$app_list_strings['inquiry_type'] = [
    'normal' => 'Zapytanie',
    'complaint' => 'Reklamacja',
    'booking' => 'Wniosek o rezerwację',
    'catalog' => 'Prośba o katalog'
];

$app_list_strings['inquiry_status'] = [
    'normal_new' => 'Nowe',
    'complaint_new' => 'Nowe (Reklamacja)',
    'catalog_new' => 'Nowe (Katalog)',
    'booking_new' => 'Nowe (Rezeracja)',
    'normal_processing' => 'W toku',
    'booking_processing' => 'W toku',
    'booking_offered' => 'Oferta',
    'converted' => 'Przekształcone',
    'closed' => 'Zamknięte',
    'cancelled' => 'Anulowane',
];

$app_list_strings['inquiry_source'] = [
    'web' => 'z internetu',
    'email' => 'E-mail',
    'manually' => 'Manualne',
];

$app_list_strings['catalogorder_status'] = [
    'new' => 'Nowe',
    'approved' => 'Zaakceptowane',
    'in_process' => 'W toku',
    'sent' => 'Wysłane',
    'cancelled' => 'Anulowane',
];

$app_list_strings['vat_country_dom'] = [
    'DE' => 'DE',
    'AT' => 'AT',
    'FR' => 'FR',
    'IT' => 'IT',
    'PL' => 'PL',
    'ES' => 'ES',
    'UK' => 'UK',
    'NL' => 'NL',
    'SW' => 'SW',
    'X' => 'X'
];

$app_list_strings['landingpage_content_type_dom'] = [
    'html' => 'HTML',
    'questionnaire' => 'Ankieta'
];

$app_list_strings['transport_type_dom'] = [
    'privatecar' => 'Samochód prywatny',
    'companycar' => 'Samochód firmowy',
    'rentalcar' => 'Samochód wypożyczony',
    'bus' => 'Autobus',
    'train' => 'Pociąg',
    'airtravel' => 'Samolot',

];

$app_list_strings['receipts_dom'] = [
    'hotel_bill' => 'Rachunek z hotelu',
    'fuel_bill' => 'Rachunek z paliwo',
    'restaurant' => 'Rachunek z restauracji'
];

$app_list_strings['relationship_type_dom'] = [
    'one-to-many' => 'Jeden-(po lewej) do-Wielu (po prawej)',
    'many-to-many' => 'Wiele-do-Wielu',
    'parent' => 'Relacja elastyczna (wiele Jeden-do-Wielu)'
];

$app_list_strings['systemmaintenance_status_dom'] = [
    'planned' => 'Zaplanowano',
    'started' => 'Rozpoczęto',
    'finished' => 'Zakończono'
];
$app_list_strings['payments_type_dom'] = [
    'cash' => 'Gotówka',
    'ATM_card' => 'Karta płatnicza',
    'credit_card' => 'Karta kredytowa'
];
