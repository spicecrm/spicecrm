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

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['EmailTemplate'] = [
    'table' => 'email_templates', 'comment' => 'Templates used in email processing',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
            'reportable' => false,
            'comment' => 'Unique identifier'
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
            'required' => true,
            'comment' => 'Date record created'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'vname' => 'LBL_DATE_MODIFIED',
            'type' => 'datetime',
            'required' => true,
            'comment' => 'Date record last modified'
        ],
        'modified_user_id' => [
            'name' => 'modified_user_id',
            'rname' => 'user_name',
            'id_name' => 'modified_user_id',
            'vname' => 'LBL_ASSIGNED_TO',
            'type' => 'assigned_user_name',
            'table' => 'users',
            'reportable' => true,
            'isnull' => 'false',
            'dbType' => 'id',
            'comment' => 'User who last modified record'
        ],
        //begin workaround maretval 2017-09-21  to terminate error when using default template in Vardefs
        //which will built wrong defined relationships since table name
        // for EmailTemplates module is email_templates and not emailtemplates
        'modified_by_name' => [
            'name' => 'modified_by_name',
            'vname' => 'LBL_MODIFIED_BY',
            'type' => 'relate',
            'reportable' => false,
            'source' => 'non-db',
            'rname' => 'user_name',
            'table' => 'users',
            'id_name' => 'modified_user_id',
            'module' => 'Users',
            'link' => 'modified_user_link',
            'duplicate_merge' => 'disabled',
            'massupdate' => false,
        ],
        'modified_user_link' => [
            'name' => 'modified_user_link',
            'type' => 'link',
            'relationship' => 'emailtemplates_modified_user',
            'vname' => 'LBL_MODIFIED_USER',
            'link_type' => 'one',
            'module' => 'Users',
            'bean_name' => 'User',
            'source' => 'non-db',
        ],
        //end
        'created_by' => [
            'name' => 'created_by',
            'vname' => 'LBL_CREATED_BY',
            'type' => 'varchar',
            'len' => '36',
            'comment' => 'User who created record'
        ],
        //begin workaround maretval 2017-09-21  to terminate error when using default template in Vardefs
        //which will built wrong defined relationships since table name
        // for EmailTemplates module is email_templates and not emailtemplates
        'created_by_name' => [
            'name' => 'created_by_name',
            'vname' => 'LBL_CREATED',
            'type' => 'relate',
            'reportable' => false,
            'link' => 'created_by_link',
            'rname' => 'user_name',
            'source' => 'non-db',
            'table' => 'users',
            'id_name' => 'created_by',
            'module' => 'Users',
            'duplicate_merge' => 'disabled',
            'importable' => 'false',
            'massupdate' => false,
        ],
        'created_by_link' => [
            'name' => 'created_by_link',
            'type' => 'link',
            'relationship' => 'emailtemplates_created_by',
            'vname' => 'LBL_CREATED_USER',
            'link_type' => 'one',
            'module' => 'Users',
            'bean_name' => 'User',
            'source' => 'non-db',
        ],
        //end
        'published' => [
            'name' => 'published',
            'vname' => 'LBL_PUBLISHED',
            'type' => 'varchar',
            'len' => '3',
            'comment' => ''
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '255',
            'comment' => 'Email template name',
            'importable' => 'required',
            'required' => true
        ],
        'description' => [
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text',
            'comment' => 'Email template description'
        ],
        'subject' => [
            'name' => 'subject',
            'vname' => 'LBL_SUBJECT',
            'type' => 'varchar',
            'len' => '255',
            'comment' => 'Email subject to be used in resulting email'
        ],
        'body_spb' => [
            'name' => 'body_spb',
            'vname' => 'LBL_BODY_SPB',
            'type' => 'json',
            'dbType' => 'longtext',
            'comment' => 'save the json structure of the page builder'
        ],
        'via_spb' => [
            'name' => 'via_spb',
            'vname' => 'LBL_VIA_SPICE_PAGE_BUILDER',
            'type' => 'bool',
            'comment' => 'True when the body is designed via the spice page builder'
        ],
        'body' => [
            'name' => 'body',
            'vname' => 'LBL_EMAIL_BODY_PLAIN',
            'type' => 'longtext',
            'comment' => 'Plain text body to be used in resulting email',
            'stylesheet_id_field' => 'style',
        ],
        'body_html' => [
            'name' => 'body_html',
            'vname' => 'LBL_EMAIL_BODY_HTML',
            'type' => 'longhtml',
            'comment' => 'HTML formatted email body to be used in resulting email',
            'stylesheet_id_field' => 'style',
        ],
        'style' => [
            'name' => 'style',
            'vname' => 'LBL_STYLE',
            'type' => 'varchar',
            'len' => 36,
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_DELETED',
            'type' => 'bool',
            'required' => false,
            'reportable' => false,
            'comment' => 'Record deletion indicator'
        ],
        'assigned_user_id' => [
            'name' => 'assigned_user_id',
            'rname' => 'user_name',
            'id_name' => 'assigned_user_id',
            'vname' => 'LBL_ASSIGNED_TO_ID',
            'group' => 'assigned_user_name',
            'type' => 'relate',
            'table' => 'users',
            'module' => 'Users',
            'reportable' => true,
            'isnull' => 'false',
            'dbType' => 'id',
            'audited' => true,
            'comment' => 'User ID assigned to record',
            'duplicate_merge' => 'disabled'
        ],
        'assigned_user_name' => [
            'name' => 'assigned_user_name',
            'link' => 'assigned_user_link',
            'vname' => 'LBL_ASSIGNED_TO',
            'rname' => 'user_name',
            'type' => 'relate',
            'reportable' => false,
            'source' => 'non-db',
            'table' => 'users',
            'id_name' => 'assigned_user_id',
            'module' => 'Users',
            'duplicate_merge' => 'disabled'
        ],
        'assigned_user_link' => [
            'name' => 'assigned_user_link',
            'type' => 'link',
            'relationship' => 'emailtemplates_assigned_user',
            'vname' => 'LBL_ASSIGNED_TO',
            'link_type' => 'one',
            'module' => 'Users',
            'bean_name' => 'User',
            'source' => 'non-db',
            'duplicate_merge' => 'enabled',
            'rname' => 'user_name',
            'id_name' => 'assigned_user_id',
            'table' => 'users',
        ],
        'text_only' => [
            'name' => 'text_only',
            'vname' => 'LBL_TEXT_ONLY',
            'type' => 'bool',
            'required' => false,
            'reportable' => false,
            'comment' => 'Should be checked if email template is to be sent in text only'
        ],
        'type' => [
            'name' => 'type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'required' => false,
            'reportable' => false,
            'options' => 'emailTemplates_type_list',
            'comment' => 'Type of the email template'
        ],
        'language' => [
            'name' => 'language',
            'vname' => 'LBL_LANGUAGE',
            'type' => 'language',
            'dbtype' => 'varchar',
            'len' => 10,
            'required' => true,
            'comment' => 'Language used by the template'
        ],
        'for_bean' => [
            'name' => 'for_bean',
            'vname' => 'LBL_FOR_MODULE',
            'type' => 'enum',
            'required' => false,
            'reportable' => false,
            'options' => 'systemdeploymentpackage_repair_modules_dom'
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_email_template_name',
            'type' => 'index',
            'fields' => ['name']
        ],
        [
            'name' => 'idx_email_template_forbean',
            'type' => 'index',
            'fields' => ['for_bean']
        ],
        [
            'name' => 'idx_email_template_type',
            'type' => 'index',
            'fields' => ['type']
        ]
    ],
    'relationships' => [
        'emailtemplates_assigned_user' =>
            ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
                'rhs_module' => 'EmailTemplates', 'rhs_table' => 'email_templates', 'rhs_key' => 'assigned_user_id',
                'relationship_type' => 'one-to-many'],
        //begin workaround maretval 2017-09-21  to terminate error when using default template in Vardefs
        'emailtemplates_modified_user' =>
            ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
                'rhs_module' => 'EmailTemplates', 'rhs_table' => 'email_templates', 'rhs_key' => 'modified_user_id',
                'relationship_type' => 'one-to-many'],
        'emailtemplates_created_by' =>
            ['lhs_module' => 'Users', 'lhs_table' => 'users', 'lhs_key' => 'id',
                'rhs_module' => 'EmailTemplates', 'rhs_table' => 'email_templates', 'rhs_key' => 'created_by',
                'relationship_type' => 'one-to-many']
        //end
    ],
];
//BEGIN PHP7.1 compatibility: avoid PHP Fatal error:  Uncaught Error: Cannot use string offset as an array
global $dictionary;
//END
$dictionary['EmailTemplate']['relationships']['emailtemplates_emails'] = [
    'lhs_module' => 'EmailTemplates',
    'lhs_table' => 'email_templates',
    'lhs_key' => 'id',
    'rhs_module' => 'Emails',
    'rhs_table' => 'emails',
    'rhs_key' => 'emailtemplate_id',
    'relationship_type' => 'one-to-many'
];

$dictionary['EmailTemplate']['fields']['emails'] = [
    'name' => 'emails',
    'type' => 'link',
    'relationship' => 'emailtemplates_emails',
    'source' => 'non-db',
    'side' => 'right',
    'vname' => 'LBL_EMAILTEMPLATES_EMAILS_LINK'
];

VardefManager::createVardef('EmailTemplates', 'EmailTemplate', ['default', 'assignable']);
