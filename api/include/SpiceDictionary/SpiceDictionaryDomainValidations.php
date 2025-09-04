<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\LanguageManager;

class SpiceDictionaryDomainValidations
{
    /**
     * the main table name
     */
    const table = 'sysdomainfieldvalidations';

    /**
     * the custom table name
     */
    const customTable = 'syscustomdomainfieldvalidations';
    /**
     * the main table name
     */
    const valuesTable = 'sysdomainfieldvalidationvalues';

    /**
     * the custom table name
     */
    const valuesCustomTable = 'syscustomdomainfieldvalidationvalues';

    /**
     * the instance for the singleton
     *
     * @var SpiceDictionaryDomainValidations|null
     */
    private static ?SpiceDictionaryDomainValidations $instance = null;

    public array $domainValidationsWithValues = [];

    public array $domainValidations = [];

    const cacheName = 'domainValidations';

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

    private function __construct(bool $load = true)
    {
        if (!$load) return;

        $cached = SpiceCache::get(self::cacheName);

        if($cached) {
            $this->domainValidations = $cached['domainValidations'];
            $this->domainValidationsWithValues = $cached['domainValidationsWithValues'];
        } else {
            $this->reloadItems();
        }

    }

    /**
     * retrieve domain validations from the database
     * @return void
     * @throws Exception
     */
    private function retrieveValidations()
    {
        $db = DBManagerFactory::getInstance();
        $this->domainValidations = [];
        $this->domainValidationsWithValues = [];

        $scopeTables = [ 'g' => self::table, 'c' => self::customTable];

        foreach($scopeTables as $scope => $table){

            $query = $db->query("SELECT *, '$scope' as scope FROM $table");

            while($validation = $db->fetchByAssoc($query)){
                $this->pushValidationInList($validation);
            }
        }

        $this->retrieveValidationValues();
    }

    /**
     * retrieve validation values for the loaded validations from the database
     * @return void
     * @throws Exception
     */
    private function retrieveValidationValues()
    {
        $db = DBManagerFactory::getInstance();

        $scopeTables = [ 'g' => self::valuesTable, 'c' => self::valuesCustomTable];

        foreach($scopeTables as $scope => $table){

            foreach($this->domainValidationsWithValues as $name => $data){

                $query = $db->query("SELECT *, '$scope' as scope FROM $table WHERE sysdomainfieldvalidation_id = '{$data['id']}'");

                while($value = $db->fetchByAssoc($query)){
                    $this->domainValidationsWithValues[$name]['validationvalues'][$value['enumvalue']] = [
                        'enumvalue' => $value['enumvalue'],
                        'label' => $value['label'],
                        'sequence' => (int)$value['sequence'],
                        'status' => $value['status'],
                    ];
                }
            }
        }
    }

    /**
     * push/update a validation in the list
     * @param array $validation
     * @return void
     */
    private function pushValidationInList(array $validation)
    {
        $this->domainValidations[$validation['id']] = $validation;

        $validation['validationvalues'] = [];

        $this->domainValidationsWithValues[$validation['name']] = $validation;
    }

    /**
     * push/update a validation value in the list
     * @param string $validationId
     * @param array $value
     * @return void
     */
    private function pushValidationValueInList(string $validationId, array $value)
    {
        $validationName = $this->domainValidations[$validationId]['name'];

        $this->domainValidationsWithValues[$validationName]['validationvalues'][$value['enumvalue']] = $value;
    }

    /**
     * reload the items from the database
     * @return void
     * @throws Exception
     */
    public function reloadItems(): void
    {
        $this->retrieveValidations();
        $this->writeCache();
    }

    /**
     * write cache
     * @return void
     */
    private function writeCache(): void
    {
        SpiceCache::set(self::cacheName, [
            'domainValidations' => $this->domainValidations,
            'domainValidationsWithValues' => $this->domainValidationsWithValues,
        ]);
    }

