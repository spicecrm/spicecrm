<?php

require_once('include/SpiceFTSManager/SpiceFTSUtils.php');

class SpiceFTSBeanHandler
{
    var $seed = null;
    var $indexProperties = array();
    var $relatedIds = array();

    function __construct($bean)
    {
        global $beanList;

        $beanModule = array_search(get_class($bean), $beanList);
        $this->indexProperties = SpiceFTSUtils::getBeanIndexProperties($beanModule);

        $this->seed = $bean;
    }

    function normalizeBean()
    {
        $indexArray = array();
        foreach ($this->indexProperties as $indexProperty) {
            $indexValue = $this->getFieldValue($indexProperty);
            if ($indexValue['fieldvalue'] == '0' || !empty($indexValue['fieldvalue'])) {
                $indexArray[$indexValue['fieldname']] = from_html($indexValue['fieldvalue']); //use from_html to avoid things like ' being translated to &#039 on bean::save()
            }

            if(isset($indexValue['fields'])) {
                foreach ($indexValue['fields'] as $subFieldName => $subFieldValue)
                    $indexArray[$indexValue['fieldname'] . '_' . $subFieldName] = $subFieldValue;
            }
        }

        // push the related IDs
        $indexArray['related_ids'] = $this->relatedIds;

        // add Standard Fields
        foreach (SpiceFTSUtils::$standardFields as $standardField => $standardFieldData) {
            if ($this->seed->$standardField == '0' || !empty($this->seed->$standardField)) {
                $indexArray[$standardField] = $this->mapDataType($this->seed->field_name_map[$standardField]['type'], $this->seed->$standardField);
            }
        }

        // add the org management info
        // legacy handling
        if (!empty($GLOBALS['KAuthAccessController']) && $GLOBALS['KAuthAccessController']->orgManaged(get_class($this->seed))) {
            $indexArray['korgobjecthash'] = $this->seed->korgobjecthash;
            $indexArray['korguserhash'] = $this->seed->korguserhash;
        }

        // new handling
        if ($GLOBALS['ACLController'] && method_exists($GLOBALS['ACLController'], 'addFTSData')) {
            $addIndexArray = $GLOBALS['ACLController']->addFTSData($this->seed);
            foreach($addIndexArray as $indexfield => $indexValue)
                $indexArray[$indexfield] = $indexValue;
        }

        $indexArray['summary_text'] = from_html($this->seed->get_summary_text()); //use from_html to avoid things like ' being translated to &#039 on bean::save()

        if(method_exists($this->seed, 'add_fts_fields')){
            $addFields = $this->seed->add_fts_fields();
            if(is_array($addFields) && count($addFields) > 0){
                $indexArray = array_merge($indexArray, $addFields);
            }
        }

        return $indexArray;
    }

