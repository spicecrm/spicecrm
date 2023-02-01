<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceDictionaryDomainValidation
{
    /**
     * @var the id of the domain
     */
    protected $id;

    public $doemainvalidation;

    public function __construct($id){
        $this->id = $id;

        $res = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdomainfieldvalidations WHERE id='{$id}' AND status='a' AND deleted = 0 UNION SELECT * FROM syscustomdomainfieldvalidations WHERE id='{$id}' AND  status='a' AND deleted = 0");
        if(!$res){
            throw new Exception("Domainfieldvalidation with ID {$id} is not defined");
        }

        $this->doemainvalidation = (object) $res;
    }

    public function getVlaidationOptions(){
        $enumValues = [];
        $db = DBManagerFactory::getInstance();
        $optionsObject = $db->query("SELECT * FROM (SELECT enumvalue, sequence FROM sysdomainfieldvalidationvalues WHERE deleted = 0 AND status='a'  AND sysdomainfieldvalidation_id='{$this->id}' UNION SELECT enumvalue, sequence FROM sysdomainfieldvalidationvalues WHERE deleted = 0 AND status='a' AND sysdomainfieldvalidation_id='{$this->id}') unres ORDER BY sequence");
        while($option = $db->fetchByAssoc($optionsObject)){
            $enumValues[] = $option['enumvalue'];
        }
        return $enumValues;
    }

}