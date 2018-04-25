<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 02.11.2017
 * Time: 16:26
 */


class SpiceFTSGenerator
{
    public $module;

    public function __construct($module_name = null){
        if(!empty($module_name))
            $this->module = $module_name;
    }

    public function loadFTSConfig(){
        //check on exiting config
        $q = "SELECT * FROM sysfts";
        $res = $GLOBALS['db']->query($q);

        //Webservice connection data
        $end_point =  $GLOBALS['sugar_config']['site_url'].'/KREST';
        $web = new KRESTWeb($end_point);
        $params = array('user_name' => $GLOBALS['current_user']->user_name, 'password' => $GLOBALS['current_user']->user_hash); //!important: password is an md5 hash
        $response = $web->callMethod('login', 'GET', $params);
        echo '<pre>'.print_r($response, true);
        $session_id = $response->id;

        while($row = $GLOBALS['db']->fetchByAssoc($res)){
            //trigger put mapping
            $params = array('session_id' => $session_id);
            $response = $web->callMethod('ftsmanager/'.$row['module'].'/map', 'GET', $params);
            echo "<pre>PUT MAPPING ".$row['module']." ".print_r($response, true);
            file_put_contents("sugarcrm.log", "PUT MAPPING ".$row['module']." ".print_r($response, true)."\n", FILE_APPEND);

            //trigger index
            $response = $web->callMethod('ftsmanager/'.$row['module'].'/index', 'POST', $params);
            echo "<pre>PUT MAPPING ".$row['module']." ".print_r($response, true);
            file_put_contents("sugarcrm.log", "INDEX ".$row['module']." ".print_r($response, true)."\n", FILE_APPEND);
        }
    }

    /**
     * set minimal FTS config
     * @param null $module_name
     */
    public function generateFtsConfig($listviewdefs, $module_name = null){
        if(empty($module_name))
            $module_name = $this->module;

        //check if module already has a fts config
        if(!class_exists('SpiceFTSRESTManager', false))
            require_once 'include/SpiceFTSManager/SpiceFTSRESTManager.php';

        $fts = new SpiceFTSRESTManager();
        $modulefts = $fts->getFTSFields($module_name);
        if(!is_array($modulefts)) $modulefts = array();
        $configExistsForFields = array();
        //if fts already available, add your fields to it
        foreach($modulefts as $idx => $fieldconf){
            $configExistsForFields[] = $fieldconf['fieldname'];
        }

        //setup output
        $items = array('fields' => $modulefts, 'settings' => array());

        //listview keys
        $listkeys = array_keys($listviewdefs);

        //get vardefs
        $bean = BeanFactory::getBean($module_name);

        $labels = return_module_language($GLOBALS['sugar_config']['default_language'], $module_name);
        //loop field_name_map
        foreach($bean->field_name_map as $fieldname => $field){
            if(in_array(strtoupper($field['name']), $listkeys) && !in_array($field['name'], $configExistsForFields) && !isset($field['usage'])){
                $id = create_guid();
                $fieldid = create_guid();
                $items['fields'][] = array(
                    'id' => $id,
                    'fieldid' => $fieldid,
                    'fieldname' => $field['name'],
                    'name' => (empty($labels[$field['vname']]) ? ucfirst($field['name']) : $labels[$field['vname']]),
                    'indexfieldname' => $field['name'],
                    'displaypath' => $module_name,
                    'path' => 'root:'.$module_name.'::field:'.$field['name'],
                    'search' => true,
                    'indextype' => $this->setFtsIndexType($field['type']),
                    'index' => 'analyzed',
                    'enablesort' => true //important! At least 1 field shall have it else indexing will not work, and first field for listview!
                );
            }
        }

        //settings
        $items['settings'] = array(
            'index_priority' => 100,
            'operator' => 'or',
            'globalsearch' => true
        );

        $fts->setFTSFields($module_name, $items);
    }

    public function setFtsIndexType($type){
        $ftstype = 'string';//string | text | keyword |date | double


        switch($type){
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                $ftstype = 'date';
                break;

            case 'float':
            case 'currency':
            case 'decimal':
                $ftstype = 'double';
                break;

            default:
                $ftstype = 'string';
        }

        return $ftstype;
    }

}