<?php

namespace SpiceCRM\includes\SysCurrencies\api\controllers;

use Psr\Http\Message\RequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class SysCurrenciesController
{
    public function loadCurrencies(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();

        $currencies = json_decode(file_get_contents('include/SysCurrencies/currencies.json'));

        foreach ($currencies as $currency) {
            $record = $db->fetchOne("SELECT * FROM syscurrencies WHERE iso4217='{$currency->alpha}'");

            if($record){
                $values = [
                    'id' => $record['id'],
                    'is_inactive' => $record['is_inactive'],
                    'is_systemcurrency' => $record['is_systemcurrency']
                ];
            } else {
                $values = [
                    'id' => SpiceUtils::createGuid(),
                    'is_inactive' => 0,
                    'is_systemcurrency' => 0
                ];
            }

            // set values
            $values['iso4217'] = $currency->alpha;
            $values['name'] = $currency->name;
            $values['currency_symbol'] = $currency->symbol;
            $values['currency_isonumeric'] = $currency->numeric;
            $values['currency_precision'] = $currency->precision;

            if($record){
                $db->updateQuery('syscurrencies', ['id' => $values['id']], $values);
            } else {
                $db->insertQuery('syscurrencies', $values);
            }
        }

        return $res->withJson(['success' => true]);
    }
}