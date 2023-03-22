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
    ],
    'indices' => [],
    'relationships' => [],
];

VardefManager::createVardef('Employees', 'Employee', ['default', 'assignable', 'person']);

