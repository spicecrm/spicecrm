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

/** @var string $object_name */
/** @var string $module */

$vardefs = [
    'fields' => [
        'salutation' => [
            'name' => 'salutation',
            'vname' => 'LBL_SALUTATION',
            'type' => 'enum',
            'options' => 'salutation_dom',
            'massupdate' => false,
            'len' => '255',
            'comment' => 'Contact salutation (e.g., Mr, Ms)'
        ],
        'form_of_address' => [
            'name' => 'form_of_address',
            'vname' => 'LBL_FORM_OF_ADDRESS',
            'type' => 'enum',
            'options' => 'form_of_address_dom',
            'comment' => 'Form of address of a contact (formal, normal, amicable)'
        ],
        'first_name' => [
            'name' => 'first_name',
            'vname' => 'LBL_FIRST_NAME',
            'type' => 'varchar',
            'len' => '100',
            'unified_search' => true,
            'full_text_search' => ['boost' => 3],
            'comment' => 'First name of the contact',
            'merge_filter' => 'selected',
        ],
        'last_name' => [
            'name' => 'last_name',
            'vname' => 'LBL_LAST_NAME',
            'type' => 'varchar',
            'len' => '100',
            'unified_search' => true,
            'full_text_search' => ['boost' => 3],
            'comment' => 'Last name of the contact',
            'merge_filter' => 'selected',
            'required' => true,
            'importable' => 'required',
        ],
        'degree1' => [
            'name' => 'degree1',
            'vname' => 'LBL_DEGREE1',
            'type' => 'varchar',
            'len' => 50
        ],
        'degree2' => [
            'name' => 'degree2',
            'vname' => 'LBL_DEGREE2',
            'type' => 'varchar',
            'len' => 50
        ],
        'name' => [
            'name' => 'name',
            'rname' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'name',
            'link' => true, // bug 39288
            'fields' => ['first_name', 'last_name'],
            'sort_on' => 'last_name',
            'source' => 'non-db',
            'group' => 'last_name',
            'len' => '255',
            'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
            'importable' => 'false',
        ],
        'full_name' =>
            [
                'name' => 'full_name',
                'rname' => 'full_name',
                'vname' => 'LBL_NAME',
                'type' => 'fullname',
                'fields' => ['first_name', 'last_name'],
                'sort_on' => 'last_name',
                'sort_on2' => 'first_name',
                'source' => 'non-db',
                'group' => 'last_name',
                'len' => '510',
                'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                'studio' => ['listview' => false],
            ],
        'communication_language' => [
            'name' => 'communication_language',
            'vname' => 'LBL_COMMUNICATION_LANGUAGE',
            'type' => 'language',
            'dbtype' => 'varchar',
            'len' => 10
        ],
        'title_dd' => [
            'name' => 'title_dd',
            'vname' => 'LBL_TITLE_DD',
            'type' => 'enum',
            'len' => 25,
            'options' => 'contacts_title_dom'
        ],
        'title' => [
            'name' => 'title',
            'vname' => 'LBL_TITLE',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'The title of the contact'
        ],
        'department' => [
            'name' => 'department',
            'vname' => 'LBL_DEPARTMENT',
            'type' => 'varchar',
            'len' => '255',
            'comment' => 'The department of the contact',
            'merge_filter' => 'enabled',
        ],
        'do_not_call' => [
            'name' => 'do_not_call',
            'vname' => 'LBL_DO_NOT_CALL',
            'type' => 'bool',
            'default' => '0',
            'audited' => true,
            'comment' => 'An indicator of whether contact can be called'
        ],
        'is_inactive' => [
            'name' => 'is_inactive',
            'vname' => 'LBL_IS_INACTIVE',
            'type' => 'bool'
        ],
        'phone_home' => [
            'name' => 'phone_home',
            'vname' => 'LBL_PHONE_HOME',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => 100,
            'unified_search' => true,
            'full_text_search' => ['boost' => 1],
            'comment' => 'Home phone number of the contact',
            'merge_filter' => 'enabled',
        ],
        //bug 42902
        'email' => [
            'name' => 'email',
            'type' => 'email',
            'query_type' => 'default',
            'source' => 'non-db',
            'operator' => 'subquery',
            'subquery' => 'SELECT eabr.bean_id FROM email_addr_bean_rel eabr JOIN email_addresses ea ON (ea.id = eabr.email_address_id) WHERE eabr.deleted=0 AND ea.email_address LIKE',
            'db_field' => [
                'id',
            ],
            'vname' => 'LBL_ANY_EMAIL',
            'studio' => ['visible' => false, 'searchview' => true],
            'importable' => false,
        ],
        'phone_mobile' => [
            'name' => 'phone_mobile',
            'vname' => 'LBL_PHONE_MOBILE',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => 100,
            'unified_search' => true,
            'full_text_search' => ['boost' => 1],
            'comment' => 'Mobile phone number of the contact',
            'merge_filter' => 'enabled',
        ],
        'phone_work' => [
            'name' => 'phone_work',
            'vname' => 'LBL_PHONE_OFFICE',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => 100,
            'audited' => true,
            'unified_search' => true,
            'full_text_search' => ['boost' => 1],
            'comment' => 'Work phone number of the contact',
            'merge_filter' => 'enabled',
        ],
        'phone_other' => [
            'name' => 'phone_other',
            'vname' => 'LBL_PHONE_OTHER',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => 100,
            'unified_search' => true,
            'full_text_search' => ['boost' => 1],
            'comment' => 'Other phone number for the contact',
            'merge_filter' => 'enabled',
        ],
        'phone_fax' =>
            [
                'name' => 'phone_fax',
                'vname' => 'LBL_PHONE_FAX',
                'type' => 'phone',
                'dbType' => 'varchar',
                'len' => 100,
                'unified_search' => true,
                'full_text_search' => ['boost' => 1],
                'comment' => 'Contact fax number',
                'merge_filter' => 'enabled',
            ],
        'personal_interests' => [
            'name' => 'personal_interests',
            'type' => 'multienum',
            'isMultiSelect' => true,
            'dbType' => 'text',
            'options' => 'personalinterests_dom',
            'vname' => 'LBL_PERSONAL_INTERESTS',
            'comment' => 'Personal Interests'
        ],
        'email1' => [
            'name' => 'email1',
            'vname' => 'LBL_EMAIL_ADDRESS',
            'type' => 'varchar',
            'source' => 'non-db',
            'group' => 'email1',
            'merge_filter' => 'enabled',
            'studio' => ['editview' => true, 'editField' => true, 'searchview' => false, 'popupsearch' => false], // bug 46859
            'full_text_search' => ['boost' => 3, 'analyzer' => 'whitespace'], //bug 54567
        ],
        'email2' => [
            'name' => 'email2',
            'vname' => 'LBL_OTHER_EMAIL_ADDRESS',
            'type' => 'varchar',
            'source' => 'non-db',
            'group' => 'email2',
            'merge_filter' => 'enabled',
            'studio' => 'false',
        ],
        'invalid_email' => [
            'name' => 'invalid_email',
            'vname' => 'LBL_INVALID_EMAIL',
            'source' => 'non-db',
            'type' => 'bool',
            'massupdate' => false,
            'studio' => 'false',
        ],
        'email_opt_out' => [
            'name' => 'email_opt_out',
            'vname' => 'LBL_EMAIL_OPT_OUT',
            'source' => 'non-db',
            'type' => 'bool',
            'massupdate' => false,
            'studio' => 'false',
        ],
        'gdpr_data_agreement' => [
            'name' => 'gdpr_data_agreement',
            'vname' => 'LBL_GDPR_DATA_AGREEMENT',
            'type' => 'bool',
            'default' => true,
            'audited' => true
        ],
        'gdpr_data_source' => [
            'name' => 'gdpr_data_source',
            'vname' => 'LBL_GDPR_DATA_SOURCE',
            'type' => 'text',
            'audited' => true,
        ],
        'gdpr_marketing_agreement' => [
            'name' => 'gdpr_marketing_agreement',
            'vname' => 'LBL_GDPR_MARKETING_AGREEMENT',
            'type' => 'bool',
            'default' => false,
            'audited' => true
        ],
        'gdpr_marketing_source' => [
            'name' => 'gdpr_marketing_source',
            'vname' => 'LBL_GDPR_MARKETING_SOURCE',
            'type' => 'text',
            'audited' => true,
        ],
        'primary_address_street' => [
            'name' => 'primary_address_street',
            'vname' => 'LBL_PRIMARY_ADDRESS_STREET',
            'type' => 'varchar',
            'len' => '150',
            'group' => 'primary_address',
            'comment' => 'Street address for primary address',
            'merge_filter' => 'enabled',
        ],
        'primary_address_street_number' => [
            'name' => 'primary_address_street_number',
            'vname' => 'LBL_PRIMARY_ADDRESS_STREET_NUMBER',
            'type' => 'varchar',
            'len' => '10',
            'comment' => 'Street number for primary address'
        ],
        'primary_address_street_number_suffix' => [
            'name' => 'primary_address_street_number_suffix',
            'vname' => 'LBL_PRIMARY_ADDRESS_STREET_NUMBER_SUFFIX',
            'type' => 'varchar',
            'len' => '25',
            'comment' => 'additional info on the number like Appartment or similar'
        ],
        'primary_address_attn' => [
            'name' => 'primary_address_attn',
            'vname' => 'LBL_PRIMARY_ADDRESS_ATTN',
            'type' => 'varchar',
            'len' => '150',
            'comment' => 'additonal attention field for the address',
            'group' => 'primary_address',
            'merge_filter' => 'enabled',
        ],
        'primary_address_street_2' =>
            [
                'name' => 'primary_address_street_2',
                'vname' => 'LBL_PRIMARY_ADDRESS_STREET_2',
                'type' => 'varchar',
                'len' => '80',
            ],
        'primary_address_street_3' => [
            'name' => 'primary_address_street_3',
            'vname' => 'LBL_PRIMARY_ADDRESS_STREET_3',
            'type' => 'varchar',
            'len' => '80',
        ],
        'primary_address_city' => [
            'name' => 'primary_address_city',
            'vname' => 'LBL_PRIMARY_ADDRESS_CITY',
            'type' => 'varchar',
            'len' => '100',
            'group' => 'primary_address',
            'comment' => 'City for primary address',
            'merge_filter' => 'enabled',
        ],
        'primary_address_district' => [
            'name' => 'primary_address_district',
            'vname' => 'LBL_PRIMARY_ADDRESS_DISTRICT',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'District for primary address',
        ],
        'primary_address_state' => [
            'name' => 'primary_address_state',
            'vname' => 'LBL_PRIMARY_ADDRESS_STATE',
            'type' => 'varchar',
            'len' => '100',
            'group' => 'primary_address',
            'comment' => 'State for primary address',
            'merge_filter' => 'enabled',
        ],
        'primary_address_postalcode' => [
            'name' => 'primary_address_postalcode',
            'vname' => 'LBL_PRIMARY_ADDRESS_POSTALCODE',
            'type' => 'varchar',
            'len' => '20',
            'group' => 'primary_address',
            'comment' => 'Postal code for primary address',
            'merge_filter' => 'enabled',

        ],
        'primary_address_pobox' =>
            [
                'name' => 'primary_address_pobox',
                'vname' => 'LBL_PRIMARY_ADDRESS_POBOX',
                'type' => 'varchar',
                'len' => '20',
                'group' => 'primary_address',
                'comment' => 'pobox for primary address',
                'merge_filter' => 'enabled',

            ],
        'primary_address_country' =>
            [
                'name' => 'primary_address_country',
                'vname' => 'LBL_PRIMARY_ADDRESS_COUNTRY',
                'type' => 'varchar',
                'group' => 'primary_address',
                'comment' => 'Country for primary address',
                'merge_filter' => 'enabled',
            ],
        'primary_address_latitude' =>
            [
                'name' => 'primary_address_latitude',
                'vname' => 'LBL_PRIMARY_ADDRESS_LATITUDE',
                'type' => 'double',
                'group' => 'primary_address'
            ],
        'primary_address_longitude' =>
            [
                'name' => 'primary_address_longitude',
                'vname' => 'LBL_PRIMARY_ADDRESS_LONGITUDE',
                'type' => 'double',
                'group' => 'primary_address'
            ],

        'alt_address_street' => [
            'name' => 'alt_address_street',
            'vname' => 'LBL_ALT_ADDRESS_STREET',
            'type' => 'varchar',
            'len' => '150',
            'group' => 'alt_address',
            'comment' => 'Street address for alternate address',
            'merge_filter' => 'enabled',
        ],
        'alt_address_street_number' => [
            'name' => 'alt_address_street_number',
            'vname' => 'LBL_ALT_ADDRESS_STREET_NUMBER',
            'type' => 'varchar',
            'len' => '10',
            'comment' => 'Street number for alternate address',
        ],
        'alt_address_street_number_suffix' => [
            'name' => 'alt_address_street_number_suffix',
            'vname' => 'LBL_ALT_ADDRESS_STREET_NUMBER_SUFFIX',
            'type' => 'varchar',
            'len' => '25',
            'comment' => 'Add Street number info like Appartmenr or similar',
        ],
        'alt_address_street_2' =>
            [
                'name' => 'alt_address_street_2',
                'vname' => 'LBL_ALT_ADDRESS_STREET_2',
                'type' => 'varchar',
                'len' => '80'
            ],
        'alt_address_street_3' => [
            'name' => 'alt_address_street_3',
            'vname' => 'LBL_ALT_ADDRESS_STREET_3',
            'type' => 'varchar',
            'len' => '80'
        ],
        'alt_address_attn' => [
            'name' => 'alt_address_attn',
            'vname' => 'LBL_ALT_ADDRESS_ATTN',
            'type' => 'varchar',
            'len' => '150'
        ],
        'alt_address_city' => [
            'name' => 'alt_address_city',
            'vname' => 'LBL_ALT_ADDRESS_CITY',
            'type' => 'varchar',
            'len' => '100',
            'group' => 'alt_address',
            'comment' => 'City for alternate address',
            'merge_filter' => 'enabled',
        ],
        'alt_address_district' => [
            'name' => 'alt_address_district',
            'vname' => 'LBL_ALT_ADDRESS_DISTRICT',
            'type' => 'varchar',
            'len' => '100',
            'comment' => 'District for alternate address'
        ],
        'alt_address_state' => [
            'name' => 'alt_address_state',
            'vname' => 'LBL_ALT_ADDRESS_STATE',
            'type' => 'varchar',
            'len' => '100',
            'group' => 'alt_address',
            'comment' => 'State for alternate address',
            'merge_filter' => 'enabled',
        ],
        'alt_address_postalcode' => [
            'name' => 'alt_address_postalcode',
            'vname' => 'LBL_ALT_ADDRESS_POSTALCODE',
            'type' => 'varchar',
            'len' => '20',
            'group' => 'alt_address',
            'comment' => 'Postal code for alternate address',
            'merge_filter' => 'enabled',
        ],
        'alt_address_pobox' => [
            'name' => 'alt_address_pobox',
            'vname' => 'LBL_ALT_ADDRESS_POBOX',
            'type' => 'varchar',
            'len' => '20',
            'group' => 'alt_address',
            'comment' => 'pobox for alternate address',
            'merge_filter' => 'enabled',
        ],
        'alt_address_country' => [
            'name' => 'alt_address_country',
            'vname' => 'LBL_ALT_ADDRESS_COUNTRY',
            'type' => 'varchar',
            'group' => 'alt_address',
            'comment' => 'Country for alternate address',
            'merge_filter' => 'enabled',
        ],
        'alt_address_latitude' => [
            'name' => 'alt_address_latitude',
            'vname' => 'LBL_ALT_ADDRESS_LATITUDE',
            'type' => 'double',
            'group' => 'alt_address'
        ],
        'alt_address_longitude' => [
            'name' => 'alt_address_longitude',
            'vname' => 'LBL_ALT_ADDRESS_LONGITUDE',
            'type' => 'double',
            'group' => 'alt_address'
        ],
        'assistant' => [
            'name' => 'assistant',
            'vname' => 'LBL_ASSISTANT',
            'type' => 'varchar',
            'len' => '75',
            'unified_search' => true,
            'full_text_search' => ['boost' => 2],
            'comment' => 'Name of the assistant of the contact',
            'merge_filter' => 'enabled',
        ],
        'assistant_phone' => [
            'name' => 'assistant_phone',
            'vname' => 'LBL_ASSISTANT_PHONE',
            'type' => 'phone',
            'dbType' => 'varchar',
            'len' => 100,
            'group' => 'assistant',
            'unified_search' => true,
            'full_text_search' => ['boost' => 1],
            'comment' => 'Phone number of the assistant of the contact',
            'merge_filter' => 'enabled',
        ],
        'primary_address' => [
            'name' => 'primary_address',
            'type' => 'bool',
            'source' => 'non-db',
            'vname' => 'LBL_PRIMARY_ADDRESS'
        ],
        'opt_in_status' => [
            'name' => 'opt_in_status',
            'type' => 'varchar',
            'source' => 'non-db',
            'comment' => 'possible values opted_in, opted_out, pending'
        ],
        'email_addresses_primary' => [
            'name' => 'email_addresses_primary',
            'type' => 'link',
            'relationship' => strtolower($object_name) . '_email_addresses_primary',
            'source' => 'non-db',
            'vname' => 'LBL_EMAIL_ADDRESS_PRIMARY',
            'duplicate_merge' => 'disabled',
        ],
        'email_addresses' => [
            'name' => 'email_addresses',
            'type' => 'link',
            'relationship' => strtolower($object_name) . '_email_addresses',
            'source' => 'non-db',
            'vname' => 'LBL_EMAIL_ADDRESSES',
            'reportable' => false,
            'unified_search' => true,
            'default' => true,
            'side' => 'left',
            'module' => 'EmailAddresses',
            'rel_fields' => [
                'opt_in_status' => [
                    'type' => 'bool',
                    'map' => 'opt_in_status'
                ],
                'primary_address' => [
                    'type' => 'bool',
                    'map' => 'primary_address'
                ]
            ],
        ],
        // Used for non-primary mail import
        'email_addresses_non_primary' => [
            'name' => 'email_addresses_non_primary',
            'type' => 'email',
            'source' => 'non-db',
            'vname' => 'LBL_EMAIL_NON_PRIMARY',
            'studio' => false,
            'reportable' => false,
            'massupdate' => false,
        ],
    ],
    'relationships' => [
        strtolower($object_name) . '_email_addresses' =>
            [
                'lhs_module' => $module, 'lhs_table' => strtolower($module), 'lhs_key' => 'id',
                'rhs_module' => 'EmailAddresses', 'rhs_table' => 'email_addresses', 'rhs_key' => 'id',
                'relationship_type' => 'many-to-many',
                'join_table' => 'email_addr_bean_rel', 'join_key_lhs' => 'bean_id', 'join_key_rhs' => 'email_address_id',
                'relationship_role_column' => 'bean_module',
                'relationship_role_column_value' => $module
            ],
        strtolower($object_name) . '_email_addresses_primary' =>
            ['lhs_module' => $module, 'lhs_table' => strtolower($module), 'lhs_key' => 'id',
                'rhs_module' => 'EmailAddresses', 'rhs_table' => 'email_addresses', 'rhs_key' => 'id',
                'relationship_type' => 'many-to-many',
                'join_table' => 'email_addr_bean_rel', 'join_key_lhs' => 'bean_id', 'join_key_rhs' => 'email_address_id',
                'relationship_role_column' => 'primary_address',
                'relationship_role_column_value' => '1'
            ],
    ]
];
?>
