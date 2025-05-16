<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

$spiceConfig = SpiceConfig::getInstance()->config['addresses'];
RESTManager::getInstance()->registerExtension('address_format', '1.0', [
    'format' => SpiceConfig::getInstance()->config['address']['address_format'] ?? '{}',
    'lazy' => $spiceConfig['lazy'],
    'hidestreetnumber' => $spiceConfig['hidestreetnumber'],
    'hidenumbersuffix' => $spiceConfig['hidenumbersuffix'],
    'hideattn' => $spiceConfig['hideattn'],
    'hidedistrict' => $spiceConfig['hidedistrict'],
    'hidestate' => $spiceConfig['hidestate']
]);
RESTManager::getInstance()->registerExtension('spiceui', '1.0', ['format' => SpiceConfig::getInstance()->config['spiceui']['addressmode'] ?? '']);
