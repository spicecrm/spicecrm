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

//dictionary global variable => class name als key
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['MailboxProcessor'] = [
    'table' => 'mailbox_processors',
    'comment' => 'Mailbox Processor Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'mailbox_id' => [
            'name'			=> 'mailbox_id',
            'type'			=> 'id',
            'vname'         => 'LBL_MAILBOX_ID',
            'length'		=> 36,
            'required'		=> true,
        ],
        'mailbox_name' => [
            'name' => 'mailbox_name',
            'type' => 'relate',
            'source' => 'non-db',
            'module' => 'Mailboxes',
            'link' => 'mailboxes',
            'id_name' => 'mailbox_id',
            'rname' => 'name',
            'vname' => 'LBL_MAILBOX'
        ],
        'processor_file' => [
            'name'			=> 'processor_file',
            'type'			=> 'varchar',
            'vname'         => 'LBL_FILE',
            'length'		=> 255,
            'required'		=> false,
        ],
        'processor_class' => [
            'name'			=> 'processor_class',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_CLASS',
            'required'		=> true,
        ],
        'processor_method' => [
            'name'			=> 'processor_method',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_METHOD',
            'required'		=> true,
        ],
        'priority' => [
            'name'			=> 'priority',
            'type'			=> 'int',
            'length'        => 8,
            'vname'         => 'LBL_PRIORITY',
            'required'		=> true,
        ],
        'stop_on_success' => [
            'name'			=> 'stop_on_success',
            'type'			=> 'bool',
            'default'       => 0,
            'vname'         => 'LBL_STOP_ON_SUCCESS',
        ],
        'mailboxes' => [
            'name' => 'mailboxes',
            'type' => 'link',
            'relationship' => 'mailboxes_mailbox_processors',
            'source' => 'non-db',
            'default' => true
        ],
    ],
    'relationships' => [],
    'indices' => [
        'idx_mbx_processors_mailboxid' => [
            'name'   => 'idx_mbx_processors_mailboxid',
            'type'   => 'index',
            'fields' => ['mailbox_id'],
        ],
    ]
];

VardefManager::createVardef('MailboxProcessors', 'MailboxProcessor', ['default']);
