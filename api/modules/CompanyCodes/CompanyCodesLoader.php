<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\CompanyCodes;

use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class CompanyCodesLoader{

    public function loadCompanyCodes()
    {
        $retArray = [];

        $companyCode = BeanFactory::getBean('CompanyCodes');
        $companyCodes = $companyCode->get_full_list();
        foreach ($companyCodes as $companyCode){
            $retArray[] = [
                'id' => $companyCode->id,
                'name' => $companyCode->name,
                'companycode' => $companyCode->companycode,
                'country' => $companyCode->company_address_country,
                'systemholidaycalendar_id' => $companyCode->systemholidaycalendar_id
            ];
        }

        return $retArray;
    }
}
