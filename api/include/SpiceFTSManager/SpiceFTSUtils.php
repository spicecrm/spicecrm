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
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class SpiceFTSUtils
{
    static $standardFields = [
        'id' => [
            'type' => 'keyword',
            'index' => true
        ],
        'summary_text' => [
            'type' => 'text'
        ],
        'related_ids' => [
            'type' => 'keyword',
            'index' => true
        ],
        /**
         * for the parent ids .. especiallly used for the ativities but can be used for other related searches as well
         */
        'parent_ids' => [
            'type' => 'keyword',
            'index' => true
        ],
        'assigned_user_name' => [
            'type' => 'text'
        ],
        'assigned_user_id' => [
            'type' => 'keyword',
            'index' => true
        ],
        'modified_by_name' => [
            'type' => 'text'
        ],
        'modified_user_id' => [
            'type' => 'keyword',
            'index' => true
        ],
        'created_by_name' => [
            'type' => 'text'
        ],
        'created_by' => [
            'type' => 'keyword',
            'index' => true
        ],
        'date_entered' => [
            'type' => 'date',
            'index' => false,
            'format' => 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis'
        ],
        'date_modified' => [
            'type' => 'date',
            'index' => false,
            'format' => 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis'
        ],
        'tags' => [
            'type' => 'text',
            'index' => true,
            'aggregate' => true,
            'suggest' => true,
            'search'=> true,
            'analyzer' => 'spice_ngram'
        ],
        '_location' => [
            'type' => 'geo_point'
        ]
    ];

    static function checkElastic(){
        $handler = new ElasticHandler();
        $response = $handler->query('GET', '');
        return json_decode($response);
    }

    /**
     * retrievs and returns the index properties
     *
     * @param $module
     * @param bool $overrideCache
     * @return array|bool|mixed
     */
    static function getBeanIndexProperties($module, $overrideCache = false)
    {
        $db = DBManagerFactory::getInstance();
        //catch installation process and abort. table sysfts will not exist at the point during installation
        if (!empty($GLOBALS['installing']))
            return false;


        if (!$overrideCache && isset($_SESSION['SpiceFTS']['indexes'][$module]['properties'])) {
            return $_SESSION['SpiceFTS']['indexes'][$module]['properties'];
        } else {

            $moduleProperties = $db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"));
            if ($moduleProperties) {
                $modulePropertiesarray = json_decode(html_entity_decode($moduleProperties['ftsfields']), true);
                $seed = BeanFactory::getBean($module);
                foreach ($modulePropertiesarray as $modulePropertyIndex => $moduleProperty) {
                    $modulePropertiesarray[$modulePropertyIndex]['indexfieldname'] = isset($moduleProperty['indexedname']) ? $moduleProperty['indexedname'] : SpiceFTSUtils::getFieldIndexName($seed, $moduleProperty['path']);
                    $modulePropertiesarray[$modulePropertyIndex]['metadata'] = SpiceFTSUtils::getFieldIndexParams($seed, $moduleProperty['path']);
                }

                $seed = BeanFactory::getBean($module);
                if (method_exists($seed, 'add_fts_metadata')) {
                    $addFields = $seed->add_fts_metadata();
                    foreach ($addFields as $addFieldName => $addField) {
                        $modulePropertiesarray[] = [
                            'fieldid' => create_guid(),
                            'fieldname' => $addFieldName,
                            'indexfieldname' => $addFieldName,
                            'search' => $addField['search'],
                            'indextype' => $addField['type'] == 'string' ? 'text' : $addField['type'],
                            'aggregate' => $addField['aggregate'],
                            'aggregatesize' => $addField['aggregatesize']
                        ];
                    }
                }

                // check if index exists

                $_SESSION['SpiceFTS']['indexes'][$module]['properties'] = $modulePropertiesarray;

                return $modulePropertiesarray;
            }

            $_SESSION['SpiceFTS']['indexes'][$module]['properties'] = false;
        }

        return false;
    }

    /**
     * returns the infexed fields ona  bean (only for the root module
     *
     * @param $module
     */
    static function getBeanIndexedFields($module){
        $fields = [];

       $indexProperties = self::getBeanIndexProperties($module);
       foreach($indexProperties as $indexProperty){
           $path = explode('::', $indexProperty['path']);

           // only 2 path records are allowed .. otherwise we ar not on root
           if(count($path) > 2) continue;

           $field = explode(':', $path[1])[1];
           if($field) $fields[] = $field;
       }
       return $fields;
    }

    /**
     * returns the index properties
     *
     * @param $module
     * @return bool|mixed
     */
    static function getBeanIndexSettings($module)
    {
        //BEGIN CR1000190
        if( @$GLOBALS['installing'] ) {
            return false;
        }
        //END
        $db = DBManagerFactory::getInstance();

        if (isset($_SESSION['SpiceFTS']['indexes'][$module]['settings'])) {
            return $_SESSION['SpiceFTS']['indexes'][$module]['settings'];
        } else {
            $moduleProperties = $db->fetchByAssoc($db->query("SELECT settings FROM sysfts WHERE module = '$module'"));
            if ($moduleProperties) {
                $_SESSION['SpiceFTS']['indexes'][$module]['settings'] = json_decode(html_entity_decode($moduleProperties['settings']), true);
                return json_decode(html_entity_decode($moduleProperties['settings']), true);
            } else {
                $_SESSION['SpiceFTS']['indexes'][$module]['settings'] = false;
            }
        }
        return false;
    }

    static function getFieldIndexName($bean, $path)
    {
        $pathRecords = explode('::', $path);
        $valueBean = null;
        $fieldName = '';
        foreach ($pathRecords as $pathRecord) {
            $pathRecordDetails = explode(':', $pathRecord);
            switch ($pathRecordDetails[0]) {
                case 'root':
                    $valueBean = $bean;
                    break;
                case 'link':
                    $fieldName = !empty($fieldName) ? $fieldName . '->' . $pathRecordDetails[2] : $pathRecordDetails[2];
                    if ($valueBean) {
                        if($valueBean->load_relationship($pathRecordDetails[2])){
                            $valueBean = BeanFactory::getBean($valueBean->{$pathRecordDetails[2]}->getRelatedModuleName());
                        } else {
                            LoggerManager::getLogger()->fatal(__CLASS__. '::'.__FUNCTION__.'() Could not load '.$pathRecordDetails[2]. ' for '.get_class($valueBean));
                        }
                    }
                    break;
                case 'field':
                    $fieldName = !empty($fieldName) ? $fieldName . '->' . $pathRecordDetails[1] : $pathRecordDetails[1];
                    break;
            }
        }
        return $fieldName;
    }

    static function getFieldIndexParams($bean, $path)
    {
        $pathRecords = explode('::', $path);
        $valueBean = null;
        $fieldData = [];
        foreach ($pathRecords as $pathRecord) {
            $pathRecordDetails = explode(':', $pathRecord);
            switch ($pathRecordDetails[0]) {
                case 'root':
                    if (!$bean)
                        $valueBean = BeanFactory::getBean($pathRecordDetails[1]);
                    else
                        $valueBean = $bean;
                    break;
                case 'link':
                    if($valueBean && $valueBean->load_relationship($pathRecordDetails[2])){
                        $valueBean = BeanFactory::getBean($valueBean->{$pathRecordDetails[2]}->getRelatedModuleName());
                    }
                    else {
                        LoggerManager::getLogger()->fatal(__CLASS__. '::'.__FUNCTION__.'() Could not load '.$pathRecordDetails[2]. ' for '.print_r($valueBean, true));
                    }
                    break;
                case 'field':
                    $fieldData = $valueBean->field_name_map[$pathRecordDetails[1]];
                    break;
            }
        }
        return $fieldData;
    }

    static function getActivityModules($scope = 'Activities')
    {
        $db = DBManagerFactory::getInstance();
        $modules = [];

        $moduleProperties = $db->query("SELECT * FROM sysfts");
        while ($moduleProperty = $db->fetchByAssoc($moduleProperties)) {
            $moduleSettings = json_decode(html_entity_decode($moduleProperty['settings']), true);
            if ($moduleSettings[strtolower($scope) . 'search']) {
                // check if module is loaded (because of core/more edition)
                if(in_array($moduleProperty['module'], SpiceModules::getInstance()->getModuleList())) {
                    $modules[$moduleProperty['module']] = [
                        'settings' => $moduleSettings,
                        'ftsfields' => json_decode(html_entity_decode($moduleProperty['ftsfields']), true),
                    ];
                }
            }
        }

        return $modules;
    }

    static function getTimelineModules()
    {
        $db = DBManagerFactory::getInstance();
        $modules = [];

        $moduleProperties = $db->query("SELECT * FROM sysfts");
        while ($moduleProperty = $db->fetchByAssoc($moduleProperties)) {
            $moduleSettings = json_decode(html_entity_decode($moduleProperty['settings']), true);
            if ($moduleSettings['timelinesearch']) {
                // check if module is loaded (because of core/more edition)
                if(in_array($moduleProperty['module'], SpiceModules::getInstance()->getModuleList())) {
                    $modules[$moduleProperty['module']] = [
                        'settings' => $moduleSettings,
                        'ftsfields' => json_decode(html_entity_decode($moduleProperty['ftsfields']), true),
                    ];
                }
            }
        }

        return $modules;
    }

    static function getCalendarModules()
    {
        $db = DBManagerFactory::getInstance();
        $modules = [];

        $moduleProperties = $db->query("SELECT * FROM sysfts");
        while ($moduleProperty = $db->fetchByAssoc($moduleProperties)) {
            $moduleSettings = json_decode(html_entity_decode($moduleProperty['settings']), true);
            if ($moduleSettings['calendarsearch']) {
                $modules[$moduleProperty['module']] = [
                    'settings' => $moduleSettings,
                    'ftsfields' => json_decode(html_entity_decode($moduleProperty['ftsfields']), true),
                ];
            }
        }

        return $modules;
    }

    static function getIndexNameForModule($module)
    {
        $handler = new ElasticHandler();
        $indexPrefix = $handler->indexPrefix;
        return $indexPrefix . strtolower($module);
    }

    /**
     *
     * fts internally uses a setign that stores how fields are addresses. this can be a string value like "root:Contacts::link:Contacts:accounts::field:industry" that indicates how the field is found.
     *
     * This helper function resolves this by exploding the structure and returning the module and the fieldname for the given path
     *
     * @param $path the path to the field
     */
    static function getDetailsForField($path)
    {
        $pathRecords = explode('::', $path);
        if (count($pathRecords) > 2)
            $pathRecords = array_slice($pathRecords, count($pathRecords) - 2, 2);

        $module = '';
        $field = '';
        foreach ($pathRecords as $pathRecord) {
            $pathRecordDetails = explode(':', $pathRecord);
            switch ($pathRecordDetails[0]) {
                case 'root':
                    $module = $pathRecordDetails[1];
                    break;
                case 'link':
                    $seed = BeanFactory::getBean($pathRecordDetails[1]);
                    if($seed && $seed->load_relationship($pathRecordDetails[2])){
                        $module = $seed->{$pathRecordDetails[2]}->getRelatedModuleName();
                    }
                    break;
                case 'field':
                    $field = $pathRecordDetails[1];
                    break;

            }
        }

        return ['module' => $module, 'field' => $field];
    }
}
