<?php

namespace SpiceCRM\KREST\handlers;

use LanguageManager;
use NoteSoap;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\includes\UploadFile;

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
use SpiceCRM\includes\TimeDate;
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

    protected function _trackAction($action, $module, $bean)
    {
        $action = strtolower($action);
        //Skip save, tracked in SugarBean instead
        if ($action == 'save') {
            return;
        }


        $tracker = BeanFactory::getBean('Trackers');
        $tracker->monitor_id = create_guid();
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

        global $beanList, $dictionary;

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
        global $timedate;
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

        if (@$searchParams['source'] !== 'db' and SpiceFTSHandler::getInstance()::checkModule($beanModule, true) and SpiceFTSHandler::getInstance()::checkFilterDefs($beanModule, json_decode(html_entity_decode($listDef['filterdefs']))) and SpiceFTSHandler::getInstance()::checkFilterDefs($beanModule, json_decode(html_entity_decode($searchParams['filter'])))) {
            //  $results = SpiceFTSHandler::getInstance()->getGlobalSearchResults([$beanModule], $searchParams['searchterm'])
            $searchParams['records'] = $searchParams['limit'];
            $result = SpiceFTSHandler::getInstance()->getModuleSearchResults($beanModule, $searchParams['searchterm'], json_decode($searchParams['searchtags']), $searchParams, json_decode(html_entity_decode($searchParams['aggregates']), true), json_decode($searchParams['sortfields'], true) ?: []);
            $totalcount = $result['total'];
            foreach ($result['hits'] as $hit) {
                $thisBean = BeanFactory::getBean($beanModule, $hit['_id'], ['encode' => false]);
                if (!$thisBean) continue;
                $beanData[] = $this->mapBeanToArray($beanModule, $thisBean, []);
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
            $filterWhere = $moduleFilter->generareWhereClauseForFilterId($searchParams['modulefilter']);
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
                if (isset($dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on']{0}))
                    $sortfield = $dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on'];
                if (isset($dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on2']{0}))
                    $sortfield .= ', ' . $dictionary[$thisBean->object_name]['fields'][$searchParams['sortfield']]['sort_on2'];
                if (!isset($sortfield{0})) $sortfield = $searchParams['sortfield'];

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
                if (isset($dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on']{0}))
                    $sf = $dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on'];
                if (isset($dictionary[$thisBean->object_name]['fields'][$sortField['sortfield']]['sort_on2']{0}))
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
                    $thisBean->retrieve();
                    $beanData[] = $this->mapBeanToArray($beanModule, $thisBean, []);
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
                $thisBean->retrieve();
                $beanData[] = $this->mapBeanToArray($beanModule, $thisBean, []);
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

            if (@$searchParams['source'] !== 'db' and SpiceFTSHandler::getInstance()::checkModule($beanModule, true) and SpiceFTSHandler::getInstance()::checkFilterDefs($beanModule, json_decode(html_entity_decode($listDef['filterdefs']))) and SpiceFTSHandler::getInstance()::checkFilterDefs($beanModule, json_decode(html_entity_decode($searchParams['filter'])))) {
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

        // prepare the output
        $fh = @fopen('php://output', 'w');
        fputcsv($fh, $returnFields, $delimiter);
        foreach ($beans as $thisBean) {
            $entryArray = [];
            foreach ($returnFields as $returnField)
                $entryArray[] = !empty($charsetTo) ? mb_convert_encoding($thisBean->$returnField, $charsetTo) : $thisBean->$returnField;
            fputcsv($fh, $entryArray, $delimiter);
        }
        fclose($fh);

        return $charsetTo;
    }

    public function merge_bean($beanModule, $beanId, $requestParams)
    {
        global $current_language;
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'delete', true))
            throw (new ForbiddenException("Forbidden to delete in module $beanModule."))->setErrorCode('noModuleDelete');

        $thisBean = BeanFactory::getBean($beanModule, $beanId);
        $thisBean->merge($requestParams);

    }

    public function get_bean_detail($beanModule, $beanId, $requestParams)
    {
        global $current_language, $app_list_strings;

        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess($beanModule, 'view', true))
            throw (new ForbiddenException("Forbidden to view in module $beanModule."))->setErrorCode('noModuleView');

        $thisBean = BeanFactory::getBean($beanModule, $beanId, ['encode' => false]); //set encode to false to avoid things like ' being translated to &#039;
        if (!$thisBean) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $beanId, 'module' => $beanModule]);

        if (!$thisBean->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $app_list_strings = return_app_list_strings_language($current_language);

        if ($requestParams['trackaction']) {
            $this->_trackAction($requestParams['trackaction'], $beanModule, $thisBean);
        }

        $includeReminder = $requestParams['includeReminder'] ? true : false;
        $includeNotes = $requestParams['includeNotes'] ? true : false;

        return $this->mapBeanToArray($beanModule, $thisBean, [], $includeReminder, $includeNotes);

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
        while ($auditRecord = $db->fetchByAssoc($auditRecords))
            $auditLog[] = $auditRecord;

        return $auditLog;

    }

    public function get_bean_surrounding($beanModule, $beanId, $params)
    {
        $db = DBManagerFactory::getInstance();
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

    public function get_bean_duplicates($beanModule, $beanId)
    {
        $db = DBManagerFactory::getInstance();

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


    public function get_bean_attachment($beanModule, $beanId)
    {
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

    public function set_bean_attachment($beanModule, $beanId, $post = '')
    {

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

    public function download_bean_attachment($beanModule, $beanId)
    {
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


    public function get_related($beanModule, $beanId, $linkName, $params)
    {

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
        if (isset($thisBean->field_defs[$linkName]['sequence_field']{0})) {
            $sortBySequenceField = $isSequenced = true;
            $sequenceField = $thisBean->field_defs[$linkName]['sequence_field'];
        }

        // apply module filter if one is set
        if ($params['modulefilter']) {
            $sysModuleFilters = new SysModuleFilters();
            $addWhere = $sysModuleFilters->generareWhereClauseForFilterId($params['modulefilter'], '', $thisBean);
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
        $relBeans = $thisBean->get_linked_beans($linkName, $GLOBALS['beanList'][$beanModule], $sortingDefinition, $dummy = $params['offset'] ?: 0, $dummy + ($params['limit'] ?: 5), 0, $addWhere);

        $retArray = [];
        foreach ($relBeans as $relBean) {
            if (empty($relBean->relid))
                $relBean->relid = create_guid();
            $retArray[$relBean->relid] = $this->mapBeanToArray($relModule, $relBean);

            // add relationship fields
            if (is_array($relBean->relationhshipfields)) {
                $retArray[$relBean->relid]['relationhshipfields'] = $relBean->relationhshipfields;
            }

            if ($params['relationshipFields']) {
                $relFields = json_decode(html_entity_decode($params['relationshipFields']), true);
                if (count($relFields) > 0) ;
            }
        }

        // wtf? retrieve all the related data and at the end, ignore all this and count it new? (╯°□°)╯︵ ┻━┻
        if ($params['getcount']) {
            return [
                'count' => count($relBeans) > 0 ? $thisBean->get_linked_beans_count($linkName, $GLOBALS['beanList'][$beanModule], 0, $addWhere) : 0,
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

    public function delete_related($beanModule, $beanId, $linkName, $postParams)
    {

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

        $relatedArray = json_decode($postParams['relatedids'], true);
        if ($relatedArray) {
            foreach ($relatedArray as $relatedId) {
                $thisBean->$linkName->delete($beanId, $relatedId);
            }
        } else {
            $thisBean->$linkName->delete($beanId, $postParams['relatedids']);
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
        global $timedate;
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

        if ($post_params['emailaddresses']) {
            $this->setEmailAddresses($beanModule, $thisBean->id, $post_params['emailaddresses']);
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
            return $spiceFavoriteClass::get_favorite($beanModule, $beanId);
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


    public function get_modules()
    {

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
    function mapBeanToArray($beanModule, $thisBean, $returnFields = [], $includeReminder = false, $includeNotes = false, $resolvelinks = true)
    {

        global $current_language;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $app_list_strings = return_app_list_strings_language($current_language);
        $beanDataArray = [];
        foreach ($thisBean->field_name_map as $fieldId => $fieldData) {
            switch ($fieldData['type']) {
                case 'relate':
                case 'parent':
                    if (count($returnFields) == 0 || (count($returnFields) > 0 && in_array($fieldId, $returnFields))) {
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
                    }
                    break;
                case 'link':
                    if ($resolvelinks && $fieldData['default'] === true && $fieldData['module']) {
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
                    if ($fieldId == 'id' || count($returnFields) == 0 || (count($returnFields) > 0 && in_array($fieldId, $returnFields))) {
                        $beanDataArray[$fieldId] = is_string($thisBean->$fieldId) ? html_entity_decode($thisBean->$fieldId, ENT_QUOTES) : $thisBean->$fieldId;
                    }
                    break;
            }
        }

        // call the bean mapper if that one exists
        if (method_exists($thisBean, 'mapToRestArray')) {
            $beanDataArray = $thisBean->mapToRestArray($beanDataArray);
        };

        // get the summary text
        $beanDataArray['summary_text'] = $thisBean ? $thisBean->get_summary_text() : '';

        // load if it is a favorite
        $beanDataArray['favorite'] = $this->get_favorite($beanModule, $thisBean->id) ? 1 : 0;

        // get the email addresses
        $beanDataArray['emailaddresses'] = $this->getEmailAddresses($beanModule, $thisBean->id);

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
        } /* else {
            //workaround to unset edit icon when bean edit is prohibited until we have our ACLController
            //build fake $beanDataArray['acl_fieldcontrol']['edit']
            if (!$beanDataArray['acl']['edit']) {
                foreach ($thisBean->field_defs as $field => $def) {
                    $beanDataArray['acl_fieldcontrol'][$def['name']] = 1;
                }
            }
        } */
        return $beanDataArray;
    }

    /**
     * returns the email addresses for a given bean
     *
     * @param $beanObject
     * @param $beanId
     * @return mixed
     */
    public function getEmailAddresses($beanObject, $beanId)
    {
        $emailAddresses = BeanFactory::getBean('EmailAddresses');
        return $emailAddresses->getAddressesByGUID($beanId, $beanObject);
    }

    /**
     * sets the email addresses for a given bean
     *
     * @param $beanModule
     * @param $beanId
     * @param $emailaddresses
     */
    private function setEmailAddresses($beanModule, $beanId, $emailaddresses)
    {

        $emailAddresses = BeanFactory::getBean('EmailAddresses');
        $emailAddresses->addresses = $emailaddresses;
        $emailAddresses->saveEmailAddress($beanId, $beanModule);
    }


    private function write_spiceuitracker($module, $bean)
    {
        global $timedate;
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
