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

namespace SpiceCRM\KREST\handlers;

use LanguageManager;
use NoteSoap;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceFTSManager\ElasticHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSBeanHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\includes\UploadFile;
use SpiceCRM\includes\TimeDate;

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 *
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 *
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\ConflictException;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\Trackers\Tracker;
use SpiceCRM\modules\Trackers\TrackerManager;
use SpiceCRM\includes\authentication\AuthenticationController;
use stdClass;
use SpiceCRM\modules\UserPreferences\UserPreference;

class ModuleHandler
{

    var $app = null;
    var $sessionId = null;
    var $requestParams = [];
    var $excludeAuthentication = [];
    var $spiceFavoritesClass = null;

    public function __construct($app = null)
    {
        $this->app = $app;

    }

    protected function _trackAction(string $action, string $module, SugarBean $bean): void {
        $action = strtolower($action);
        //Skip save, tracked in SugarBean instead
        if ($action == 'save') {
            return;
        }

        $tracker = BeanFactory::getBean('Trackers');
        $tracker->monitor_id = SpiceUtils::createGuid();
        $tracker->user_id = AuthenticationController::getInstance()->getCurrentUser()->id;
        $tracker->module_name = $module;
        $tracker->action = $action;
        $tracker->date_modified = TimeDate::getInstance()->nowDb();
        $tracker->visible = (($action == 'detailview') || ($action == 'editview')) ? 1 : 0;
        $tracker->item_id = $bean->id;
        $tracker->item_summary = $bean->get_summary_text();
        $tracker->session_id = session_id();
        $tracker->save();
    }

    public function get_mod_language($modules, $lang)
    {
        $modLang = [];

        foreach ($modules as $module)
            $modLang[$module] = return_module_language($lang, $module, true);

        return $modLang;
    }

    public function get_dynamic_domains($modules, $language)
    {

        global $dictionary;

        $dynamicDomains = [];

        foreach ($modules as $module) {

            $thisBean = BeanFactory::getBean($module);
            if ($thisBean) {
                $fieldDefs = $thisBean->getFieldDefinitions();

                //$domainFunctions = array_map(function($fieldDef) { return isset($fieldDef['spice_domain_function']) ? $fieldDef['spice_domain_function'] : [];} , $dictionary[$beanList[$module]]['fields']);
                $fieldDefsWithDomainFunction = array_filter($fieldDefs, function ($fieldDef) {
                    return isset($fieldDef['spice_domain_function']);
                });

                foreach ($fieldDefsWithDomainFunction as $fieldDef) {
                    $functionName = is_array($fieldDef['spice_domain_function']) ? $fieldDef['spice_domain_function']['name'] : $fieldDef['spice_domain_function'];
                    $domainKey = 'spice_domain_function_' . strtolower($functionName) . '_dom';
                    $dynamicDomains[$domainKey] = $this->processSpiceDomainFunction($thisBean, $fieldDef, $language);
                }
            }
        }

        return $dynamicDomains;
    }


