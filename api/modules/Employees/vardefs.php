<?php
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Employee'] = [
    'table' => 'employees',
    'audited' =>  true,
    'fields' => [
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'type' => 'link',
            'relationship' => 'employees_users',
            'source' => 'non-db',
            'module' => 'Users'
        ],
        'hcmmeasures' => [
            'name' => 'hcmmeasures',
            'vname' => 'LBL_HCMMEASURES',
            'type' => 'link',
            'relationship' => 'employees_hcmmeasures',
            'source' => 'non-db',
            'module' => 'HCMMeasures'
        ],
        'hcmskills' => [
            'name' => 'hcmskills',
            'vname' => 'LBL_HCMSKILLS',
            'type' => 'link',
            'relationship' => 'employees_hcmskills',
            'source' => 'non-db',
            'module' => 'HCMSkills'
        ],
        'hcmtrainings' => [
            'name' => 'hcmtrainings',
            'vname' => 'LBL_HCMTRAININGS',
            'type' => 'link',
            'relationship' => 'employees_hcmtrainings',
            'source' => 'non-db',
            'module' => 'HCMTrainings'
        ],
    ],
    'indices' => [],
    'relationships' => [],
];

VardefManager::createVardef('Employees', 'Employee', ['default', 'assignable', 'person']);

