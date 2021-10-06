<?php


use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;
$dictionary['CampaignTask'] = [
    'table' => 'campaigntasks',
    'comment' => 'CampaignTasks Module',
    'audited' => true,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'start_date' => [
            'name' => 'start_date',
            'vname' => 'LBL_DATE_START',
            'type' => 'date',
            'audited' => true
        ],
        'end_date' => [
            'name' => 'end_date',
            'vname' => 'LBL_DATE_END',
            'type' => 'date',
            'audited' => true
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'campaign_status_dom',
            'len' => 100,
            'audited' => true,
            'required' => true
        ],
        'activated' => [
            'name' => 'activated',
            'vname' => 'LBL_ACTIVATED',
            'type' => 'bool',
            'audited' => true
        ],
        'campaigntask_type' => [
            'name' => 'campaigntask_type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'options' => 'campaigntask_type_dom',
            'len' => 100,
            'audited' => true,
            'required' => true
        ],
        'campaign_id' => [
            'name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN_ID',
            'type' => 'id'
        ],
        'campaign_name' => [
            'name' => 'campaign_name',
            'rname' => 'name',
            'id_name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN',
            'type' => 'relate',
            'table' => 'campaigns',
            'isnull' => 'true',
            'module' => 'Campaigns',
            'dbType' => 'varchar',
            'link' => 'campaigns',
            'len' => '255',
            'source' => 'non-db'
        ],
        'campaigns' => [
            'name' => 'campaigns',
            'type' => 'link',
            'relationship' => 'campaign_campaigntasks',
            'source' => 'non-db',
            'module' => 'Campaigns'
        ],
        'email_template_name' => [
            'name' => 'email_template_name',
            'rname' => 'name',
            'id_name' => 'email_template_id',
            'vname' => 'LBL_EMAILTEMPLATE',
            'type' => 'relate',
            'table' => 'email_templates',
            'isnull' => 'true',
            'module' => 'EmailTemplates',
            'dbType' => 'varchar',
            'link' => 'emailtemplates',
            'len' => '255',
            'source' => 'non-db',
        ],
        'emailtemplates' => [
            'name' => 'emailtemplates',
            'type' => 'link',
            'relationship' => 'campaigntask_email_template',
            'source' => 'non-db',
            'module' => 'EmailTemplates'
        ],
        'email_template_id' => [
            'name' => 'email_template_id',
            'vname' => 'LBL_EMAILTEMPLATE_ID',
            'type' => 'varchar',
            'len' => 36
        ],
        'output_template_name' => [
            'name' => 'output_template_name',
            'rname' => 'name',
            'id_name' => 'output_template_id',
            'vname' => 'LBL_OUTPUT_TEMPLATE',
            'type' => 'relate',
            'table' => 'output_template',
            'isnull' => 'true',
            'module' => 'OutputTemplates',
            'dbType' => 'varchar',
            'link' => 'outputtemplates',
            'len' => '255',
            'source' => 'non-db',
        ],
        'outputtemplate' => [
            'name' => 'outputtemplate',
            'type' => 'link',
            'relationship' => 'campaigntask_output_template',
            'source' => 'non-db',
            'module' => 'OutputTemplates'
        ],
        'output_template_id' => [
            'name' => 'output_template_id',
            'vname' => 'LBL_OUTPUTTEMPLATE_ID',
            'type' => 'varchar',
            'len' => 36
        ],
        'mailbox_id' => [
            'name' => 'mailbox_id',
            'vname' => 'LBL_MAILBOX',
            'type' => 'mailbox',
            'dbtype' => 'varchar',
            'len' => 36
        ],
        'objective' => [
            'name' => 'objective',
            'vname' => 'LBL_OBJECTIVE',
            'type' => 'text'
        ],
        'content' => [
            'name' => 'content',
            'vname' => 'LBL_CONTENT',
            'type' => 'text'
        ],
        'ext_id' => [
            'name' => 'ext_id',
            'vname' => 'LBL_EXT_ID',
            'type' => 'varchar',
            'len' => '50'
        ],
        'mailing_id' => [
            'name' => 'mailing_id',
            'vname' => 'LBL_MAILING_ID',
            'type' => 'varchar',
            'len' => '50'
        ],
        'prospectlists' => [
            'name' => 'prospectlists',
            'vname' => 'LBL_PROSPECTLISTS',
            'type' => 'link',
            'relationship' => 'prospect_list_campaigntasks',
            'source' => 'non-db'
        ],
        'log_entries' => [
            'name' => 'log_entries',
            'type' => 'link',
            'relationship' => 'campaigntask_campaignlog',
            'source' => 'non-db',
            'module' => 'CampaignLog',
            'vname' => 'LBL_LOG_ENTRIES',
        ],
        'calls' => [
            'name' => 'calls',
            'type' => 'link',
            'vname' => 'LBL_CALLS',
            'relationship' => 'calls_campaigntasks',
            'source' => 'non-db',
            'module' => 'Calls'
        ],
        'eventregistrations' => [
            'name' => 'eventregistrations',
            'vname' => 'LBL_EVENTREGISTRATOINS_LINK',
            'type' => 'link',
            'module' => 'EventRegistrations',
            'relationship' => 'eventregistration_campaigntask_rel',
            'source' => 'non-db',
        ],
        'email_subject' => [
            'name' => 'email_subject',
            'vname' => 'LBL_SUBJECT',
            'type' => 'varchar',
            'comment' => 'the subject when an email / letter is composed right in the campaigntask'
        ],
        'email_body' => [
            'name' => 'email_body',
            'vname' => 'LBL_EMAIL_BODY_PLAIN',
            'type' => 'text',
            'comment' => 'Plain text body to be used in resulting email / document',
            'stylesheet_id_field' => 'email_stylesheet_id',
            'audited' => false
        ],
        'email_spb' => [
            'name' => 'email_spb',
            'vname' => 'LBL_EMAIL_SPB',
            'type' => 'json',
            'dbType' => 'text',
            'comment' => 'save the json structure of the page builder',
            'audited' => false
        ],
        'via_spb' => [
            'name' => 'via_spb',
            'vname' => 'LBL_VIA_SPICE_PAGE_BUILDER',
            'type' => 'bool',
            'comment' => 'True when the body is designed via the spice page builder'
        ],
        'email_stylesheet_id' => [
            'name' => 'email_stylesheet_id',
            'vname' => 'LBL_STYLESHEET',
            'type' => 'varchar',
            'len' => 36,
            'comment' => 'the style id when an email is composed right in the campaigntask'
        ],
        'questionnaire_id' => [
            'name' => 'questionnaire_id',
            'vname' => 'LBL_QUESTIONNAIRE_ID',
            'type' => 'id',
            'reportable' => true,
            'comment' => 'The ID of the questionnaire',
            'required' => false,
        ],
        'questionnaire_name' => [
            'name' => 'questionnaire_name',
            'vname' => 'LBL_QUESTIONNAIRE',
            'type' => 'relate',
            'source' => 'non-db',
            'len' => '255',
            'id_name' => 'questionnaire_id',
            'rname' => 'name',
            'module' => 'Questionnaires',
            'link' => 'questionnaire'
        ],
        'questionnaire' => [
            'vname' => 'LBL_QUESTIONNAIRES',
            'name' => 'questionnaire',
            'type' => 'link',
            'module' => 'Questionnaires',
            'relationship' => 'campaigntasks_questionnaire',
            'link_type' => 'one',
            'side' => 'right',
            'source' => 'non-db',
        ],
        'servicefeedbacks' => [
            'vname' => 'LBL_SERVICEFEEDBACKS',
            'name' => 'servicefeedbacks',
            'type' => 'link',
            'module' => 'ServiceFeedbacks',
            'relationship' => 'servicefeedbacks_campaigntasks',
            'link_type' => 'one',
            'source' => 'non-db'
        ]
    ],
    'relationships' => [
        'campaign_campaigntasks' => [
            'lhs_module' => 'Campaigns',
            'lhs_table' => 'campaigns',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignTasks',
            'rhs_table' => 'campaigntasks',
            'rhs_key' => 'campaign_id',
            'relationship_type' => 'one-to-many'
        ],
        'campaigntask_campaignlog' => [
            'lhs_module' => 'CampaignTasks',
            'lhs_table' => 'campaigntasks',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignLog',
            'rhs_table' => 'campaign_log',
            'rhs_key' => 'campaigntask_id',
            'relationship_type' => 'one-to-many',
        ],
        'campaigntask_email_template' => [
            'lhs_module' => 'EmailTemplates',
            'lhs_table' => 'email_templates',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignTasks',
            'rhs_table' => 'campaigntasks',
            'rhs_key' => 'email_template_id',
            'relationship_type' => 'one-to-many'
        ],
        'campaigntask_output_template' => [
            'lhs_module' => 'OutputTemplates',
            'lhs_table' => 'outputtemplates',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignTasks',
            'rhs_table' => 'campaigntasks',
            'rhs_key' => 'output_template_id',
            'relationship_type' => 'one-to-many'
        ],
        'campaigntasks_questionnaire' => [
            'lhs_module' => 'Questionnaires',
            'lhs_table' => 'questionnaires',
            'lhs_key' => 'id',
            'rhs_module' => 'CampaignTasks',
            'rhs_table' => 'campaigntasks',
            'rhs_key' => 'questionnaire_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => []
];

VardefManager::createVardef('CampaignTasks', 'CampaignTask', ['default', 'assignable']);
