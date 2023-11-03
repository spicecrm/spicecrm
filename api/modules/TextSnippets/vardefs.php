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
    ],
    'indices' => [
        [
            'name' => 'idx_text_snippet_template_name',
            'type' => 'index',
            'fields' => ['name']
        ],
        [
            'name' => 'idx_text_snippet_template_forbean',
            'type' => 'index',
            'fields' => ['for_bean']
        ]
    ],
];

VardefManager::createVardef('TextSnippets', 'TextSnippet', ['default', 'assignable']);
