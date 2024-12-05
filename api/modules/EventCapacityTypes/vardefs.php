<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EventCapacityType'] = [
    'table' => 'eventcapacitytypes',
    'comment' => 'EventCapacityTypes Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'label' => [
            'name'  => 'label',
            'vname' => 'LBL_LABEL',
            'type'  => 'varchar',
            'len'   => '255',
            'required' => false
        ],
        'duration' => [
            'name' => 'duration',
            'type' => 'int',
            'vname' => 'LBL_DURATION_MINUTES'
        ],
        'check_class' => [
            'name'			=> 'check_class',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_CLASS',
            'required'		=> true,
        ],
        'check_method' => [
            'name'			=> 'check_method',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_METHOD',
            'required'		=> true,
        ],
        'eventcapacities' => [
            'name' => 'eventcapacities',
            'type' => 'link',
            'relationship' => 'eventcapacitytypes_eventcapacities',
            'module' => 'EventCapacities',
            'bean_name' => 'EventCapacity',
            'source' => 'non-db',
            'vname' => 'LBL_EVENTCAPACITY',
        ],
    ],
    'relationships' => [],
    'indices' => []
];

VardefManager::createVardef('EventCapacityTypes', 'EventCapacityType', ['default', 'assignable']);
