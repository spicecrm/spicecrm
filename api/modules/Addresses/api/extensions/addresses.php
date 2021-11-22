<?php


use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

RESTManager::getInstance()->registerExtension('address_format', '1.0', ['format' => SpiceConfig::getInstance()->config['address']['address_format'] ?? '{}']);
