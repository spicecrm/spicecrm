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
    'language_pack_name' => 'English',

    'customer_type_dom' => [
        'B' => 'Business',
        'C' => 'Consumer',
    ],

    //e.g. en franï¿½ais 'Analyst'=>'Analyste',
    'account_type_dom' => [
        '' => '',
        'Analyst' => 'Analyst',
        'Competitor' => 'Competitor',
        'Customer' => 'Customer',
        'Integrator' => 'Integrator',
        'Investor' => 'Investor',
        'Partner' => 'Partner',
        'Press' => 'Press',
        'Prospect' => 'Prospect',
        'Reseller' => 'Reseller',
        'Other' => 'Other',
    ],
    'account_user_roles_dom' => [
        '' => '',
        'am' => 'Account Manager',
        'se' => 'Support Engineer',
        'es' => 'Executive Sponsor'
    ],
    'events_account_roles_dom' => [
        '' => '',
        'organizer' => 'Organizer',
        'sponsor' => 'Sponsor',
        'caterer' => 'Caterer'
    ],
    'events_contact_roles_dom' => [
        '' => '',
        'organizer' => 'Organizer',
        'speaker' => 'Speaker',
        'moderator' => 'Moderator',
    ],
    'events_consumer_roles_dom' => [
        '' => '',
        'organizer' => 'Organizer',
        'speaker' => 'Speaker',
        'moderator' => 'Moderator',
    ],
    'userabsences_type_dom' => [
        '' => '',
        'Sick leave' => 'Sick leave',
        'Vacation' => 'Vacation',
        'HomeOffice' => 'Home Office',
    ],
    'userabsences_status_dom' => [
        '' => '',
        'created' => 'Created',
        'submitted' => 'Submitted',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
        'revoked' => 'Revoked',
        'cancel_requested' => 'Cancellation requested'
    ],

    //e.g. en espaï¿½ol 'Apparel'=>'Ropa',
    'industry_dom' => [
        '' => '',
        'Apparel' => 'Apparel',
        'Banking' => 'Banking',
        'Biotechnology' => 'Biotechnology',
        'Chemicals' => 'Chemicals',
        'Communications' => 'Communications',
        'Construction' => 'Construction',
        'Consulting' => 'Consulting',
        'Education' => 'Education',
        'Electronics' => 'Electronics',
        'Energy' => 'Energy',
        'Engineering' => 'Engineering',
        'Entertainment' => 'Entertainment',
        'Environmental' => 'Environmental',
        'Finance' => 'Finance',
        'Government' => 'Government',
        'Healthcare' => 'Healthcare',
        'Hospitality' => 'Hospitality',
        'Insurance' => 'Insurance',
        'Machinery' => 'Machinery',
        'Manufacturing' => 'Manufacturing',
        'Media' => 'Media',
        'Not For Profit' => 'Not For Profit',
        'Recreation' => 'Recreation',
        'Retail' => 'Retail',
        'Shipping' => 'Shipping',
        'Technology' => 'Technology',
        'Telecommunications' => 'Telecommunications',
        'Transportation' => 'Transportation',
        'Utilities' => 'Utilities',
        'Other' => 'Other',
    ],
    'lead_source_default_key' => 'Self Generated',
    'lead_source_dom' => [
        '' => '',
        'Cold Call' => 'Cold Call',
        'Existing Customer' => 'Existing Customer',
        'Self Generated' => 'Self Generated',
        'Employee' => 'Employee',
        'Partner' => 'Partner',
        'Public Relations' => 'Public Relations',
        'Direct Mail' => 'Direct Mail',
        'Conference' => 'Conference',
        'Trade Show' => 'Trade Show',
        'Web Site' => 'Web Site',
        'Word of mouth' => 'Word of mouth',
        'Email' => 'Email',
        'Campaign' => 'Campaign',
        'Other' => 'Other',
    ],
    'opportunity_type_dom' => [
        '' => '',
        'Existing Business' => 'Existing Business',
        'New Business' => 'New Business',
    ],
    'roi_type_dom' => [
        'Revenue' => 'Revenue',
        'Investment' => 'Investment',
        'Expected_Revenue' => 'Expected Revenue',
        'Budget' => 'Budget',

    ],
    //Note:  do not translate opportunity_relationship_type_default_key
//       it is the key for the default opportunity_relationship_type_dom value
    'opportunity_relationship_type_default_key' => 'Primary Decision Maker',
    'opportunity_relationship_type_dom' =>
        [
            '' => '',
            'Primary Decision Maker' => 'Primary Decision Maker',
            'Business Decision Maker' => 'Business Decision Maker',
            'Business Evaluator' => 'Business Evaluator',
            'Technical Decision Maker' => 'Technical Decision Maker',
            'Technical Evaluator' => 'Technical Evaluator',
            'Executive Sponsor' => 'Executive Sponsor',
            'Influencer' => 'Influencer',
            'Project Manager' => 'Project Manager',
            'Other' => 'Other',
        ],
    'opportunity_urelationship_type_dom' =>
        [
            '' => '',
            'Account Manager' => 'Account Manager',
            'Solution Manager' => 'Solution Manager',
            'Success Manager' => 'Success Manager',
            'Executive Sponsor' => 'Executive Sponsor',
            'Other' => 'Other',
        ],
    //Note:  do not translate case_relationship_type_default_key
