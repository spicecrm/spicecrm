<?php

require_once 'modules/Currencies/Currency.php';

$app->group('/currencies', function () use ($app) {
    $app->get('', function () use ($app) {
        global $current_user, $db;

        $currency = new Currency();

        $retArray = [array(
            'id' => '-99',
            'name' => $currency->getDefaultCurrencyName(),
            'iso' =>  $currency->getDefaultISO4217(),
            'symbol' => $currency->getDefaultCurrencySymbol(),
            'conversion_rate' => 1
        )];

        $dbCurrencies = $db->query("SELECT * FROM currencies");
        while($dbCurrency = $db->fetchByAssoc($dbCurrencies)){
            $retArray[] = $dbCurrency;
        }

        echo json_encode($retArray);
    });
});