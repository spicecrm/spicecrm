<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\LanguageManager;

class SpiceDictionaryDomainValidation
{
    /**
     * @var the id of the domain
     */
    protected $id;

    public $domainvalidation;

    /**
     * @param array|string $id
     * @throws Exception
     */
    public function __construct($id){
        if(is_array($id)) $id = $id['id'];

        $this->id = $id;

        $res = SpiceDictionaryDomainValidations::getInstance()->domainValidations[$id];

        if(!$res){
            throw new Exception("Domainfieldvalidation with ID {$id} is not defined or not active");
        }

        $this->domainvalidation = (object) $res;
    }

    public function getValidationOptions(){
        $enumValues = [];
        $db = DBManagerFactory::getInstance();
        $optionsObject = $db->query("SELECT * FROM (SELECT enumvalue, sequence FROM sysdomainfieldvalidationvalues WHERE deleted = 0 AND status='a'  AND sysdomainfieldvalidation_id='{$this->id}' UNION SELECT enumvalue, sequence FROM syscustomdomainfieldvalidationvalues WHERE deleted = 0 AND status='a' AND sysdomainfieldvalidation_id='{$this->id}') unres ORDER BY sequence");
        while($option = $db->fetchByAssoc($optionsObject)){
            $enumValues[] = $option['enumvalue'];
        }
        return $enumValues;
    }

    /**
     * gets the definition
     *
     * @return object
     */
    public function getDefinition(){
        return $this->domainvalidation;
    }

}