//       it is the key for the default case_relationship_type_dom value
    'case_relationship_type_default_key' => 'Primary Contact',
    'case_relationship_type_dom' =>
        [
            '' => '',
            'Primary Contact' => 'Primary Contact',
            'Alternate Contact' => 'Alternate Contact',
        ],
    'payment_terms' =>
        [
            '' => '',
            'Net 15' => 'Net 15',
            'Net 30' => 'Net 30',
        ],
    'sales_stage_default_key' => 'Prospecting',
    'fts_type' => [
        '' => '',
        'Elastic' => 'elasticsearch'
    ],
    'sales_stage_dom' => [
// CR1000302 adapt to match opportunity spicebeanguidestages
//        'Prospecting' => 'Prospecting',
        'Qualification' => 'Qualification',
        'Analysis' => 'Needs Analysis',
        'Proposition' => 'Value Proposition',
//        'Id. Decision Makers' => 'Id. Decision Makers',
//        'Perception Analysis' => 'Perception Analysis',
        'Proposal' => 'Proposal/Price Quote',
        'Negotiation' => 'Negotiation/Review',
        'Closed Won' => 'Closed Won',
        'Closed Lost' => 'Closed Lost',
        'Closed Discontinued' => 'Closed Discontinued'
    ],
    'opportunityrevenuesplit_dom' => [
        'none' => 'None',
        'split' => 'Split',
        'rampup' => 'Rampup'
    ],
    'opportunity_relationship_buying_center_dom' => [
        '++' => 'very positive',
        '+' => 'positive',
        'o' => 'neutral',
        '-' => 'negative',
        '--' => 'very negative'
    ],
    'in_total_group_stages' => [
        'Draft' => 'Draft',
        'Negotiation' => 'Negotiation',
        'Delivered' => 'Delivered',
        'On Hold' => 'On Hold',
        'Confirmed' => 'Confirmed',
        'Closed Accepted' => 'Closed Accepted',
        'Closed Lost' => 'Closed Lost',
        'Closed Dead' => 'Closed Dead',
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
        '++' => 'very high',
        '+' => 'high',
        'o' => 'neutral',
        '-' => 'low',
        '--' => 'very low'
    ],
    'competitive_status_dom' => [
        'active' => 'active in Sales Cycle',
        'withdrawn' => 'withdrawn by Competitor',
        'rejected' => 'rejected by Customer'
    ],
    'activity_dom' => [
        'Call' => 'Call',
        'Meeting' => 'Meeting',
        'Task' => 'Task',
        'Email' => 'Email',
        'Note' => 'Note',
    ],
    'salutation_dom' => [
        '' => '',
        'Mr.' => 'Mr.',
        'Ms.' => 'Ms.',
        'Mx.' => 'Mx.'
        // 'Mrs.' => 'Mrs.',
        // 'Dr.' => 'Dr.',
        //  'Prof.' => 'Prof.',
    ],
    'salutation_letter_dom' => [
        '' => '',
        'Mr.' => 'Dear Mr.',
        'Ms.' => 'Dear Ms.',
        'Mx.' => 'Dear Mx.'
        // 'Mrs.' => 'Mrs.',
        // 'Dr.' => 'Dr.',
        //  'Prof.' => 'Prof.',
    ],
    'form_of_address_dom' => [
        'formal' => 'formal',
        'normal' => 'normal',
        'friendly' => 'friendly'
    ],
    'gdpr_marketing_agreement_dom' => [
        '' => '',
        'r' => 'refused',
        'g' => 'granted',
    ],
    'uom_unit_dimensions_dom' => [
        '' => '',
        'none' => 'none',
        'weight' => 'Weight',
        'volume' => 'Volume',
        'area' => 'Area',
        'time' => 'Time',
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
    'personalinterests_dom' => [
        'sports' => 'Sports',
        'food' => 'Food',
        'wine' => 'Wine',
        'culture' => 'Culture',
        'travel' => 'Travel',
        'books' => 'Books',
        'animals' => 'Animals',
        'clothing' => 'Clothing',
        'cooking' => 'Cooking',
        'fashion' => 'Fashion',
        'music' => 'Music',
        'fitness' => 'Fitness'
    ],
    'questionstypes_dom' => [
        'rating' => 'Rating',
        'ratinggroup' => 'Rating Group',
        'binary' => 'Binary Choice',
        'single' => 'Single Choice',
        'multi' => 'Multiple Choice',
        'text' => 'Text Input',
        'ist' => 'IST',
        'nps' => 'NPS (Net Promoter Score)'
    ],
    'questionsettypes_dom' => [
        'various' => 'verschiedene (default)',
        'ratinggroup' => 'Bewertung',
    ],
    'evaluationtypes_dom' => [
        'default' => 'Standard',
        'avg_core' => 'Average',
        'spiderweb' => 'Spiderweb'
    ],
    'evaluationsorting_dom' => [
        'categories' => 'by Categories (alphabetical)',
        'points asc' => 'by Points, ascending',
        'points desc' => 'by Points, descending'
    ],
    'interpretationsuggestions_dom' => [
        'top3' => 'top 3',
        'top3_bottom2' => 'top 3 + bottom 2',
        'top5' => 'top 5',
        'over20' => 'up from 20 points',
        'over30' => 'up from 30 points',
        'over40' => 'up from 40 points',
        'top3_upfrom20' => 'top 3 or up from 20 points',
        'top5_upfrom20' => 'top 5 or up from 20 points',
        'top3_upfrom30' => 'top 3 or up from 30 points',
        'top5_upfrom30' => 'top 5 or up from 30 points',
        'top3_upfrom40' => 'top 3 or up from 40 points',
        'top5_upfrom40' => 'top 5 or up from 40 points',
        'all' => 'all Interpretations',
        'mbti' => 'MBTI'
    ],
    //time is in seconds; the greater the time the longer it takes;
    'reminder_max_time' => 90000,
    'reminder_time_options' => [
        -1 => 'no reminder',
        60 => '1 minute prior',
        300 => '5 minutes prior',
        600 => '10 minutes prior',
        900 => '15 minutes prior',
        1800 => '30 minutes prior',
        3600 => '1 hour prior',
        7200 => '2 hours prior',
        10800 => '3 hours prior',
        18000 => '5 hours prior',
        86400 => '1 day prior',
    ],

    'task_priority_default' => 'Medium',
    'task_priority_dom' =>
        [
            'High' => 'High',
            'Medium' => 'Medium',
            'Low' => 'Low',
        ],
    'task_status_default' => 'Not Started',
    'task_status_dom' =>
        [
            'Not Started' => 'Not Started',
            'In Progress' => 'In Progress',
            'Completed' => 'Completed',
            'Pending Input' => 'Pending Input',
            'Deferred' => 'Deferred',
        ],
    'meeting_status_default' => 'Planned',
    'meeting_status_dom' =>
        [
            'Planned' => 'Planned',
            'Held' => 'Held',
            'Cancelled' => 'Cancelled',
            'Not Held' => 'Not Held',
        ],
    'extapi_meeting_password' =>
        [
            'WebEx' => 'WebEx',
        ],
    'meeting_type_dom' =>
        [
            'Other' => 'Other',
            'Spice' => 'SpiceCRM',
        ],
    'call_status_default' => 'Planned',
    'call_status_dom' =>
        [
            'Planned' => 'Planned',
            'Held' => 'Held',
            'Cancelled' => 'Cancelled',
            'Not Held' => 'Not Held',
        ],
    'call_direction_default' => 'Outbound',
    'call_direction_dom' =>
        [
            'Inbound' => 'Inbound',
            'Outbound' => 'Outbound',
        ],
    'lead_status_dom' =>
        [
            '' => '',
            'New' => 'New',
            'Assigned' => 'Assigned',
            'In Process' => 'In Process',
            'Converted' => 'Converted',
            'Recycled' => 'Recycled',
            'Dead' => 'Dead',
        ],
    'lead_classification_dom' => [
        'cold' => 'cold',
        'warm' => 'warm',
        'hot' => 'hot'
    ],
    'lead_type_dom' => [
        'b2b' => 'business',
        'b2c' => 'consumer'
    ],
    'gender_list' =>
        [
            'male' => 'Male',
            'female' => 'Female',
        ],
    //Note:  do not translate case_status_default_key
//       it is the key for the default case_status_dom value
    'case_status_default_key' => 'New',
    'case_status_dom' =>
        [
            'New' => 'New',
            'Assigned' => 'Assigned',
            'Closed' => 'Closed',
            'Pending Input' => 'Pending Input',
            'Rejected' => 'Rejected',
            'Duplicate' => 'Duplicate',
        ],
    'case_priority_default_key' => 'P2',
    'case_priority_dom' =>
        [
            'P1' => 'High',
            'P2' => 'Medium',
            'P3' => 'Low',
        ],
    'user_type_dom' =>
        [
            'RegularUser' => 'Regular User',
            'PortalUser' => 'Portal User',
            'Administrator' => 'Administrator',
            'APIuser' => 'API User'
        ],
    'user_status_dom' =>
        [
            'Active' => 'Active',
            'Inactive' => 'Inactive',
        ],
    'calendar_type_dom' =>
        [
            'Full' => 'Full',
            'Day' => 'Day',
        ],
    'knowledge_status_dom' =>
        [
            'Draft' => 'Draft',
            'Released' => 'Released',
            'Retired' => 'Retired',
        ],
    'employee_status_dom' =>
        [
            'Active' => 'Active',
            'Terminated' => 'Terminated',
            'Leave of Absence' => 'Leave of Absence',
        ],
    'messenger_type_dom' =>
        [
            '' => '',
            'MSN' => 'MSN',
            'Yahoo!' => 'Yahoo!',
            'AOL' => 'AOL',
        ],
    'project_task_priority_options' => [
        'High' => 'High',
        'Medium' => 'Medium',
        'Low' => 'Low',
    ],
    'project_task_priority_default' => 'Medium',

    'project_task_status_options' => [
        'Not Started' => 'Not Started',
        'In Progress' => 'In Progress',
        'Completed' => 'Completed',
        'Pending Input' => 'Pending Input',
        'Deferred' => 'Deferred',
    ],
    'project_task_utilization_options' => [
        '0' => 'none',
        '25' => '25',
        '50' => '50',
        '75' => '75',
        '100' => '100',
    ],
    'project_type_dom' => [
        'customer' => 'customer',
        'development' => 'development',
        'sales' => 'sales',
        'admin' => 'intern',
    ],
    'project_status_dom' => [
        'planned' => 'Planned',
        'active' => 'Active',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
        'Draft' => 'Draft',
        'In Review' => 'In Review',
        'Published' => 'Published',
    ],
    'project_duration_units_dom' => [
        'Days' => 'Days',
        'Hours' => 'Hours',
    ],
    'project_priority_options' => [
        'High' => 'High',
        'Medium' => 'Medium',
        'Low' => 'Low',
    ],
    'projects_plannedactivity_status_dom' => [
        'planned' => 'planned',
        'released' => 'released',
        'active' => 'active',
        'onhold' => 'on Hold',
        'completed' => 'completed',
        'cancelled' => 'cancelled'
    ],
    'projects_activity_status_dom' => [
        'created' => 'created',
        'settled' => 'settled'
    ],
   'mailbox_message_types' => [
        'sms' => 'Text Messages',
        'email' => 'Emails',
    ],
    /*Added entries 'Queued' and 'Sending' for 4.0 release..*/
    'campaign_status_dom' =>
        [
            '' => '',
            'Planning' => 'Planning',
            'Active' => 'Active',
            'Inactive' => 'Inactive',
            'Complete' => 'Complete',
            'In Queue' => 'In Queue',
            'Sending' => 'Sending',
        ],
    'campaign_type_dom' => [
        'Event' => 'Event',
        'Telesales' => 'Telesales',
        'Mail' => 'Mail',
        'Email' => 'Email',
        'Print' => 'Print',
        'Web' => 'Web',
        'Radio' => 'Radio',
        'Television' => 'Television',
        'NewsLetter' => 'Newsletter',
    ],
    'campaigntask_type_dom' => [
        'Event' => 'Event',
        'Telesales' => 'Telesales',
        'Mail' => 'Mail',
        'Email' => 'Email',
        'mailmerge' => 'Mail Merge',
        'Feedback' => 'Feedback',
        'Print' => 'Print',
        'Web' => 'Web',
        'Radio' => 'Radio',
        'Television' => 'Television',
        'NewsLetter' => 'Newsletter',
    ],
    'newsletter_frequency_dom' =>
        [
            '' => '',
            'Weekly' => 'Weekly',
            'Monthly' => 'Monthly',
            'Quarterly' => 'Quarterly',
            'Annually' => 'Annually',
        ],
    'servicecall_type_dom' => [
        'info' => 'Info Request',
        'complaint' => 'Complaint',
        'return' => 'Return',
        'service' => 'Service Request',
    ],
    'dom_cal_month_long' => [
        '0' => "",
        '1' => "January",
        '2' => "February",
        '3' => "March",
        '4' => "April",
        '5' => "May",
        '6' => "June",
        '7' => "July",
        '8' => "August",
        '9' => "September",
        '10' => "October",
        '11' => "November",
        '12' => "December",
    ],
    'dom_cal_month_short' => [
        '0' => "",
        '1' => "Jan",
        '2' => "Feb",
        '3' => "Mar",
        '4' => "Apr",
        '5' => "May",
        '6' => "Jun",
        '7' => "Jul",
        '8' => "Aug",
        '9' => "Sep",
        '10' => "Oct",
        '11' => "Nov",
        '12' => "Dec",
    ],
    'dom_cal_day_long' => [
        '0' => "",
        '1' => "Sunday",
        '2' => "Monday",
        '3' => "Tuesday",
        '4' => "Wednesday",
        '5' => "Thursday",
        '6' => "Friday",
        '7' => "Saturday",
    ],
    'dom_cal_day_short' => [
        '0' => "",
        '1' => "Sun",
        '2' => "Mon",
        '3' => "Tue",
        '4' => "Wed",
        '5' => "Thu",
        '6' => "Fri",
        '7' => "Sat",
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
        'out' => 'Sent',
        'archived' => 'Archived',
        'draft' => 'Draft',
        'inbound' => 'Inbound',
        'campaign' => 'Campaign'
    ],
    'dom_email_status' => [
        'archived' => 'Archived',
        'closed' => 'Closed',
        'draft' => 'In Draft',
        'read' => 'Read',
        'opened' => 'Opened',
        'replied' => 'Replied',
        'sent' => 'Sent',
        'delivered' => 'Delivered',
        'send_error' => 'Send Error',
        'unread' => 'Unread',
        'bounced' => 'Bounced'
    ],
    'dom_letter_status' => [
        'sent' => 'sent',
        'draft' => 'draft'
    ],
    'dom_textmessage_status' => [
        'archived' => 'Archived',
        'closed' => 'Closed',
        'draft' => 'In Draft',
        'read' => 'Read',
        'replied' => 'Replied',
        'sent' => 'Sent',
        'send_error' => 'Send Error',
        'unread' => 'Unread',
    ],
    'dom_email_archived_status' => [
        'archived' => 'Archived',
    ],
    'dom_email_openness' => [
        'open' => 'Open',
        'user_closed' => 'Closed by user',
        'system_closed' => 'Closed by system'
    ],
    'dom_textmessage_openness' => [
        'open' => 'Open',
        'user_closed' => 'Closed by user',
        'system_closed' => 'Closed by system'
    ],
    'dom_email_server_type' => ['' => '--None--',
        'imap' => 'IMAP',
    ],
    'dom_mailbox_type' => [/*''           => '--None Specified--',*/
        'pick' => '--None--',
        'createcase' => 'Create Case',
        'bounce' => 'Bounce Handling',
    ],
    'dom_email_distribution' => ['' => '--None--',
        'direct' => 'Direct Assign',
        'roundRobin' => 'Round-Robin',
        'leastBusy' => 'Least-Busy',
    ],
    'dom_email_distribution_for_auto_create' => ['roundRobin' => 'Round-Robin',
        'leastBusy' => 'Least-Busy',
    ],
    'jobtask_status_dom' => [
        'active' => 'active',
        'running' => 'running',
        'on_hold' => 'on hold'
    ],
    'job_status_dom' =>
        [
            'Active' => 'Active',
            'Inactive' => 'Inactive',
            'OnHold' => 'On hold',
            'Running' => 'Running',
        ],
    'job_period_dom' =>
        [
            'min' => 'Minutes',
            'hour' => 'Hours',
        ],
    'document_category_dom' => [
        '' => '',
        'Marketing' => 'Marketing',
        'Knowledege Base' => 'Knowledge Base',
        'Sales' => 'Sales',
    ],
    'document_subcategory_dom' => [
        '' => '',
        'Marketing Collateral' => 'Marketing Collateral',
        'Product Brochures' => 'Product Brochures',
        'FAQ' => 'FAQ',
    ],
    'document_status_dom' => [
        'Active' => 'Active',
        'Draft' => 'Draft',
        'Expired' => 'Expired',
        'Under Review' => 'Under Review',
    ],
    'document_template_type_dom' => [
        '' => '',
        'mailmerge' => 'Mail Merge',
        'eula' => 'EULA',
        'nda' => 'NDA',
        'license' => 'License Agreement',
    ],
    'document_revisionstatus_dom' => [
        'c' => 'created',
        'r' => 'released',
        'a' => 'archived',
    ],
    'dom_meeting_accept_options' => [
        'accept' => 'Accept',
        'decline' => 'Decline',
        'tentative' => 'Tentative',
    ],
    'dom_meeting_accept_status' => [
        'accept' => 'Accepted',
        'decline' => 'Declined',
        'tentative' => 'Tentative',
        'none' => 'None',
    ],
    'duration_intervals' => ['0' => '00',
        '15' => '15',
        '30' => '30',
        '45' => '45'
    ],
    'repeat_type_dom' => [
        '' => 'None',
        'Daily' => 'Daily',
        'Weekly' => 'Weekly',
        'Monthly' => 'Monthly',
        'Yearly' => 'Yearly',
    ],

    'repeat_intervals' => [
        '' => '',
        'Daily' => 'day(s)',
        'Weekly' => 'week(s)',
        'Monthly' => 'month(s)',
        'Yearly' => 'year(s)',
    ],

    'duration_dom' => [
        '' => 'None',
        '900' => '15 minutes',
        '1800' => '30 minutes',
        '2700' => '45 minutes',
        '3600' => '1 hour',
        '5400' => '1.5 hours',
        '7200' => '2 hours',
        '10800' => '3 hours',
        '21600' => '6 hours',
        '86400' => '1 day',
        '172800' => '2 days',
        '259200' => '3 days',
        '604800' => '1 week',
    ],

// deferred
    /*// QUEUES MODULE DOMs
    'queue_type_dom' => array(
        'Users' => 'Users',
        'Mailbox' => 'Mailbox',
    ),
    */
//prospect list type dom
    'prospect_list_type_dom' =>
        [
            'default' => 'Default',
            'seed' => 'Seed',
            'exempt_domain' => 'Suppression List - By Domain',
            'exempt_address' => 'Suppression List - By Email Address',
            'exempt' => 'Suppression List - By Id',
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
            'active' => 'Active',
            'inactive' => 'Inactive'
        ],

    'campainglog_activity_type_dom' =>
        [
            '' => '',
            'queued' => 'queued',
            'sent' => 'sent',
            'delivered' => 'delivered',
            'opened' => 'opened',
            'deferred' => 'deferred',
            'bounced' => 'bounced',
            'targeted' => 'Message Sent/Attempted',
            'send error' => 'Bounced Messages,Other',
            'invalid email' => 'Bounced Messages,Invalid Email',
            'link' => 'clicked',
            'viewed' => 'opened',
            'removed' => 'Opted Out',
            'lead' => 'Leads Created',
            'contact' => 'Contacts Created',
            'blocked' => 'Suppressed by address or domain',
            'error' => 'generic error',
            'noemail' => 'no email address'
        ],

    'campainglog_target_type_dom' =>
        [
            'Contacts' => 'Contacts',
            'Users' => 'Users',
            'Prospects' => 'Targets',
            'Leads' => 'Leads',
            'Accounts' => 'Accounts',
        ],
    'projects_priority_options' => [
        'high' => 'High',
        'medium' => 'Medium',
        'low' => 'Low',
    ],
    'projects_status_options' => [
        'notstarted' => 'Not Started',
        'inprogress' => 'In Progress',
        'completed' => 'Completed',
    ],
    'salesdoc_doccategories' => [
        'QT' => 'Quote',
        'OR' => 'Order',
        'IV' => 'Invoice',
        'CT' => 'Contract',
        'VS' => 'Voucher Sale'
    ],
    'salesdoc_docparties' => [
        'I' => 'Individual',
        'B' => 'Business',
        'C' => 'Consumer',
    ],
    'salesdoc_uoms' => [
        'm2' => 'm²',
        'PC' => 'PC'
    ],
    'salesdocs_paymentterms' => [
        '7DN' => '7 Days Net',
        '14DN' => '14 Days Net',
        '30DN' => '30 Days Net',
        '30DN7D3' => '30 Days Net, 7 Days 3%',
        '60DN' => '60 Days Net',
        '60DN7D3' => '60 Days Net, 7 Days 3%',
    ],
    'salesdocitem_rejection_reasons_dom' => [
        'tooexpensive' => 'too expensive',
        'nomatch' => 'does not match requirements',
        'deliverydate' => 'proposed delivery too late'
    ],
    'salesvoucher_type_dom' => [
        'v' => 'value',
        'p' => 'prercent'
    ],
    'salesdoc_status_dom' => [
        'vsnew' => 'new',
        'vscreated' => 'created',
        'vspaid' => 'paid',
        'vscancelled' => 'cancelled'
    ],
    'salesvoucher_status_dom' => [
        'created' => 'created',
        'paid' => 'paid',
        'redeemed' => 'redeemed',
        'canceled' => 'canceled'
    ],
    'resource_status_dom' => [
        'planned' => 'Planned',
        'active' => 'Active',
        'retired' => 'Retired',
    ],
    'resource_type_dom' => [
        'room' => 'Room',
        'equipment' => 'Equipment',
        'vehicle' => 'Vehicle',
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
        'task' => 'Task',
        'decision' => 'Decision',
        'email' => 'Email',
        'system' => 'System',
    ],
    'workflowdefinition_status' => [
        'active' => 'active',
        'active_once' => 'active (run once)',
        'active_scheduled' => 'active scheduled',
        'active_scheduled_once' => 'active scheduled (run once)',
        'inactive' => 'inactive'
    ],
    'workflowdefinition_precondition' => [
        'a' => 'always',
        'u' => 'on update',
        'n' => 'when new'
    ],
    'workflowdefinition_emailtypes' => [
        '1' => 'user assigned to Task',
        '2' => 'user assigned to Bean',
        '3' => 'user created Bean',
        '4' => 'manager assigned to Bean',
        '5' => 'manager created Bean',
        '6' => 'email address',
        '7' => 'system routine',
        '8' => 'user creator to Bean',
        '9' => 'email1 of parent bean',
        'A' => 'email1 of parent of parent bean',
        'B' => 'email1 of parent of parent bean'
    ],
    'workflowdefinition_assgintotypes' => [
        '1' => 'User',
        '2' => 'Workgroup',
        '3' => 'User assigned to Parent Object',
        '4' => 'Manager of User assigned to Parent Object',
        '5' => 'system routine',
        '6' => 'Creator',
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
        '5' => 'Scheduled',
        '10' => 'New',
        '20' => 'in process',
        '30' => 'completed',
        '40' => 'closed by System'
    ],
    'page_sizes_dom' => [
        'A3' => 'A3',
        'A4' => 'A4',
        'A5' => 'A5',
        'A6' => 'A6'
    ],
    'page_orientation_dom' => [
        'P' => 'Portrait',
        'L' => 'Landscape'
    ],
    // dropdown status for costcenter module
    'costcenter_status_dom' => [
        'active' => 'Active',
        'inactive' => 'Inactive'
    ],
    // dropdown status for serviceorderitems module
    'serviceorderitem_status_dom' => [
        'active' => 'Active',
        'inactive' => 'Inactive'
    ],
    'apilog_direction_dom' => [
    'I' => 'Inbound',
    'O' => 'Outbound',
],
];
$app_list_strings['project_priority_default'] = 'Medium';
$app_list_strings['project_priority_options'] = [
    'High' => 'High',
    'Medium' => 'Medium',
    'Low' => 'Low',
];


