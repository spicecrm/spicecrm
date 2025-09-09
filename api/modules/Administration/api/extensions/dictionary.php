<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\DictionaryController;

$routes = [
    [
        'method' => 'post',
        'route' => '/admin/repair/custom/enum',
        'class' => DictionaryController::class,
        'function' => 'repairCustomEnum',
        'description' => 'generate custom dictionary validations from custom vardefs enum',
        'options' => ['adminOnly' => true, 'validate' => true],
    ]
];

/**
 * get a Rest Manager Instance
 */
RESTManager::getInstance()->registerExtension('dictionary', '2.0', [], $routes);