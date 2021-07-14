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

use DateTime;
use SpiceCRM\includes\SugarObjects\SpiceModules;

/**
 * Class SpiceFTSAggregates
 * @package SpiceCRM\includes\SpiceFTSManager
 *
 * handles the aggregates for teh FTS Queries to Elastic
 */
class SpiceFTSAggregates
{

    var $module;
    var $aggregateFields = [];
    var $aggregatesFilters = [];

    function __construct($module, $indexProperties, $aggregatesFilters, $indexSettings = [])
    {

        // set the module
        $this->module = $module;

        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['search']) {
                $searchFields[] = $indexProperty['indexfieldname'];
            }

            if (!empty($indexProperty['aggregate'])) {

                // $this->aggregateFields[$indexProperty['fieldname']] = array(
                $this->aggregateFields[str_replace('->', '-', $indexProperty['indexfieldname'])] = [
                    'indexfieldname' => $indexProperty['indexfieldname'],
                    'fieldname' => $indexProperty['fieldname'],
                    'fielddetails' => SpiceFTSUtils::getDetailsForField($indexProperty['path']),
                    'field' => $indexProperty['indexfieldname'] . '.agg',
                    'name' => $indexProperty['name'],
                    'type' => $indexProperty['aggregate'],
                    'aggregateempty' => $indexProperty['aggregateempty'],
                    'aggregatesize' => $indexProperty['aggregatesize'],
                    'aggregatepriority' => $indexProperty['aggregatepriority'],
                    'metadata' => SpiceFTSUtils::getFieldIndexParams(null, $indexProperty['path'])
                ];

                // check on sort parameters for aggregates
                if(!empty($indexProperty['aggregatesortby']) && !empty($indexProperty['aggregatesort'])){
                    $this->aggregateFields[str_replace('->', '-', $indexProperty['indexfieldname'])]['aggregatesortby'] = $indexProperty['aggregatesortby'];
                    $this->aggregateFields[str_replace('->', '-', $indexProperty['indexfieldname'])]['aggregatesort'] = $indexProperty['aggregatesort'];
                }

                // check if we have aggParams
                if ($indexProperty['aggregateaddparams']) {
                    $addParamsSting = html_entity_decode(base64_decode($indexProperty['aggregateaddparams']));
                    $addParamsSting = str_replace('$field', $indexProperty['indexfieldname'] . '.agg', $addParamsSting);
                    $this->aggregateFields[str_replace('->', '-', $indexProperty['indexfieldname'])]['aggParams'] = json_decode($addParamsSting, true);
                }
            }
        }



        $this->aggregatesFilters = $aggregatesFilters;
    }

    function buildQueryFilterFromAggregates()
    {
        $postFilter = [];
        foreach ($this->aggregatesFilters as $aggregatesFilter => $aggregatesFilterValues) {
            $postFilter['bool']['must'][] = SpiceFTSFilters::buildFiltersFromAggregate($this->aggregateFields[$aggregatesFilter]['indexfieldname'] ?: $aggregatesFilter, $aggregatesFilterValues);
        }

        return count($postFilter) > 0 ? $postFilter : false;
    }

    /**
     * build the aggregate filter based on the ggregates
     *
     * @return array
     */
    function buildAggFilters(){
        $aggFilters = [];
        foreach ($this->aggregatesFilters as $aggregatesFilter => $aggregatesFilterValues) {
                $aggFilters['bool']['must'][] = SpiceFTSFilters::buildFiltersFromAggregate($this->aggregateFields[$aggregatesFilter]['indexfieldname'], $aggregatesFilterValues);
        }
        return $aggFilters;
    }

    function buildAggregates()
    {
        $aggs = [];
        foreach ($this->aggregateFields as $aggregateField => $aggregateIndexFieldData) {
            // go over all aggregate filters passed in and see if one is applicable to be added
            $aggFilters = [];

            $aggregateName = str_replace('->', '-', $aggregateIndexFieldData['indexfieldname']);

            foreach ($this->aggregatesFilters as $aggregatesFilter => $aggregatesFilterValues) {
                if ($aggregatesFilter != $aggregateIndexFieldData['indexfieldname'] && $aggregatesFilter != $aggregateField) {
                    $aggFilters['bool']['must'][] = SpiceFTSFilters::buildFiltersFromAggregate($this->aggregateFields[$aggregatesFilter]['indexfieldname'], $aggregatesFilterValues);
                }
            }

            // if we have a filter for the aggregation pass it in
            switch ($aggregateIndexFieldData['type']) {
                case 'datem':
                    $aggParams = ['date_histogram' => [
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg',
                        "interval" => "month",
                        "format" => 'MM/yyyy'
                    ]];
                    break;
                case 'datew':
                    $aggParams = ['date_histogram' => [
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg',
                        "interval" => "week",
                        "format" => 'w/yyyy'
                    ]];
                    break;
                case 'dateq':
                    $aggParams = ['date_histogram' => [
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg',
                        "interval" => "quarter",
                        "format" => 'MM/yyyy'
                    ]];
                    break;
                case 'datey':
                    $aggParams = ['date_histogram' => [
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg',
                        "interval" => "year",
                        "format" => 'yyyy'
                    ]];
                    break;
                case 'term':
                    $aggParams = ['terms' => [
                        'size' => !empty($aggregateIndexFieldData['aggregatesize']) ? (int) $aggregateIndexFieldData['aggregatesize'] : 10,
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg'
                    ]];

                    // check if we shoudl aggregate empty values
                    if($aggregateIndexFieldData['aggregateempty']){
                        $aggParams['terms']['missing'] = '#not#set#';
                    }

                    if(!empty($aggregateIndexFieldData['aggregatesortby']) && !empty($aggregateIndexFieldData['aggregatesort'])){
                        $aggParams['terms']['order'] = [$aggregateIndexFieldData['aggregatesortby'] => $aggregateIndexFieldData['aggregatesort']];
                    }
                    break;
                case 'range':
                    if (isset($aggregateIndexFieldData['aggParams']))
                        $aggParams = $aggregateIndexFieldData['aggParams'];
                    break;
                default:
                    $aggParams = ['terms' => [
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg'
                    ]];
                    break;
            }

            if (count($aggFilters) > 0) {
                $aggs[$aggregateName] = [
                    'filter' => $aggFilters,
                    'aggs' => [
                        $aggregateName => $aggParams
                    ]
                ];
            } else {
                $aggs[$aggregateName] = $aggParams;
            }
        }



        $aggFilters = [];
        foreach ($this->aggregatesFilters as $aggregatesFilter => $aggregatesFilterValues) {
            if (SpiceModules::getInstance()->taggingActive($this->module) && $aggregatesFilter != 'tags') {
                $aggFilters['bool']['must'][] = SpiceFTSFilters::buildFiltersFromAggregate('tags', $aggregatesFilterValues);
            }
        }

        // add tags
        if(SpiceModules::getInstance()->taggingActive($this->module)) {
            $tagAggregator = [
                'terms' => [
                    'field' => 'tags.agg',
                    'size' => 25
                ]
            ];
            if (count($aggFilters) > 0) {
                $aggs['tags'] = [
                    'filter' => $aggFilters,
                    'aggs' => [
                        'tags' => $tagAggregator
                    ]
                ];
            } else {
                $aggs['tags'] = $tagAggregator;
            }
        }


        // add the field info so we can later on enrich thje reponse
        /*
        $aggregates[$aggregateName] = array(
            'field' => $aggregateIndexFieldData['indexfieldname'] . '.agg',
            'name' => $aggregateIndexFieldData['name']
        );
        */

        return count($aggs) > 0 ? $aggs : false;

    }

    function processAggregations(&$aggregations)
    {
        // $appListStrings = return_app_list_strings_language($GLOBALS['current_language']);

        foreach ($aggregations as $aggField => $aggData) {

            $aggregations[$aggField]['aggregateindex'] = $aggField;
            $aggregations[$aggField]['aggregatepriority'] = $this->aggregateFields[$aggField]['aggregatepriority'];;
            $aggregations[$aggField]['fieldname'] = $this->aggregateFields[$aggField]['fieldname'];
            $aggregations[$aggField]['fielddetails'] = $this->aggregateFields[$aggField]['fielddetails'];
            $aggregations[$aggField]['name'] = $this->aggregateFields[$aggField]['name'];
            $aggregations[$aggField]['type'] = $this->aggregateFields[$aggField]['type'];

//            $buckets = $aggregations[$aggField]['buckets'] ?: $aggregations[$aggField][$aggField]['buckets'];
            $buckets = !empty($aggregations[$aggField]['buckets']) ? $aggregations[$aggField]['buckets'] : (!empty($aggregations[$aggField][$aggField]['buckets']) ? $aggregations[$aggField][$aggField]['buckets'] : []);

            foreach ($buckets as $aggItemIndex => &$aggItemData) {


                if($aggItemData['doc_count'] == 0) {
                    unset($buckets[$aggItemIndex]);
                    //continue;
                }


                switch ($this->aggregateFields[$aggField]['type']) {
                    case 'datew':
                    case 'datem':
                    $aggItemData['displayName'] = $aggItemData['key_as_string'];
                        $keyArr = explode('/', $aggItemData['key_as_string']);
                        $fromDate = new DateTime($keyArr[1] . '-' . $keyArr[0] . '-01 00:00:00');
                        $aggItemData['from'] = $fromDate->format('Y-m-d') . ' 00:00:00';
                        $aggItemData['to'] = $fromDate->format('Y-m-t') . ' 23:59:59';
                    $aggItemData['aggdata'] = $this->getAggItemData($aggItemData);
                        break;
                    case 'datey':
                        $aggItemData['displayName'] = $aggItemData['key_as_string'];
                        $aggItemData['from'] = $aggItemData['key_as_string'] . '-01-01 00:00:00';
                        $aggItemData['to'] = $aggItemData['key_as_string'] . '-12-31 23:59:59';
                        $aggItemData['aggdata'] = $this->getAggItemData($aggItemData);
                        break;
                    case 'dateq':
                        $dateArray = explode('/', $aggItemData['key_as_string']);
                        $aggItemData['displayName'] = 'Q' . ceil($dateArray[0] / 3) . '/' . $dateArray[1];

                        switch (ceil($dateArray[0] / 3)) {
                            case 1:
                                $aggItemData['from'] = $dateArray[1] . '-01-01 00:00:00';
                                $aggItemData['to'] = $dateArray[1] . '-03-31 23:59:59';
                                break;
                            case 2:
                                $aggItemData['from'] = $dateArray[1] . '-04-01 00:00:00';
                                $aggItemData['to'] = $dateArray[1] . '-06-30 23:59:59';
                                break;
                            case 3:
                                $aggItemData['from'] = $dateArray[1] . '-07-01 00:00:00';
                                $aggItemData['to'] = $dateArray[1] . '-09-30 23:59:59';
                                break;
                            case 4:
                                $aggItemData['from'] = $dateArray[1] . '-10-01 00:00:00';
                                $aggItemData['to'] = $dateArray[1] . '-12-31 23:59:59';
                                break;
                        }
                        $aggItemData['aggdata'] = $this->getAggItemData($aggItemData);
                        break;
                    default:
                        $aggItemData['displayName'] = $aggItemData['key'];
                        $aggItemData['aggdata'] = $this->getAggItemData($aggItemData);
                        break;
                }

                // see if we need to check the box
                /*
                foreach ($this->aggregatesFilters[$aggField] as $aggregatesFilterValue) {
                    $filterData = json_decode(html_entity_decode(base64_decode($aggregatesFilterValue)), true);
                    if ($aggItemData['key'] == $filterData['key'])
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['checked'] = true;
                }
                */
            }

            // nasty trick to get this array reshuffled - if not seuenced angular will not iterate over it
            // ToDo: find a nice way to handle this
            $aggregations[$aggField]['buckets'] = array_merge($buckets ?? [], []);
        }
        return $aggregations;
    }

    private function getAggItemData($aggItemData){
        $aggData = [];

        foreach($aggItemData as $key => $value){
            if($key !== 'doc_count'){
                $aggData[$key] = $value;
            }
        }
        return base64_encode(json_encode($aggData));
    }
}