$app_list_strings['kbdocument_status_dom'] = [
    'Draft' => 'Draft',
    'Expired' => 'Expired',
    'In Review' => 'In Review',
    'Published' => 'Published',
];

$app_list_strings['kbadmin_actions_dom'] =
    [
        '' => '--Admin Actions--',
        'Create New Tag' => 'Create New Tag',
        'Delete Tag' => 'Delete Tag',
        'Rename Tag' => 'Rename Tag',
        'Move Selected Articles' => 'Move Selected Articles',
        'Apply Tags On Articles' => 'Apply Tags To Articles',
        'Delete Selected Articles' => 'Delete Selected Articles',
    ];


$app_list_strings['kbdocument_attachment_option_dom'] =
    [
        '' => '',
        'some' => 'Has Attachments',
        'none' => 'Has None',
        'mime' => 'Specify Mime Type',
        'name' => 'Specify Name',
    ];

$app_list_strings['moduleList']['KBDocuments'] = 'Knowledge Base';
$app_strings['LBL_CREATE_KB_DOCUMENT'] = 'Create Article';
$app_list_strings['kbdocument_viewing_frequency_dom'] =
    [
        '' => '',
        'Top_5' => 'Top 5',
        'Top_10' => 'Top 10',
        'Top_20' => 'Top 20',
        'Bot_5' => 'Bottom 5',
        'Bot_10' => 'Bottom 10',
        'Bot_20' => 'Bottom 20',
    ];