    private function getFieldValue($indexproperty)
    {
        global $sugar_config;

        $pathRecords = explode('::', $indexproperty['path']);
        $valueBean = null;
        $fieldName = '';
        $fieldValue = '';
        $fields = array();
        $relatedIDs = array();
        foreach ($pathRecords as $pathRecord) {
            $pathRecordDetails = explode(':', $pathRecord);
            switch ($pathRecordDetails[0]) {
                case 'root':
                    $valueBean = $this->seed;
                    break;
                case 'link':
                    $fieldName = $indexproperty['indexedname'] ?: (!empty($fieldName) ? $fieldName . '->' . $pathRecordDetails[2] : $pathRecordDetails[2]);
                    $beans = array();
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
                            $this->addRelated($bean->id);
                        }
                    } else {
                        $valueBean = reset($beans);
                        $this->addRelated($valueBean->id);
                    }
                    break;
                case 'field':
                    $fieldName = isset($indexproperty['indexedname']) ? $indexproperty['indexedname'] : (!empty($fieldName) ? $fieldName . '->' . $pathRecordDetails[1] : $pathRecordDetails[1]);
                    if (is_array($valueBean)) {
                        $valArray = array();
                        foreach ($valueBean as $thisValueBean) {
                            $valArray[] = $this->mapDataType('xxx', $thisValueBean->{$pathRecordDetails[1]});
                        }
                        $fieldValue = $valArray;
                        /*
                        // type specific handling
                        switch ($valueBean->field_name_map[$pathRecordDetails[1]]['type']) {
                            case 'enum':
                                foreach ($sugar_config['languages'] as $langkey => $langvalue) {
                                    $appListStrings = return_app_list_strings_language($langkey);
                                    foreach ($valArray as $val)
                                        $fields[$langkey][] = $appListStrings[$valueBean->field_name_map[$pathRecordDetails[1]]]['options'][$val];
                                }
                                break;
                        }
                        */

                    } else {
                        $fieldValue = $this->mapDataType($valueBean->field_name_map[$pathRecordDetails[1]]['type'], $valueBean->{$pathRecordDetails[1]});

                        /*
                        if ($fieldValue != '') {
                            // type specific handling
                            switch ($valueBean->field_name_map[$pathRecordDetails[1]]['type']) {
                                case 'enum':
                                    foreach ($sugar_config['languages'] as $langkey => $langvalue) {
                                        $appListStrings = return_app_list_strings_language($langkey);
                                        $fields[$langkey] = $appListStrings[$valueBean->field_name_map[$pathRecordDetails[1]]['options']][$fieldValue];
                                    }
                                    break;
                            }
                        }
                        */
                    }

                    // see if we have a related id for the field
                    if (isset($this->seed->field_name_map[$pathRecordDetails[1]]['id_name']) && $this->seed->field_name_map[$pathRecordDetails[1]]['id_name'] != '')
                        $this->addRelated($this->seed->{$this->seed->field_name_map[$pathRecordDetails[1]]['id_name']});

                    break;
            }
        }
        return array(
            'fieldname' => $fieldName,
            'fieldvalue' => $fieldValue
            // 'fields' => $fields
        );
    }

    private function mapDataType($type, $value)
    {
        global $timedate;
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
            case'date':
                if ($GLOBALS['disable_date_format'] !== true)
                    $retvalue = $timedate->to_db($value) ?: $value;
                break;
            case 'datetime':
            case 'datetimecombo':
                if ($GLOBALS['disable_date_format'] !== true)
                    $retvalue = $timedate->to_db($value) ?: $value;
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

    static function mapModule($module)
    {
        global $sugar_config;
        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($module);
        $properties = array();

        foreach (SpiceFTSUtils::$standardFields as $standardField => $standardFieldData) {
            $properties[$standardField] = array(
                'type' => $standardFieldData['type'] ?: 'text',
                'index' => $standardFieldData['index'] ?: 'analyzed'
            );

            if ($standardFieldData['format'])
                $properties[$standardField]['format'] = $standardFieldData['format'];
        }

        if (!empty($GLOBALS['KAuthAccessController']) && $GLOBALS['KAuthAccessController']->orgManaged($GLOBALS['beanList'][$module])) {
            $properties['korgobjecthash'] = array(
                'type' => 'string',
                'index' => 'not_analyzed'
            );
            $properties['korguserhash'] = array(
                'type' => 'string',
                'index' => 'not_analyzed'
            );
        }

        foreach ($indexProperties as $indexProperty) {

            //$fieldParams = SpiceFTSUtils::getFieldIndexParams(BeanFactory::getBean($module), $indexProperty['path']);

            $properties[$indexProperty['indexfieldname']] = array(
                'type' => $indexProperty['indextype'] ?: 'text',
            );

            /*
            switch ($fieldParams['type']) {
                case 'enum':
                    $properties[$indexProperty['indexfieldname']]['index'] = 'not_analyzed';
                    foreach ($sugar_config['languages'] as $langkey => $langname)
                        $properties[$indexProperty['indexfieldname' . '_' . $langkey]] = array(
                            'type' => 'string',
                            'index' => 'analyzed'
                        );
                    break;
            }
            */

            if ($properties[$indexProperty['indexfieldname']]['type'] == 'date')
                $properties[$indexProperty['indexfieldname']]['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";

            if ($indexProperty['analyzer']) {
                $properties[$indexProperty['indexfieldname']]['analyzer'] = $indexProperty['analyzer'];
                // $properties[$indexProperty['indexfieldname']]['search_analyzer'] = 'standard';
            }

            if ($indexProperty['index'])
                $properties[$indexProperty['indexfieldname']]['index'] = $indexProperty['index'];

            if ($indexProperty['format'])
                $properties[$indexProperty['indexfieldname']]['format'] = $indexProperty['format'];

            /*
            if ($indexProperty['boost'])
                $properties[$indexProperty['indexfieldname']]['boost'] = $indexProperty['boost'];
            */

            if (!empty($indexProperty['aggregate']) || $indexProperty['enablesort']) {
                $properties[$indexProperty['indexfieldname']]['fields']['raw'] = array(
                    'type' => $indexProperty['indextype'] ?: 'string',
                    'index' => 'not_analyzed'
                );

                if ($properties[$indexProperty['indexfieldname']]['fields']['raw']['type'] == 'date')
                    $properties[$indexProperty['indexfieldname']]['fields']['raw']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
            }
        }

        $seed = BeanFactory::getBean($module);
        if(method_exists($seed, 'add_fts_metadata')){
            $addFields = $seed->add_fts_metadata();
            if(is_array($addFields) && count($addFields) > 0){
                foreach($addFields as $addFieldName => $addField){
                    $properties[$addFieldName] = array(
                        'type' =>  $addField['type'],
                        'index' =>  $addField['index']
                    );

                    if (!empty($addField['aggregate']) || $addField['enablesort']) {
                        $properties[$addFieldName]['fields']['raw'] = array(
                            'type' => $addField['type'] ?: 'string',
                            'index' => 'not_analyzed'
                        );

                        if ($properties[$addFieldName]['fields']['raw']['type'] == 'date')
                            $properties[$addFieldName]['fields']['raw']['format'] = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis";
                    }
                }
            }
        }

        return $properties;
    }
}