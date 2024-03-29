<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['DistributionList'] = [
    'table' => 'distributionlists',
    'comment' => 'DistributionLists Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'type' => 'link',
            'relationship' => 'distributionlists_users',
            'module' => 'Users',
            'bean_name' => 'User',
            'source' => 'non-db',
            'comment' => 'Users allocated to the list'
        ]
    ],
    'relationships' => [

    ],
    'indices' => [
    ]
];

VardefManager::createVardef('DistributionLists', 'DistributionList', ['default', 'assignable']);