$app_list_strings['kbdocument_canned_search'] =
    [
        'all' => 'All',
        'added' => 'Added Last 30 days',
        'pending' => 'Pending my Approval',
        'updated' => 'Updated Last 30 days',
        'faqs' => 'FAQs',
    ];
$app_list_strings['kbdocument_date_filter_options'] =
    [
        '' => '',
        'on' => 'On',
        'before' => 'Before',
        'after' => 'After',
        'between_dates' => 'Is Between',
        'last_7_days' => 'Last 7 Days',
        'next_7_days' => 'Next 7 Days',
        'last_month' => 'Last Month',
        'this_month' => 'This Month',
        'next_month' => 'Next Month',
        'last_30_days' => 'Last 30 Days',
        'next_30_days' => 'Next 30 Days',
        'last_year' => 'Last Year',
        'this_year' => 'This Year',
        'next_year' => 'Next Year',
        'isnull' => 'Is Null',
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
    'campaign' => 'Campaign',
    'email' => 'Email',
    'notification' => 'Notification',
    'bean2mail' => 'send Bean via mail',
    'sendCredentials' => 'Send credentials',
    'sendTokenForNewPassword' => 'Send the token, when password is lost'
];

/** KReporter **/
$app_list_strings['kreportstatus'] = [
    '1' => 'draft',
    '2' => 'limited release',
    '3' => 'general release'
];

