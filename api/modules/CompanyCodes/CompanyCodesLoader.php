<?php
namespace SpiceCRM\modules\CompanyCodes;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;

class CompanyCodesLoader{
    public function loadCompanyCodes(){
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $companyCode = BeanFactory::getBean('CompanyCodes');
        $companyCodes = $companyCode->get_full_list();
        foreach ($companyCodes as $companyCode){
            $retArray[] = [
                'id' => $companyCode->id,
                'name' => $companyCode->name,
                'companycode' => $companyCode->companycode,
                'country' => $companyCode->company_address_country
            ];
        }

        return $retArray;

    }
}
