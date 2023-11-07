<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['TextSnippet'] = [
    'table' => 'textsnippets',
    'comment' => 'TextSnippets Module',
    'fields' => [
        'for_bean' => [
            'name' => 'for_bean',
            'vname' => 'LBL_FOR_MODULE',
            'type' => 'enum',
            'required' => false,
            'reportable' => false,
            'options' => 'systemdeploymentpackage_repair_modules_dom'
        ],
        'body' => [
            'name' => 'body',
            'vname' => 'LBL_TEXT_SNIPPET_BODY',
            'type' => 'longhtml',
            'comment' => 'HTML formatted text snippet body to be used in resulting email'
        ],
        'language' => [
            'name' => 'language',
            'vname' => 'LBL_LANGUAGE',
            'type' => 'language',
            'dbtype' => 'varchar',
            'len' => 10,
            'required' => true,
            'comment' => 'Language used by the template'
        ],
    ]
];

VardefManager::createVardef('TextSnippets', 'TextSnippet', ['default', 'assignable']);