$app_list_strings['report_type_dom'] = [
    'standard' => 'Standard',
    'admin' => 'Admin',
    'system' => 'System'
];

/** Proposals */
$app_list_strings['proposalstatus_dom'] = [
    '1' => 'draft',
    '2' => 'submitted',
    '3' => 'accepted',
    '4' => 'rejected',
];

//KREST mobile
$addAppStrings = [
    'LBL_CALENDAR' => 'Calendar',
    'LBL_SETTINGS' => 'Settings',
    'LBL_RECENT' => 'Recently viewed',
    'LBL_ACTION_EDIT' => 'Edit',
    'LBL_ACTION_CALL' => 'Call',
    'LBL_ACTION_SMS' => 'SMS',
    'LBL_ACTION_MAP' => 'MAP',
    'LBL_ACTION_DELETE' => 'Delete',
    'LBL_CANCEL' => 'Cancel',
    'LBL_OK' => 'OK',
    'LBL_SELECT' => 'Select',
    'LBL_SEL_PARENTTYPE' => 'Select Parent Type',
    'LBL_DASHBOARDS' => 'Dashboards',
    'LBL_ABOUT' => 'About',
    'LBL_CONNECTION' => 'Connection',
    'LBL_BACKEND' => 'Backend',
    'LBL_CONNECTIONDATA' => 'Connection & Login',
    'LBL_ADDRESSFORMAT' => 'Address Format',
    'LBL_ADRFORMATLOCALE' => 'Region',
    'LBL_CALENDAR_DAYS' => 'Display Days',
    'LBL_CALENDAR_WEEKSTART' => 'Week starts',
    'LBL_THEME' => 'Theme',
    'LBL_CALENDAR_SETTINGS' => 'Calendar Settings',
    'LBL_CALENDAR_STARTTIME' => 'day starts',
    'LBL_CALENDAR_ENDTIME' => 'day ends',
    'LBL_USERNAME' => 'Username',
    'LBL_PWD_VALIDITY' => 'Pwd Valdity',
    'LBL_AUTOLOGIN' => 'Autologin',
    'LBL_LOADING_LANGUAGE' => 'Loading Language',
    'LBL_LANGUAGE' => 'Language',
    'LBL_ENTERPASSWORD' => 'Enter Password',
    'LBL_YOURPASSWORD' => 'Your Password',
    'LBL_ACTION_SAVE' => 'Save',
    'LBL_ACTION_CAPTURECARD' => 'Capture Card',
    'LBL_ACTION_QRCVCF' => 'Capture QR Code',
    'LBL_ACTION_CAPTUREIMAGE' => 'Capture Image',
    'LBL_OPEN_MEETINGS' => 'Open Meetings',
    'LBL_OVD_MEETINGS' => 'Overdue Meetings',
    'LBL_OPEN_CALLS' => 'Open Calls',
    'LBL_OPEN_TASKS' => 'Open Tasks',
    'LBL_CHOOSE_EVENTTYPE' => 'Choose Event Type',
    'LBL_NEXT_SYNC' => 'next Sync',
    'LBL_OBJECTS' => 'Objects',
    'LBL_RELATIONSHIPS' => 'Relationship Data',
    'LBL_APPDATA' => 'Application Data',
    'LBL_SYNCED' => 'synced',
    'LBL_ENTRIES' => 'Entries',
    'LBL_SYNC_SHORT' => 'Sync',
    'LBL_DB_SHORT' => 'DB',
    'LBL_DATAMONITOR' => 'Data Monitor',
    'LBL_SYNCACTIVE' => 'active',
    'LBL_UNLINK' => 'Unlink Record',
    'LBL_CONFIRM_UNLINK' => 'Are you sure you want to unlink the record?',
    'LBL_DELETE' => 'Delete',
    'LBL_CONFIRM_DELETE' => 'Are you sure you want to delete the record?',
    'LBL_SORT_BY' => 'Sort by',
    'LBL_ACTION_IMPORTCONTACT' => 'import from phone',
    'LBL_CALENDAR_LOCALCALENDARS' => 'Local Calendars',
    'LBL_TIMEOUT' => 'Timeout',
    'LBL_MYACCOUNTS' => 'My Accounts',
    'LBL_MYFAVACCOUNTS' => 'My Favorite Accounts',
    'LBL_MYCONTACTS' => 'My Contacts',
    'LBL_MYFAVCONTACTS' => 'My Favorite Contacts',
    'LBL_OPEN_OPPORTUNITIES' => 'Open Opportunities',
    'LBL_FAVORITE_OPPORTUNITIES' => 'Favorite Opportunities',
    'LBL_OPEN_CASES' => 'Open Cases',
    'LBL_MYOPEN_CASES' => 'My open Cases',
    'LBL_OPENMYLEADS' => 'My open Leads',
    'LBL_MYFAVLEADS' => 'My favorite Leads',
    'LBL_GEO_SETTINGS' => 'GEO Data',
    'LBL_DISTANCE_UNIT' => 'Unit',
    'LBL_DEFAULT_HOME_LAT' => 'Home Lat',
    'LBL_DEFAULT_HOME_LON' => 'Home Lon',
    'LBL_SET_HOME' => 'Set Home',
    'LBL_ADVANCED_SETTINGS' => 'Advanced Settings',
    'LBL_SEARCH_DELAY' => 'Search Delay',
    'LBL_GEO_SETTINGS' => 'Geocoding Settings',
    'LBL_DISTANCE_UNIT' => 'Unit',
    'LBL_DEFAULT_HOME_LAT' => 'Home Lat',
    'LBL_DEFAULT_HOME_LON' => 'Home Lon',
    'LBL_SET_HOME' => 'Set Home',
    'LBL_ADVANCED_SETTINGS' => 'Advanced Settings',
    'LBL_SEARCH_DELAY' => 'Search Delay',
    'LBL_TIMESTREAM' => 'Timestream',
    'LBL_TASKMANAGER' => 'Taskmanager',
    'LBL_ACOUNTCCDETAILS_LINK' => 'Account Company Code Details',
];