    public function get_bean_list($beanModule, $searchParams, $addwhere = "")
    {
        $timedate = TimeDate::getInstance();
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        // acl check if user can list
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'list', true))
            throw (new ForbiddenException("Forbidden to list in module $beanModule."))->setErrorCode('noModuleList');

        // check if the bean can be instantiated
        $thisBean = BeanFactory::getBean($beanModule);
        if (!$thisBean)
            throw new NotFoundException("No Bean found for $beanModule!");

        // prepare the returning array for the beans
        $beanData = [];

        if (!empty($searchParams['listid']) && $searchParams['listid'] != 'owner' && $searchParams['listid'] != 'all') {
            // get the list defs
            $listDef = $db->fetchByAssoc($db->query("SELECT * FROM sysmodulelists WHERE id = '{$searchParams['listid']}'"));
            // set the last used date
            $db->query("UPDATE sysmodulelists SET date_last_used='{$timedate->nowDb()}' WHERE id = '{$searchParams['listid']}'");
        }

        if ($searchParams['limit'] == -99 or $searchParams['limit'] === 'all') {
            $searchParams['limit'] = SpiceConfig::getInstance()->config['getAllLimit'] ?: 10000;
        }

        $searchParams['start'] = $searchParams['offset']; // Temporary workaround because GET parameter "start" AND "offset" is used.

        // check if we have an ft config

        if (@$searchParams['source'] !== 'db'
            and SpiceFTSHandler::getInstance()->checkModule($beanModule, true)
            and SpiceFTSHandler::getInstance()->checkFilterDefs($beanModule, json_decode(html_entity_decode($listDef['filterdefs'])))
            and SpiceFTSHandler::getInstance()->checkFilterDefs($beanModule, json_decode(html_entity_decode($searchParams['filter'])))
        ) {
            //  $results = SpiceFTSHandler::getInstance()->getGlobalSearchResults([$beanModule], $searchParams['searchterm'])
            $searchParams['records'] = $searchParams['limit'];
            $result = SpiceFTSHandler::getInstance()
                ->getModuleSearchResults(
                    $beanModule,
                    $searchParams['searchterm'],
                    json_decode($searchParams['searchtags']),
                    $searchParams,
                    json_decode(html_entity_decode($searchParams['aggregates']), true),
                    json_decode($searchParams['sortfields'], true)
                        ?: []);
            $totalcount = $result['total'];
            foreach ($result['hits'] as $hit) {
                // load the Bean
                $thisBean = BeanFactory::getBean($beanModule, $hit['_id'], ['encode' => false, 'forceRetrieve' => true]);

                // if we had an error retrieving continue
                // but reduce the totalcount by one so in case this is a limited list there is no attempt to load more
                if (!$thisBean) {
                    $totalcount--;
                    continue;
                }

                // get the list details
                $thisBean->retrieveListDetails();

                // map and add to the array
                $beanData[] = $this->mapBeanToArray($beanModule, $thisBean, false);
            }
            $retArray['aggregations'] = $result['aggregations'];
            $retArray['buckets'] = $result['buckets'];
            $retArray['source'] = 'fts';
        } else {

            $listData = $this->getBeanDBList($beanModule, $thisBean, $listDef, $searchParams);

            $beanData = $listData['beanData'];
            $totalcount = $listData['totalCount'];

            $retArray['buckets'] = $listData['buckets'];
            $retArray['source'] = 'db';
        }

        $retArray['totalcount'] = $totalcount;
        $retArray['list'] = $beanData;

        return $retArray;
    }


    /**
     * prepares the query for the Database Search
     *
     * @param $beanModule
     * @param $thisBean
     * @param $listDef
     * @param $searchParams
     * @return array
     */
    public function prepareBeanDBListQuery($beanModule, $thisBean, $listDef, $searchParams)
    {
        global $dictionary;
        // BWC: reduce number of fields and related tables to search on
        $create_new_list_query_filter = [];

        // initialize the where Clauses
        $whereClauses = [];

        // build the where clause if searchterm is specified
        if (!empty($searchParams['searchterm'])) {
            $searchtermArray = explode(' ', $searchParams['searchterm']);
            foreach ($searchtermArray as $thisSearchterm) {
                $searchTerms = [];
                $searchTermFields = $searchParams['searchtermfields'] ? json_decode(html_entity_decode($searchParams['searchtermfields']), true) : [];

                // if no serachterm field has been sent .. use the unified search fields
                if (count($searchTermFields) == 0) {
                    foreach ($thisBean->field_name_map as $fieldname => $fielddata) {
                        if ($fielddata['unified_search']) {
                            $searchTermFields[] = $fieldname;
                        }
                    }
                }

                if ($searchTermFields) {
                    foreach ($searchTermFields as $fieldName) {
                        switch ($thisBean->field_name_map[$fieldName]['type']) {
                            case 'relate':
                                $searchTerms[] = ($thisBean->field_name_map[$fieldName]['join_name'] ?: $thisBean->field_name_map[$fieldName]['table']) . '.' . $thisBean->field_name_map[$fieldName]['rname'] . ' like \'%' . $thisSearchterm . '%\'';
                                break;
                            case 'link':
                                break;
                            default:
                                $searchTerms[] = $thisBean->table_name . '.' . $fieldName . ' like \'%' . $thisSearchterm . '%\'';
                                break;
                        }

                        // BWC: reduce number of fields and related tables to search on: those meant for unified search will do.
                        if ($thisBean->field_name_map[$fieldName]['unified_search']) {
                            $create_new_list_query_filter[$fieldName] = true;
                        }
                    }
                } else {
                    foreach ($thisBean->field_defs as $fieldName => $fieldData) {
                        if ($fieldData['unified_search'] && $fieldData['source'] != 'non-db')
                            $searchTerms[] = $thisBean->table_name . '.' . $fieldName . ' like \'%' . $thisSearchterm . '%\'';
                    }
                }

                if (count($searchTerms) > 0) {
                    $whereClauses[] = '(' . implode(' OR ', $searchTerms) . ')';
                }
            }
        }

        // get the index settings
        $settings = SpiceFTSUtils::getBeanIndexSettings($beanModule);
        // check for geotags
        if ($searchParams['searchgeo'] && $settings['geosearch']) {
            $searchParams['searchgeo'] = json_decode($searchParams['searchgeo']);
            $geoCondition = "(6371*acos(cos(radians( {$searchParams['searchgeo']->lat}))*cos(radians({$thisBean->table_name}.{$settings['geolat']}))*cos(radians({$thisBean->table_name}.{$settings['geolng']})-radians({$searchParams['searchgeo']->lng}))+sin(radians({$searchParams['searchgeo']->lat}))*sin(radians({$thisBean->table_name}.{$settings['geolat']})))) < {$searchParams['searchgeo']->radius}";
            $whereClauses[] = "({$geoCondition})";
        }


        if (!empty($searchParams['relatefilter'])) {
            $relateFilter = json_decode($searchParams['relatefilter']);
            $relateSeed = BeanFactory::getBean($relateFilter->module, $relateFilter->id);
            $relateSeed->load_relationship($relateFilter->relationship);
            $relatedBeans = $relateSeed->get_linked_beans($relateFilter->relationship, $relateSeed->field_name_map[$relateFilter->relationship]['module'], [], 0, -99);

            // if we found none return false
            if (count($relatedBeans) == 0) return false;

            $relatedids = [];
            foreach ($relatedBeans as $relatedBean) {
                $relatedids[] = $relatedBean->id;
            }
            $addFilters[] = ["terms" => ["id" => $relatedids]];
            $whereClauses[] = "({$thisBean->table_name}.id IN ('" . implode("','", $relatedids) . "'))";
        }


        $moduleFilter = new SysModuleFilters();
        $moduleFilter->filtermodule = $beanModule;
        if (!empty($searchParams['filter'])) {
            $listWhereClause = $moduleFilter->buildSQLWhereClauseForGroup(json_decode(html_entity_decode($searchParams['filter'])), $thisBean->table_name, $beanModule);
            if ($listWhereClause) {
                $whereClauses[] = '(' . $listWhereClause . ')';
            }
        }

        // handle the listid
        if (!empty($searchParams['listid'])) {
            switch ($searchParams['listid']) {
                case 'all':
                    // do nothing
                    break;
                case 'owner':
                    $searchParams['owner'] = true;
                    break;
                default:
                    $filterdefs = json_decode(html_entity_decode($listDef['filterdefs']));
                    if ($filterdefs) {

                        $listWhereClause = $moduleFilter->buildSQLWhereClauseForGroup($filterdefs, $thisBean->table_name, $beanModule);
                        if ($listWhereClause) {
                            $whereClauses[] = '(' . $listWhereClause . ')';
                        }
                    }
                    break;
            }
        }

        if (!empty($searchParams['modulefilter'])) {
            $filterWhere = $moduleFilter->generateWhereClauseForFilterId($searchParams['modulefilter']);
            if ($filterWhere) {
                $whereClauses[] = '(' . $filterWhere . ')';
            }
        }

        $addJoins = '';

        //  add a sort criteria
        if (!empty($searchParams['sortfield'])) {
            if (!json_decode(html_entity_decode($searchParams['sortfield']))) {

                $sortfield = '';
                # Andreas Glöckl, 2018-08-22.
                # In case of a non-db field:
                # It can´t be used in the db request, so "sort_on" (and optional "sort_on2") should have been defined in vardefs.
                # The field name(s) in "sort_on" (and "sort_on2") are used instead. They are real/existing db fields.
                # Better would be an array ( "sort_fields"=>array("nameOfField1","nameOfField2",...) ), but "sort_on"/"sort_on2" is already implemented and used elsewhere, so I use it here.
                if (isset($dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on'][0]))
                    $sortfield = $dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on'];
                if (isset($dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on2'][0]))
                    $sortfield .= ', ' . $dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on2'];
                if (!isset($sortfield[0])) $sortfield = $searchParams['sortfield'];

                $searchParams['orderby'] = $sortfield . ' ' . ($searchParams['sortdirection'] ? strtoupper($searchParams['sortdirection']) : 'ASC');

            } else {
                $sortObject = json_decode(html_entity_decode($searchParams['sortfield']));
                $searchParams['orderby'] = ($searchParams['sortdirection'] ? strtoupper($searchParams['sortdirection']) : 'ASC');
            }
        } else if (!empty($searchParams['sortfields'])) {
            $orderbys = [];
            $sortFields = json_decode(html_entity_decode($searchParams['sortfields']), true);
            foreach ($sortFields as $sortField) {
                $sf = $sortField['sortfield'];
                if (isset($dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on'][0]))
                    $sf = $dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on'];
                if (isset($dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on2'][0]))
                    $sf .= ', ' . $dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on2'];

                $orderbys[] = $sf . ' ' . ($sortField['sortdirection'] ? strtoupper($sortField['sortdirection']) : 'ASC');
            }
            $searchParams['orderby'] = implode(', ', $orderbys);
        }


        // $beanList = $thisBean->get_list($searchParams['orderby'], $searchParams['whereclause'], $searchParams['offset'], $searchParams['limit']);
        $queryArray = $thisBean->create_new_list_query($searchParams['orderby'], implode(' AND ', $whereClauses), $create_new_list_query_filter, [], false, '', true, $thisBean, true);

        // any additional joins we might have gotten
        $queryArray['from'] .= ' ' . $addJoins;
        $queryArray['secondary_from'] .= ' ' . $addJoins;

        // build the query
        return ['query' => $queryArray['select'] . $queryArray['from'] . $queryArray['where'] . $queryArray['order_by'], 'addjoins' => $addJoins, 'whereclauses' => $whereClauses];
    }

    /**
     * loads the list from the Database
     *
     * @param $thisBean
     * @param $listDef
     * @param $searchParams
     */
    private function getBeanDBList($beanModule, $thisBean, $listDef, $searchParams)
    {
        global $dictionary;

        $totalcount = 0;
        $beanData = [];
        $whereClauses = [];

        // process the query
        if (empty($searchParams['start']))
            $searchParams['start'] = 0;

        if (empty($searchParams['limit']))
            $searchParams['limit'] = SpiceConfig::getInstance()->config['list_max_entries_per_page'] ?: 25;


        $queryResult = $this->prepareBeanDBListQuery($beanModule, $thisBean, $listDef, $searchParams);

        // if no query is returned return empty
        if ($queryResult === false) {
            return ['beanData' => [], 'totalCount' => 0, 'buckets' => $searchParams['buckets'] ?: []];
        }

        $query = $queryResult['query'];
        $addJoins = $queryResult['addjoins'];


        $searchParams['buckets'] = json_decode($searchParams['buckets'], true);
        if ($searchParams['buckets'] && count($searchParams['buckets']) > 0) {

            foreach ($searchParams['buckets']['bucketitems'] as &$bucketitem) {
                $bucketWhere = ["{$thisBean->table_name}.{$searchParams['buckets']['bucketfield']} = '{$bucketitem['bucket']}'"];

                // build a query for the bucket
                $bQueryArray = $thisBean->create_new_list_query($searchParams['orderby'], implode(' AND ', array_merge($queryResult['whereclauses'], $bucketWhere)), [], [], false, '', true, $thisBean, true);
                // any additional joins we might have gotten
                $bQueryArray['from'] .= ' ' . $addJoins;
                $bQueryArray['secondary_from'] .= ' ' . $addJoins;
                // build the query
                $query = $bQueryArray['select'] . $bQueryArray['from'] . $bQueryArray['where'] . $bQueryArray['order_by'];

                $beanList = $thisBean->process_list_query($query, $bucketitem['items'] ?: 0, $searchParams['limit'], $searchParams['limit']);

                foreach ($beanList['list'] as $thisBean) {
                    // retrieve the bean
                    $thisBean->retrieve();

                    // retrieve the additonal list details
                    $thisBean->retrieveListDetails();

                    // map and add to the array
                    $beanData[] = $this->mapBeanToArray($beanModule, $thisBean, false);
                }

                $bucketitem['items'] = $bucketitem['items'] + count($beanList['list']);

                $count_query = $thisBean->create_list_count_query($query);
                if (!empty($count_query)) {
                    // add a sum query to the copunt query
                    if ($searchParams['buckets']['buckettotal']) {
                        $count_query = str_replace("count(*) c", "count(*) c, sum({$thisBean->table_name}.{$searchParams['buckets']['buckettotal'][0]['name']}) total", $count_query);
                    }
                    // We have a count query.  Run it and get the results.
                    $result = $thisBean->db->query($count_query);
                    $assoc = $thisBean->db->fetchByAssoc($result);
                    if (isset($assoc['c'])) {
                        $bucketitem['total'] = (int)$assoc['c'];
                        $bucketitem['value'] = (double)$assoc['total'] ?: 0;
                        $bucketitem['values']['_bucket_agg_' . $searchParams['buckets']['buckettotal'][0]['name']] = (double)$assoc['total'] ?: 0;
                        $totalcount += $assoc['c'];
                    }
                }
            }

        } else {

            $beanList = $thisBean->process_list_query($query, $searchParams['start'], $searchParams['limit'], $searchParams['limit']);

            foreach ($beanList['list'] as $thisBean) {
                // retrieve the bean
                $thisBean->retrieve();

                // retrieve the additonal list details
                $thisBean->retrieveListDetails();

                $beanData[] = $this->mapBeanToArray($beanModule, $thisBean, false);
            }

            // get the count

            if ((isset($searchParams['count']) && $searchParams['count'] === true) || (!isset($searchParams['count']) && !SpiceConfig::getInstance()->config['disable_count_query'])) {
                $count_query = $thisBean->create_list_count_query($query);
                if (!empty($count_query)) {
                    // We have a count query.  Run it and get the results.
                    $result = $thisBean->db->query($count_query);
                    $assoc = $thisBean->db->fetchByAssoc($result);
                    if (!empty($assoc['c'])) {
                        $totalcount = $assoc['c'];
                    }
                }
            }

        }


        // ToDo: handle buckets in SQL query
        /*
        $searchParams['buckets'] = json_decode($searchParams['buckets'], true);
        if (count($searchParams['buckets']) > 0) {
            $aggregate_query = $thisBean->create_list_aggregate_query($query, $searchParams['buckets']['bucketfield'], 'SUM');
            if (!empty($aggregate_query)) {
                // We have a count query.  Run it and get the results.
                $aggregates = $thisBean->db->query($aggregate_query);
                $assoc = $thisBean->db->fetchByAssoc($aggregates);

            }
        }
        */

        return ['beanData' => $beanData, 'totalCount' => $totalcount, 'buckets' => $searchParams['buckets'] ?: []];
    }

    public function export_bean_list($beanModule, $searchParams)
    {
        global $dictionary, $app_list_strings, $current_language, $timedate;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $app_list_strings = return_app_list_strings_language($current_language);

        // whitelist currencies modules
        $aclWhitelist = [
            'Currencies'
        ];

        // acl check if user can list
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'export', true) && !in_array($beanModule, $aclWhitelist))
            throw (new ForbiddenException("Forbidden to export module $beanModule."))->setErrorCode('noModuleList');

        $thisBean = BeanFactory::getBean($beanModule);

        if (!empty($searchParams['listid']) && $searchParams['listid'] != 'owner' && $searchParams['listid'] != 'all') {
            // get the list defs
            $listDef = $db->fetchByAssoc($db->query("SELECT * FROM sysmodulelists WHERE id = '{$searchParams['listid']}'"));
            // set the last used date
            $db->query("UPDATE sysmodulelists SET date_last_used='{$timedate->nowDb()}' WHERE id = '{$searchParams['listid']}'");
        }

        //var_dump($searchParams['fields'], html_entity_decode($searchParams['fields']));
        if ($searchParams['fields'] == '*') {
            // get all fields...
            $returnFields = [];
            foreach ($thisBean->field_name_map as $field) {
                $returnFields[] = $field['name'];
            }
        } elseif (is_array($searchParams['fields'])) {
            $returnFields = $searchParams['fields'];
        } elseif (is_array(json_decode(html_entity_decode($searchParams['fields']), true))) {
            $returnFields = json_decode(html_entity_decode($searchParams['fields']), true);
        }

        // set filter fields for the bean query
        $filterFields = [];
        foreach ($returnFields as $returnField) {
            $filterFields[$returnField] = true;
        }

        // the list of beans
        $beans = [];

        // determine if we have selected ids to export or we export all
        if (isset($searchParams['ids']) && count($searchParams['ids']) > 0) {

            $searchParams['whereclause'] = "$thisBean->table_name.id in ('" . join("','", $searchParams['ids']) . "')";

            $queryArray = $thisBean->create_new_list_query($searchParams['orderby'], $searchParams['whereclause'], $filterFields, [], false, '', true, $thisBean, true);

            // build the query
            $query = $queryArray['select'] . $queryArray['from'] . $queryArray['where'] . $queryArray['order_by'];
            $beanList = $thisBean->process_list_query($query, 0, 1000, 1000);
            foreach ($beanList['list'] as $thisBean) {
                // retrieve the bean to get the full fields
                $beans[] = $thisBean->retrieve();
            }
        } else {

            // check if we have an ft config

            if (@$searchParams['source'] !== 'db' and SpiceFTSHandler::getInstance()->checkModule($beanModule, true) and SpiceFTSHandler::getInstance()->checkFilterDefs($beanModule, json_decode(html_entity_decode($listDef['filterdefs']))) and SpiceFTSHandler::getInstance()->checkFilterDefs($beanModule, json_decode(html_entity_decode($searchParams['filter'])))) {
                //  $results = SpiceFTSHandler::getInstance()->getGlobalSearchResults([$beanModule], $searchParams['searchterm'])
                $searchParams['records'] = SpiceConfig::getInstance()->config['getAllLimit'] ?: 10000;
                $result = SpiceFTSHandler::getInstance()->getModuleSearchResults($beanModule, $searchParams['searchterm'], json_decode($searchParams['searchtags']), $searchParams, json_decode(html_entity_decode($searchParams['aggregates']), true), json_decode($searchParams['sortfields'], true) ?: []);
                foreach ($result['hits'] as $hit) {
                    $thisBean = BeanFactory::getBean($beanModule, $hit['_id']);
                    if (!$thisBean) continue;
                    $beans[] = $thisBean;
                }
            } else {

                $queryResult = $this->prepareBeanDBListQuery($beanModule, $thisBean, $listDef, $searchParams);
                if ($queryResult !== false) {
                    $query = $queryResult['query'];
                    $addJoins = $queryResult['addjoins'];
                    $beanList = $thisBean->process_list_query($query, 0, -99);
                    foreach ($beanList['list'] as $thisBean) {
                        // retrieve the bean to get the full fields
                        $beans[] = $thisBean->retrieve();
                    }
                }
            }
        }

        // determine the delimiter
        $delimiter = UserPreference::getDefaultPreference('export_delimiter') ?: ';';
        if (!empty(AuthenticationController::getInstance()->getCurrentUser()->getPreference('export_delimiter'))) $delimiter = AuthenticationController::getInstance()->getCurrentUser()->getPreference('export_delimiter');

        // determine the charset
        $supportedCharsets = mb_list_encodings();
        $charsetTo = UserPreference::getDefaultPreference('default_charset');
        if (!empty($postBody['charset'])) {
            if (in_array($postBody['charset'], $supportedCharsets)) $charsetTo = $postBody['charset'];
        } else {
            if (in_array(AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_export_charset'), $supportedCharsets)) $charsetTo = AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_export_charset');
        }

        // prepare the output
        $fh = fopen('php://temp', 'rw');
        fputcsv($fh, $returnFields, $delimiter);
        foreach ($beans as $thisBean) {
            $entryArray = [];
            foreach ($returnFields as $returnField)
                $entryArray[] = !empty($charsetTo) ? mb_convert_encoding($thisBean->$returnField, $charsetTo) : $thisBean->$returnField;
            fputcsv($fh, $entryArray, $delimiter);
        }
        rewind($fh);
        $csv = stream_get_contents($fh);
        fclose($fh);

        return ['charset' => $charsetTo , 'csv' => $csv];
    }

    public function merge_bean($beanModule, $beanId, $requestParams)
    {
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'delete', true))
            throw (new ForbiddenException("Forbidden to delete in module $beanModule."))->setErrorCode('noModuleDelete');

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        $thisBean->merge($requestParams);

    }

    public function get_bean_detail($beanModule, $beanId, $requestParams)
    {
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');

        $thisBean = BeanFactory::getBean($beanModule, $beanId, ['encode' => false]); //set encode to false to avoid things like ' being translated to &#039;
        if (!$thisBean) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        if (!$thisBean->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        // load the view details
        $thisBean->retrieveViewDetails();

        if ($requestParams['trackaction']) {
            $this->_trackAction($requestParams['trackaction'], $beanModule, $thisBean);
        }

        $includeReminder = $requestParams['includeReminder'] ? true : false;
        $includeNotes = $requestParams['includeNotes'] ? true : false;

        return $this->mapBeanToArray($beanModule, $thisBean);

    }

    public static function get_module_records_timeline($parentid, $findEnd, $startDate, $endDate = '', $searchterm = '', $own = '', $objects = []): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // gets the modules we have to search in for records
        $modules = SpiceFTSUtils::getTimelineModules();
        $moduleQueries = [];
        $queryModules = [];
        $totalCount = 0;
        $postFilters = [];
        if(array_search_insensitive('Modules', $objects) !== false) $objects = [];

        // all modules that potentially could be listed
        $candidateModules = [];

        // create an instance of the elastichandler
        $elastichandler = new ElasticHandler();



        foreach ($modules as $module => $moduleDetails) {


            // check acl access for the user as well as if a filter object is set
            //if(!SpiceACL::getInstance()->checkACLAccess($module, 'list') || ($objects && count($objects) > 0 && array_search_insensitive($module, $objects) === false)){
            if (!SpiceACL::getInstance()->checkAccess($module, 'list') || !$elastichandler->checkIndex($module)) {
                continue;
            }

            $candidateModules[] = $module;

            // if access is granted build the module query
            $beanHandler = new SpiceFTSBeanHandler($module);
            $moduleQuery = $beanHandler->getModuleSearchQuery($searchterm);

            $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["_index" => SpiceFTSUtils::getIndexNameForModule($module)]];
            $moduleQuery['bool']['filter']['bool']['must'][] = ['match' => ["_activityparentids" => $parentid]];


            // builds a query to get the whole amount of module records which we can access
            if($findEnd) {
                $EndQuery = $moduleQuery;
                $EndQuery['bool']['filter']['bool']['must'][] = ['range' => ['_activitydate' => ['lt' => $startDate]]];
                $CountQueries[] = $EndQuery;
            }


            // build the module query depending on the given end Date
            if($endDate !== '') {
                $moduleQuery['bool']['filter']['bool']['must'][] = ['range' => ['_activitydate' => ['gte' => $endDate, 'lt' => $startDate]]];
            } else {
                $moduleQuery['bool']['filter']['bool']['must'][] = ['range' => ['_activitydate' => ['lt' => $startDate]]];
            }

            switch ($own) {
                case 'assigned':
                    $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["assigned_user_id" => $current_user->id]];
                    break;
                case 'created':
                    $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["created_by" => $current_user->id]];
                    break;
            }

            $moduleQueries[] = $moduleQuery;

            // collect all modules we should query for building the search URL listing the indexes
            $queryModules[] = SpiceFTSUtils::getIndexNameForModule($module);


            if ($objects && count($objects) > 0 && array_search_insensitive($module, $objects) === false) {
                $postFilters[] = [
                    'term' => ['_index' => SpiceFTSUtils::getIndexNameForModule($module)]
                ];
            }
        }

        // if we do not have any modules to query - return an empty response
        if(count($moduleQueries) === 0) {
            return ['records' => [], 'totalCount' => 0, 'TimelineModules' => []];
        }

        // main query
        $query = [
            "size" => 24,
            "query" => [
                'bool' => [
                    'should' => $moduleQueries
                ]
            ],
            "sort" => [['_activitydate' => ['order' => 'desc']]]
        ];

        if (count($postFilters) > 0) {
            $query['post_filter'] = [
                "bool" => [
                    "must_not" => $postFilters
                ]
            ];
        }

        // to get the number of module records we can load
        if($findEnd) {
            $countQuery = [
                "size" => 0,
                "query" => [
                    'bool' => [
                        'should' => $CountQueries
                    ]
                ]
            ];
            if (count($postFilters) > 0) {
                $countQuery['post_filter'] = [
                    "bool" => [
                        "must_not" => $postFilters
                    ]
                ];
            }
            $totalCount = $elastichandler->getHitsTotalValue(json_decode($elastichandler->query('POST', join(',', $queryModules) . '/_search', null, $countQuery), true));
        }

        $results = json_decode($elastichandler->query('POST', join(',', $queryModules) . '/_search', null, $query), true);


        // gets the found records
        $items = [];


        foreach ($results['hits']['hits'] as &$hit) {
            if(!$seed = BeanFactory::getBean($elastichandler->getHitModule($hit), $hit['_id'])){
                LoggerManager::getLogger()->fatal(__CLASS__. 'on line '.__LINE__.': no '.$elastichandler->getHitModule($hit).' found with id='.$hit['_id'].'. Check if bean is indexed properly');
                LoggerManager::getLogger()->fatal($hit);
                continue;
            }

            // get the email addresses
            $krestHandler = new ModuleHandler();

            $items[] = [
                'id' => $seed->id,
                'module' => $elastichandler->getHitModule($hit),
                'date' => $hit['_source']['_activitydate'],
                'related_ids' => $hit['_source']['related_ids'],
                'record_Type' => 'module',
                'data' => $krestHandler->mapBeanToArray($elastichandler->getHitModule($hit), $seed, false)
            ];
        }

        $recordSearch = !$findEnd || $totalCount !== 0;
        $counts = ['modulesTook' => count($items), 'totalModules' => $totalCount, 'auditsTook' => 0, 'totalAudits' => 0];

        return ['records' => $items, 'counts' => $counts, 'TimelineModules' => $candidateModules, 'moduleSearch' => $recordSearch, 'auditSearch' => false];
    }

    public function get_timeline_records($beanModule, $beanId, $body): array
    {
        // get all essential params
        $startDate = $body['startDate'];
        $endDate = $body['endDate'];
        $moduleSearch = $body['moduleSearch'];
        $auditSearch = $body['auditSearch'];
        $searchterm = $body['searchTerm'];
        $own = $body['own'];
        $objects = json_decode($body['objects']);
        $timeRangeStart = $body['timeRangeStart'];
        $findEnd = false;


        // check if we cann access an audit_log
        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        $isAudit = $thisBean->is_AuditEnabled();

        $timelineModules = [];


        foreach (SpiceFTSUtils::getTimelineModules() as $module => $moduleDetails) {
            $timelineModules[] = $module;
        }
        $modules = $isAudit? array_merge(['auditLog'], $timelineModules) : $timelineModules;

        // checks if we have a startDate
        if (!$startDate)
        {
            $findEnd = true;
            $startDate = date("Y-m-d H:i:s");
        }

        if($startDate === $timeRangeStart) {
            $findEnd = true;
        }

        // returns if searching for module and audit records is deactivated
        if(!$moduleSearch && (!$auditSearch || !$isAudit || $own === 'assigned'))
        {
            $data = ['counts' => ['totalModules' => 0, 'modulesTook' => 0, 'totalAudits' => 0, 'auditsTook' => 0], 'endDate' => $endDate, 'records' => []];
            $moduleSearch = false;
            $auditSearch = false;
            $point = 5;
        }

        // handles the search process if searching for module records is deactivated
        elseif((count($objects) === 1 && $objects[0] === 'auditLog'))
        {
            // collecting necessary data for the further search process
            $moduleSearch = false;
            $auditSearch = true;
            $point = 7;

        }

        // handles the search process if searching for audit records is not allowed or deactivated
        elseif(!$isAudit || $searchterm !== '' || $own === 'assigned' ||
            (count($objects) >= 1 && array_search_insensitive('auditLog', $objects) === false))
        {
            // collecting necessary data for the further search process
            $moduleSearch = true;
            $auditSearch = false;
            $point = 7;
        }

        if($moduleSearch && $auditSearch) {
            $auditOverview = self::get_auditlog_for_timeline($beanModule, $beanId, false, $startDate, '', $own, true);
            $auditSearch = $auditOverview['auditSearch'];
            $endDate = $auditOverview['endDate'];
        }

        if($moduleSearch) {
            $data = self::get_module_records_timeline($beanId, $findEnd, $startDate, $endDate, $searchterm, $own, $objects);
            if($data['counts']['modulesTook'] > 24) $endDate = end($data['records'])['date'];
            $moduleData = $data;
            $moduleSearch = $data['moduleSearch'];
        }

        if($auditSearch) {
            $endDate = $moduleSearch? $endDate : '';
            $data = self::get_auditlog_for_timeline($beanModule, $beanId, $findEnd, $startDate, $endDate, $own);

            $auditData = $data;
        }

        if($auditSearch && $moduleSearch) {
            $data = self::get_records_merged_for_timeline($moduleData, $auditData);
            $point = 1;
        }

        $endDate = !end($data['records'])['date']? '' : end($data['records'])['date'];
        $records = self::add_Date_Dividers($data['records'], $startDate, $findEnd);
        $counts = $data['counts'];

        return ['point' => $point, 'records' => $records, 'moduleSearch' => $moduleSearch, 'auditSearch' => $auditSearch, 'endDate' => $endDate, 'counts' => $counts, 'timelineModules' => $modules];
    }



    public function get_records_merged_for_timeline($moduleData, $auditData): array
    {
        $records = array_merge($moduleData['records'], $auditData['records']);

        // sorts the records by date
        usort($records, function($element1, $element2) {

            $v1 = strtotime($element1['date']);

            $v2 = strtotime($element2['date']);

            return $v2 - $v1;
        });

        $counts = ['totalModules' => $moduleData['counts']['totalModules'], 'modulesTook' => $moduleData['counts']['modulesTook'], 'totalAudits' => $auditData['counts']['totalAudits'],'auditsTook' => $auditData['counts']['auditsTook']];

        return ['records' => $records, 'counts' => $counts];
    }

    public function add_Date_Dividers($records, $startDate, $findEnd)
    {
        $dates = [];
        $lastDates = [];
        $lastDate = '';

        foreach($records as $recordIndex => $record) {

            if(!$lastDate) $lastDate = date('Y-m', strtotime($startDate));


            $date = date('Y-m', strtotime($record['date']));

            if($findEnd && $recordIndex === 0) $lastDate = '0';
            elseif ($date !== $lastDate) {
                $records[intval($recordIndex)]['divider'] = $date;
            }
            $lastDates[] = $lastDate;
            $dates[] = $date;
            $lastDate = $date;

        }

        return $records;
    }


    public function get_auditlog_for_timeline($beanModule, $beanId, $findEnd = false, $startDate = null, $endDate = '', $own = '', $count = false)
    {

        $db = DBManagerFactory::getInstance();

        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');


        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if (!isset($thisBean->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        $currentUser = AuthenticationController::getInstance()->getCurrentUser()->id;
        $totalCount = 0;

        // define the querries
        if($own === 'created' || $own === 'assigned') {
            $CQuery = "SELECT b.id, DATE_FORMAT(b.date_created, '%Y-%m') dateCreatedMonth, b.date_created dateCreatedExact, COUNT(b.trans_id) id_count FROM (SELECT a.id, a.transaction_id trans_id, a.date_created FROM " . $thisBean->get_audit_table_name() . " a WHERE a.created_by = '$currentUser' AND a.parent_id = '$beanId' AND a.date_created < '$startDate' GROUP BY trans_id ORDER BY a.date_created ASC) b GROUP BY dateCreatedMonth ORDER BY dateCreatedMonth desc";
            $AMQuery = "SELECT al.*, au.user_name FROM " . $thisBean->get_audit_table_name() . " al LEFT JOIN users au ON al.created_by = au.id WHERE parent_id = '$beanId' AND al.created_by = '$currentUser' AND al.date_created >= '$endDate' AND al.date_created < '$startDate'";
            $AQuery = "SELECT al.*, au.user_name FROM " . $thisBean->get_audit_table_name() . " al LEFT JOIN users au ON al.created_by = au.id WHERE parent_id = '$beanId' AND al.created_by = '$currentUser' AND al.date_created < '$startDate' ORDER BY al.date_created DESC LIMIT 20";
            $FEQuery = "SELECT COUNT(b.trans_id) totalCount FROM (SELECT a.transaction_id trans_id FROM " . $thisBean->get_audit_table_name() . " a WHERE a.created_by = '$currentUser' AND a.parent_id = '$beanId' AND a.date_created <= '$startDate' GROUP BY trans_id) b";
        } else {
            $CQuery = "SELECT b.id, DATE_FORMAT(b.date_created, '%Y-%m') dateCreatedMonth, b.date_created dateCreatedExact, COUNT(b.trans_id) id_count FROM (SELECT a.id, a.transaction_id trans_id, a.date_created FROM " . $thisBean->get_audit_table_name() . " a WHERE parent_id = '$beanId' AND a.date_created < '$startDate' GROUP BY trans_id ORDER BY a.date_created ASC) b GROUP BY dateCreatedMonth ORDER BY dateCreatedMonth desc";
            $AMQuery = "SELECT al.*, au.user_name FROM " . $thisBean->get_audit_table_name() . " al LEFT JOIN users au ON al.created_by = au.id WHERE parent_id = '$beanId' AND al.date_created >= '$endDate' AND al.date_created < '$startDate'";
            $AQuery = "SELECT al.*, au.user_name FROM " . $thisBean->get_audit_table_name() . " al LEFT JOIN users au ON al.created_by = au.id WHERE parent_id = '$beanId' AND al.date_created < '$startDate' ORDER BY al.date_created DESC LIMIT 20";
            $FEQuery = "SELECT COUNT(b.trans_id) totalCount FROM (SELECT a.transaction_id trans_id FROM " . $thisBean->get_audit_table_name() . " a WHERE a.parent_id = '$beanId' AND a.date_created <= '$startDate' GROUP BY trans_id) b";
        }

        // calculates the whole amount of audit records we can access
        if($findEnd) {

            $auditRecords = $db->query($FEQuery);

            while ($auditRecord = $db->fetchByAssoc($auditRecords)) {
                $totalCount = intval($auditRecord['totalCount']);
            }
        }

        // loops over the records grouped by months and blocks the case of loading too many records
        // returns the amount of records and the date of the oldest one for the further module record search
        if($count) {
            $auditRecords = $db->query($CQuery);
            $records = 0;

            while ($auditRecord = $db->fetchByAssoc($auditRecords)) {

                $records += $auditRecord['id_count'];
                $date = $auditRecord['dateCreatedExact'];

                if($records >= 12) break;
            }
            $auditSearch = !$findEnd || $totalCount !== 0;
            return ['endDate' => $date, 'count' => $records, 'auditSearch' => $auditSearch];


        } elseif($endDate === '') {
            $auditRecords = $db->query($AQuery);
        } else {
            $auditRecords = $db->query($AMQuery);
        }

        $auditLog = [];
        $records = [];

        while ($auditRecord = $db->fetchByAssoc($auditRecords)) {
            $date = $auditRecord['date_created'];
            if (!isset($auditLog[$auditRecord['transaction_id']])) {
                $auditLog[$auditRecord['transaction_id']] = [
                    'id' => $auditRecord['transaction_id'],
                    'date' => $auditRecord['date_created'],
                    'created_by' => $auditRecord['created_by'],
                    'user_name' => $auditRecord['user_name'],
                    'record_Type' => 'audit',
                    'data' => []
                ];
            }

            // add the log record
            $auditLog[$auditRecord['transaction_id']]['data'][] = [
                'field_name' => $auditRecord['field_name'],
                'data_type' => $auditRecord['data_type'],
                'before_value_string' => $auditRecord['before_value_string'],
                'before_value_text' => $auditRecord['before_value_text'],
                'after_value_string' => $auditRecord['after_value_string'],
                'after_value_text' => $auditRecord['after_value_text'],
            ];
        }
        foreach($auditLog as $transaction_id => $audits) {
            $records[] = $audits;
        }

        $auditSearch = !$findEnd || $totalCount !== 0;
        $counts = ['modulesTook' => 0, 'totalModules' => 0, 'auditsTook' => count($records), 'totalAudits' => $totalCount];

        return ['records' => $records, 'counts' => $counts, 'endDate' => $date, 'auditSearch' => $auditSearch, 'moduleSearch' => false];
    }

    public function get_bean_auditlog($beanModule, $beanId, $params)
    {
        $db = DBManagerFactory::getInstance();

        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if (!isset($thisBean->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);
        if (!$thisBean->is_AuditEnabled()) throw (new NotFoundException('Record not audit enabled.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule])->setErrorCode('moduleNotAudited');

        $auditLog = [];

        $query = "SELECT al.*, au.user_name FROM " . $thisBean->get_audit_table_name() . " al LEFT JOIN users au ON al.created_by = au.id WHERE parent_id = '$beanId'";
        if ($params['user']) {
            $query .= " AND au.user_name like '%{$params['user']}%'";
        }
        if ($params['field']) {
            $query .= " AND al.field_name = '{$params['field']}'";
        }
        $query .= " ORDER BY date_created DESC";

        $auditRecords = $db->query($query);
        while ($auditRecord = $db->fetchByAssoc($auditRecords)) {
            if($params['grouped']){
                // add a record if we dont have it
                if(!isset($auditLog[$auditRecord['transaction_id']])) {
                    $auditLog[$auditRecord['transaction_id']] = [
                        'transaction_id' => $auditRecord['transaction_id'],
                        'date_created' => $auditRecord['date_created'],
                        'created_by' => $auditRecord['created_by'],
                        'user_name' => $auditRecord['user_name'],
                        'audit_log' => []
                    ];
                }

                // add the log record
                $auditLog[$auditRecord['transaction_id']]['audit_log'][] = [
                    'field_name' => $auditRecord['field_name'],
                    'data_type' => $auditRecord['data_type'],
                    'before_value_string' => $auditRecord['before_value_string'],
                    'before_value_text' => $auditRecord['before_value_text'],
                    'after_value_string' => $auditRecord['after_value_string'],
                    'after_value_text' => $auditRecord['after_value_text'],
                ];
            } else {
                $auditLog[] = $auditRecord;
            }
        }

        return $params['grouped'] ? array_values($auditLog) : $auditLog;

    }


    public function check_bean_duplicates($beanModule, $beanData)
    {
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');

        // load the bean and populate from row
        $seed = BeanFactory::getBean($beanModule);
        $seed->populateFromRow($beanData);
        $duplicates = $seed->checkForDuplicates();

        $retArray = [];
        foreach ($duplicates['records'] as $duplicate) {
            $retArray[] = $this->mapBeanToArray($beanModule, $duplicate);
        }
        return ['count' => $duplicates['count'], 'records' => $retArray];
    }

    public function get_bean_duplicates(string $beanModule, string $beanId): array {
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if (!isset($thisBean->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        $duplicates = $thisBean->checkForDuplicates();

        $retArray = [];
        foreach ($duplicates['records'] as $duplicate) {
            $retArray[] = $this->mapBeanToArray($beanModule, $duplicate);
        }
        return ['count' => $duplicates['count'], 'records' => $retArray];
    }


    public function get_bean_attachment(string $beanModule, string $beanId): array {
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in for module $beanModule."))->setErrorCode('noModuleView');

        $thisBean = BeanFactory::getBean($beanModule);
        $thisBean->retrieve($beanId);
        if (!isset($thisBean->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        if ($thisBean->file_name || $thisBean->filename) {
            require_once('modules/Notes/NoteSoap.php');
            $noteSoap = new NoteSoap();
            $fileData = $noteSoap->retrieveFile($thisBean->id, $thisBean->file_name ?: $thisBean->filename);
            // In case the file is a text file:
            // For a correct display of special characters in the browser, convert the file content to UTF8, if it not already UTF8 encoded.
            if ($thisBean->file_mime_type === 'text/plain') {
                $dummy = base64_decode($fileData);
                $dummy = mb_check_encoding($dummy, 'UTF-8') ? $dummy : utf8_encode($dummy);
                $fileData = base64_encode($dummy);
            }
            if ($fileData >= -1)
                return [
                    'filename' => $thisBean->file_name ?: $thisBean->filename,
                    'file' => $fileData,
                    'filetype' => $thisBean->file_mime_type
                ];
        }

        // if we did not return before we did not find the file
        throw (new NotFoundException('Attachment/File not found.'));
    }

    public function set_bean_attachment(string $beanModule, string $beanId, ?array $post) {
        $upload_file = new UploadFile('file');
        if ($post['file']) {
            $decodedFile = base64_decode($post['file']);
            $upload_file->set_for_soap($beanId, $decodedFile);
            $upload_file->final_move($beanId, true);
        }

        return ['filename' => $post['filename'], 'filetype' => $post['filemimetype'], 'filemd5' => 'md5hash'];
    }

    /**
     * upload an attachment
     * @param $req
     * @param $res
     * @param $args
     * @return array
     */
    public function uploadFile($params) {
        $upload_file = new UploadFile('file');
        $decodedFile = base64_decode($params['file']);
        $file_md5 = md5($decodedFile);
        $upload_file->set_for_soap($file_md5, $decodedFile);
        $upload_file->final_move($file_md5, true);

        return $file_md5;
    }

    public function download_bean_attachment(string $beanModule, string $beanId): void {
        $seed = BeanFactory::getBean($beanModule, $beanId);
        if ($seed) {
            $download_location = "upload://" . $beanId;

            // make sure to clean the buffer
            while (ob_get_level() && @ob_end_clean()) ;

            header("Pragma: public");
            header("Cache-Control: maxage=1, post-check=0, pre-check=0");
            header('Content-type: application/octet-stream');
            header("Content-Disposition: attachment; filename=\"" . $seed->filename . "\";");
            header("X-Content-Type-Options: nosniff");
            header("Content-Length: " . filesize($download_location));
            header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 2592000));
            readfile($download_location);
        }
    }


    public function get_related(string $beanModule, string $beanId, string $linkName, array $params): array {
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');

        // get the bean
        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if ($thisBean === false) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        if ($thisBean->load_relationship($linkName)) {
            $relModule = $thisBean->{$linkName}->getRelatedModuleName();
        } else {
            LoggerManager::getLogger()->fatal("Error trying to load relationship using link name = " . $linkName . " in bean " . $beanModule);
        }

        if (isset($thisBean->field_defs[$linkName]['sequence_field'])) {
            $sortBySequenceField = $isSequenced = true;
            $sequenceField = $thisBean->field_defs[$linkName]['sequence_field'];
        }

        // apply module filter if one is set
        if ($params['modulefilter']) {
            $sysModuleFilters = new SysModuleFilters();
            $addWhere = $sysModuleFilters->generateWhereClauseForFilterId($params['modulefilter'], '', $thisBean);
            $sortBySequenceField = false;
        }

        // apply field filter ..
        // ToDo: prevent SQL Injection
        if ($params['fieldfilters']) {
            $valuewhere = [];

            // decode the array and go for it
            $fieldFilters = json_decode($params['fieldfilters'], true);
            if (count($fieldFilters) > 0 && $relModule) {
                $relSeed = BeanFactory::getBean($relModule);
                foreach ($fieldFilters as $field => $value) {
                    $valuewhere[] = "{$relSeed->table_name}.$field = '$value'";
                }
                $valuewhere = join(' AND ', $valuewhere);
                if ($addWhere != '') {
                    $addWhere = "($addWhere) AND ($valuewhere)";
                } else {
                    $addWhere = $valuewhere;
                }
            }
        }

        $sortingDefinition = json_decode($params['sort'], true) ?: [];
        if ($sortingDefinition) $sortBySequenceField = false;

        if ($sortBySequenceField) $sortingDefinition = ['sortfield' => $sequenceField, 'sortdirection' => 'ASC'];

        if (!SpiceACL::getInstance()->checkAccess($relModule, 'list', true) && !SpiceACL::getInstance()->checkAccess($relModule, 'listrelated', true))
            throw (new ForbiddenException('Forbidden to list in module ' . $relModule . '.'))->setErrorCode('noModuleList');

        // get related beans and related module
        // get_linked_beans($field_name, $bean_name, $sort_array = [], $begin_index = 0, $end_index = -1, $deleted = 0, $optional_where = "")
        $relBeans = $thisBean->get_linked_beans($linkName, SpiceModules::getInstance()->getBeanName($beanModule), $sortingDefinition, $dummy = $params['offset'] ?: 0, $dummy + ($params['limit'] ?: 5), 0, $addWhere);

        $retArray = [];
        foreach ($relBeans as $relBean) {
            if (empty($relBean->relid))
                $relBean->relid = SpiceUtils::createGuid();
            $retArray[$relBean->relid] = $this->mapBeanToArray($relModule, $relBean, false);

            // add relationship fields
            if (is_array($relBean->relationhshipfields)) {
                $retArray[$relBean->relid]['relationhshipfields'] = $relBean->relationhshipfields;
            }

            // this code block is completely pointless
//            if ($params['relationshipFields']) {
//                $relFields = json_decode(html_entity_decode($params['relationshipFields']), true);
//                if (count($relFields) > 0) ;
//            }
        }

        // wtf? retrieve all the related data and at the end, ignore all this and count it new? (╯°□°)╯︵ ┻━┻
        if ($params['getcount']) {
            return [
                'count' => count($relBeans) > 0 ? $thisBean->get_linked_beans_count($linkName, SpiceModules::getInstance()->getBeanName($beanModule), 0, $addWhere) : 0,
                'list' => $retArray
            ];
        } else
            return $retArray;
    }

    public function add_related($beanModule, $beanId, $linkName, $relatedIds)
    {

        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module $beanModule."))->setErrorCode('noModuleEdit');

        $retArray = [];

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if ($thisBean === false) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        $thisBean->load_relationship($linkName);
        $relModule = $thisBean->{$linkName}->getRelatedModuleName();

        if (!SpiceACL::getInstance()->checkAccess($relModule, 'list', true))
            throw (new ForbiddenException('Forbidden to list in module ' . $relModule . '.'))->setErrorCode('noModuleList');


        foreach ($relatedIds as $relatedId) {
            $result = $thisBean->{$linkName}->add($relatedId);
            if (!$result)
                throw new Exception("Something went wrong by adding $relatedId to $linkName");
            $retArray[$relatedId] = $thisBean->{$linkName}->relationship->relid;
        }

        // reindex the curent bean since the added relationship might add to the indexed data

        SpiceFTSHandler::getInstance()->indexBean($thisBean);

        return $retArray;
    }

    public function set_related($beanModule, $beanId, $linkName, $postparams)
    {

        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'edit', true) && !SpiceACL::getInstance()->checkAccess($beanModule, 'editrelated', true))
            throw (new ForbiddenException("Forbidden to edit in module $beanModule."))->setErrorCode('noModuleEdit');

        $retArray = [];

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if ($thisBean === false) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        $thisBean->load_relationship($linkName);
        $relModule = $thisBean->{$linkName}->getRelatedModuleName();

        if (!SpiceACL::getInstance()->checkAccess($relModule, 'list', true))
            throw (new ForbiddenException('Forbidden to list in module ' . $relModule . '.'))->setErrorCode('noModuleList');

        // set the relate module
        $relBean = BeanFactory::getBean($relModule, $postparams['id']);
        if ($relBean === false) throw (new NotFoundException('Related record not found.'))->setLookedFor(['id' => $postparams['id'], 'module' => $relModule]);

        if (!SpiceACL::getInstance()->checkAccess($relModule, 'edit', true) &&
            !SpiceACL::getInstance()->checkAccess($relModule, 'editrelated', true)) {
            throw (new ForbiddenException("Forbidden to edit in module $relModule."))->setErrorCode('noModuleEdit');
        }

        if (SpiceACL::getInstance()->checkAccess($relModule, 'edit', true)) {
            $beanResponse = $this->add_bean($relModule, $postparams['id'], $postparams);
        }

        $relFields = $thisBean->field_defs[$linkName]['rel_fields'];
        if (is_array($relFields) && count($relFields) > 0) {
            $thisBean->load_relationship($linkName);
            switch ($thisBean->{$linkName}->getSide()) {
                case 'RHS':
                    $relid = $thisBean->{$linkName}->relationship->relationship_exists($relBean, $thisBean);
                    break;
                default:
                    $relid = $thisBean->{$linkName}->relationship->relationship_exists($thisBean, $relBean);
                    break;
            }

            if ($relid) {
                $valArray = [];
                foreach ($relFields as $relfield => $relmapdata) {
                    if (isset($postparams[$relmapdata['map']])) {
                        $valArray[] = "$relfield = '{$postparams[$relmapdata['map']]}'";
                    }
                }

                $thisBean->db->query("UPDATE " . $thisBean->{$linkName}->relationship->getRelationshipTable() . " SET " . implode(', ', $valArray) . " WHERE id ='$relid'");

            }
        }

        // reindex the curent bean since the added relationship might add to the indexed data

        SpiceFTSHandler::getInstance()->indexBean($thisBean);

        return $beanResponse;
    }

    public function delete_related(string $beanModule, string $beanId, string $linkName, ?array $queryParams): array {
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module $beanModule."))->setErrorCode('noModuleEdit');

        $retArray = [];

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        if (!isset($thisBean->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        $thisBean->load_relationship($linkName);
        $relModule = $thisBean->{$linkName}->getRelatedModuleName();

        if (!SpiceACL::getInstance()->checkAccess($relModule, 'list', true))
            throw (new ForbiddenException('Forbidden to list in module ' . $relModule . '.'))->setErrorCode('noModuleList');

        $thisBean->load_relationship($linkName);

        $relatedArray = json_decode($queryParams['relatedids'], true);
        if ($relatedArray) {
            foreach ($relatedArray as $relatedId) {
                $thisBean->$linkName->delete($beanId, $relatedId);
            }
        } else {
            $thisBean->$linkName->delete($beanId, $queryParams['relatedids']);
        }

        // reindex the curent bean since the added relationship might add to the indexed data

        SpiceFTSHandler::getInstance()->indexBean($thisBean);

        return $retArray;
    }

    public function add_mudltiple_related($beanModule, $linkName)
    {

    }

    /**
     * adds a new bean or updtes it if the bean with the id exists
     *
     * @param $beanModule
     * @param $beanId
     * @param $post_params
     * @return array
     * @throws ConflictException
     * @throws Exception
     * @throws NotFoundException
     */
    public function add_bean($beanModule, $beanId, $post_params, $query_params = [])
    {
        $timedate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'edit', true) && !SpiceACL::getInstance()->checkAccess($beanModule, 'create', true))
            throw (new ForbiddenException("Forbidden to edit or create in module $beanModule."))->setErrorCode('noModuleEdit');

        if ($post_params['deleted']) {

            if (!SpiceACL::getInstance()->checkAccess($beanModule, 'delete', true))
                throw (new ForbiddenException("Forbidden to delete in module $beanModule."))->setErrorCode('noModuleDelete');

            $this->delete_bean($beanModule, $beanId);
            return $beanId;
        }

        $thisBean = BeanFactory::getBean($beanModule);
        if ($thisBean->retrieve($beanId)) {
            if (!$thisBean->ACLAccess('edit'))
                throw (new ForbiddenException('Forbidden to edit record.'))->setErrorCode('noRecordEdit');
        } else {
            if (!SpiceACL::getInstance()->checkAccess($beanModule, 'create', true))
                throw (new ForbiddenException('Forbidden to edit record.'))->setErrorCode('noRecordEdit');
        }

        if (isset($query_params['templateId']) && strlen($query_params['templateId']) > 0) $thisBean->newFromTemplate = $query_params['templateId'];

        if (empty($thisBean->id) && !empty($beanId)) {
            $thisBean->new_with_id = true;
            $thisBean->id = $beanId;
        } else if ($thisBean->optimistic_lock && !empty($post_params['date_modified'])) {
            // do an optimistic locking check
            $curDate = date_create_from_format($timedate->get_db_date_format() . ' H:i:s', $thisBean->date_modified);
            $inDate = date_create_from_format($timedate->get_db_date_format() . ' H:i:s', $post_params['date_modified']);
            if ($curDate > $inDate) {
                $fields = [];
                foreach ($post_params as $fieldname => $fieldValue) {
                    if ($fieldValue != $thisBean->$fieldname) {
                        $fields[] = $fieldname;
                    }
                }
                $changedFields = $thisBean->getAuditChangesAfterDate($post_params['date_modified'], $fields);
                if (count($changedFields) > 0) {
                    throw (new ConflictException('Optimistic locking conflicts detected'))->setConflicts($changedFields);
                }
            }
        }

        // get the field access details
        $fieldControl = SpiceACL::getInstance()->getFieldAccess($thisBean, 'edit', false);

        foreach ($thisBean->field_name_map as $fieldId => $fieldData) {
            if ($fieldId == 'date_entered')
                continue;

            switch ($fieldData['type']) {
                case 'link':
                    break;
                default:
                    if (isset($post_params[$fieldData['name']]) && (!isset($fieldControl[$fieldData['name']]) || (isset($fieldControl[$fieldData['name']]) && $fieldControl[$fieldData['name']] > 2)))
                        $thisBean->{$fieldData['name']} = $post_params[$fieldData['name']];
                    break;
            }
        }

        // make sure we have an assigned user
        if (empty($thisBean->assigned_user_id))
            $thisBean->assigned_user_id = $current_user->id;


        // map from the bean
        if (method_exists($thisBean, 'mapFromRestArray')) {
            $thisBean->mapFromRestArray($post_params);
        }

        // check if notification might be applied
        # if( $thisBean->object_name == "Meeting" || $thisBean->object_name == "Call" || !empty($thisBean->assigned_user_id) && $thisBean->assigned_user_id != \SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser()->id && empty(\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['exclude_notifications'][$thisBean->module_dir])){
        if (!empty($thisBean->assigned_user_id) && $thisBean->assigned_user_id != AuthenticationController::getInstance()->getCurrentUser()->id && empty(@SpiceConfig::getInstance()->config['exclude_notifications'][$thisBean->module_dir])) {
            $thisBean->notify_on_save = true;
        }

        $tempEmail1 = null;

        // workaround: to prevent saving the email address twice
        if (isset($thisBean->email1) || isset($post_params['email1'])) {
            $tempEmail1 = $thisBean->email1 ?? $post_params['email1'];
            $thisBean->email1 = '';
            unset($post_params['email1']);
        }

        // save the bean bbut do not index .. indexing is handled later here since we might save related beans
        $thisBean->update_date_entered = true;
        $thisBean->save(!empty($thisBean->notify_on_save), false);

        // process links if sent
        foreach ($thisBean->field_name_map as $fieldId => $fieldData) {
            switch ($fieldData['type']) {
                case 'link':
                    if ($fieldData['module'] && isset($post_params[$fieldData['name']])) {
                        $thisBean->load_relationship($fieldId);

                        if (!$thisBean->{$fieldId}) {
                            break;
                        }

                        // CR1000357 get additional_rel_fields
                        $additional_rel_fields = [];
                        $additional_rel_fields_mapped = [];
                        if (isset($fieldData['rel_fields'])) {
                            foreach ($fieldData['rel_fields'] as $join_table_field => $joinDetails) {
                                $additional_rel_fields_mapped[] = $joinDetails['map'];
                                $additional_rel_fields[$joinDetails['map']] = $join_table_field;
                            }
                        }

                        $relModule = $thisBean->{$fieldId}->getRelatedModuleName();

                        //workaround for lookup field: delete relationships
                        $beans = $post_params[$fieldData['name']]['beans_relations_to_delete'];
                        foreach ($beans as $thisBeanId => $beanData) {
                            $seed = BeanFactory::getBean($relModule, $thisBeanId);
                            $thisBean->$fieldId->delete($thisBean, $seed);
                        }
                        //

                        $beans = $post_params[$fieldData['name']]['beans'];
                        foreach ($beans as $thisBeanId => $beanData) {
                            $seed = BeanFactory::getBean($relModule, $thisBeanId);

                            // handle email addresses link
                            if ($fieldData['name'] == 'email_addresses') {

                                // hold the retrieved email address if exists
                                $beforeEmailAddress = !$seed ? null : ['id' => $seed->id, 'email_address' => $seed->email_address];

                                // try to find the seed by the email address
                                $seed = BeanFactory::getBean('EmailAddresses');
                                $seed->retrieve_by_string_fields(['email_address_caps' => strtoupper($beanData['email_address'])]);

                                // if the seed was not found
                                if (!$seed->id) {

                                    // set seed to null to force creating a new one
                                    $seed = null;

                                    // delete the old relationship and generate a new guid if the email address from the old retrieved seed does not match the current one and the id was the same
                                    if ($beforeEmailAddress && $beanData['email_address'] != $beforeEmailAddress['email_address']) {
                                        $thisBean->$fieldId->delete($thisBean, $beforeEmailAddress['id']);
                                        $beanData['id'] = SpiceUtils::createGuid();
                                    }
                                } else {
                                    $beanData['id'] = $seed->id;
                                }
                            }

                            if (empty($beanData['deleted'])) {
                                // if it does not exist create new bean
                                if (!$seed) {
                                    $seed = BeanFactory::getBean($relModule);
                                    $seed->id = $thisBeanId;
                                    $seed->new_with_id = true;
                                }

                                // populate and save and add
                                $changed = false;
                                $additional_values = [];
                                foreach ($seed->field_defs as $field => $field_value) {
                                    if (isset($beanData[$field]) && $beanData[$field] !== $seed->$field) {
                                        $seed->$field = $beanData[$field];
                                        $changed = true;

                                        // CR1000357 prepare additional values
                                        if (in_array($field, $additional_rel_fields_mapped)) {
                                            $additional_values[$additional_rel_fields[$field]] = $seed->$field;
                                        }
                                    }
                                }
                                // save if we had changes
                                if ($changed)
                                    $seed->save();

                                // CR1000357: added $additional_values parameter
                                $thisBean->$fieldId->add($seed, $additional_values);
                            } else {
                                if ($seed) {
                                    $seed->mark_deleted($seed->id);
                                }
                            }
                        }
                    }
                    break;
            }
        }

        // check on sync_comtact for Contacts Module
        if ($thisBean->module_name == 'Contacts') {
            if ($thisBean->load_relationship('user_sync', 'User')) {
                if ($thisBean->sync_contact) {
                    $thisBean->user_sync->add(AuthenticationController::getInstance()->getCurrentUser());
                } else {
                    $thisBean->user_sync->delete(AuthenticationController::getInstance()->getCurrentUser()->id);
                }
            }
        }

        // see if we have an attachement
        if ($beanModule == 'Notes' && isset($post_params['file']) && isset($post_params['filename'])) {
            require_once('modules/Notes/NoteSoap.php');
            $noteSoap = new NoteSoap();
            $post_params['id'] = $thisBean->id;
            $noteSoap->newSaveFile($post_params);
        }

        // if favorite is set .. update this as well
        if (isset($post_params['favorite'])) {
            if ($post_params['favorite'])
                $this->set_favorite($beanModule, $beanId);
            else
                $this->delete_favorite($beanModule, $beanId);
        }

        // index the bean now
        SpiceFTSHandler::getInstance()->indexBean($thisBean);

        // call after save hook once again after the relationships ahve been saved as well
        $thisBean->call_custom_logic('after_save_completed', '');

        if (@SpiceConfig::getInstance()->config['krest']['retrieve_after_save']) $thisBean->retrieve();

        // refill the email1 if it was cleared in the workaround line
        if ($tempEmail1) {
            $thisBean->email1 = $tempEmail1;
        }

        return $this->mapBeanToArray($beanModule, $thisBean);
    }

    /**
     * deletes a bean with the given id and the module
     *
     * @param $beanModule
     * @param $beanId
     * @return bool
     * @throws Exception
     * @throws NotFoundException
     */
    public function delete_bean($beanModule, $beanId)
    {
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'delete', true))
            throw (new ForbiddenException("Forbidden to delete in module $beanModule."))->setErrorCode('noModuleDelete');

        $thisBean = BeanFactory::getBean($beanModule);
        $thisBean->retrieve($beanId);
        if (!isset($thisBean->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        if (!$thisBean->ACLAccess('delete'))
            throw (new ForbiddenException('Forbidden to delete record.'))->setErrorCode('noRecordDelete');

        $thisBean->mark_deleted($beanId);
        return true;
    }

    /**
     * legacy support ot have compatibility with SugarCRM for standalone installations of KREST
     *
     * @return string|null
     */
    private function getSpiceFavoritesClass()
    {
        global $dictionary;

        if ($this->spiceFavoritesClass === null) {
            if ($dictionary['spicefavorites'] && file_exists('include/SpiceFavorites/SpiceFavorites.php')) {
                // require_once 'include/SpiceFavorites/SpiceFavorites.php';
                $this->spiceFavoritesClass = '\SpiceCRM\includes\SpiceFavorites\SpiceFavorites';
            }
        }
        return $this->spiceFavoritesClass;
    }

    /**
     * checksit a record is a favorite
     *
     * @param $beanModule
     * @param $beanId
     * @return array
     */
    public function get_favorite($beanModule, $beanId)
    {
        $spiceFavoriteClass = $this->getSpiceFavoritesClass();
        if ($spiceFavoriteClass)
            return $spiceFavoriteClass::getFavorite($beanModule, $beanId);
        else
            return [];
    }

    /**
     * marks a record as favorite
     *
     * @param $beanModule
     * @param $beanId
     */
    public function set_favorite($beanModule, $beanId)
    {
        $spiceFavoriteClass = $this->getSpiceFavoritesClass();
        if ($spiceFavoriteClass)
            $spiceFavoriteClass::set_favorite($beanModule, $beanId);
    }

    /**
     * deletes a favorite
     *
     * @param $beanModule
     * @param $beanId
     * @return bool
     */
    public function delete_favorite($beanModule, $beanId)
    {
        $spiceFavoriteClass = $this->getSpiceFavoritesClass();
        if ($spiceFavoriteClass)
            $spiceFavoriteClass::delete_favorite($beanModule, $beanId);
        else
            return false;
    }

    private function get_reminder($bean)
    {

        global $dictionary, $current_user;
        $db = DBManagerFactory::getInstance();

        // check capability and handle old theme customers
        if ($dictionary['spicereminders']) {
            $spiceReminderTable = 'spicereminders';
        } elseif ($dictionary['trreminders']) {
            $spiceReminderTable = 'trreminders';
        } else {
            return null;
        }

        $reminderObj = $db->query("SELECT * FROM $spiceReminderTable WHERE user_id='$current_user->id' AND bean_id='$bean->id' AND bean='$bean->module_dir'");
        if ($reminderRow = $db->fetchByAssoc($reminderObj)) {
            if (DBManagerFactory::getInstance()->dbType == 'mssql') {
                $reminderRow['reminder_date'] = str_replace('.000', '', $reminderRow['reminder_date']);
            }
            $reminderRow['summary'] = $bean->get_summary_text();
            return $reminderRow;
        } else {
            return null;
        }
    }

    private function get_quicknotes($bean)
    {
        global $dictionary;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        // check capability and handle old theme customers
        if ($dictionary['spicenotes']) {
            $spiceNotesTable = 'spicenotes';
        } elseif ($dictionary['trquicknotes']) {
            $spiceNotesTable = 'trquicknotes';
        } else {
            return null;
        }


        $quicknotes = [];

        if (DBManagerFactory::getInstance()->dbType == 'mssql') {
            $quicknotesRes = $db->query("SELECT qn.*,u.user_name FROM $spiceNotesTable AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$bean->id}' AND qn.bean_type='{$bean->module_dir}' AND (qn.user_id = '" . $current_user->id . "' OR qn.trglobal = '1') AND qn.deleted = 0 ORDER BY qn.trdate DESC");
        } else {
            $quicknotesRes = $db->query("SELECT qn.*,u.user_name FROM $spiceNotesTable AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$bean->id}' AND qn.bean_type='{$bean->module_dir}' AND (qn.user_id = '" . $current_user->id . "' OR qn.trglobal = '1') AND qn.deleted = 0 ORDER BY qn.trdate DESC");
        }

        if (DBManagerFactory::getInstance()->dbType == 'mssql' || $db->getRowCount($quicknotesRes) > 0) {
            while ($thisQuickNote = $db->fetchByAssoc($quicknotesRes)) {
                $quicknotes[] = [
                    'id' => $thisQuickNote['id'],
                    'user_id' => $thisQuickNote['user_id'],
                    'user_name' => $thisQuickNote['user_name'],
                    'bean_id' => $bean->id,
                    'bean_type' => $bean->module_dir,
                    'own' => ($thisQuickNote['user_id'] == $current_user->id || $current_user->is_admin) ? '1' : '0',
                    'date' => $thisQuickNote['trdate'],
                    'text' => $thisQuickNote['text'],
                    'global' => $thisQuickNote['trglobal'] ? 1 : 0
                ];
            }
        }
        return $quicknotes;
    }

    public function get_bean_vardefs($beanModule)
    {

        $thisBean = BeanFactory::getBean($beanModule);
        return $thisBean->field_name_map;
    }

    public function get_beandefs_multiple($beanModules)
    {

        $retArray = [];

        foreach ($beanModules as $thisModule) {
            $retArray[$thisModule] = $this->get_beandefs($thisModule);
        }

        return $retArray;
    }


    public function get_modules(): array {
        global $current_language;

        $app_list_strings = return_app_list_strings_language($current_language);
        $modArray = [];
        foreach ($app_list_strings['moduleList'] as $module => $modulename) {
            $modArray[] = [
                'module' => $module,
                'name' => $modulename
            ];
        }
        usort($modArray, function ($a, $b) {
            return $a['name'] > $b['name'] ? 1 : -1;
        });
        return $modArray;
    }

    //private helper functions
    function mapBeanToArray($beanModule, $thisBean, $resolvelinks = true)
    {

        global $current_language;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $beanDataArray = [];
        foreach ($thisBean->field_name_map as $fieldId => $fieldData) {
            switch ($fieldData['type']) {
                case 'relate':
                case 'parent':
                    $beanDataArray[$fieldId] = $thisBean->$fieldId;
                    if ($fieldData['id_name']) {
                        $beanDataArray[$fieldData['id_name']] = $thisBean->{$fieldData['id_name']};
                    } else if (!empty($thisBean->parent_id)) {
                        $beanDataArray['parent_id'] = $thisBean->parent_id;
                    }
                    if ($fieldData['type_name']) {
                        $beanDataArray[$fieldData['type_name']] = $thisBean->{$fieldData['type_name']};
                    } else if (!empty($thisBean->parent_type)) {
                        $beanDataArray['parent_type'] = $thisBean->parent_type;
                    }
                    break;
                case 'link':
                    if (($resolvelinks && $fieldData['default'] === true && $fieldData['module']) || $fieldData['name'] == 'email_addresses') {
                        $beanDataArray[$fieldId]['beans'] = new stdClass();
                        $thisBean->load_relationship($fieldId);
                        if ($thisBean->{$fieldId}) {
                            $relModule = $thisBean->{$fieldId}->getRelatedModuleName();
                            $relatedBeans = $thisBean->get_linked_beans($fieldId, $relModule);
                            foreach ($relatedBeans as $relatedBean) {
                                $beanDataArray[$fieldId]['beans']->{$relatedBean->id} = $this->mapBeanToArray($relModule, $relatedBean);
                            }
                            //workaround lookup field: define property to be used in lookup field
                            $beanDataArray[$fieldId]['beans_relations_to_delete'] = new stdClass();
                        }
                        //
                    }
                    break;
                default:
                    $beanDataArray[$fieldId] = is_string($thisBean->$fieldId) ? html_entity_decode($thisBean->$fieldId, ENT_QUOTES) : $thisBean->$fieldId;
                    break;
            }
        }

        // call the bean mapper if that one exists
        if (method_exists($thisBean, 'mapToRestArray')) {
            $beanDataArray = $thisBean->mapToRestArray($beanDataArray);
        };

        // get the summary text
        $beanDataArray['summary_text'] = $thisBean ? $thisBean->get_summary_text() : '';

        // get the ACL Array
        $beanDataArray['acl'] = $thisBean->getACLActions();

        if (!$current_user->is_admin && SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'getFieldAccess')) {
            $beanDataArray['acl_fieldcontrol']['edit'] = SpiceACL::getInstance()->getFieldAccess($thisBean, 'edit', false);
            $beanDataArray['acl_fieldcontrol']['display'] = SpiceACL::getInstance()->getFieldAccess($thisBean, 'display', false);

            // remove any field that is hidden
            $controlArray = [];
            foreach ($beanDataArray['acl_fieldcontrol']['display'] as $field => $fieldcontrol) {
                if (!isset($controlArray[$field]) || (isset($controlArray[$field]) && $fieldcontrol > $controlArray[$field]))
                    $controlArray[$field] = $fieldcontrol;
            }
            foreach ($beanDataArray['acl_fieldcontrol']['edit'] as $field => $fieldcontrol) {
                if (!isset($controlArray[$field]) || (isset($controlArray[$field]) && $fieldcontrol > $controlArray[$field]))
                    $controlArray[$field] = $fieldcontrol;
            }

            foreach ($controlArray as $field => $fieldcontrol) {
                if ($fieldcontrol == 1)
                    unset($beanDataArray[$field]);
            }

            $beanDataArray['acl_fieldcontrol'] = $controlArray;
        }
        return $beanDataArray;
    }

    private function write_spiceuitracker($module, $bean)
    {
        $timedate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        // check if the last entr from the user is the same id
        $lastRecord = $db->fetchByAssoc($db->limitQuery("SELECT record_id FROM spiceuitrackers ORDER BY date_entered DESC ", 0, 1));

        if ($lastRecord['record_id'] == $bean->id)
            return false;

        // insert a record
        $db->query("INSERT INTO spiceuitrackers (id, user_id, date_entered, record_module, record_id, record_summary) VALUES('" . create_guid() . "', '{$current_user->id}', '" . $timedate->nowDb() . "', '{$module}', '{$bean->id}', '" . $bean->get_summary_text() . "')");
    }

    private function processSpiceDomainFunction($thisBean, $fieldDef, $language)
    {

        if (isset($fieldDef['spice_domain_function'])) {
            $function = $fieldDef['spice_domain_function'];
            if (is_array($function) && isset($function['name'])) {
                $function = $fieldDef['spice_domain_function']['name'];
            } else {
                $function = $fieldDef['spice_domain_function'];
            }

            if (isset($fieldDef['spice_domain_function']['include']) && file_exists($fieldDef['spice_domain_function']['include'])) {
                require_once($fieldDef['spice_domain_function']['include']);
            }

            $domain = call_user_func($function, $thisBean, $fieldDef['name'], $language);
            return $domain;

        } else {
            return [];
        }
    }


    public function getLanguage($modules, $language = null)
    {

        // see if we have a language passed in .. if not use the default
        if (empty($language)) $language = SpiceConfig::getInstance()->config['default_language'];

        $dynamicDomains = $this->get_dynamic_domains($modules, $language);
        $appListStrings = return_app_list_strings_language($language);
        $appStrings = array_merge($appListStrings, $dynamicDomains);

        // grab labels from syslanguagetranslations
        // $syslanguages = $this->get_languages(strtolower($language));
        if (!class_exists('LanguageManager')) require_once 'include/SugarObjects/LanguageManager.php';

        $syslanguagelabels = LanguageManager::loadDatabaseLanguage($language);
        // file_put_contents("sugarcrm.log", print_r($syslanguagelabels, true), FILE_APPEND);
        $syslanguages = [];
        // var_dump($syslanguagelabels);
        // explode labels default|short|long
        if (is_array($syslanguagelabels)) {
            foreach ($syslanguagelabels as $syslanguagelbl => $syslanguagelblcfg) {
                $syslanguages[$syslanguagelbl] = [
                    'default' => $syslanguagelblcfg['default'],
                    'short' => $syslanguagelblcfg['short'],
                    'long' => $syslanguagelblcfg['long'],
                ];
                /*
                $syslanguages[$syslanguagelbl] = $syslanguagelblcfg['default'];
                if(!empty($syslanguagelblcfg['short']))
                    $syslanguages[$syslanguagelbl.'_SHORT'] = $syslanguagelblcfg['short'];
                if(!empty($syslanguagelblcfg['long']))
                    $syslanguages[$syslanguagelbl.'_LONG'] = $syslanguagelblcfg['long'];
                */
            }
        }

        $responseArray = [
            'languages' => LanguageManager::getLanguages(),
            'applang' => $syslanguages,
            'applist' => $appStrings
        ];


        $responseArray['md5'] = md5(json_encode($responseArray));

        return $responseArray;

    }
}
