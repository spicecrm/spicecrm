<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;
use SpiceCRM\modules\EmailAddresses\EmailAddress;

class PrimaryLinkHandler extends SpiceDictionaryDomainHandler
{
    /**
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws \Exception
     */
    public function onRetrieve($item,SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        // load the relationship
        $rel = $bean->load_relationship($item['name'].'_link');
        if($rel){
            $linked = $bean->get_linked_beans($item['name'].'_link');
            if(count($linked) > 0){
                $fields[$item['name'].'_id'] = $linked[0]->id;
                $fields[$item['name'].'_name'] = $linked[0]->summary_text ?: $linked[0]->name ;
            }
            return true;
        }

        return false;
    }

    /**
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws \Exception
     */
    public function afterSave($item,SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        if($bean->{$item['name'].'_id'} == $bean->fetched_row[$item['name'].'_id']){
            return false;
        }

        // load the relationship
        $rel = $bean->load_relationship($item['name'].'_link');
        if($rel){
            $linked = $bean->get_linked_beans($item['name'].'_link');
            $newLinked = count($linked) == 0;
            foreach ($linked as $linkedBean) {
                if($linkedBean != $bean->{$item['name'].'_id'}){
                    $bean->{$item['name'].'_link'}->delete($bean->id, $linkedBean);
                    $newLinked = true;
                }
            }

            if($newLinked && !empty($bean->{$item['name'].'_id'})){
                $bean->{$item['name'].'_link'}->add($bean->{$item['name'].'_id'});
            }
            return true;
        }

        return false;
    }
}