// CR1000333
$app_list_strings['cruser_role_dom'] = [
    'developer' => 'developer',
    'tester' => 'tester',
];

$app_list_strings['crstatus_dom'] = [
    '-1' => 'backlog',
    '0' => 'created',
    '1' => 'in progress',
    '2' => 'unit tested',
    '3' => 'integration test',
    '4' => 'completed', // was 3 before CR1000333
    '5' => 'canceled/deferred' // was 4 before CR1000333
];

$app_list_strings['crtype_dom'] = [
    '0' => 'bug',
    '1' => 'feature request',
    '2' => 'change request',
    '3' => 'hotfix'
];

$app_list_strings['scrum_status_dom'] = [
    'created' => 'created',
    'in_progress' => 'in progress',
    'in_test' => 'in test',
    'completed' => 'completed',
    'backlog' => 'backlog'
];

$app_list_strings['emailschedule_status_dom'] = [
    'queued' => 'queued',
    'sent' => 'sent',
];

$app_list_strings['email_schedule_status_dom'] = [
    'open' => 'open',
    'done' => 'done',
    'done_with_errors' => 'done with errors',
    'record_not_loaded' => 'record not loaded',
];
$app_list_strings['moduleList']['KReleasePackages'] = 'K Releasepackages';

$app_list_strings['rpstatus_dom'] = [
    '0' => 'created',
    '1' => 'in progress',
    '2' => 'completed',
    '3' => 'in test',
    '4' => 'delivered',
    '5' => 'fetched',
    '6' => 'deployed',
    '7' => 'released'
];

$app_list_strings['rptype_dom'] = [
    '0' => 'patch',
    '1' => 'feature package',
    '2' => 'release',
    '3' => 'software package',
    '4' => 'imported'
];

$app_list_strings['systemdeploymentpackage_repair_dom'] = [
    'repairDatabase' => 'repair Database',
    'rebuildExtensions' => 'rebuild Extensions',
    'clearTpls' => 'clear Templates',
    'clearJsFiles' => 'clear Js-Files',
    'clearDashlets' => 'clear Dashlets',
    'clearSugarFeedCache' => 'clear Sugar-Feed-Cache',
    'clearThemeCache' => 'clear Theme-Cache',
    'clearVardefs' => 'clear Vardefs',
    'clearJsLangFiles' => 'clear Js-Lang-Files',
    'rebuildAuditTables' => 'rebuild Audit-Tables',
    'clearSearchCache' => 'clear Search-Cache',
    'clearAll' => 'clear All',
];


