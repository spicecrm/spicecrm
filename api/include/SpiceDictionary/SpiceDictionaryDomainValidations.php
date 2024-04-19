<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\LanguageManager;

class SpiceDictionaryDomainValidations
{
    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    public $domainValidations;

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryDomainValidations
     */
    static function getInstance(): SpiceDictionaryDomainValidations
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function __construct()
    {
        $cached = SpiceCache::get('domainvalidations');
        if($cached) {
            $this->domainValidations = $cached;
            return;
        }

        $db = DBManagerFactory::getInstance();
        $validationsArray = [];
        $domainfields = $db->query("SELECT * FROM sysdomainfieldvalidations");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $validationsArray[$domainfield['name']] = [
                'id' => $domainfield['id'],
                'validation_type' => $domainfield['validation_type'],
                'operator' => $domainfield['operator'],
                'validationvalues' => []
            ];
        }
        $domainfields = $db->query("SELECT * FROM syscustomdomainfieldvalidations");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $validationsArray[$domainfield['name']] = [
                'id' => $domainfield['id'],
                'validation_type' => $domainfield['validation_type'],
                'operator' => $domainfield['operator'],
                'validationvalues' => []
            ];
        }

        // load the values
        foreach($validationsArray as $valname => $valdata){

            $domainvalues = $db->query("SELECT * FROM sysdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$valdata['id']}'");
            while($domainvalue = $db->fetchByAssoc($domainvalues)){
                $validationsArray[$valname]['validationvalues'][$domainvalue['enumvalue']] = [
                    'enumvalue' => $domainvalue['enumvalue'],
//                    'minvalue' => $domainvalue['minvalue'],
//                    'maxval' => $domainvalue['maxval'],
                    'label' => $domainvalue['label'],
                    'sequence' => $domainvalue['sequence']
                ];
            }

            $domainvalues = $db->query("SELECT * FROM syscustomdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$valdata['id']}'");
            while($domainvalue = $db->fetchByAssoc($domainvalues)){

                // fill the dom
                $validationsArray[$valname]['validationvalues'][$domainvalue['enumvalue']] = [
                    'enumvalue' => $domainvalue['enumvalue'],
//                'minvalue' => $domainvalue['minvalue'],
//                'maxvalue' => $domainvalue['maxvalue'],
                    'label' => $domainvalue['label'],
                    'sequence' => $domainvalue['sequence']
                ];
            }
        }

        $validationsArray[$valname]['validationvalues'] = array_values($validationsArray[$valname]['validationvalues']);

        SpiceCache::set('domainvalidations', $validationsArray);

        $this->domainValidations = $validationsArray;
    }

    public function createDictionaryValidationDoms($language){
        if(empty($language)){
            $language = $GLOBALS['current_language'];
        }

        $sys_app_list_strings = [];
        // $validations = self::loadDictionaryValidations();
        $syslanguagelabels[$language] = LanguageManager::loadDatabaseLanguage($language);

        foreach($this->domainValidations as $dom => $definition){
            // re-organize and add translation
            foreach($definition['validationvalues'] as $def){
                $translation = (!empty($syslanguagelabels[$language][$def['label']]['default']) ? $syslanguagelabels[$language][$def['label']]['default'] : $def['enumvalue']);
                $sys_app_list_strings[$dom][$language]['values'][$def['enumvalue']]['enumvalue'] = $def['enumvalue'];
                $sys_app_list_strings[$dom][$language]['values'][$def['enumvalue']]['translation'] = $translation;
                $sys_app_list_strings[$dom][$language]['values'][$def['enumvalue']]['sequence'] = $def['sequence'];
            }

            // sort by the sequence
            if(is_array($sys_app_list_strings[$dom][$language]['values'])){
                $arrmap = array_map(function($element) {
                    return $element['sequence'];
                }, $sys_app_list_strings[$dom][$language]['values']);
                array_multisort($arrmap, ($definition['sort_flag'] == 'desc' ? SORT_DESC : SORT_ASC), $sys_app_list_strings[$dom][$language]['values']);
            }
        }

        return $sys_app_list_strings;
    }


    /**
     * adds a validation
     *
     * @param array $validation
     * @return void
     * @throws \Exception
     */
    public function addValidation(array $validation)
    {
        //get teh table
        $table = $validation['scope'] == 'c' ? 'syscustomdomainfieldvalidations' : 'sysdomainfieldvalidations';
        unset($validation['scope']);
        DBManagerFactory::getInstance()->insertQuery($table, $validation);
    }

}