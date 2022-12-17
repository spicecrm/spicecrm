<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
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
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Letter'] = [
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
            'reportable' => false,
            'comment'    => 'The ID of the parent Sugar object identified by parent_type'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'len'      => 255,
            'comment'  => 'The parent module to which the bean is related',
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db',
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
            'comment'  => 'The link to the account',
        ],
        'consumers' => [
            'name' => 'consumers',
            'type' => 'link',
            'relationship' => 'consumer_letters',
            'module' => 'Consumers',
            'bean_name' => 'Consumer',
            'source' => 'non-db',
            'vname' => 'LBL_CONSUMER',
            'comment'  => 'The link to the consumer',
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