<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes\SpiceFTSManager;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpicePhoneNumberParser\SpicePhoneNumberParser;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use stdClass;
use UnifiedSearchAdvanced;
use SpiceCRM\modules\UserPreferences\UserPreference;
use SpiceCRM\includes\TimeDate;

class SpiceFTSHandler
{

    /**
     * an instance of the elastic handler
     *
     * @var ElasticHandler|null
     */
    var $elasticHandler = null;

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    /**
     * set internally if we are in a transaction and shoudl collect the entries
     *
     * @var bool
     */
    var $inTransaction = false;

    /**
     * indicates that we should process this call syncronously
     * @var bool
     */
    var $transactionSyncronous = false;

    /**
     * array collection the transactional updates to be then executed on commit
     *
     * @var array
     */
    var $transactionEntries = [
        'database' => [],
        'elastic' => []
    ];

    public final function __construct()
    {
        $this->elasticHandler = new ElasticHandler();
    }

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceFTSHandler
     */
    static function getInstance()
    {
        if (self::$instance === null) {

            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * returns the geo coordinate fields for a given module
     *
     * @param $module the name of the module
     * @return array|bool
     */
    static function checkGeo($module)
    {
        $settings = SpiceFTSUtils::getBeanIndexSettings($module);
        if ($settings['geosearch']) {
            return ['latitude_field' => $settings['geolat'], 'longitude_field' => $settings['geolng']];
        }
        return $settings['geosearch'] ? true : false;
    }

    /**
     * returns if the module shoudl be considered in the global search
     *
     * @param $module the name of the module
     * @return array|bool
     */
    static function checkGlobal($module)
    {
        $settings = SpiceFTSUtils::getBeanIndexSettings($module);
        return $settings['globalsearch'] ? true : false;
    }

    /**
     * processes the search
     *
     * @param $req
     * @param $res
     * @param $args
     */
    function search($postBody)
    {

        $useFts = !empty($postBody['modules']);
        $result = [];

        // CR1000458: when no fts configuration is set fall back to backend global search and query on database
        $modArray = $postBody['modules'];
        if (!is_array($postBody['modules'])) {
            $modArray = explode(",", $postBody['modules']);
        }
        if (is_array($modArray)) {
            foreach ($modArray as $module) {
                if (!$this->checkModule($module, false)) {
                    $useFts = false;
                    break;
                }
            }
        }

        // use FTS
        if ($useFts) {
            $result = $this->getGlobalSearchResults($postBody['modules'], $postBody['searchterm'], json_decode($postBody['searchtags']), $postBody, $postBody['aggregates'], $postBody['sort']);
        } else {
            // else go for a DB query and guess global modules

            // loop modules
            foreach ($modArray as $module) {
                $krestHandler = new ModuleHandler();
                $listData = $krestHandler->get_bean_list($module, ['searchterm' => $postBody['searchterm']]);
                $result[$module]['aggregations'] = [];
                $result[$module]['total'] = intval($listData['totalcount']);
                $result[$module]['hits'] = [];
                foreach ($listData['list'] as $hit) {
                    $hit['_module'] = $module;
                    $result[$module]['hits'][] = [
                        '_id' => $hit['id'],
                        '_source' => $hit,
                        '_type' => $module,
                        '_index' => 'spice_' . strtolower($module)
                    ];
                }
            }
        }

        return $result;
    }

    /**
     * processes the search based on a passed in phone number .. used for the telephony integration
     *
     * @param $req
     * @param $res
     * @param $args
     */
    function searchPhone($phonenumber)
    {
        $db = DBManagerFactory::getInstance();


        if (substr($phonenumber, 0, 2) == 00) {
            $phonenumber = '+' . substr($phonenumber, 2);
        }

        // format as in fts index
        $phonenumber = SpicePhoneNumberParser::convertToE164($phonenumber);

        // determine the modules
        // ToDo: move to fts utils and utilize cache
        $searchresults = [];
        $krestHandler = new ModuleHandler();
        $modulesObject = $db->query("SELECT * FROM sysfts");
        while ($ftsmodule = $db->fetchByAssoc($modulesObject)) {
            $ftsParams = json_decode(html_entity_decode($ftsmodule['settings']));
            if ($ftsParams->phonesearch == true) {
                $module = $ftsmodule['module'];
                $searchresultsraw = $this->searchModuleByPhoneNumber($module, $phonenumber);

                foreach ($searchresultsraw['hits']['hits'] as $hit) {
                    $seed = BeanFactory::getBean($module, $hit['_id']);
                    $searchresults[] = [
                        'id' => $hit['_id'],
                        'module' => $module,
                        'data' => $krestHandler->mapBeanToArray($module, $seed)
                    ];
                }
            }
        }

        return $searchresults;
    }

    /**
     * processes the export for an fts request
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    function export($postBody)
    {

        $result = $this->exportGlobalSearchResults($postBody['module'], $postBody['searchterm'], $postBody['fields'], $postBody, $postBody['aggregates'], $postBody['sort']);

        // determine the delimiter
        $delimiter = UserPreference::getDefaultPreference('export_delimiter');
        if (!empty(AuthenticationController::getInstance()->getCurrentUser()->getPreference('export_delimiter'))) $delimiter = AuthenticationController::getInstance()->getCurrentUser()->getPreference('export_delimiter');

        // determine the charset
        $supportedCharsets = mb_list_encodings();
        $charsetTo = UserPreference::getDefaultPreference('default_charset');
        if (!empty($postBody['charset'])) {
            if (in_array($postBody['charset'], $supportedCharsets)) $charsetTo = $postBody['charset'];
        } else {
            if (in_array(AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_export_charset'), $supportedCharsets)) $charsetTo = AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_export_charset');
        }

        $fh = @fopen('php://output', 'w');
        fputcsv($fh, $postBody['fields'], $delimiter);
        foreach ($result as $thisBean) {
            $entryArray = [];
            foreach ($postBody['fields'] as $returnField)
                $entryArray[] = !empty($charsetTo) ? mb_convert_encoding($thisBean[$returnField], $charsetTo) : $thisBean[$returnField];
            fputcsv($fh, $entryArray, $delimiter);
        }
        fclose($fh);


    }

    /*
    * static function to check if a module has a FTE definition
    */
    public function checkModule($module, $checkIndex = false)
    {
        $db = DBManagerFactory::getInstance();

        if ($db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"))) {
            if ($checkIndex) {
                $elastichandler = new ElasticHandler();
                return $elastichandler->checkIndex($module);
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    /*
    * static function to check if a module has a FTE definition
    */
    public function checkFilterDefs($module, $filterdefs)
    {
        // check that a filter def has been passed in
        if (!$filterdefs) return true;

        $sysFilter = new SysModuleFilters();
        $sysFilter->filtermodule = $module;
        $fields = $sysFilter->getFilterFieldsForGroup($filterdefs);

        $beanHandler = new SpiceFTSBeanHandler($module);
        $indexedFields = $beanHandler->mapModule();

        foreach ($fields as $field) {
            if (!isset($indexedFields[$field])) return false;
        }

        return true;
    }

    /**
     * resets all date_indexe fields on a module
     *
     * @param $module the name of the bean
     */
    function resetIndexModule($module)
    {
        $db = DBManagerFactory::getInstance();

        $seed = BeanFactory::getBean($module);
        if ($seed)
            $db->query('UPDATE ' . $seed->table_name . ' SET date_indexed = NULL');

    }

    /**
     * heper funciton that indexes one given module.
     *
     * @param $module thebean name
     */
    function indexModule($module)
    {
        $db = DBManagerFactory::getInstance();

        $seed = BeanFactory::getBean($module);

        $db->query('UPDATE ' . $seed->table_name . ' SET date_indexed = NULL');

        // $ids = $db->limitQuery('SELECT id FROM ' . $seed->table_name . ' WHERE deleted = 0', 0, 5);
        $ids = $db->query('SELECT id FROM ' . $seed->table_name . ' WHERE deleted = 0');
        while ($id = $db->fetchByAssoc($ids)) {
            $seed->retrieve($id['id'], false); //set encode to false to avoid things like ' being translated to &#039;
            $this->indexBean($seed);
        }

    }

    /**
     * CR1000257
     * helper funciton that indexes one given module with bulk fts.
     *
     * @param $module thebean name
     */
    function indexModuleBulk($module, $packagesize = 'system')
    {
        // if -1 set to the system defautl setting
        $packageSize = $packagesize == -1 ? SpiceConfig::getInstance()->config['fts']['schedulerpackagesize'] : $packagesize;

        // fallback to 5000 if no value is set in the config
        if (empty($packageSize)) $packageSize = 5000;

        // off we go
        $this->bulkIndexBeans($packageSize, $module);
    }

    /**
     * heper function to retrieve all global search enabled modules
     *
     * @return array
     */
    function getGlobalSearchModules()
    {
        global $current_language;
        $db = DBManagerFactory::getInstance();

        // so we have the variable -> will then be filled once the metadata is included
        $listViewDefs = [];

        // load the app language
        $appLang = return_application_language($current_language);

        $modArray = [];
        $modLangArray = [];
        $viewDefs = [];
        $modules = [];

        // default FTS
        $modListFts = $db->query("SELECT * FROM sysfts");
        while ($row = $db->fetchByAssoc($modListFts)) {
            $modules[] = $row;
        }
        // BWC when no FTS is set. Fall back on unified search definition
        if (empty($modules)) {
            // try unified search
            require_once 'include/utils/UnifiedSearchAdvanced.php';
            $usa = new UnifiedSearchAdvanced();
            $modListUS = $usa->getUnifiedSearchModules();
            foreach ($modListUS as $modName => $modData) {
                $modules[] = ['module' => $modName, 'settings' => '{"globalsearch":true}'];
            }
        }

        foreach ($modules as $module) {
            $settings = json_decode(html_entity_decode($module['settings']), true);

            if (!$settings['globalsearch']) continue;

            // add the module
            $modArray[] = $module['module'];

            // add the language label
            $modLangArray[$module['module']] = $appLang['moduleList'][$module['module']] ?: $module['module'];

            // get the fielddefs
            $metadataFile = null;
            $foundViewDefs = false;
            if (file_exists("custom/modules/{$module['module']}/metadata/listviewdefs.php")) {
                $metadataFile = "custom/modules/{$module['module']}/metadata/listviewdefs.php";
                $foundViewDefs = true;
            } else {
                if (file_exists("custom/modules/{$module['module']}/metadata/metafiles.php")) {
                    require_once("custom/modules/{$module['module']}/metadata/metafiles.php");
                    if (!empty($metafiles[$module['module']]['listviewdefs'])) {
                        $metadataFile = $metafiles[$module['module']]['listviewdefs'];
                        $foundViewDefs = true;
                    }
                } elseif (file_exists("extensions/modules/{$module['module']}/metadata/metafiles.php")) {
                    require_once("extensions/modules/{$module['module']}/metadata/metafiles.php");
                    if (!empty($metafiles[$module['module']]['listviewdefs'])) {
                        $metadataFile = $metafiles[$module['module']]['listviewdefs'];
                        $foundViewDefs = true;
                    }
                } elseif (file_exists("modules/{$module['module']}/metadata/metafiles.php")) {
                    require_once("modules/{$module['module']}/metadata/metafiles.php");
                    if (!empty($metafiles[$module['module']]['listviewdefs'])) {
                        $metadataFile = $metafiles[$module['module']]['listviewdefs'];
                        $foundViewDefs = true;
                    }
                }
            }
            if (!$foundViewDefs && file_exists("extensions/modules/{$module['module']}/metadata/listviewdefs.php")) {
                $metadataFile = "extensions/modules/{$module['module']}/metadata/listviewdefs.php";

            } elseif (!$foundViewDefs && file_exists("modules/{$module['module']}/metadata/listviewdefs.php")) {
                $metadataFile = "modules/{$module['module']}/metadata/listviewdefs.php";

            }

            if (file_exists($metadataFile))
                require_once($metadataFile);

            $modLang = return_module_language($current_language, $module['module'], true);


            $totalWidth = 0;
            foreach ($listViewDefs[$module['module']] as $fieldName => $fieldData) {
                if ($fieldData['default'] && $fieldData['globalsearch'] !== false) {
                    $viewDefs[$module['module']][] = [
                        'name' => $fieldName,
                        'width' => str_replace('%', '', $fieldData['width']),
                        'label' => $modLang[$fieldData['label']] ?: $appLang[$fieldData['label']] ?: $fieldData['label'],
                        'link' => ($fieldData['link'] && empty($fieldData['customCode'])) ? true : false,
                        'linkid' => $fieldData['id'],
                        'linkmodule' => $fieldData['module']
                    ];
                    $totalWidth += str_replace('%', '', $fieldData['width']);
                }
            }

            if ($totalWidth != 100) {
                foreach ($viewDefs[$module['module']] as $fieldIndex => $fieldData)
                    $viewDefs[$module['module']][$fieldIndex]['width'] = $viewDefs[$module['module']][$fieldIndex]['width'] * 100 / $totalWidth;
            }
        }

        //make sure any module is only once in modArray else angular duplicatekeys error on display
        $modArray = array_unique($modArray);
        return ['modules' => $modArray, 'moduleLabels' => $modLangArray, 'viewdefs' => $viewDefs];

    }

    /*
    * function to get all modules and all indexed fields
    */
    function getGlobalModulesFields()
    {
        $db = DBManagerFactory::getInstance();

        $modArray = [];
        $searchFields = [];

        $modules = $db->query("SELECT * FROM sysfts");
        while ($module = $db->fetchByAssoc($modules)) {
            $settings = json_decode(html_entity_decode($module['settings']), true);
            if (!$settings['globalsearch']) continue;

            $fields = json_decode(html_entity_decode($module['ftsfields']), true);
            foreach ($fields as $field) {
                if ($field['indexfieldname'] && $field['search']) {
                    $modArray[$module['module']][] = $field['indexfieldname'];

                    if (array_search($field['indexfieldname'], $searchFields) === false)
                        $searchFields[] = $field['indexfieldname'];
                }
            }
        }

        return ['modules' => $modArray, 'searchfields' => $searchFields];
    }

    /**
     * indexes a given bean that is passed in
     *
     * @param $bean the sugarbean to be indexed
     *
     * @return bool
     */
    function indexBean($bean)
    {
        $indexResponse = [];
        $beanHandler = new SpiceFTSBeanHandler($bean);

        $beanModule = $bean->_module;
        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($beanModule);
        if ($indexProperties) {
            $indexArray = $beanHandler->normalizeBean();

            // check if we are in a transaction then collect the entries
            if ($this->inTransaction) {
                // check if we shoudl set the transaction to syncronous processing
                if(!$this->transactionSyncronous) {
                    $indexSettings = SpiceFTSUtils::getBeanIndexSettings($beanModule);
                    if ($indexSettings['waitfor']) $this->transactionSyncronous = true;
                }

                $this->transactionEntries['elastic'][] = json_encode([
                    'index' => [
                        '_index' => $this->elasticHandler->indexPrefix . strtolower($beanModule),
                        '_id' => $bean->id
                    ]
                ]);
                $this->transactionEntries['elastic'][] = json_encode($indexArray);
                $this->transactionEntries['database'][] = "UPDATE {$bean->table_name} SET date_indexed = '" . TimeDate::getInstance()->nowDb() . "' WHERE id = '{$bean->id}'";
            } else {
                $indexResponse = $this->elasticHandler->document_index($beanModule, $indexArray);

                // check if we had success
                $indexResponse = json_decode($indexResponse, true);
                // SPICEUI-100
                // if (!$indexResponse->error) {
                if ($indexResponse && !in_array('error', $indexResponse)) {
                    // update the date
                    $bean->db->query("UPDATE {$bean->table_name} SET date_indexed = '" . TimeDate::getInstance()->nowDb() . "' WHERE id = '{$bean->id}'");
                }
            }
        }

        // check all related beans
        $relatedRecords = $this->elasticHandler->filter('related_ids', $bean->id);
        if ($relatedRecords == null) return true;
        if (is_array($relatedRecords['hits']['hits'])) {
            foreach ($relatedRecords['hits']['hits'] as $relatedRecord) {
                $relatedBean = BeanFactory::getBean($this->elasticHandler->getHitModule($relatedRecord), $relatedRecord['_id']);
                if ($relatedBean) {
                    $relBeanHandler = new SpiceFTSBeanHandler($relatedBean);
                    // check if we are in a transaction then collect the entries
                    if ($this->inTransaction) {
                        $this->transactionEntries['elastic'][] = json_encode([
                            'index' => [
                                '_index' => $this->elasticHandler->indexPrefix . strtolower($this->elasticHandler->getHitModule($relatedRecord)),
                                '_id' => $relatedBean->id
                            ]
                        ]);
                        $this->transactionEntries['elastic'][] = json_encode($relBeanHandler->normalizeBean());
                    } else {
                        $this->elasticHandler->document_index($this->elasticHandler->getHitModule($relatedRecord), $relBeanHandler->normalizeBean());
                    }
                }
            }
        }

        return true;
    }

    /**
     * handles the removal from a bean record form the proper index
     *
     * @param $bean
     * @return bool
     */
    function deleteBean($bean)
    {
        $beanModule = $bean->_module;
        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($beanModule);
        if ($indexProperties) {
            // check if we are in a transaction then collect the entries
            if ($this->inTransaction) {
                $this->transactionEntries['elastic'][] = json_encode([
                    'delete' => [
                        '_index' => $this->elasticHandler->indexPrefix . strtolower($beanModule),
                        '_id' => $bean->id
                    ]
                ]);
                $this->transactionEntries['database'][] = "UPDATE {$bean->table_name} SET date_indexed = NULL WHERE id = '{$bean->id}'";
            } else {
                $this->elasticHandler->document_delete($beanModule, $bean->id);
                $bean->db->query("UPDATE {$bean->table_name} SET date_indexed = NULL WHERE id = '{$bean->id}'");
            }
        }

        return true;
    }

    /*
     * function to search in a module
     */
    function searchTerm($searchterm = '', $aggregatesFilters = [], $size = 25, $from = 0)
    {
        $searchfields = $this->getGlobalModulesFields();

        // build the query
        $queryParam = [
            'size' => $size,
            'from' => $from
        ];
        if (!empty($searchterm)) {
            $queryParam['query'] = [
                "bool" => [
                    "must" => [
                        "multi_match" => [
                            "query" => "$searchterm",
                            'analyzer' => 'standard',
                            'fields' => $searchfields['searchfields']
                        ]
                    ]
                ]
            ];
        }

        // build the searchmodules list
        $modules = [];
        foreach ($searchfields['modules'] as $module => $modulefields) {
            $modules[] = $module;
        }

        // make the search
        $searchresults = $this->elasticHandler->searchModules($modules, $queryParam, $size, $from);

        return $searchresults;

    }

    private function getSortArrayEntry($seed, $indexProperties, $sortfield, $sortdirection)
    {
        // replace by metadata sortfield definition
        if ($seed->field_name_map[$sortfield]['sort_on']) {
            $sortfield = $seed->field_name_map[$sortfield]['sort_on'];
        }

        // check that the field is here, is sortable and if aanother sort field is set
        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['fieldname'] == $sortfield) {
                if ($indexProperty['metadata']['sort_on']) {
                    return [$indexProperty['metadata']['sort_on'] . '.raw' => $sortdirection];
                } else {
                    switch ($indexProperty['indextype']) {
                        case 'date';
                        case 'double';
                            return [$sortfield => $sortdirection];
                        default:
                            return [$sortfield . '.raw' => $sortdirection];
                    }
                }
                break;
            }
        }
    }

    /**
     *
     * function to search in a module
     *
     * @param $module
     * @param string $searchterm
     * @param array $aggregatesFilters
     * @param int $size
     * @param int $from
     * @param array $sort
     * @param array $addFilters
     * @param bool $useWildcard
     * @param array $requiredFields
     * @param array $source set to false if no source fields shopudl be returned
     *
     * @return array|mixed
     */
    function searchModule($module, $searchterm = '', $searchtags = [], $aggregatesFilters = [], $size = 25, $from = 0, $sort = [], $addFilters = [], $useWildcard = false, $requiredFields = [], $source = true, $addAggregates = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($module);
        $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);
        $seed = BeanFactory::getBean($module);

        $searchFields = [];

        // $aggregateFields = [];
        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['search']) {
                if ($indexProperty['boost'])
                    $searchFields[] = $indexProperty['indexfieldname'] . '^' . $indexProperty['boost'];
                else
                    $searchFields[] = $indexProperty['indexfieldname'];
            }
        }

        // add Standard Fields
        foreach (SpiceFTSUtils::$standardFields as $standardField => $standardFieldData) {
            if ($standardFieldData['search']) {
                $searchFields[] = $standardField;
            }
        }

        $aggregates = new SpiceFTSAggregates($module, $indexProperties, $aggregatesFilters, $indexSettings);

        if (count($searchFields) == 0)
            return [];

        // build the query
        $queryParam = [
            'track_total_hits' => true,
            'size' => $size,
            'from' => $from
        ];

        // if we do not want any srurce fields to be returned
        if (!$source) {
            $queryParam['_source'] = false;
        }

        $queryParam['sort'] = [];
        if (isset($sort['sortfield']) && isset($sort['sortdirection']) && !empty($sort['sortfield']) && !empty($sort['sortdirection'])) {
            // catch if entry is valid. Field name might habe changed
            $entry = $this->getSortArrayEntry($seed, $indexProperties, $sort['sortfield'], $sort['sortdirection']);
            if (!empty($entry)) {
                $queryParam['sort'][] = $entry;
            }
        } elseif (is_array($sort) && count($sort) > 0) {
            foreach ($sort as $sortparam) {
                // catch if entry is valid. Field name might habe changed
                $entry = $this->getSortArrayEntry($seed, $indexProperties, $sortparam['sortfield'], $sortparam['sortdirection']);
                if (!empty($entry)) {
                    $queryParam['sort'][] = $entry;
                }
            }
        }


        /**
         * changed to build multiple must queries
         */
        if (!empty($searchterm)) {
            $multimatch = [
                "query" => "$searchterm",
                'analyzer' => $indexSettings['search_analyzer'] ?: 'spice_standard',
                'fields' => $searchFields,
            ];

            if ($indexSettings['minimum_should_match'])
                $multimatch['minimum_should_match'] = $indexSettings['minimum_should_match'] . '%';

            if ($indexSettings['fuzziness'])
                $multimatch['fuzziness'] = $indexSettings['fuzziness'];


            if ($indexSettings['operator'])
                $multimatch['operator'] = $indexSettings['operator'];

            if ($indexSettings['multimatch_type'])
                $multimatch['type'] = $indexSettings['multimatch_type'];


            $queryParam['query'] = [
                'bool' => [
                    'must' => [
                        ['multi_match' => $multimatch]
                    ]
                ]
            ];

            // check for required fields
            if (count($requiredFields) > 0) {
                $existsBlock = [];
                foreach ($requiredFields as $requiredField) {
                    $existsBlock[] = [
                        'exists' => [
                            'field' => $requiredField
                        ]
                    ];
                }
                $queryParam['query']['bool']['should'] = $existsBlock;
                $queryParam['query']['bool']['minimum_should_match'] = 1;
            }


            //wildcard capability: change elasticsearch params!
            if ($useWildcard) {
                $queryParam['query'] = [
                    "bool" => [
                        "should" => []
                    ]
                ];
                foreach ($searchFields as $searchField) {
                    $queryParam['query']['bool']['should'][] = ["wildcard" => [substr($searchField, 0, (strpos($searchField, "^") > 0 ? strpos($searchField, "^") : strlen($searchField))) => "$searchterm"]];
                }

            };
        }

        // if searchtags add an additional query for the must
        if ($searchtags) {
            $tags = [];
            foreach ($searchtags as $v) $tags[] = ['term' => ['tags.raw' => $v]];
            $queryParam['query']['bool']['must'][] = [
                'bool' => [
                    'should' => $tags,
                    'minimum_should_match' => 1
                ]
            ];
        }

        // add ACL Check filters
        if (!$current_user->is_admin && SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'getFTSQuery')) {
            $aclFilters = SpiceACL::getInstance()->getFTSQuery($module);
            if (count($aclFilters) > 0) {
                // do not write empty entries
                if (isset($aclFilters['should']) && count($aclFilters['should']) >= 1) {
                    $queryParam['query']['bool']['filter']['bool']['should'] = $aclFilters['should'];
                    $queryParam['query']['bool']['filter']['bool']['minimum_should_match'] = 1;
                }
                if (isset($aclFilters['must_not']) && count($aclFilters['must_not']) >= 1) {
                    $queryParam['query']['bool']['filter']['bool']['must_not'] = $aclFilters['must_not'];
                }
                if (isset($aclFilters['must']) && count($aclFilters['must']) >= 1) {
                    $queryParam['query']['bool']['filter']['bool']['must'] = $aclFilters['must'];
                }

            }
        }

