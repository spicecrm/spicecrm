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
        'orgunit_id' => [
            'vname' => 'LBL_ORGUNIT_ID',
            'name' => 'orgunit_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'orgunit_name' => [
            'name' => 'orgunit_name',
            'rname' => 'name',
            'id_name' => 'orgunit_id',
            'link' => 'orgunits',
            'vname' => 'LBL_ORGUNIT',
            'type' => 'relate',
            'table' => 'orgunits',
            'module' => 'OrgUnits',
            'source' => 'non-db',
        ],
        'orgunit' => [
            'name' => 'orgunit',
            'id_name' => 'orgunit_id',
            'link' => 'orgunits',
            'vname' => 'LBL_ORGUNIT',
            'type' => 'linked',
            'module' => 'OrgUnits',
            'source' => 'non-db'
        ],
        'orgunits' => [
            'name' => 'orgunits',
            'type' => 'link',
            'vname' => 'LBL_ORGUNITS',
            'relationship' => 'orgunits_employees',
            'module' => 'OrgUnits',
            'source' => 'non-db'
        ],
    ],
    'indices' => [],
    'relationships' => [],
];

VardefManager::createVardef('Employees', 'Employee', ['default', 'assignable', 'person']);