$app_list_strings['moduleList']['KDeploymentMWs'] = 'Deployment Maintenance Windows';
$app_list_strings['mwstatus_dom'] = [
    'planned' => 'planned',
    'active' => 'active',
    'completed' => 'completed'
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
    'interested' => 'not available',
    'tentative' => 'tentative',
    'registered' => 'registered',
    'unregistered' => 'unregistered',
    'attended' => 'attended',
    'notattended' => 'did not attend'
];

//ProjectWBSs module
$app_list_strings['wbs_status_dom'] = [
    '0' => 'created',
    '1' => 'started',
    '2' => 'completed'
];
//Projectactivities
$app_list_strings['projects_activity_types_dom'] = [
    'consulting' => 'consulting',
    'dev' => 'development',
    'support' => 'support'
];
$app_list_strings['projects_activity_levels_dom'] = [
    'standard' => 'standard',
    'senior' => 'senior',
];
//Projectmilestones
$app_list_strings['projects_milestone_status_dom'] = [
    'not startet' => 'standard',
    'senior' => 'senior',
];
$app_list_strings['projects_activity_status_dom'] = [
    'created' => 'created',
    'billed' => 'billed',
];

$app_list_strings['projects_activity_settlement_types_dom'] = [
    'regular' => 'regular',
    'goodwill' => 'goodwill',
    'exclude' => 'exclude'
];

//ProductAttributes
$app_list_strings['productattributedatatypes_dom'] = [
    'di' => 'Dropdown',
    'f' => 'Checkbox',
    'n' => 'Numeric',
    's' => 'Multiselect',
    'vc' => 'Text'
];
$app_list_strings['productattribute_usage_dom'] = [
    'required' => 'required',
    'optional' => 'optional',
    'none' => 'no input',
    'hidden' => 'hidden'
];

//AccountCCDetails
$app_list_strings['abccategory_dom'] = [
    '' => '',
    'A' => 'A',
    'B' => 'B',
    'C' => 'C',
];

$app_list_strings['logicoperators_dom'] = [
    'and' => 'and',
    'or' => 'or',
];

$app_list_strings['comparators_dom'] = [
    'equal' => 'equals',
    'unequal' => 'unequal',
    'greater' => 'greater',
    'greaterequal' => 'greaterequals',
    'less' => 'less',
    'lessequal' => 'lessequals',
    'contain' => 'contains',
    'ncontain' => 'does not contain',
    'empty' => 'empty',
    'nempty' => 'not empty',
    'null' => 'null',
    'notnull' => 'not null',
    'regex' => 'matches regex',
    'notregex' => 'does not match regex'
];

$app_list_strings['moduleList']['AccountKPIs'] = 'Account KPIs';

$app_list_strings['moduleList']['Mailboxes'] = 'Mailboxes';

$app_list_strings['mailboxes_imap_pop3_protocol_dom'] = [
    'imap' => 'IMAP',
    'pop3' => 'POP3',
];

$app_list_strings['mailboxes_imap_pop3_encryption_dom'] = [
    'ssl_enable' => 'Enable SSL',
    'ssl_disable' => 'Disable SSL'
];

$app_list_strings['mailboxes_smtp_encryption_dom'] = [
    'none' => 'No Encryption',
    'ssl' => 'SSL',
    'tls' => 'TLS/STARTTLS',
];

$app_strings = array_merge($app_strings, $addAppStrings);

if (file_exists('extensions/modules/ServiceEquipments/ServiceEquipment.php')) {
    $app_list_strings['serviceequipment_status_dom'] = [
        'new' => 'new',
        'offsite' => 'off site',
        'onsite' => 'on site',
        'inactive' => 'inactive',
    ];
    $app_list_strings['maintenance_cycle_dom'] = [
        '12' => 'once a year',
        '6' => 'twice a year',
        '3' => '3 times a year',
        '24' => 'every second year',
    ];
    $app_list_strings['counter_unit_dom'] = [ //uomunits value
        'M' => 'meters',
        'STD' => 'hours',
    ];
}

if (file_exists('extensions/modules/ServiceOrders/ServiceOrder.php')) {
    $app_list_strings['serviceorder_status_dom'] = [
        'new' => 'New',
        'planned' => 'Planned',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
        'signed' => 'Signed',
    ];
    $app_list_strings['parent_type_display']['ServiceOrders'] = 'Serviceaufträge';
    $app_list_strings['record_type_display']['ServiceOrders'] = 'Serviceaufträge';
    $app_list_strings['record_type_display_notes']['ServiceOrders'] = 'Serviceaufträge';

    $app_list_strings['serviceorder_user_role_dom'] = [
        'operator' => 'operator',
        'assistant' => 'assistant',
    ];

    $app_list_strings['serviceorderitem_parent_type_display'] = [
        'Products' => 'Products',
        'ProductVariants' => 'Product Variants',
    ];
}
if (file_exists('modules/ServiceTickets/ServiceTicket.php')) {
    $app_list_strings['serviceticket_status_dom'] = [
        'New' => 'new',
        'In Process' => 'in Process',
        'Assigned' => 'assigned',
        'Closed' => 'closed',
        'Pending Input' => 'pending input',
        'Rejected' => 'rejected',
        'Duplicate' => 'duplicate',
    ];
    $app_list_strings['serviceticket_class_dom'] = [
        'P1' => 'high',
        'P2' => 'medium',
        'P3' => 'low',
    ];
    $app_list_strings['serviceticket_resaction_dom'] = [
        '' => '',
        'credit' => 'issue creditnote',
        'replace' => 'send replacement',
        'return' => 'return goods'
    ];
    $app_list_strings['servicenote_status_dom'] = [
        'read' => 'read',
        'unread' => 'unread'
    ];
    $app_list_strings['parent_type_display']['ServiceTickets'] = 'Servicetickets';
    $app_list_strings['record_type_display']['ServiceTickets'] = 'Servicetickets';
    $app_list_strings['record_type_display_notes']['ServiceTickets'] = 'Servicetickets';

}
if (file_exists('extensions/modules/ServiceFeedbacks/ServiceFeedback.php')) {
    $app_list_strings['service_satisfaction_scale_dom'] = [
        1 => '1 - not satisfied',
        2 => '2',
        3 => '3',
        4 => '4',
        5 => '5 - happy',
    ];
    $app_list_strings['servicefeedback_status_dom'] = [
        'created' => 'created',
        'sent' => 'sent',
        'completed' => 'completed',
    ];
    $app_list_strings['servicefeedback_parent_type_display'] = [
        'ServiceTickets' => 'Service Tickets',
        'ServiceOrders' => 'Service Orders',
        'ServiceCalls' => 'Service Calls',
    ];
    $app_list_strings['record_type_display'] = [
        'ServiceTickets' => 'Service Tickets',
        'ServiceOrders' => 'Service Orders',
        'ServiceCalls' => 'Service Calls',
    ];
}

