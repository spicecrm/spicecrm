<?php

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

$restManager = RestManager::getInstance();

$routes = [

];

$restManager->registerExtension('gateway', '1,0',['enabled' => !!SpiceConfig::getInstance()->get('system.gateway_server_api_key')], $routes);