    public function createDictionaryValidationDoms($language){
        if(empty($language)){
            $language = $GLOBALS['current_language'];
        }

        $sys_app_list_strings = [];
        // $validations = self::loadDictionaryValidations();
        $syslanguagelabels[$language] = LanguageManager::loadDatabaseLanguage($language);

        foreach($this->domainValidationsWithValues as $dom => $definition){
            // re-organize and add translation
            foreach($definition['validationvalues'] as $def){
                if($def['status'] == 'a') {
                    $translation = (!empty($syslanguagelabels[$language][$def['label']]['default']) ? $syslanguagelabels[$language][$def['label']]['default'] : $def['enumvalue']);
                    $sys_app_list_strings[$dom][$language]['values'][$def['enumvalue']]['enumvalue'] = $def['enumvalue'];
                    $sys_app_list_strings[$dom][$language]['values'][$def['enumvalue']]['translation'] = $translation;
                    $sys_app_list_strings[$dom][$language]['values'][$def['enumvalue']]['sequence'] = $def['sequence'];
                }
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
     * @throws Exception
     */
    public function addValidation(array $validation)
    {
        //get teh table
        $table = $validation['scope'] == 'c' ? self::customTable : self::table;

        $this->pushValidationInList($validation);

        unset($validation['scope']);

        DBManagerFactory::getInstance()->upsertQuery($table, ['id' => $validation['id']], $validation);

        $this->writeCache();
    }

    /**
     * save the enum values for a validation
     * @param string $validationId
     * @param array $values
     * @return void
     * @throws Exception
     */
    public function setValues(string $validationId, array $values){

        $db = DBManagerFactory::getInstance();
        $validationName = $this->domainValidations[$validationId]['name'];
        $this->domainValidationsWithValues[$validationName]['validationvalues'] = [];

        $activeValues = [];

        $tableScopes = ['g' => self::valuesTable, 'c' => self::valuesCustomTable];

        foreach($tableScopes as $scope => $table){

            $query = $db->query("SELECT id, enumvalue, $scope scope FROM $table WHERE sysdomainfieldvalidation_id='$validationId'");

            while($option = $db->fetchByAssoc($query)){
                $activeValues[$option['id']] = $option;
            }
        }

        foreach ($values as $value){

            $table = $value['scope'] == 'c' ? self::valuesCustomTable : self::valuesTable;

            # if a global value is customized, keep the global value
            if ($value['scope'] == 'c' && $global = array_filter($activeValues, fn($v) => $v['scope'] == 'g' && $v['enumvalue'] == $value['enumvalue'])) {
                unset($activeValues[array_key_first($global)]);
            }

            unset($value['scope']);

            SystemDeploymentCR::writeDBEntry($table, $value['id'], $value, $value['enumvalue'] ?? 'empty');

            unset($activeValues[$value['id']]);

            $this->pushValidationValueInList($validationId, $value);
        }

        $this->writeCache();

        // delete the nonexistent
        foreach ($activeValues as $activeValue){
            $table = $activeValue['scope'] == 'c' ? self::valuesCustomTable : self::valuesTable;
            SystemDeploymentCR::deleteDBEntry($table,$activeValue['id'], $activeValue['enumvalue'] ?? 'empty' );
        }

        foreach (LanguageManager::getLanguages()['available'] as $language){
            SpiceCache::clear("app_list_strings.{$language['language_code']}");
            SpiceCache::clear("cachedlanguage{$language['language_code']}");
        }
    }

    /**
     * initialize and set validations and values from the system package for installer
     * @param array $validations
     * @param array $values
     * @return void
     */
    public static function initializeFromSystemPackage(array $validations, array $values)
    {
        self::$instance = new self(false);

        self::$instance->domainValidations = [];
        self::$instance->domainValidationsWithValues = [];

        foreach ($validations as $validation) {
            $validation->scope = 'g';
            self::$instance->pushValidationInList((array) $validation);
        }

        foreach ($values as $value) {
            $value->scope = 'g';
            self::$instance->pushValidationValueInList($value->sysdomainfieldvalidation_id, (array) $value);
        }

        self::$instance->writeCache();
    }
}