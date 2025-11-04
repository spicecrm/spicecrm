<?php
namespace SpiceCRM\modules\Currencies\api\controllers;

use SpiceCRM\includes\SysCurrencies\SysCurrenciesLoader;

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
