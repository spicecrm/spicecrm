<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\LanguageManager;

class SpiceDictionaryDomainValidation
{
    /**
     * @var the id of the domain
     */
    protected $id;

    public $domainvalidation;

    public function __construct($id){
        $this->id = $id;

        $res = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM sysdomainfieldvalidations WHERE id='{$id}' AND status='a' AND deleted = 0");

        if (!$res) {
            $res = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM syscustomdomainfieldvalidations WHERE id='{$id}' AND  status='a' AND deleted = 0");
        }

        if(!$res){
            throw new Exception("Domainfieldvalidation with ID {$id} is not defined");
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

    /*
     * handles the saving of the values
     */
    public function setValues($values){
        $db = DBManagerFactory::getInstance();
        $activeValues = [];
        $optionsObject = $db->query("SELECT id, enumvalue, 'g' scope FROM sysdomainfieldvalidationvalues WHERE  sysdomainfieldvalidation_id='{$this->id}' UNION SELECT id, enumvalue, 'c' scope FROM syscustomdomainfieldvalidationvalues WHERE  sysdomainfieldvalidation_id='{$this->id}'");
        while($option = $db->fetchByAssoc($optionsObject)){
            $activeValues[$option['id']] = $option;
        }

        // upsert the current values
        foreach ($values as $value){
            $table = $value['scope'] == 'c' ? 'syscustomdomainfieldvalidationvalues' : 'sysdomainfieldvalidationvalues';

            # if a global value is customized, keep the global value
            if ($value['scope'] == 'c' && $global = array_filter($activeValues, fn($v) => $v['scope'] == 'g' && $v['enumvalue'] == $value['enumvalue'])) {
                unset($activeValues[array_key_first($global)]);
            }

            unset($value['scope']);
            SystemDeploymentCR::writeDBEntry($table, $value['id'], $value, $value['enumvalue'] ?? 'empty');
            unset($activeValues[$value['id']]);

        }

        // delete the nonexistent
        foreach ($activeValues as $activeValue){
            $table = $activeValue['scope'] == 'c' ? 'syscustomdomainfieldvalidationvalues' : 'sysdomainfieldvalidationvalues';
            SystemDeploymentCR::deleteDBEntry($table,$activeValue['id'], $activeValue['enumvalue'] ?? 'empty' );
        }

        SpiceCache::clear('domainvalidations');

        foreach (LanguageManager::getLanguages()['available'] as $language){
            SpiceCache::clear("app_list_strings.{$language['language_code']}");
            SpiceCache::clear("cachedlanguage{$language['language_code']}");
        }
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