<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Consumer'] = [
    'table' => 'consumers',
    'comment' => 'Consumers Module',
    'audited' => true,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
//        'tasks_participant' => [
//            'name' => 'tasks',
//            'type' => 'link',
//            'relationship' => 'consumer_tasks',
//            'source' => 'non-db',
//            'vname' => 'LBL_TASKS',
//        ],
//        'agreements' => [
//            'name' => 'agreements',
//            'type' => 'link',
//            'relationship' => 'consumer_agreements',
//            'source' => 'non-db',
//            'module' => 'Agreements',
//            'bean_name' => 'Agreement',
//            'vname' => 'LBL_AGREEMENTS',
//            'default' => false,
//            'comment' => 'One-2-many relationship link'
//        ],
//        'salesdocsop' => [
//            'name' => 'salesdocsop',
//            'type' => 'link',
//            'vname' => 'LBL_SALESDOCS',
//            'relationship' => 'salesdocs_consumerop',
//            'module' => 'SalesDocs',
//            'source' => 'non-db',
//        ],
//        'salesdocsrp' => [
//            'name' => 'salesdocsrp',
//            'type' => 'link',
//            'vname' => 'LBL_SALESDOCS',
//            'relationship' => 'salesdocs_consumerrp',
//            'module' => 'SalesDocs',
//            'source' => 'non-db',
//        ],
    ],

];
