<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;
/* @deprecated in 2023.01.001
 * Will be removed in 2023.02.001
 * new Module at HCMTrainings
 */
SpiceDictionaryHandler::getInstance()->dictionary['Qualification'] = [
    'table' => 'qualifications',
    'audited' => false,
    'fields' => [
        'qualification_type' => [
            'name' => 'qualification_type',
            'type' => 'enum',
            'vname' => 'LBL_TYPE',
            'options' => 'qualification_type_dom'
        ],
        'sub_type' => [
            'name' => 'sub_type',
            'type' => 'enum',
            'vname' => 'LBL_TYPE',
            'options' => 'qualification_sub_type_dom'
        ],
        'bean_qualification_start_date' => [
            'name' => 'qualification_start_date',
            'vname' => 'LBL_VALID_FROM',
            'type' => 'date',
            'source' => 'non-db'
        ],
        'bean_qualification_end_date' => [
            'name' => 'qualification_end_date',
            'vname' => 'LBL_VALID_UNTIL',
            'type' => 'date',
            'source' => 'non-db'
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'users_qualifications',
            'rname' => 'user_name',
            'source' => 'non-db',
            'module' => 'Users'
        ],

    ],
    'indices' => [],
    'relationships' => []
];

VardefManager::createVardef('Qualifications', 'Qualification', array('default', 'assignable'));
