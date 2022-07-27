<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['MarketingAction'] = [
    'table' => 'marketingactions',
    'comment' => 'marketing actions applicable to email templates',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'id' =>
            [
                'name' => 'id',
                'vname' => 'LBL_ID',
                'type' => 'id',
                'required' => true,
            ],
        'name' =>
            [
                'name' => 'name',
                'vname' => 'LBL_NAME',
                'type' => 'varchar',
                'len' => 255,
            ],
        'date_entered' =>
            [
                'name' => 'date_entered',
                'vname' => 'LBL_DATE_ENTERED',
                'type' => 'datetime',
            ],
        'date_modified' =>
            [
                'name' => 'date_modified',
                'vname' => 'LBL_DATE_MODIFIED',
                'type' => 'datetime',
            ],
        'deleted' =>
            [
                'name' => 'deleted',
                'vname' => 'LBL_DELETED',
                'type' => 'bool',
            ],
    ],
    'relationships' => [],
    'indices' => [
        ['name' => 'marketingactionspk', 'type' => 'primary', 'fields' => ['id']]
    ],

];

VardefManager::createVardef('MarketingActions', 'MarketingAction', []);