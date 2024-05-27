<?php
/**
 */

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['ProspectListUnsubscribe'] = [
    'table' => 'prospectlistunsubscribes',
    'fields' => [
        'external_id' => [
            'name' => 'external_id',
            'vname' => 'LBL_EXTERNALID',
            'type' => 'varchar',
            'len' => 50,
        ],
        'contacts' => [
            'name' => 'contacts',
            'vname' => 'LBL_CONTACTS',
            'type' => 'link',
            'relationship' => 'prospectlistunsubscribes_contacts',
            'source' => 'non-db',
        ],
        'is_default_sendgrid' => [
            'name' => 'is_default_sendgrid',
            'vname' => 'LBL_ISDEFAULT_SENDGRID',
            'type' => 'bool',
            'default' => 0,
        ],

    ]
];

VardefManager::createVardef('ProspectListUnsubscribes', 'ProspectListUnsubscribe', ['default', 'assignable']);
SpiceDictionaryHandler::getInstance()->dictionary['ProspectListUnsubscribe']['fields']['description']['required'] = true;