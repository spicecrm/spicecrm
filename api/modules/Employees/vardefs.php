<?php
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Employee'] = [
    'table' => 'employees',
    'audited' =>  true,
    'fields' => [
        'user_id' => [
            'name' => 'user_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
        ],
        'user_name' => [
            'name' => 'user_name',
            'rname' => 'name',
            'id_name' => 'user_id',
            'vname' => 'LBL_USER',
            'type' => 'relate',
            'table' => 'users',
            'module' => 'Users',
            'dbType' => 'varchar',
            'link' => 'users',
            'len' => 255,
            'source' => 'non-db'
        ],
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

