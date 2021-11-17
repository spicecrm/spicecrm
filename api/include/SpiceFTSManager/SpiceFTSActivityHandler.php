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
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class SpiceFTSActivityHandler
{
    public static function checkActivities($module)
    {
        $settings = SpiceFTSUtils::getBeanIndexSettings($module);

        return [
            'Activities' => $settings['activitiessearch'] ?: false,
            'History' => $settings['historysearch'] ?: false,
            'Assistant' => $settings['assistantsearch'] ?: false
        ];
    }

    /**
     *
     *loads the activities from elastic
     *
     * @param $activitiesmodule can be either History or Activities
     * @param $parentid the id of teh parent module
     * @param int $start the start for the entries
     * @param int $limit the number of entries returned
     * @param string $searchterm an optional seachterm that is also applied to the fts search
     * @param array $objects an array with Modules that shodul eb included in thesearch response. Used for filtering the results and teh indexes queried
     *
     * @return array and array with the element totalcount, aggregates and items
     */
    public static function loadActivities($activitiesmodule, $parentid = null, $start = 0, $limit = 10, $searchterm = '', $ownerfiler = '', $objects = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $modules = SpiceFTSUtils::getActivityModules($activitiesmodule);
        $moduleQueries = [];
        $queryModules = [];
        $postFilters = [];

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

            // add to the candidates
            $candidateModules[] = $module;

            // if access is granted build the module query
            $beanHandler = new SpiceFTSBeanHandler($module);
            $moduleQuery = $beanHandler->getModuleSearchQuery($searchterm);

            // check if we have a filter

            if ($beanHandler->indexSettings[strtolower($activitiesmodule) . 'filter']) {
                $filter = new SysModuleFilters();
                $filterDef = $filter->generareElasticFilterForFilterId($beanHandler->indexSettings[strtolower($activitiesmodule) . 'filter']);
                $moduleQuery['bool']['filter']['bool']['must'][] = $filterDef;
            }

            // add the activities filters
            if($parentid) {
                $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["_activityparentids" => $parentid]];
            }
            $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["_index" => SpiceFTSUtils::getIndexNameForModule($module)]];

            switch ($ownerfiler) {
                case 'assigned':
                    $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["assigned_user_id" => $current_user->id]];
                    break;
                case 'created':
                    $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ["created_by" => $current_user->id]];
                    break;
            }

            $moduleQueries[] = $moduleQuery;

            // collect all modules we shoudl query for building the serach URL listiung the indexes
            $queryModules[] = SpiceFTSUtils::getIndexNameForModule($module);

            // see if we shpould filter by the module int he post filters
            if ($objects && count($objects) > 0 && array_search_insensitive($module, $objects) === false) {
                $postFilters[] = [
                    'term' => ['_index' => SpiceFTSUtils::getIndexNameForModule($module)]
                ];
            }
        }

        // if we do not have any modules to query .. return an empty response
        if (count($queryModules) == 0) {
            return ['totalcount' => 0, 'aggregates' => [], 'items' => [], 'modules' => []];
        }

        // build the complete query
        $query = [
            "size" => $limit ?: 10,
            "from" => $start ?: 0,
            "query" => [
                'bool' => [
                    'should' => $moduleQueries
                ]
            ],
            "sort" => [
                ['_activitydate' => ['order' => $activitiesmodule == 'History' ? 'desc' : 'asc']]
            ],
            'aggs' => [
                'module' => [
                    'terms' => [
                        'field' => $elastichandler->gettModuleTermFieldName(), //'_module' for ES7, '_type' for ES6
                        'size' => 10
                    ]
                ],
                'year' => [
                    'date_histogram' => [
                        'field' => '_activitydate',
                        'interval' => '1y',
                        'format' => 'yyyy'
                    ]
                ]
            ]
        ];

        if (count($postFilters) > 0) {
            $query['post_filter'] = [
                "bool" => [
                    "must_not" => $postFilters
                ]
            ];

            // also filter the entries per year

            $query['aggs']['year'] = [
                'filter' => [
                    "bool" => [
                        "must_not" => $postFilters
                    ]
                ],
                'aggs' => [
                    'yearfiltered' => $query['aggs']['year']
                ]
            ];
        }

        $elastichandler = new ElasticHandler();
        $results = json_decode($elastichandler->query('POST', join(',', $queryModules) . '/_search', null, $query), true);

        $moduleHandler = new ModuleHandler();

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
                'date_activity' => $hit['_source']['_activitydate'],
                'related_ids' => $hit['_source']['related_ids'],
                'data' => $krestHandler->mapBeanToArray($elastichandler->getHitModule($hit), $seed, false)
            ];
        }

        //handle thh aggregates
        $aggregates = [];
        foreach ($results['aggregations']['module']['buckets'] as $bucket) {
            $aggregates['module'][] = [
                'module' => $bucket['key'],
                'count' => $bucket['doc_count']
            ];

        }
        if (count($postFilters) > 0) {
            foreach ($results['aggregations']['year']['yearfiltered']['buckets'] as $bucket) {
                $aggregates['year'][] = [
                    'year' => $bucket['key_as_string'],
                    'count' => $bucket['doc_count']
                ];
            }
        } else {
            foreach ($results['aggregations']['year']['buckets'] as $bucket) {
                $aggregates['year'][] = [
                    'year' => $bucket['key_as_string'],
                    'count' => $bucket['doc_count']
                ];
            }
        }

        return ['totalcount' => $elastichandler->getHitsTotalValue($results), 'aggregates' => $aggregates, 'items' => $items, 'modules' => $candidateModules];
    }

    /**
     *
     *loads the activities from elastic
     *
     * @param $activitiesmodule can be either History or Activities
     * @param $parentid the id of teh parent module
     * @param int $start the start for the entries
     * @param int $limit the number of entries returned
     * @param string $searchterm an optional seachterm that is also applied to the fts search
     * @param array $objects an array with Modules that shodul eb included in thesearch response. Used for filtering the results and teh indexes queried
     *
     * @return array and array with the element totalcount, aggregates and items
     */
    public static function loadCalendarEvents($startdate, $enddate, $userId, $searchterm = '', $usersIds = [], $objects = [])
    {
        $modules = SpiceFTSUtils::getCalendarModules();
        $moduleQueries = [];
        $queryModules = [];
        $postFilters = [];

        foreach ($modules as $module => $moduleDetails) {

            // check acl access for the user as well as if a filter object is set
            //if(!SpiceACL::getInstance()->checkACLAccess($module, 'list') || ($objects && count($objects) > 0 && array_search_insensitive($module, $objects) === false)){
            if (!SpiceACL::getInstance()->checkAccess($module, 'list', $userId)) {
                continue;
            }


            // if access is granted build the module query
            $beanHandler = new SpiceFTSBeanHandler($module);
            $moduleQuery = $beanHandler->getModuleSearchQuery($searchterm);

            // check if we have a filter

            if ($beanHandler->indexSettings['calendarfilter']) {
                $filter = new SysModuleFilters();
                $filterDef = $filter->generareElasticFilterForFilterId($beanHandler->indexSettings['calendarfilter']);
                $moduleQuery['bool']['filter']['bool']['must'][] = $filterDef;
            }

            // date range filter
            $moduleQuery['bool']['filter']['bool']['must'][] = [
                'bool' => [
                    'must' => [
                        ['range' => ['_activitydate' => ['lt' => $enddate]]],
                        ['range' => ['_activityenddate' => ['gt' => $startdate]]]
                    ]
                ]
            ];

            $moduleQuery['bool']['filter']['bool']['must'][] = ['term' => ['_index' => SpiceFTSUtils::getIndexNameForModule($module)]];
            if (empty($usersIds)) {
                $moduleQuery['bool']['filter']['bool']['must'][] = [
                    'bool' => [
                        'should' => [
                            ['term' => ["assigned_user_id" => $userId]],
                            ['term' => ["_activityparticipantids" => $userId]],
                        ],
                        'minimum_should_match' => 1
                    ]
                ];
                //    ['term' => ["assigned_user_id" => $userId]];
            } else {
                $moduleQuery['bool']['filter']['bool']['must'][] =[
                    'bool' => [
                        'should' => [
                            ['terms' => ["assigned_user_id" => $usersIds]],
                            ['terms' => ["_activityparticipantids" => $usersIds]],
                        ],
                        'minimum_should_match' => 1
                    ]
                ];
                //['terms' => ["assigned_user_id" => $usersIds]];
            }

            $moduleQueries[] = $moduleQuery;

            // collect all modules we shoudl query for building the serach URL listiung the indexes
            $queryModules[] = SpiceFTSUtils::getIndexNameForModule($module);

            // see if we shpould filter by the module int he post filters
            if ($objects && count($objects) > 0 && array_search_insensitive($module, $objects) === false) {
                $postFilters[] = [
                    'term' => ['_index' => SpiceFTSUtils::getIndexNameForModule($module)]
                ];
            }
        }

        // if we do not have any modules to query .. return an empty response
        if (count($queryModules) == 0) {
            return ['totalcount' => 0, 'aggregates' => [], 'items' => []];
        }

        // build the complete query
        $query = [
            "query" => [
                'bool' => [
                    'should' => $moduleQueries
                ]
            ]
        ];

        // set a size
        // ToDo: make this configurable
        // Make this configurable using another was than sugar_config and/or add aggs to group by id in results
        $query['size'] = (!empty(SpiceConfig::getInstance()->config['fts']['calendareventssize']) ? SpiceConfig::getInstance()->config['fts']['calendareventssize'] : 100);

        $elastichandler = new ElasticHandler();
        $results = json_decode($elastichandler->query('POST', join(',', $queryModules) . '/_search', null, $query), true);


        $moduleHandler = new ModuleHandler();

        $items = [];
        /** @todo clarify if we should add a check for the data types to split an object etc.. */
        foreach ($results['hits']['hits'] as &$hit) {
            $seed = BeanFactory::getBean($elastichandler->getHitModule($hit), $hit['_id']);
            foreach ($seed->field_name_map as $field => $fieldData) {
                //if (!isset($hit['_source']{$field}))
                if(is_string($seed->$field)){
                    $hit['_source'][$field] = html_entity_decode( $seed->$field, ENT_QUOTES);
                }
            }

            //$hit['_source']['emailaddresses'] = $moduleHandler->getEmailAddresses($elastichandler->getHitModule($hit), $hit['_id']);

            $hit['acl'] = $seed->getACLActions();
            // $hit['acl_fieldcontrol'] = $krestHandler->get_acl_fieldaccess($seed);

            // unset hidden fields
            foreach ($hit['acl_fieldcontrol'] as $field => $control) {
                if ($control == 1 && isset($hit['_source'][$field])) unset($hit['_source'][$field]);
            }
            $items[] = [
                'id' => $seed->id,
                'module' => $elastichandler->getHitModule($hit),
                'start' => $hit['_source']['_activitydate'],
                'end' => $hit['_source']['_activityenddate'],
                'type' => $elastichandler->getHitModule($hit) == 'UserAbsences' ? 'absence' : 'event',
                'data' => $moduleHandler->mapBeanToArray($elastichandler->getHitModule($hit), $seed)
            ];
        }

        return $items;
    }
}
