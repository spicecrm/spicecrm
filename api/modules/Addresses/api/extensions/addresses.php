<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

RESTManager::getInstance()->registerExtension('address_format', '1.0', ['format' => SpiceConfig::getInstance()->config['address']['address_format'] ?? '{}']);
RESTManager::getInstance()->registerExtension('spiceui', '1.0', ['format' => SpiceConfig::getInstance()->config['spiceui']['addressmode'] ?? '']);
