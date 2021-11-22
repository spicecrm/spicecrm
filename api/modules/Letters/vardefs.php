<?php

use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;

$dictionary['Letter'] = [
    'table' => 'letters',
    'fields' => [
        'name' => [
            'name'     => 'name',
            'vname'    => 'LBL_SUBJECT',
            'type'     => 'name',
            'dbType'   => 'varchar',
            'required' => true,
            'len'      => '255',
            'comment'  => 'The subject of the letter',
        ],
        'body' => [
            'name'    => 'body',
            'type'    => 'blob',
            'dbType'  => 'longblob',
            'vname'   => 'LBL_LETTER_BODY',
            'comment' => 'the body of the letter',
        ],
        'description_html' => [
            'name'   => 'description_html',
            'type'   => 'html',
            'vname'  => 'LBL_BODY_HTML',
            'source' => 'non-db',
            'comment' => 'body field of the letter'
        ],
        'letter_status' => [
            'name'    => 'letter_status',
            'vname'   => 'LBL_LETTER_STATUS',
            'type'    => 'enum',
            'len'     => 10,
            'options' => 'dom_letter_status',
            'comment' => 'the status of the letter',
            'default' => 'draft',
        ],

        // output templates for the letters
        'outputtemplate_id' => [
            'name' => 'outputtemplate_id',
            'vname' => 'LBL_OUTPUT_TEMPLATE',
            'type' => 'id',
            'comment' => 'ID of related output template'
        ],
        'outputtemplate' => [
            'name' => 'outputtemplate',
            'type' => 'link',
            'module' => 'OutputTemplates',
            'relationship' => 'letters_outputtemplate',
            'source' => 'non-db',
            'vname' => 'LBL_OUTPUT_TEMPLATE',
        ],
        'outputtemplate_name' => [
            'name' => 'outputtemplate_name',
            'rname' => 'name',
            'id_name' => 'outputtemplate_id',
            'type' => 'relate',
            'link' => 'outputtemplate',
            'table' => 'outputtemplates',
            'module' => 'OutputTemplates',
            'source' => 'non-db',
            // 'required' => true,
            'vname' => 'LBL_OUTPUT_TEMPLATE',
        ],

        // parent is the contact
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_LIST_RELATED_TO_ID',
            'type'       => 'id',
            'group'      => 'parent_name',
            'reportable' => false,
            'comment'    => 'The ID of the parent Sugar object identified by parent_type'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'group'    => 'parent_name',
            'options'  => 'parent_type_display',
            'len'      => 255,
            'comment'  => 'The Sugar object to which the call is related',
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'parent_type' => 'record_type_display',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'group'       => 'parent_name',
            'source'      => 'non-db',
            'options'     => 'parent_type_display',
        ],

        // links to other modules
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'contact_letters',
            'module' => 'Contacts',
            'bean_name' => 'Contact',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS',
            'comment'  => 'The link to the contact',
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'account_letters',
            'module' => 'Accounts',
            'bean_name' => 'Account',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNT',
            'comment'  => 'The link to the contact',
        ],
        'consumers' => [
            'name' => 'consumers',
            'type' => 'link',
            'relationship' => 'consumer_letters',
            'module' => 'Consumers',
            'bean_name' => 'Contact',
            'source' => 'non-db',
            'vname' => 'LBL_CONSUMERS',
            'comment'  => 'The link to the consumer',
        ],

    ],
    'relationships' => [

        'outputtemplate_letters' => [
            'lhs_module' => 'OutputTemplates',
            'lhs_table' => 'outputtemplates',
            'lhs_key' => 'id',
            'rhs_module' => 'Letters',
            'rhs_table' => 'letters',
            'rhs_key' => 'outputtemplate_id',
            'relationship_type' => 'one-to-many'
        ],


    ],
    'indices' => [],
    'comment' => 'Contains a record of letters sent to and from the application',

];

VardefManager::createVardef('Letters', 'Letter', ['default', 'assignable']);