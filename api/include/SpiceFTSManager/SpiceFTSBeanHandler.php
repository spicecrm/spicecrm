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
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\SpicePhoneNumberParser\SpicePhoneNumberParser;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class SpiceFTSBeanHandler
{
    var $seed = null;
    var $seedModule = null;
    var $indexProperties = [];
    var $indexSettings = [];
    var $relatedIds = [];
    var $parentIds = [];

    function __construct($bean)
    {
        // check if we have a beanname or a bean object being passed in
        if (!is_string($bean)) {
            $beanModule = $bean->_module;
            $this->seed = $bean;
            $this->seedModule = $beanModule;
        } else {
            $beanModule = $bean;
            $this->seedModule = $bean;
        }

        $this->indexProperties = SpiceFTSUtils::getBeanIndexProperties($beanModule);
        $this->indexSettings = SpiceFTSUtils::getBeanIndexSettings($beanModule);


    }

    /**
     * returns the aggregates defined for the bean
     */
    function getAggregates()
    {
        $aggregates = [];
        foreach ($this->indexProperties as $indexProperty) {
            $details = SpiceFTSUtils::getDetailsForField($indexProperty['path']);
            if (isset($indexProperty['aggregate']) && (!empty($details['field']) || !empty($details['module']))) {
                $aggregates[] = [
                    'fieldname' => $indexProperty['fieldname'],
                    'indexfieldname' => $indexProperty['indexfieldname'],
                    'fielddetails' => $details,
                    'type' => $indexProperty['aggregate'],
                    'collapsed' => $indexProperty['aggregatecollapsed'] == 1 ? true : false,
                    'priority' => $indexProperty['aggregatepriority'],
                    'system' => $indexProperty['aggregatesystem']
                ];
            }
        }
        return $aggregates;
    }

    /**
     * called to normalize the bean
     *
     * the function takes a bean and resolves the fts settings flatteing the relational structure building the elastic document
     *
     * @return array the array with the fields and values to be indexed by elastic
     */
    function normalizeBean()
    {
        $indexArray = [
            '_module' => $this->seedModule
        ];
        foreach ($this->indexProperties as $indexProperty) {
            $indexValue = $this->getFieldValue($indexProperty);
            if ($indexValue['fieldvalue'] == '0' || !empty($indexValue['fieldvalue'])) {
                $indexArray[$indexValue['fieldname']] = from_html($indexValue['fieldvalue']); //use from_html to avoid things like ' being translated to &#039 on bean::save()

                // handling for the activities
                if (!empty($indexProperty['activitytype'])) {
                    switch ($indexProperty['activitytype']) {
                        case 'activityparentid';
                            // initialize if it is not an array yet
                            if (!is_array($indexArray['_activityparentids'])) $indexArray['_activityparentids'] = [];

                            // append or add the id
                            if (is_array($indexValue['fieldvalue'])) {
                                $indexArray['_activityparentids'] = array_merge($indexArray['_activityparentids'], $indexValue['fieldvalue']);
                            } else {
                                $indexArray['_activityparentids'][] = $indexValue['fieldvalue'];
                            }

                            // remove any potential duplicates
                            // $indexArray['_activityparentids'] = array_unique($indexArray['_activityparentids']);
                            break;
                        case 'activityparticipant';
                            // initialize if it is not an array yet
                            if (!is_array($indexArray['_activityparticipantids'])) $indexArray['_activityparticipantids'] = [];

                            // append or add the id
                            if (is_array($indexValue['fieldvalue'])) {
                                $indexArray['_activityparticipantids'] = array_merge($indexArray['_activityparticipantids'], $indexValue['fieldvalue']);
                            } else {
                                $indexArray['_activityparticipantids'][] = $indexValue['fieldvalue'];
                            }
                            break;
                        default:
                            $indexArray['_' . $indexProperty['activitytype']] = from_html($indexValue['fieldvalue']);
                            break;
                    }
                }

                // handling for phon enumbers
                if ($indexProperty['phonesearch']) {
                    $indexArray['_phone'][] = SpicePhoneNumberParser::convertToE164($indexValue['fieldvalue']);
                }
            }

            if (isset($indexValue['fields'])) {
                foreach ($indexValue['fields'] as $subFieldName => $subFieldValue)
                    $indexArray[$indexValue['fieldname'] . '_' . $subFieldName] = $subFieldValue;
            }
        }

        // push the related IDs & parent IDs
        $indexArray['related_ids'] = $this->relatedIds;
        // $indexArray['parent_ids'] = $this->parentIds;

        // add Standard Fields
        foreach (SpiceFTSUtils::$standardFields as $standardField => $standardFieldData) {
            if (isset($this->seed->field_name_map[$standardField]) && isset($this->seed->$standardField) and ($this->seed->$standardField == '0' || !empty($this->seed->$standardField))) {
                $indexArray[$standardField] = $this->mapDataType($this->seed->field_name_map[$standardField]['type'], $this->seed->$standardField);
            }
        }

        // ACL Controller handling
        if (SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'addFTSData')) {
            $addIndexArray = SpiceACL::getInstance()->addFTSData($this->seed);
            foreach ($addIndexArray as $indexfield => $indexValue)
                $indexArray[$indexfield] = $indexValue;
        }

        // add the summary text
        $indexArray['summary_text'] = from_html($this->seed->get_summary_text()); //use from_html to avoid things like ' being translated to &#039 on bean::save()

        // call module funtion
        if (method_exists($this->seed, 'add_fts_fields')) {
            $addFields = $this->seed->add_fts_fields();
            if (is_array($addFields) && count($addFields) > 0) {
                $indexArray = array_merge($indexArray, $addFields);
            }
        }

        // add the geo location if set
        if ($this->indexSettings['geosearch'] && $this->indexSettings['geolat'] && $this->indexSettings['geolng'] && !empty($this->seed->{$this->indexSettings['geolat']}) && !empty($this->seed->{$this->indexSettings['geolng']})) {
            $indexArray['_location'] = ['lat' => $this->seed->{$this->indexSettings['geolat']}, 'lon' => $this->seed->{$this->indexSettings['geolng']}];
        }

        return $indexArray;
    }

    public function getModuleSearchQuery($searchterm, $addFilters = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $searchFields = [];

        // $aggregateFields = [];
        foreach ($this->indexProperties as $indexProperty) {
            if ($indexProperty['search']) {
                if ($indexProperty['boost'])
                    $searchFields[] = $indexProperty['indexfieldname'] . '^' . $indexProperty['boost'];
                else
                    $searchFields[] = $indexProperty['indexfieldname'];
            }
        }


        if (count($searchFields) == 0)
            return [];

        if (!empty($searchterm)) {
            $moduleQuery = [
                'bool' => [
                    'must' => [
                        "multi_match" => [
                            "query" => "$searchterm",
                            'analyzer' => 'standard',
                            'fields' => $searchFields,
                        ]

                    ]
                ]
            ];


            if ($this->indexSettings['minimum_should_match'])
                $moduleQuery['bool']['must']['multi_match']['minimum_should_match'] = $this->indexSettings['minimum_should_match'] . '%';

            if ($this->indexSettings['fuzziness'])
                $moduleQuery['bool']['must']['multi_match']['fuzziness'] = $this->indexSettings['fuzziness'];


            if ($this->indexSettings['operator'])
                $moduleQuery['bool']['must']['multi_match']['operator'] = $this->indexSettings['operator'];

            if ($this->indexSettings['multimatch_type'])
                $moduleQuery['bool']['must']['multi_match']['type'] = $this->indexSettings['multimatch_type'];


        }

        // add ACL Check filters
        if (!$current_user->is_admin && SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'getFTSQuery')) {
            $aclFilters = SpiceACL::getInstance()->getFTSQuery($this->seedModule);
            if (count($aclFilters) > 0) {
                // do not write empty entries
                if (isset($aclFilters['should']) && count($aclFilters['should']) >= 1) {
                    $moduleQuery['bool']['filter']['bool']['should'] = $aclFilters['should'];
                    $moduleQuery['bool']['filter']['bool']['minimum_should_match'] = 1;
                }
                if (isset($aclFilters['must_not']) && count($aclFilters['must_not']) >= 1) {
                    $moduleQuery['bool']['filter']['bool']['must_not'] = $aclFilters['must_not'];
                }
                if (isset($aclFilters['must']) && count($aclFilters['must']) >= 1) {
                    $moduleQuery['bool']['filter']['bool']['must'] = $aclFilters['must'];
                }

            }
        }

        // process additional filters
        if (is_array($addFilters) && count($addFilters) > 0) {
            if (is_array($moduleQuery['bool']['filter']['bool']['must'])) {
                foreach ($addFilters as $addFilter)
                    $moduleQuery['bool']['filter']['bool']['must'][] = $addFilter;
            } else {
                $moduleQuery['bool']['filter']['bool']['must'] = $addFilters;
            }
        }

        return $moduleQuery;
    }

    private function getFieldValue($indexproperty)
    {
        

        $pathRecords = explode('::', $indexproperty['path']);
        $valueBean = null;
        $fieldName = '';
        $fieldValue = '';
        foreach ($pathRecords as $pathRecord) {

            $pathRecordDetails = explode(':', $pathRecord);
            switch ($pathRecordDetails[0]) {
                case 'root':
                    $valueBean = $this->seed;
                    break;
                case 'link':
                    $fieldName = isset($indexproperty['indexedname']) ?: (!empty($fieldName) ? $fieldName . '->' . $pathRecordDetails[2] : $pathRecordDetails[2]);
                    $beans = [];
                    if (is_array($valueBean)) {
                        foreach ($valueBean as $thisValueBean) {
                            $thisValueBean->load_relationship($pathRecordDetails[2]);
                            $thisBeans = $thisValueBean->{$pathRecordDetails[2]}->getBeans();
                            $beans = array_merge($beans, $thisBeans);
                        }
                    } else {
                        $valueBean->load_relationship($pathRecordDetails[2]);
                        $beans = $valueBean->{$pathRecordDetails[2]}->getBeans();
                    }

                    // if we doid not find related beans reutnr false
                    if (count($beans) === 0)
                        return false;

                    if (count($beans) > 1) {
                        $valueBean = $beans;
                        foreach ($beans as $bean) {
                            switch ($indexproperty['indextype']) {
                                case 'parentid':
                                    break;
                                default:
                                    $this->addRelated($bean->id);
                                    break;
                            }

                        }
                    } else {
                        $valueBean = reset($beans);
                        switch ($indexproperty['indextype']) {
                            case 'parentid':
                                break;
                            default:
                                $this->addRelated($valueBean->id);
                                break;
                        }
                    }
                    break;
                case 'field':
                    $fieldName = isset($indexproperty['indexedname']) ? $indexproperty['indexedname'] : (!empty($fieldName) ? $fieldName . '->' . $pathRecordDetails[1] : $pathRecordDetails[1]);
                    if (is_array($valueBean)) {
                        $valArray = [];
                        foreach ($valueBean as $thisValueBean) {
                            // BEGIN CR1000343 handle function: enrich value for bean property before it is processed for indexing
                            if (isset($indexproperty['function'])) {
                                $valArray[] = $this->enrichDataByFunction($indexproperty);
                            } // END
                            else {
                                $valArray[] = $this->mapDataType($thisValueBean->field_name_map[$pathRecordDetails[1]]['type'], $thisValueBean->{$pathRecordDetails[1]});
                            }
                        }
                        $fieldValue = $valArray;

                    } else {
                        // BEGIN CR1000343 handle function: enrich value for bean property before it is processed for indexing
                        if (isset($indexproperty['function'])) {
                            $fieldValue = $this->enrichDataByFunction($indexproperty);
                        } // END
                        else {
                            $fieldValue = $this->mapDataType($valueBean->field_name_map[$pathRecordDetails[1]]['type'], $valueBean->{$pathRecordDetails[1]});
                        }
                    }

                    // see if we have a related id for the field
                    if (isset($this->seed->field_name_map[$pathRecordDetails[1]]['id_name']) && $this->seed->field_name_map[$pathRecordDetails[1]]['id_name'] != '')
                        $this->addRelated($this->seed->{$this->seed->field_name_map[$pathRecordDetails[1]]['id_name']});
                    break;
            }
        }

        return [
            'fieldname' => $fieldName,
            'fieldvalue' => $fieldValue
        ];
    }

    /**
     * CR1000343 handle function: enrich value for bean property before it is processed for indexing
     */
    private function enrichDataByFunction($indexproperty)
    {
        // extract class name
        $functionData = explode("->", $indexproperty['function']);
        if (count($functionData) != 2) {
            $functionData = explode("::", $indexproperty['function']);
        }
        // call
        if (class_exists($functionData[0])) {
            $functionObj = new $functionData[0]();
            if (method_exists($functionObj, $functionData[1])) {
                // overwrite value
                return $functionObj->{$functionData[1]}($this->seed);
            }
        }
    }

    private function mapDataType($type, $value)
    {
        $timedate = TimeDate::getInstance();
        $retvalue = $value;
        switch ($type) {
            case 'boolean':
            case 'bool':
                $retvalue = $value ? '1' : '0';
                break;
            case 'multienum':
                if (strpos($value, '^,^') !== false) {
                    $retvalue = explode('^,^', substr($value, 1, strlen($value) - 2));
                } else {
                    $retvalue = trim($value, '^');
                }
                break;
            case'tags':
                $retvalue = json_decode(html_entity_decode($value), true) ?: [];
                break;
            case 'datetime':
            case 'datetimecombo':
                // catch bad date format like '0000-00-00'
                if ($retvalue == '0000-00-00' || $retvalue == '0000-00-00 00:00:00') {
                    $retvalue = null;
                }
                break;
        }
        return $retvalue;
    }

    private function addRelated($id)
    {
        if (array_search($id, $this->relatedIds) === false) {
            $this->relatedIds[] = $id;
        }
    }

    public function mapModule()
    {
        
        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($this->seedModule, true);
        $properties = [
            '_module' => [
                'type' => 'keyword',
                'index' => false
            ]
        ];

        // if we have a phone searc enabled add a _phone field
        if ($this->indexSettings['phonesearch']) {
            $properties['_phone'] = [
                'type' => 'keyword',
                'index' => true
            ];
        }

        foreach (SpiceFTSUtils::$standardFields as $standardField => $standardFieldData) {
            $properties[$standardField] = [
                'type' => $standardFieldData['type'] ?: 'text',
            ];

            if ($standardFieldData['format'])
                $properties[$standardField]['format'] = $standardFieldData['format'];

            if ($standardFieldData['analyzer']) {
                $properties[$standardField]['analyzer'] = $standardFieldData['analyzer'];
                $properties[$standardField]['search_analyzer'] = $standardFieldData['search_analyzer'] ?: 'standard';
            }

            if ($standardFieldData['enablesort'] || $standardFieldData['suggest'] || ($standardFieldData['duplicatecheck'] && $standardFieldData['duplicatequery'] == 'term')) {
                $properties[$standardField]['fields']['raw'] = [
                    'type' => $standardFieldData['indextype'] && $standardFieldData['indextype'] != 'text' ? $standardFieldData['indextype'] : 'keyword',
                    'index' => true
                ];
                if ($standardFieldData['indextype'] == 'keyword') {
                    $properties[$standardField]['fields']['raw']['normalizer'] = 'spice_lowercase';
                }

                // add a sepoarate field for the suggester to have an autocomplete
                if ($standardFieldData['suggest']) {
                    $properties[$standardField]['fields']['suggester'] = [
                        'type' => 'completion'
                    ];
                }

                if ($properties[$standardField]['fields']['raw']['type'] == 'date')
                    $properties[$standardField]['fields']['raw']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
            }

            // add separate field for the aggregates
            if (!empty($standardFieldData['aggregate'])) {
                $properties[$standardField]['fields']['agg'] = [
                    'type' => $standardFieldData['indextype'] && $standardFieldData['indextype'] != 'text' ? $standardFieldData['indextype'] : 'keyword',
                    'index' => true
                ];

                if ($properties[$standardField]['fields']['agg']['type'] == 'date')
                    $properties[$standardField]['fields']['agg']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
            }
        }

        foreach ($indexProperties as $indexProperty) {
            $this->mapIndexProperty($indexProperty, $properties);
        }

        $seed = BeanFactory::getBean($this->seedModule);
        if (method_exists($seed, 'add_fts_metadata')) {
            $addFields = $seed->add_fts_metadata();
            if (is_array($addFields) && count($addFields) > 0) {
                foreach ($addFields as $addFieldName => $addField) {
                    $properties[$addFieldName] = [
                        'type' => $addField['type'],
                        'index' => $addField['index'] ?: false
                    ];

                    if ($addField['enablesort']) {
                        $properties[$addFieldName]['fields']['raw'] = [
                            'type' => $addField['type'] && $addField['type'] != 'keyword' ? $addField['type'] : 'keyword',
                            //'type' =>  'keyword',
                            //'normalizer' => 'spice_lowercase',
                            'index' => true
                        ];
                        if ($addField['type'] == 'keyword') {
                            $properties[$addFieldName]['fields']['raw']['normalizer'] = 'spice_lowercase';
                        }

                        if ($properties[$addFieldName]['fields']['raw']['type'] == 'date')
                            $properties[$addFieldName]['fields']['raw']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
                    }

                    // separate handling for the aggregates
                    if (!empty($addField['aggregate'])) {
                        $properties[$addFieldName]['fields']['agg'] = [
                            'type' => $addField['type'] && $addField['type'] != 'text' ? $addField['type'] : 'keyword',
                            'index' => true
                        ];

                        if ($properties[$addFieldName]['fields']['agg']['type'] == 'date')
                            $properties[$addFieldName]['fields']['agg']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";

                    }
                }
            }
        }

        // sort by name
        ksort($properties);

        return $properties;
    }

    private function mapIndexProperty($indexProperty, &$properties)
    {
        $fieldParams = SpiceFTSUtils::getFieldIndexParams(BeanFactory::getBean($this->seedModule), $indexProperty['path']);

        $indexFieldName = $indexProperty['indexfieldname'];

        $properties[$indexFieldName] = [
            'type' => $indexProperty['indextype'] ?: 'text',
            'index' => true
        ];


        if ($indexProperty['analyzer']) {
            $properties[$indexFieldName]['analyzer'] = $indexProperty['analyzer'];
            $properties[$indexFieldName]['search_analyzer'] = $indexProperty['search_analyzer'] ?: 'standard';
        }

        // if ($indexProperty['index']) $properties[$indexFieldName]['index'] = $indexProperty['index'];

        // set the format .. resp when date is set
        if ($indexProperty['format']) $properties[$indexFieldName]['format'] = $indexProperty['format'];
        if ($properties[$indexFieldName]['type'] == 'date') $properties[$indexFieldName]['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";

        if ($indexProperty['indextype'] !== 'date' && ($indexProperty['enablesort'] || $indexProperty['suggest'] || ($indexProperty['duplicatecheck'] && $indexProperty['duplicatequery'] == 'term'))) {
            $properties[$indexFieldName]['fields']['raw'] = [
                'type' => $indexProperty['indextype'] && $indexProperty['indextype'] != 'text' ? $indexProperty['indextype'] : 'keyword',
                'index' => true
            ];

            // for enum type fields resp string and eyaword .. swicth raw to lowercase .. enabling proper sort
            if ($fieldParams['type'] != 'enum' && $fieldParams['type'] != 'multienum' && $indexProperty['indextype'] == 'keyword') {
                $properties[$indexFieldName]['fields']['raw']['normalizer'] = 'spice_lowercase';
            }

            // force date format for date fields
            if ($properties[$indexFieldName]['fields']['raw']['type'] == 'date') $properties[$indexFieldName]['fields']['raw']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
        }


        // separate handling for the aggregates
        if (!empty($indexProperty['aggregate'])) {
            $properties[$indexFieldName]['fields']['agg'] = [
                'type' => $indexProperty['indextype'] && $indexProperty['indextype'] != 'text' ? $indexProperty['indextype'] : 'keyword',
                'index' => true
            ];

            // force date format for date fields
            if ($properties[$indexFieldName]['fields']['agg']['type'] == 'date') $properties[$indexFieldName]['fields']['agg']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
        }

        // handle activity types
        $this->handleActivitiySettings($indexProperty, $properties);
    }

    private function handleActivitiySettings($indexProperty, &$properties)
    {
        switch ($indexProperty['activitytype']) {
            case 'activitydate':
                $properties['_activitydate'] = [
                    'type' => 'date',
                    "index" => true,
                    'format' => "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
                ];
                break;
            case 'activityenddate':
                $properties['_activityenddate'] = [
                    'type' => 'date',
                    "index" => true,
                    'format' => "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
                ];
                break;
            case 'activityparentid':
                $properties['_activityparentids'] = [
                    'type' => 'keyword',
                    "index" => true
                ];
                break;

            case 'activityparticipant':
                $properties['_activityparticipantids'] = [
                    'type' => 'keyword',
                    "index" => true
                ];
                break;
        }
    }
}
