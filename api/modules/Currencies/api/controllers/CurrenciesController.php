<?php
namespace SpiceCRM\modules\Currencies\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\Currencies\Currency;
use Psr\Http\Message\ServerRequestInterface as Request;

class CurrenciesController{

    /**
     * gets the default currency
     * @ToDo  temporary changed to null, because the spiceuiloadtaskcontroller -> executeloadTask calls an method without arguments, and slim expects arguments
     * @param null $req
     * @param null $res
     * @param null $args
     * @return mixed
     * @throws \Exception
     */
    public function getDefaultCurrency(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $currency = BeanFactory::getBean('Currencies');

        $retArray = [[
            'id' => '-99',
            'name' => $currency->getDefaultCurrencyName(),
            'iso4217' =>  $currency->getDefaultISO4217(),
            'symbol' => $currency->getDefaultCurrencySymbol(),
            'conversion_rate' => 1
        ]];

        $dbCurrencies = $db->query("SELECT * FROM currencies");
        while($dbCurrency = $db->fetchByAssoc($dbCurrencies)){
            $retArray[] = $dbCurrency;
        }

        return $res->withJson($retArray);
    }


    /**
     * @return array[]
     * @throws \Exception
     */

    public function getCurrencies(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $currency = new Currency();
        $retArray = [[
            'id' => '-99',
            'name' => $currency->getDefaultCurrencyName(),
            'iso4217' =>  $currency->getDefaultISO4217(),
            'symbol' => $currency->getDefaultCurrencySymbol(),
            'conversion_rate' => 1
        ]];
        $dbCurrencies = $db->query("SELECT * FROM currencies");
        while($dbCurrency = $db->fetchByAssoc($dbCurrencies)){
            $retArray[] = $dbCurrency;
        }
        #res = RESTManager::getInstance()->app->getResponseFactory()->createResponse();
        return $res->withJson($retArray);
        #return $retArray;
    }

    /* @ToDo  just a temporary fix, changed the database entry to that method */
    public function getCurrenciesLoadTask(){
        $db = DBManagerFactory::getInstance();
        $currency = BeanFactory::getBean('Currencies');
        $retArray = [[
            'id' => '-99',
            'name' => $currency->getDefaultCurrencyName(),
            'iso4217' =>  $currency->getDefaultISO4217(),
            'symbol' => $currency->getDefaultCurrencySymbol(),
            'conversion_rate' => 1
        ]];
        $dbCurrencies = $db->query("SELECT * FROM currencies");
        while($dbCurrency = $db->fetchByAssoc($dbCurrencies)){
            $retArray[] = $dbCurrency;
        }
        return $retArray;
    }

    /**
     * adds a currency to a user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function addCurrency(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $currency = BeanFactory::getBean('Currencies');
        $postBody = $req->getParsedBody();

        $currency->name = $postBody['name'];
        $currency->status = 'Active';
        $currency->symbol = $postBody['symbol'];
        $currency->iso4217 = $postBody['iso'];
        $currency->created_by = $current_user->id;

        if(!$currency->save()) {
            $outcome = false;
        } else {
            $outcome = true;
        }

        return $res->withJson(['status' => $outcome]);
    }


}
