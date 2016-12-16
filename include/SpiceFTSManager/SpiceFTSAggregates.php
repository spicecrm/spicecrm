<?php

require_once('include/SpiceFTSManager/SpiceFTSFilters.php');

class SpiceFTSAggregates
{

    var $aggregateFields = array();
    var $aggregatesFilters = array();

    function __construct($indexProperties, $aggregatesFilters)
    {
        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['index'] == 'analyzed' && $indexProperty['search']) {
                $searchFields[] = $indexProperty['indexfieldname'];
            }

            if (!empty($indexProperty['aggregate'])) {

                // $this->aggregateFields[$indexProperty['fieldname']] = array(
                $this->aggregateFields[str_replace('->', '-', $indexProperty['indexfieldname'])] = array(
                    'indexfieldname' => $indexProperty['indexfieldname'],
                    'fieldname' => $indexProperty['fieldname'],
                    'field' => $indexProperty['indexfieldname'] . '.raw',
                    'name' => $indexProperty['name'],
                    'type' => $indexProperty['aggregate'],
                    'metadata' => SpiceFTSUtils::getFieldIndexParams(null, $indexProperty['path'])
                );

                // check if we have aggParams
                if ($indexProperty['aggregateaddparams']) {
                    $addParamsSting = html_entity_decode(base64_decode($indexProperty['aggregateaddparams']));
                    $addParamsSting = str_replace('$field', $indexProperty['indexfieldname'] . '.raw', $addParamsSting);
                    $this->aggregateFields[str_replace('->', '-', $indexProperty['indexfieldname'])]['aggParams'] = json_decode($addParamsSting, true);
                }
            }
        }

        $this->aggregatesFilters = $aggregatesFilters;
    }

    function buildQueryFilterFromAggregates()
    {
        $postFilter = array();
        foreach ($this->aggregatesFilters as $aggregatesFilter => $aggregatesFilterValues) {
            $postFilter['and'][] = SpiceFTSFilters::buildFiltersFromAggregate($this->aggregateFields[$aggregatesFilter]['indexfieldname'], $aggregatesFilterValues);
        }

        return count($postFilter) > 0 ? $postFilter : false;
    }

    function buildAggregates()
    {
        $aggs = array();
        foreach ($this->aggregateFields as $aggregateField => $aggregateIndexFieldData) {
            // go over all aggregate filters passed in and see if one is applicable to be added
            $aggFilters = array();

            $aggregateName = str_replace('->', '-', $aggregateIndexFieldData['indexfieldname']);

            foreach ($this->aggregatesFilters as $aggregatesFilter => $aggregatesFilterValues) {
                if ($aggregatesFilter != $aggregateIndexFieldData['indexfieldname'] && $aggregatesFilter != $aggregateField) {
                    $aggFilters['and'][] = SpiceFTSFilters::buildFiltersFromAggregate($this->aggregateFields[$aggregatesFilter]['indexfieldname'], $aggregatesFilterValues);
                }
            }

            // if we have a filter for the aggregation pass it in
            switch ($aggregateIndexFieldData['type']) {
                case 'datem':
                    $aggParams = array('date_histogram' => array(
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw',
                        "interval" => "month",
                        "format" => 'MM/yyyy'
                    ));
                    break;
                case 'datew':
                    $aggParams = array('date_histogram' => array(
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw',
                        "interval" => "week",
                        "format" => 'w/yyyy'
                    ));
                    break;
                case 'dateq':
                    $aggParams = array('date_histogram' => array(
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw',
                        "interval" => "quarter",
                        "format" => 'MM/yyyy'
                    ));
                    break;
                case 'datey':
                    $aggParams = array('date_histogram' => array(
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw',
                        "interval" => "year",
                        "format" => 'yyyy'
                    ));
                    break;
                case 'term':
                    $aggParams = array('terms' => array(
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw'
                    ));
                    break;
                case 'range':
                    if (isset($aggregateIndexFieldData['aggParams']))
                        $aggParams = $aggregateIndexFieldData['aggParams'];
                    break;
                default:
                    $aggParams = array('terms' => array(
                        'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw'
                    ));
                    break;
            }

            if (count($aggFilters) > 0) {
                $aggs{$aggregateName} = array(
                    'filter' => $aggFilters,
                    'aggs' => array(
                        $aggregateName => $aggParams
                    )
                );
            } else {
                $aggs{$aggregateName} = $aggParams;
            }
        }

        // add the field info so we can later on enrich thje reponse
        /*
        $aggregates[$aggregateName] = array(
            'field' => $aggregateIndexFieldData['indexfieldname'] . '.raw',
            'name' => $aggregateIndexFieldData['name']
        );
        */

        return count($aggs) > 0 ? $aggs : false;

    }

    function processAggregations(&$aggregations)
    {
        $appListStrings = return_app_list_strings_language($GLOBALS['current_language']);

        foreach ($aggregations as $aggField => $aggData) {

            if (!isset($aggData['buckets']) && isset($aggData[$aggField]) && isset($aggData[$aggField]['buckets'])) {
                $aggregations[$aggField]['buckets'] = $aggData[$aggField]['buckets'];
                unset($aggregations[$aggField][$aggField]);
            }

            $aggregations[$aggField]['aggregateindex'] = $aggField;
            $aggregations[$aggField]['fieldname'] = $this->aggregateFields[$aggField]['fieldname'];
            $aggregations[$aggField]['name'] = $this->aggregateFields[$aggField]['name'];

            foreach ($aggregations[$aggField]['buckets'] as $aggItemIndex => $aggItemData) {
                switch ($this->aggregateFields[$aggField]['type']) {
                    case 'datew':
                    case 'datem':
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['displayName'] = $aggItemData['key_as_string'];
                        $keyArr = explode('/', $aggItemData['key_as_string']);
                        $fromDate = new DateTime($keyArr[1] . '-' . $keyArr[0] . '-01 00:00:00');
                        $aggItemData['from'] = $fromDate->format('Y-m-d') . ' 00:00:00';
                        $aggItemData['to'] = $fromDate->format('Y-m-t') . ' 23:59:59';
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['aggdata'] = base64_encode(json_encode($aggItemData));
                        break;
                    case 'datey':
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['displayName'] = $aggItemData['key_as_string'];
                        $aggItemData['from'] = $aggItemData['key_as_string'] . '-01-01 00:00:00';
                        $aggItemData['to'] = $aggItemData['key_as_string'] . '-12-31 23:59:59';
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['aggdata'] = base64_encode(json_encode($aggItemData));
                        break;
                    case 'dateq':
                        $dateArray = explode('/', $aggItemData['key_as_string']);
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['displayName'] = 'Q' . ceil($dateArray[0] / 3) . '/' . $dateArray[1];

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
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['aggdata'] = base64_encode(json_encode($aggItemData));
                        break;
                    default:
                        switch ($this->aggregateFields[$aggField]['metadata']['type']) {
                            case 'enum':
                                $aggregations[$aggField]['buckets'][$aggItemIndex]['displayName'] = $appListStrings[$this->aggregateFields[$aggField]['metadata']['options']][$aggItemData['key']] ?: $aggItemData['key'];
                                $aggregations[$aggField]['buckets'][$aggItemIndex]['aggdata'] = base64_encode(json_encode($aggItemData));
                                break;
                            default:
                                $aggregations[$aggField]['buckets'][$aggItemIndex]['displayName'] = $aggItemData['key'];
                                $aggregations[$aggField]['buckets'][$aggItemIndex]['aggdata'] = base64_encode(json_encode($aggItemData));
                                break;
                        }
                        break;
                }

                // see if we need to check the box
                foreach ($this->aggregatesFilters[$aggField] as $aggregatesFilterValue) {
                    $filterData = json_decode(html_entity_decode(base64_decode($aggregatesFilterValue)), true);
                    if ($aggItemData['key'] == $filterData['key'])
                        $aggregations[$aggField]['buckets'][$aggItemIndex]['checked'] = true;
                }
            }
        }
    }
}