        // check if we have a global filter for the module defined
        // if yes add this here to the add filters
        if (!empty($indexSettings['globalfilter'])) {
            $sysFilter = new SysModuleFilters();
            $filterForId = $sysFilter->generareElasticFilterForFilterId($indexSettings['globalfilter']);
            if (!empty($filterForId)) {
                $addFilters[] = $filterForId;
            }
        }

        // process additional filters
        if (is_array($addFilters) && count($addFilters) > 0) {
            if (is_array($queryParam['query']['bool']['filter']['bool']['must'])) {
                foreach ($addFilters as $addFilter)
                    $queryParam['query']['bool']['filter']['bool']['must'][] = $addFilter;
            } else {
                $queryParam['query']['bool']['filter']['bool']['must'] = $addFilters;
            }
        }

        //add aggregates filters
        $postFiler = $aggregates->buildQueryFilterFromAggregates();
        if ($postFiler !== false)
            $queryParam['post_filter'] = $postFiler;

        $aggs = $aggregates->buildAggregates();
        if ($addAggregates) {
            $aggFilters = $aggregates->buildAggFilters();
            if (count($aggregates->buildAggFilters()) > 0) {
                foreach ($addAggregates as $aggregateName => $aggParams)
                    $aggs[$aggregateName] = [
                        'filter' => $aggFilters,
                        'aggs' => [
                            $aggregateName => $aggParams
                        ]
                    ];
            } else {
                $aggs = array_merge($aggs, $addAggregates);
            }
        }

