<?php
namespace SpiceCRM\modules\Currencies\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SysCurrencies\SysCurrencies;
use SpiceCRM\includes\SysCurrencies\SysCurrenciesLoader;
use SpiceCRM\modules\Currencies\Currency;
use Psr\Http\Message\ServerRequestInterface as Request;

class CurrenciesController{


    /**
     * @deprecated - replaced by loaded in syscurrencies
     *
     * @return array
     */
    public function getCurrenciesLoadTask(){
        return  (new SysCurrenciesLoader)->loadCurrencies();
    }

}