$app_list_strings['mailboxes_transport_dom'] = [
    'imap' => 'IMAP/SMTP',
    'mailgun' => 'Mailgun',
    'sendgrid' => 'Sendgrid',
    'twillio' => 'Twillio',
];

$app_list_strings['mailboxes_log_levels'] = [
    '0' => 'none',
    '1' => 'error',
    '2' => 'debug',
];

$app_list_strings['mailboxes_outbound_comm'] = [
    'no' => 'Not Allowed',
    'single' => 'Only Single Emails',
    'mass' => 'Single and Mass Emails',
    'single_sms' => 'Only Single Text Messages (SMS)',
    'mass_sms' => 'Single and Mass Text Messages (SMS)',
];

$app_list_strings['output_template_types'] = [
    '' => '',
    'email' => 'email',
    'pdf' => 'PDF',
];

$app_list_strings['languages'] = [
    '' => '',
    'de' => 'german',
    'en' => 'english',
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
$app_list_strings['deploymentrelease_status_dom'] = [
    '' => '',
    'plan' => 'plan', // value was planned before CR1000333
    'develop' => 'develop',
    'prepare' => 'prepare',
    'test' => 'test',
    'release' => 'release',
    'closed completed' => 'completed', // value was released before CR1000333
    'closed canceled' => 'canceled',
];

$app_list_strings['product_status_dom'] = [
    'draft' => 'draft',
    'active' => 'active',
    'inactive' => 'inactive',
];

$app_list_strings['product_tax_categories_dom'] = [
    '0' => 'tax free',
    '1' => 'regular taxed',
    '2' => 'reduced tax',
];

$app_list_strings['textmessage_direction'] = [
    'i' => 'Inbound',
    'o' => 'Outbound',
];

$app_list_strings['textmessage_delivery_status'] = [
    'draft' => 'Draft',
    'sent' => 'Sent',
    'failed' => 'Failed',
    'transmitting' => 'Transmitting',
];

$app_list_strings['event_status_dom'] = [
    'planned' => 'planned',
    'active' => 'active',
    'canceled' => 'canceled'
];

$app_list_strings['event_category_dom'] = [
    'presentations' => 'Presentations',
    'seminars' => 'Seminars',
    'conferences' => 'Conferences'
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


$app_list_strings['sales_planning_characteristics_fieldtype_dom'] = [
    'char' => 'character',
    'int' => 'natural',
    'float' => 'float',
];

$app_list_strings['sales_planning_version_status_dom'] = [
    'd' => 'created',
    'a' => 'active',
    'c' => 'closed',
];

$app_list_strings['sales_planning_content_field_dom'] = [
    'percentage' => 'Percentage',
    'currency' => 'Currency',
    'character' => 'Character',
    'natural' => 'Natural',
    'float' => 'Float',
];

$app_list_strings['sales_planning_periode_units_dom'] = [
    'days' => 'Days',
    'weeks' => 'Weeks',
    'months' => 'Months',
    'quarters' => 'Quarters',
    'years' => 'Years',
];

$app_list_strings['sales_planning_group_actions_dom'] = [
    '' => '',
    'sum' => 'Sum',
    'avg' => 'Average',
    'min' => 'Minimum',
    'max' => 'Maximum'
];

$app_list_strings['inquiry_type'] = [
    'normal' => 'Inquiries',
    'complaint' => 'Complaint',
    'booking' => 'Booking Request',
    'catalog' => 'Catalog Request'
];

$app_list_strings['inquiry_status'] = [
    'normal_new' => 'new',
    'complaint_new' => 'new (complaint)',
    'catalog_new' => 'new (catalog)',
    'booking_new' => 'new (booking)',
    'normal_processing' => 'in process',
    'booking_processing' => 'in process',
    'booking_offered' => 'offerd',
    'converted' => 'converted',
    'closed' => 'closed',
    'cancelled' => 'cancelled',
];

$app_list_strings['inquiry_source'] = [
    'web' => 'Web',
    'email' => 'E-Mail',
    'manually' => 'manual',
];

$app_list_strings['catalogorder_status'] = [
    'new' => 'new',
    'approved' => 'released',
    'in_process' => 'in process',
    'sent' => 'sent',
    'cancelled' => 'cancelled',
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
    'gate' => 'Gate',
    'html' => 'HTML',
    'questionnaire' => 'Questionnaire'
];

$app_list_strings['transport_type_dom'] = [
    'privatecar' => 'private car',
    'companycar' => 'company car',
    'rentalcar' => 'rental cat',
    'bus' => 'bus',
    'train' => 'train',
    'airtravel' => 'air travel',

];

$app_list_strings['receipts_dom'] = [
    'hotel_bill' => 'hotel bill',
    'fuel_bill' => 'fuel bill',
    'restaurant' => 'restaurant bill'
];

$app_list_strings['relationship_type_dom'] = [
    'one-to-many' => 'one-(left) to-many (right)',
    'many-to-many' => 'many-to-many',
    'parent' => 'parent (multiple one-to-many)'
];

$app_list_strings['systemmaintenance_status_dom'] = [
    'planned' => 'planned',
    'started' => 'started',
    'finished' => 'finished'
];
$app_list_strings['payments_type_dom'] = [
    'cash' => 'cash',
    'ATM_card' => 'ATM card',
    'credit_card' => 'credit card'
];
$app_list_strings['scheduler_callback_on_dom'] = [
    'success' => 'success',
    'failure' => 'failure',
];

$app_list_strings['qualification_type_dom'] = [];

$app_list_strings['qualification_sub_type_dom'] = [];

$app_list_strings['relationship_type_dom'] = [
    'mother' => 'mother',
    'father' => 'father',
    'daughter' => 'daughter',
    'son' => 'son',
    'stepmother' => 'stepmother',
    'stepfather' => 'stepfather',
    'brother' => 'brother',
    'sister' => 'sister',
    'stepbrother' => 'stepbrother',
    'stepsister' => 'stepsister',
    'aunt' => 'aunt',
    'uncle' => 'uncle',
    'grandfather' => 'grandfather',
    'grandmother' => 'grandmother',
    'female grandchild' => 'female grandchild',
    'male grandchild' => 'male grandchild',
    'female cousin' => 'female cousin',
    'male cousin' => 'male cousin',
    'acquaintance' => 'acquaintance',
    'partner' => 'partner',
    'colleague' => 'colleague'
];

$app_list_strings['bonuscard_extension_status_enum'] = [
    'initial' => 'initial',
    'sent' => 'sent'
];