        if ($aggs !== false) {
            $queryParam['aggs'] = $aggs;
        }

        // make the search
        LoggerManager::getLogger()->debug(json_encode($queryParam));


        /* ToDo: experimental to think about scoring based on age of record
        $queryParam['query'] = [
            'function_score' => [
                'query' => $queryParam['query'],
                'gauss' => [
                    'date_modified' => [
                        "scale" => "100d"
                    ]
                ]
            ]
        ];
        */

        $searchresults = $this->elasticHandler->searchModule($module, $queryParam, $size, $from);

        $aggregates->processAggregations($searchresults['aggregations']);

        return $searchresults;

    }

    /**
     *
     * function to search in a module
     *
     * @param $module
     * @param string $searchterm
     * @param array $aggregatesFilters
     * @param int $size
     * @param int $from
     * @param array $sort
     * @param array $addFilters
     * @param bool $useWildcard
     * @param array $requiredFields
     * @param array $source set to false if no source fields shopudl be returned
     *
     * @return array|mixed
     */
    function searchModuleByPhoneNumber($module, $searchterm = '')
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);

        // build the query
        $queryParam = [
            'size' => 50,
            'from' => 0
        ];
        $queryParam['_source'] = false;

        $queryParam['query'] = [
            'bool' => [
                'must' => [
                    ['terms' => ['_phone' => [$searchterm]]]
                ]
            ]
        ];

        // add ACL Check filters
        if (!$current_user->is_admin && SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'getFTSQuery')) {
            $aclFilters = SpiceACL::getInstance()->getFTSQuery($module);
            if (count($aclFilters) > 0) {
                // do not write empty entries
                if (isset($aclFilters['should']) && count($aclFilters['should']) >= 1) {
                    $queryParam['query']['bool']['filter']['bool']['should'] = $aclFilters['should'];
                    $queryParam['query']['bool']['filter']['bool']['minimum_should_match'] = 1;
                }
                if (isset($aclFilters['must_not']) && count($aclFilters['must_not']) >= 1) {
                    $queryParam['query']['bool']['filter']['bool']['must_not'] = $aclFilters['must_not'];
                }
                if (isset($aclFilters['must']) && count($aclFilters['must']) >= 1) {
                    $queryParam['query']['bool']['filter']['bool']['must'] = $aclFilters['must'];
                }

            }
        }

        // check if we have a global filter for the module defined
        // if yes add this here to the add filters
        if (!empty($indexSettings['globalfilter'])) {
            $sysFilter = new SysModuleFilters();
            $filterForId = $sysFilter->generareElasticFilterForFilterId($indexSettings['globalfilter']);
            if (!empty($filterForId)) {
                $addFilters[] = $filterForId;
            }
        }

        $searchresults = $this->elasticHandler->searchModule($module, $queryParam, 50, 0);

        return $searchresults;
    }

    /**
     *
     * checks for duplicate records
     *
     * @param SugarBean $bean
     *
     * @return array
     */
    function checkDuplicates($bean)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($bean->_module);
        $searchParts = [];
        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['duplicatecheck']) {
                $indexField = $indexProperty['indexfieldname'];
                if (empty($bean->$indexField)) {
                    //return [];
                    // don't stop, just continue, ignore it
                    continue;
                } else {

                    $queryField = $bean->$indexField;

                    switch ($indexProperty['duplicatequery']) {
                        case 'term':
                            $searchParts[] = [
                                "match" => [
                                    $indexProperty['indexfieldname'] . '.raw' => $queryField
                                ]
                            ];
                            break;
                        case 'match_and':
                            $searchParts[] = [
                                "match" => [
                                    $indexProperty['indexfieldname'] => [
                                        "query" => $queryField,
                                        'analyzer' => 'standard',
                                        "operator" => "and",
                                        'fuzziness' => $indexProperty['duplicatefuzz'] ?: 0]
                                ]
                            ];
                            break;
                        default:
                            $searchParts[] = [
                                "match" => [
                                    $indexProperty['indexfieldname'] => [
                                        "query" => $queryField,
                                        'analyzer' => 'standard',
                                        'fuzziness' => $indexProperty['duplicatefuzz'] ?: 0]
                                ]
                            ];
                            break;
                    }
                }
            }
        }

        if (count($searchParts) == 0)
            return [];


        $queryParam['query'] = [
            "bool" => [
                "must" => $searchParts
            ]
        ];

        if ($bean->id) {
            $queryParam['query']['bool']['must_not'] = [
                'term' => [
                    'id' => $bean->id
                ]
            ];
        }

        // add ACL Check filters
        if (!$current_user->is_admin && SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'getFTSQuery')) {
            $aclFilters = SpiceACL::getInstance()->getFTSQuery($bean->_module);
            if (count($aclFilters) > 0) {
                // do not write empty entries
                if (isset($aclFilters['should']) && count($aclFilters['should']) > 1) {
                    $queryParam['query']['bool']['filter']['bool']['should'] = $aclFilters['should'];
                    $queryParam['query']['bool']['filter']['bool']['minimum_should_match'] = 1;
                }
                if (isset($aclFilters['must_not']) && count($aclFilters['must_not']) > 1) {
                    $queryParam['query']['bool']['filter']['bool']['must_not'] = $aclFilters['must_not'];
                }
                if (isset($aclFilters['must']) && count($aclFilters['must']) > 1) {
                    $queryParam['query']['bool']['filter']['bool']['must'] = $aclFilters['must'];
                }
            }
        }

        // make the search
        LoggerManager::getLogger()->debug(json_encode($queryParam));
        $searchresults = $this->elasticHandler->searchModule($bean->_module, $queryParam, 100, 0);

        $duplicateIds = [];
        foreach ($searchresults['hits']['hits'] as $hit) {
            $duplicateIds[] = $hit['_id'];
        }

        return ['count' => $this->elasticHandler->getHitsTotalValue($searchresults), 'records' => $duplicateIds];

    }


    /**
     * @param $modules
     * @param $searchterm
     * @param $params
     * @param array $aggregates
     * @param array $sort
     * @param array $required
     *
     * @return array
     */
    function getGlobalSearchResults($modules, $searchterm, $searchtags, $params, $aggregates = [], $sort = [], $required = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $searchterm = strtolower(trim((string)$searchterm));

        if (empty($modules)) {
            $modulesArray = $this->getGlobalSearchModules();
            $modArray = $modulesArray['modules'];
        } else {
            $modArray = explode(',', $modules);
        }
        $searchresults = [];

        foreach ($modArray as $module) {

            /* experimental to set ACL Controller from namespace
            $acl = '\SpiceCRM\modules\ACL\ACLController';
            if (!$acl::checkAccess($module, 'list', true))
                continue;
            */

            if (!SpiceACL::getInstance()->checkAccess($module, 'list', true))
                continue;

            // prepare the aggregates
            $aggregatesFilters = [];
            foreach ($aggregates[$module] as $aggregate) {
                $aggregateDetails = explode('::', $aggregate);
                $aggregatesFilters[$aggregateDetails[0]][] = $aggregateDetails[1];
            }

            // check if we have an owner set as parameter
            $addFilters = [];
            if ($params['owner'] == 1) {
                $addFilters[] = [
                    'bool' => [
                        'should' => [
                            [
                                'term' => [
                                    'assigned_user_id' => $current_user->id
                                ]
                            ],
                            [
                                'term' => [
                                    'assigned_user_ids' => $current_user->id
                                ]
                            ]
                        ],
                        'minimum_should_match' => '1'
                    ]
                ];
            }


            // get the index settings
            $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);
            // check for geotags
            if ($params['searchgeo'] && $indexSettings['geosearch']) {
                $addFilters[] = [
                    "geo_distance" => [
                        "distance" => $params['searchgeo']['radius'] . "km",
                        "_location" => [
                            "lat" => $params['searchgeo']['lat'],
                            "lon" => $params['searchgeo']['lng'],
                        ]
                    ]
                ];
            }

            // check for modulefilter
            if (!empty($params['modulefilter'])) {
                $sysFilter = new SysModuleFilters();
                $addFilters[] = $sysFilter->generareElasticFilterForFilterId($params['modulefilter'], $params['filtercontextbeanid']);
            }


            if (!empty($params['listid'])) {
                $listDef = DBManagerFactory::getInstance()->fetchByAssoc(DBManagerFactory::getInstance()->query("SELECT * FROM sysmodulelists WHERE id = '{$params['listid']}'"));
                $filterdefs = json_decode(html_entity_decode($listDef['filterdefs']));
                if ($filterdefs) {
                    $sysFilter = new SysModuleFilters();
                    $addFilters[] = $sysFilter->buildElasticFilterForGroup($filterdefs);
                }
            }

            //check if we use a wildcard for the search
            $useWildcard = false;
            if (preg_match("/\*/", $searchterm))
                $useWildcard = true;

            $params['buckets'] = json_decode($params['buckets'], true);
            if (is_array($params['buckets']) && count($params['buckets']) > 0) {
                // get the full aggregates
                $searchresultsraw = $this->searchModule($module, $searchterm, $searchtags, $aggregatesFilters, 0, 0, $sort, $addFilters, $useWildcard, $required);
                $searchresults[$module] = $searchresultsraw['hits'] ?: ['hits' => [], 'total' => $this->elasticHandler->getHitsTotalValue($searchresultsraw)];
                $searchresults[$module]['aggregations'] = $searchresultsraw['aggregations'];

                foreach ($params['buckets']['bucketitems'] as &$bucketitem) {
                    $bucketfilters = [];
                    $bucketfilters[] = [
                        'term' => [
                            $params['buckets']['bucketfield'] . '.raw' => $bucketitem['bucket']
                        ]
                    ];
                    $addAggrs = [];
                    if ($params['buckets']['buckettotal']) {
                        foreach ($params['buckets']['buckettotal'] as $item) {
                            $addAggrs['_bucket_agg_' . $item['name']] = [$item['function'] => ['field' => $item['name'] . '.agg']];
                        }
                    }

                    $searchresultsraw = $this->searchModule($module, $searchterm, $searchtags, $aggregatesFilters, $params['records'] ?: 5, $bucketitem['items'] ?: 0, $sort, array_merge($addFilters, $bucketfilters), $useWildcard, $required, true, $addAggrs);
                    foreach ($searchresultsraw['hits']['hits'] as &$hit) {
                        $seed = BeanFactory::getBean($module, $hit['_id']);
                        foreach ($seed->field_name_map as $field => $fieldData) {
                            //if (!isset($hit['_source']{$field}))
                            if (is_string($seed->$field)) {
                                $hit['_source'][$field] = html_entity_decode($seed->$field, ENT_QUOTES);
                            }
                        }

                        // get the email addresses
                        $krestHandler = new ModuleHandler();
                        $hit['_source']['emailaddresses'] = $krestHandler->getEmailAddresses($module, $hit['_id']);

                        $hit['acl'] = $seed->getACLActions();
                        $hit['acl_fieldcontrol'] = $this->get_acl_fieldaccess($seed);

                        // unset hidden fields
                        foreach ($hit['acl_fieldcontrol'] as $field => $control) {
                            if ($control == 1 && isset($hit['_source'][$field])) unset($hit['_source'][$field]);
                        }
                        $searchresults[$module]['hits'][] = $hit;
                    }

                    $aggsArray = [];
                    foreach (array_keys($addAggrs) as $aggregateKey) {
                        $aggsArray[$aggregateKey] = $searchresultsraw['aggregations'][$aggregateKey]['value'] ?: $searchresultsraw['aggregations'][$aggregateKey][$aggregateKey]['value'];
                    }

                    // update the bucket item
                    $bucketitem['values'] = $aggsArray;
                    $bucketitem['total'] = $this->elasticHandler->getHitsTotalValue($searchresultsraw);
                    $bucketitem['items'] = $bucketitem['items'] + count($searchresultsraw['hits']['hits']);
                }

                // return the upodated bnucket items
                $searchresults[$module]['buckets'] = $params['buckets'];
            } else {

                $searchresultsraw = $this->searchModule($module, $searchterm, $searchtags, $aggregatesFilters, $params['records'] ?: 5, $params['start'] ?: 0, $sort, $addFilters, $useWildcard, $required);
                $searchresults[$module] = $searchresultsraw['hits'] ?: ['hits' => [], 'total' => $this->elasticHandler->getHitsTotalValue($searchresultsraw)];

                if ($searchresultsraw['error']) {
                    // no error handling accepted... just trash it into some logs...
                    // \SpiceCRM\includes\Logger\LoggerManager::getLogger()->fatal(json_encode($searchresultsraw['error']['root_cause']));
                    //throw new Exception(json_encode($searchresultsraw['error']['root_cause']));
                }

                foreach ($searchresults[$module]['hits'] as &$hit) {
                    $seed = BeanFactory::getBean($module, $hit['_id']);

                    // if we do not find the record .. do not return it
                    if (!$seed) continue;

                    foreach ($seed->field_name_map as $field => $fieldData) {
                        //if (!isset($hit['_source']{$field}))
                        if(is_string($seed->$field)) { // might be Link2 Object! so check on it
                            $hit['_source'][$field] = html_entity_decode($seed->$field, ENT_QUOTES);
                        }
                    }

                    // get the email addresses
                    $krestHandler = new ModuleHandler();
                    // $hit['_source']['emailaddresses'] = $krestHandler->getEmailAddresses($module, $hit['_id']);

                    $hit['acl'] = $seed->getACLActions();
                    $hit['acl_fieldcontrol'] = $this->get_acl_fieldaccess($seed);

                    // unset hidden fields
                    foreach ($hit['acl_fieldcontrol'] as $field => $control) {
                        if ($control == 1 && isset($hit['_source'][$field])) unset($hit['_source'][$field]);
                    }

                }

                // add the aggregations
                $searchresults[$module]['aggregations'] = $searchresultsraw['aggregations'];
            }
        }
        return $searchresults;
    }


    /**
     * @param $modules
     * @param $searchterm
     * @param $params
     * @param array $aggregates
     * @param array $sort
     * @param array $required
     *
     * @return array
     */
    function getModuleSearchResults($module, $searchterm, $searchtags, $params, $aggregates = [], $sort = [], $required = [])
    {
        $searchterm = strtolower(trim((string)$searchterm));

        $searchresults = [];

        // prepare the aggregates
        $aggregatesFilters = [];
        foreach ($aggregates[$module] as $aggregate) {
            $aggregateDetails = explode('::', $aggregate);
            $aggregatesFilters[$aggregateDetails[0]][] = $aggregateDetails[1];
        }

        // check if we have an owner set as parameter
        $addFilters = [];

        // get the index settings
        $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);

        // check for geotags
        if ($params['searchgeo'] && $indexSettings['geosearch']) {
            $params['searchgeo'] = json_decode($params['searchgeo']);
            $addFilters[] = [
                "geo_distance" => [
                    "distance" => $params['searchgeo']->radius . "km",
                    "_location" => [
                        "lat" => $params['searchgeo']->lat,
                        "lon" => $params['searchgeo']->lng,
                    ]
                ]
            ];
        }

        if (!empty($params['relatefilter'])) {
            $relateFilter = json_decode($params['relatefilter']);
            $relateSeed = BeanFactory::getBean($relateFilter->module, $relateFilter->id);
            $relateSeed->load_relationship($relateFilter->relationship);
            $relatedBeans = $relateSeed->get_linked_beans($relateFilter->relationship, $relateSeed->field_name_map[$relateFilter->relationship]['module'], [], 0, -99);
            $relatedids = [];
            foreach ($relatedBeans as $relatedBean) {
                $relatedids[] = $relatedBean->id;
            }
            $addFilters[] = ["terms" => ["id" => $relatedids]];
        }

        // handle the filters
        $sysFilter = new SysModuleFilters();
        $sysFilter->filtermodule = $module;

        // check if we have a filter passed in from the top
        if (!empty($params['filter'])) {
            $addFilters[] = $sysFilter->buildElasticFilterForGroup(json_decode(html_entity_decode($params['filter'])));
        }

        // check for modulefilter
        if (!empty($params['modulefilter'])) {
            $addFilters[] = $sysFilter->generareElasticFilterForFilterId($params['modulefilter'], $params['filtercontextbeanid']);
        }

        // check if we have a listid
        if (!empty($params['listid'])) {
            switch ($params['listid']) {
                case 'owner':
                    $filter = new stdClass();
                    $filter->groupscope = 'own';
                    $addFilters[] = $sysFilter->buildElasticFilterForGroup($filter);
                    break;
                default:
                    $listDef = DBManagerFactory::getInstance()->fetchByAssoc(DBManagerFactory::getInstance()->query("SELECT * FROM sysmodulelists WHERE id = '{$params['listid']}'"));
                    $filterdefs = json_decode(html_entity_decode($listDef['filterdefs']));
                    if ($filterdefs) {
                        $processedFilters = $sysFilter->buildElasticFilterForGroup($filterdefs);
                        if (count($processedFilters) > 0) $addFilters[] = $processedFilters;
                    }
                    break;
            }
        }

        //check if we use a wildcard for the search
        $useWildcard = false;
        if (preg_match("/\*/", $searchterm))
            $useWildcard = true;

        $params['buckets'] = json_decode($params['buckets'], true);
        if (is_array($params['buckets']) && count($params['buckets']) > 0) {

            $terms = [];
            foreach ($params['buckets']['bucketitems'] as &$bucketitem) {
                // collect the terms
                $terms[] = $bucketitem['bucket'];

                // build the bucket filter
                $bucketfilters = [];
                $bucketfilters[] = [
                    'term' => [
                        $params['buckets']['bucketfield'] . '.raw' => $bucketitem['bucket']
                    ]
                ];

//                 add the aggregate
                $addAggrs = [];
                if ($params['buckets']['buckettotal']) {
                    foreach ($params['buckets']['buckettotal'] as $item) {
                        $addAggrs['_bucket_agg_' . $item['name']] = [$item['function'] => ['field' => $item['name'] . '.agg']];
                    }
                }

                // add the aggregates
                $searchresultsraw = $this->searchModule($module, $searchterm, $searchtags, $aggregatesFilters, $params['records'] ?: 5, $bucketitem['items'] ?: 0, $sort, array_merge($addFilters, $bucketfilters), $useWildcard, $required, true, $addAggrs);
                foreach ($searchresultsraw['hits']['hits'] as &$hit) {
                    $searchresults['hits'][] = $hit;
                }

                // loop over the aggregate keys to get the searched values
                $aggsArray = [];
                foreach (array_keys($addAggrs) as $aggregateKey) {
                    $aggsArray[$aggregateKey] = $searchresultsraw['aggregations'][$aggregateKey]['value'] ?: $searchresultsraw['aggregations'][$aggregateKey][$aggregateKey]['value'];
                }

                // update the bucket items
                $bucketitem['values'] = $aggsArray;
                $bucketitem['total'] = $this->elasticHandler->getHitsTotalValue($searchresultsraw);
                $bucketitem['items'] = $bucketitem['items'] + count($searchresultsraw['hits']['hits']);

            }

            // get the total filtered by the list of buckets and the total aggregates
            $bucketfilters = [];
            $bucketfilters[] = [
                'terms' => [
                    $params['buckets']['bucketfield'] . '.raw' => $terms
                ]
            ];
            $searchresultsraw = $this->searchModule($module, $searchterm, $searchtags, $aggregatesFilters, 0, 0, $sort, array_merge($addFilters, $bucketfilters), $useWildcard, $required);
            $searchresults['total'] = $this->elasticHandler->getHitsTotalValue($searchresultsraw);
            $searchresults['aggregations'] = $searchresultsraw['aggregations'];

            // return the upodated bnucket items
            $searchresults['buckets'] = $params['buckets'];
        } else {
            $searchresultsraw = $this->searchModule($module, $searchterm, $searchtags, $aggregatesFilters, $params['records'] ?: 5, $params['start'] ?: 0, $sort, $addFilters, $useWildcard, $required);
            $searchresults = $searchresultsraw['hits'] ? ['hits' => $searchresultsraw['hits']['hits'], 'total' => $this->elasticHandler->getHitsTotalValue($searchresultsraw)] : ['hits' => [], 'total' => 0];

            if ($searchresultsraw['error']) {
                // no error handling accepted... just trash it into some logs...
                // \SpiceCRM\includes\Logger\LoggerManager::getLogger()->fatal(json_encode($searchresultsraw['error']['root_cause']));
                //throw new Exception(json_encode($searchresultsraw['error']['root_cause']));
            }
            // add the aggregations
            $searchresults['aggregations'] = $searchresultsraw['aggregations'];
        }

        return $searchresults;
    }


    function exportGlobalSearchResults($module, $searchterm, $fields, $params, $aggregates = [], $sort = [], $required = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $searchterm = strtolower(trim((string)$searchterm));

        $exportresults = [];

        if (!SpiceACL::getInstance()->checkAccess($module, 'export', true))
            return false;

        $searchresultsraw = $this->getRawSearchResults($module, $searchterm, $params, $aggregates, 1000, 0, $sort, $required, false);

        if ($searchresultsraw['error']) {
            return $exportresults;
        }

        // get the email addresses
        $krestHandler = new ModuleHandler();
        foreach ($searchresultsraw['hits']['hits'] as &$hit) {
            $seed = BeanFactory::getBean($module, $hit['_id']);
            $exportresults[] = $krestHandler->mapBeanToArray($module, $seed);
        }

        return $exportresults;
    }

    function getRawSearchResults($module, $searchterm, $params, $aggregates = [], $size, $from, $sort = [], $required = [], $source = true)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $aggregatesFilters = [];
        foreach ($aggregates[$module] as $aggregate) {
            $aggregateDetails = explode('::', $aggregate);
            $aggregatesFilters[$aggregateDetails[0]][] = $aggregateDetails[1];
        }

        // check if we have an owner set as parameter
        $addFilters = [];
        if ($params['owner'] == 1) {
            $addFilters[] = [
                'term' => [
                    'assigned_user_id' => $current_user->id
                ]
            ];
        }

        // check for modulefilter
        if (!empty($params['modulefilter'])) {
            $sysFilter = new SysModuleFilters();
            $addFilters[] = $sysFilter->generareElasticFilterForFilterId($params['modulefilter'], $params['filtercontextbeanid']);
        }

        //check if we use a wildcard for the search
        $useWildcard = false;
        if (preg_match("/\*/", $searchterm))
            $useWildcard = true;

        $searchresultsraw = $this->searchModule($module, $searchterm, [], $aggregatesFilters, $size, $from, $sort, $addFilters, $useWildcard, $required, $source);

        return $searchresultsraw;

    }


    private
    function get_acl_fieldaccess($bean)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $aclArray = [];
        if (!$current_user->is_admin && SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'getFieldAccess')) {
            $controlArray = [];
            foreach (SpiceACL::getInstance()->getFieldAccess($bean, 'display', false) as $field => $fieldcontrol) {
                if (!isset($controlArray[$field]) || (isset($controlArray[$field]) && $fieldcontrol > $controlArray[$field]))
                    $aclArray[$field] = $fieldcontrol;
            }
            foreach (SpiceACL::getInstance()->getFieldAccess($bean, 'edit', false) as $field => $fieldcontrol) {
                if (!isset($controlArray[$field]) || (isset($controlArray[$field]) && $fieldcontrol > $controlArray[$field]))
                    $aclArray[$field] = $fieldcontrol;
            }
        }

        return $aclArray;
    }

    function indexBeans($packagesize, $toConsole = false)
    {
        $db = DBManagerFactory::getInstance();

        $beanCounter = 0;
        $beans = $db->query("SELECT * FROM sysfts");
        echo "Starting indexing (maximal $packagesize records).\n";
        while ($bean = $db->fetchByAssoc($beans)) {
            echo 'Indexing module ' . $bean['module'] . ': ';
            $seed = BeanFactory::getBean($bean['module']);

            //in case of module mispelling, no bean will be found. Catch here
            if (!$seed) {
                echo "Module not found.\n";
                continue;
            }

            $indexBeans = $db->limitQuery("SELECT id, deleted FROM " . $seed->table_name . " WHERE (deleted = 0 AND (date_indexed IS NULL  OR date_indexed < date_modified)) OR (deleted = 1 AND (date_indexed IS NOT NULL))", 0, $packagesize - $beanCounter);
            $numRows = $indexBeans->num_rows;
            $counterIndexed = $counterDeleted = 0;
            if ($toConsole) {
                echo $numRows . ' records to do.';
                if ($numRows) {
                    $numRowsLength = strlen($numRows); // determine the maximum character number of the counter
                    echo ' Finished ';
                } else echo "\n";
            }

            while ($indexBean = $db->fetchByAssoc($indexBeans)) {
                if ($toConsole) {
                    if ($counterIndexed + $counterDeleted > 0) echo str_repeat(chr(8), $numRowsLength); // delete previous counter output
                    echo sprintf("%${numRowsLength}d", $counterIndexed + $counterDeleted + 1); // output current counter
                }
                if ($indexBean['deleted'] == 0) {
                    $seed->retrieve($indexBean['id']);
                    $this->indexBean($seed);
                    $beanCounter++;
                    $counterIndexed++;
                } else {
                    $seed->retrieve($indexBean['id'], true, false);
                    $this->deleteBean($seed);
                    $beanCounter++;
                    $counterDeleted++;
                }
            }
            if ($numRows) {
                if ($toConsole) echo str_repeat(chr(8), $numRowsLength + 1) . '!'; // delete previous/last counter output
                echo " Indexed $counterIndexed, deleted $counterDeleted records.\n";
            }
            if ($beanCounter >= $packagesize) {
                echo "Indexing incomplete closed, because scheduler package size ($packagesize) exceeded. Will continue next time.\n";
                return true;
            }
        }
        echo 'Indexing finished. All done.';
    }

    /**
     *
     * @param $packagesize
     * @param null $module added for CR1000257
     * @return bool
     */
    function bulkIndexBeans($packagesize, $module = null, $toConsole = false)
    {

        $db = DBManagerFactory::getInstance();

        $beanCounter = 0;
        // BEGIN CR1000257
        $where = "";
        if (!empty($module)) {
            $where = " WHERE module='" . $module . "'";
        }
        // END
        $order = empty($module) ? ' ORDER BY module ' : '';
        $beans = $db->query("SELECT * FROM sysfts" . $where . $order);
        echo "Starting indexing (maximal $packagesize records).\n";

        $bulkCommitSize = (SpiceConfig::getInstance()->config['fts']['bulkcommitsize'] ?: 1000);
        $bulkItems = [];
        $bulkUpdates = [
            'indexed' => [],
            'deleted' => []
        ];

        while ($bean = $db->fetchByAssoc($beans)) {
            echo 'Indexing module ' . $bean['module'] . ': ';
            $seed = BeanFactory::getBean($bean['module']);

            //in case of module mispelling, no bean will be found. Catch here
            if (!$seed) {
                echo "Module not found.\n";
                continue;
            }

            $indexBeans = $db->limitQuery("SELECT id, deleted FROM " . $seed->table_name . " WHERE (deleted = 0 AND (date_indexed IS NULL OR date_indexed < date_modified)) OR (deleted = 1 AND (date_indexed IS NOT NULL ))", 0, $packagesize);
            $numRows = $indexBeans->num_rows;
            $counterIndexed = $counterDeleted = 0;
            if ($toConsole) {
                echo $numRows . ' records to do.';
                if ($numRows) {
                    $numRowsLength = strlen($numRows); // determine the maximum character number of the counter
                    echo ' Finished ';
                } else echo "\n";
            }

            while ($indexBean = $db->fetchByAssoc($indexBeans)) {
                if ($toConsole) {
                    if ($counterIndexed + $counterDeleted > 0) echo str_repeat(chr(8), $numRowsLength); // delete previous counter output
                    echo sprintf("%${numRowsLength}d", $counterIndexed + $counterDeleted + 1); // output current counter
                }
                if ($indexBean['deleted'] == 0) {
                    $seed->retrieve($indexBean['id'], false, false, false );

                    if ($this->elasticHandler->getMajorVersion() == '6') {
                        $bulkItems[] = json_encode([
                            'index' => [
                                '_index' => $this->elasticHandler->indexPrefix . strtolower($bean['module']),
                                '_type' => $bean['module'],
                                '_id' => $seed->id
                            ]
                        ]);
                    } else {
                        $bulkItems[] = json_encode([
                            'index' => [
                                '_index' => $this->elasticHandler->indexPrefix . strtolower($bean['module']),
                                '_id' => $seed->id
                            ]
                        ]);
                    }

                    $beanHandler = new SpiceFTSBeanHandler($seed);
                    $bulkItems[] = json_encode($beanHandler->normalizeBean());

                    $bulkUpdates['indexed'][] = $seed->id;

                    $beanCounter++;
                    $counterIndexed++;
                } else {
                    $seed->retrieve($indexBean['id'], true, false, false);
                    $bulkItems[] = json_encode([
                        'delete' => [
                            '_index' => $this->elasticHandler->indexPrefix . strtolower($bean['module']),
                            '_id' => $seed->id
                        ]
                    ]);

                    $bulkUpdates['deleted'][] = $seed->id;

                    $beanCounter++;
                    $counterDeleted++;
                }
                if (count($bulkItems) >= $bulkCommitSize) {
                    $indexResponse = $this->elasticHandler->bulk($bulkItems);
                    if (!$indexResponse->errors) {
                        if (count($bulkUpdates['indexed']) > 0)
                            $db->query("UPDATE " . $seed->table_name . " SET date_indexed = '" . TimeDate::getInstance()->nowDb() . "' WHERE id IN ('" . implode("','", $bulkUpdates['indexed']) . "')");

                        if (count($bulkUpdates['deleted']) > 0)
                            $db->query("UPDATE " . $seed->table_name . " SET date_indexed = NULL WHERE id IN ('" . implode("','", $bulkUpdates['deleted']) . "')");

                        $bulkUpdates = [
                            'indexed' => [],
                            'deleted' => []
                        ];
                    }
                    $bulkItems = [];
                }
            }

            if (count($bulkItems) > 0) {
                $indexResponse = $this->elasticHandler->bulk($bulkItems);
                if (!$indexResponse->errors) {
                    if (count($bulkUpdates['indexed']) > 0)
                        $db->query("UPDATE " . $seed->table_name . " SET date_indexed = '" . TimeDate::getInstance()->nowDb() . "' WHERE id IN ('" . implode("','", $bulkUpdates['indexed']) . "')");

                    if (count($bulkUpdates['deleted']) > 0)
                        $db->query("UPDATE " . $seed->table_name . " SET date_indexed = NULL WHERE id IN ('" . implode("','", $bulkUpdates['deleted']) . "')");

                    $bulkUpdates = [
                        'indexed' => [],
                        'deleted' => []
                    ];
                }
                $bulkItems = [];
            }

            if ($numRows) {
                if ($toConsole) echo str_repeat(chr(8), $numRowsLength + 1) . '!'; // delete previous/last counter output
                echo " Indexed $counterIndexed, deleted $counterDeleted records.\n";
            }
            if ($beanCounter >= $packagesize) {
                echo "Indexing incomplete closed, because scheduler package size ($packagesize) exceeded. Will continue next time.\n";
                return true;
            }
        }
        if (count($bulkItems) > 0) {
            $indexResponse = $this->elasticHandler->bulk($bulkItems);
            if (!$indexResponse->errors) {
                if (count($bulkUpdates['indexed']) > 0)
                    $db->query("UPDATE " . $seed->table_name . " SET date_indexed = '" . TimeDate::getInstance()->nowDb() . "' WHERE id IN ('" . implode("','", $bulkUpdates['indexed']) . "')");

                if (count($bulkUpdates['deleted']) > 0)
                    $db->query("UPDATE " . $seed->table_name . " SET date_indexed = NULL WHERE id IN ('" . implode("','", $bulkUpdates['deleted']) . "')");

                $bulkUpdates = [
                    'indexed' => [],
                    'deleted' => []
                ];
            }
        }
        echo 'Indexing finished. All done.';
    }


    /**
     * sets the transaciton flag and starts collectiing index and delete requests
     */
    public function startTransaction(){
        $this->inTransaction = true;
    }

    /**
     * commit Transaction, indexing the collected updates and deletes
     * execute the updates to the database
     * reset the transaction array and transaction flag
     *
     * @throws \Exception
     */
    public function commitTransaction(){
        $db = DBManagerFactory::getInstance();

        if($this->transactionEntries['elastic'] != []) {

            // add parameters if we shoudl process syncronously
            $params = [];
            if($this->transactionSyncronous){
                $params['refresh'] = 'wait_for';
            }

            // run the bulk update
            $indexResponse = $this->elasticHandler->bulk($this->transactionEntries['elastic'], $params);

            // update the database if we had a success
            if (!$indexResponse->errors) {
                foreach ($this->transactionEntries['database'] as $query) {
                    $db->query($query);
                }
            }
        }

        // reset the transaction array and flag
        $this->transactionEntries['elastic'] = [];
        $this->transactionEntries['database'] = [];
        $this->inTransaction = false;
    }

    /**
     * rolls back all changes in a transaction and stops the transaction handler
     * by simply removing all transactional entries so nothing will be processed when a commit is called
     */
    public function rollbackTransaction(){
        $this->transactionEntries['elastic'] = [];
        $this->transactionEntries['database'] = [];
        $this->inTransaction = false;
    }

    /**
     * returns the Version on the elastic cluster
     *
     * @return array|mixed
     */
    function getVersion()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->is_admin)
            return $this->elasticHandler->getVersion();
        else
            return [];
    }

    /**
     * returns the basic infor and status of the elastic engine
     *
     * @return array|bool|string
     */
    function getStatus()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->is_admin)
            return $this->elasticHandler->getStatus();
        else
            return [];
    }

    /**
     * returns the basic infor and status of the elastic engine
     *
     * @return array|bool|string
     */
    function check()
    {
        $res = $this->elasticHandler->getStatus();
        return $res != null;
    }

    /**
     * retuens the stats on the elastic cluster
     *
     * @return array|mixed
     */
    function getStats()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->is_admin)
            return $this->elasticHandler->getStats();
        else
            return [];
    }

    /**
     * returns the settings on the elastic cluster
     *
     * @return array|mixed
     */
    function getSettings()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->is_admin)
            return $this->elasticHandler->getSettings();
        else
            return [];
    }

    /**
     * returns the settings on the elastic cluster
     *
     * @return array|mixed
     */
    function unblock()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->is_admin)
            return $this->elasticHandler->unblock();
        else
            return [];
    }

    /**
     * returns all fields for a given module to be used in the selection tree
     *
     * @param $module
     * @return array
     */
    function getFTSModuleFields($module)
    {
        $returnArray = [];
        if ($module != '' && $module != 'undefined') {
            $nodeModule = BeanFactory::getBean($module);
            foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
                if ($field_defs['type'] != 'link') {
                    $returnArray[] = [
                        'id' => 'field:' . $field_defs['name'],
                        'name' => $field_defs['name'],
                        // in case of a kreporter field return the report_data_type so operators ar processed properly
                        // 2011-05-31 changed to kreporttype returned if fieldttype is kreporter
                        // 2011-10-15 if the kreporttype is set return it
                        //'type' => ($field_defs['type'] == 'kreporter') ? $field_defs['kreporttype'] :  $field_defs['type'],
                        'type' => $field_defs['type'],
                        'text' => (translate($field_defs['vname'], $module) != '') ? translate($field_defs['vname'], $module) : $field_defs['name'],
                        'leaf' => true,
                        'options' => $field_defs['options'],
                        'label' => $field_defs['vname']
                    ];
                }
            }
        }

        usort($returnArray, "arraySortByName");
        return $returnArray;
    }
}
