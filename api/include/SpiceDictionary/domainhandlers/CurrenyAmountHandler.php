<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;

class CurrenyAmountHandler extends SpiceDictionaryDomainHandler
{


    /**
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws \Exception
     */
    public function beforeSave($item,SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        if(!$bean->currency_id || $bean->{$item['name']} == $bean->fetched_row[$item['name']]){
            return false;
        }

        if($bean->{$item['name']} == 0){
            $fields[$item['name'].'_systemcurrency'] = 0;
        } else {
            $currency = BeanFactory::getBean('Currencies');
            $currency->retrieve($bean->currency_id);
            $fields[$item['name'].'_systemcurrency'] = $currency->convertToBase($bean->{$item['name']});
        }

        return true;
    }
}