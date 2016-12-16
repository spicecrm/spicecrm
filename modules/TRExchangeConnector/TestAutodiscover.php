<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

require_once 'modules/TRExchangeConnector/ExchangeInterface/ExchangeApi/php-ews/EWSAutodiscover.php';
require_once 'modules/TRExchangeConnector/ExchangeInterface/ExchangeApi/php-ews/ExchangeWebServices.php';

// $ews = EWSAutodiscover::getEWS('u.komlenovic@vipmobile.rs', 'm@PA8U!reV4s', 'SugarPipeline@vipmobile.rs');
$ews = EWSAutodiscover::getEWS('u.komlenovic@mtelcloud.onmicrosoft.com', 'm@PA8U!reV4s', 'SugarPipeline@vipmobile.rs');
print "<pre>";
var_dump($ews);
print "</pre>";
