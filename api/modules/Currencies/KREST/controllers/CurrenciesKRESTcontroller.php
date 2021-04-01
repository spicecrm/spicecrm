<?php
namespace SpiceCRM\modules\Currencies\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\modules\Currencies\Currency;


class CurrenciesKRESTcontroller{

    /**
     * gets the default currency
     * @ToDo  temporary changed to null, because the spiceuiloadtaskcontroller -> executeloadTask calls an method without arguments, and slim expects arguments
     * @param null $req
     * @param null $res
     * @param null $args
     * @return mixed
     * @throws \Exception
     */
    public function getDefaultCurrency($req = null ,$res = null,$args = null){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
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

    public function getCurrencies($req,$res ,$args ){
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

    public function addCurrency($req, $res, $args) {
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
