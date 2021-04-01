<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 16.06.2019
 * Time: 21:01
 */

namespace SpiceCRM\modules\CompanyCodes\KREST\controllers;

use SpiceCRM\modules\CompanyCodes\CompanyCodesLoader;

class CompanyCodesKRESTController
{
    static function getCompanyCodes(){
        $loader = new CompanyCodesLoader();
        $results = $loader->loadCompanyCodes();
        return $results;
    }
}
