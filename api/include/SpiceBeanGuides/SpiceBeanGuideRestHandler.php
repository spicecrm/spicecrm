<?php

namespace SpiceCRM\includes\SpiceBeanGuides;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use stdClass;

class SpiceBeanGuideRestHandler
{

    public function getStageDefs($module)
    {
        global $current_language;
$db = DBManagerFactory::getInstance();

        $focus = BeanFactory::getBean($module);

        // get the object
        // get the object
        $object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeancustomguides WHERE module='$module'"));
        if(empty($object)){
            $object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeanguides WHERE module='$module'"));
        }

        $statusField = $object['status_field'];

        // get the sales stages
        $stagesObj = $db->query("SELECT st.*, stt.stage_name, stt.stage_secondaryname, stt.stage_description FROM spicebeanguidestages st , spicebeanguidestages_texts stt WHERE st.spicebeanguide_id = '" . $object['id'] . "' AND st.id = stt.stage_id AND stt.language = '$current_language' ORDER BY st.stage_sequence");
        $stages = [];
        $stagePassed = false;
        while ($stage = $db->fetchByAssoc($stagesObj)) {
            // set the stage - for multi stage take the first or the one that is active if it is not the first
            if (!isset($stages[$stage['stage']]) || $stage['stage'] . $stage['secondary_stage'] == $focus->$statusField) {
                $stages[$stage['stage']] = $stage;
                $stages[$stage['stage']]['stage_description'] = html_entity_decode($stage['stage_description']);


                // perform checks
                $stages[$stage['stage']]['checks'] = [];
                $stages[$stage['stage']]['checkcontent'] = '';
            }
        }

        $retStages = [];
        foreach ($stages as $stage => $stageData) {
            $retStages[] = $stageData;
        }

        return [
            'statusfield' => $object['status_field'],
            'stages' => $retStages
        ];
    }


    public function getStages($module, $beanid = '')
    {
        global $current_language;
$db = DBManagerFactory::getInstance();

        if (!empty($beanid))
            $focus = BeanFactory::getBean($module, $beanid);
        else
            $focus = BeanFactory::getBean($module);

        // get the object
        $object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeancustomguides WHERE module='$module'"));
        if(empty($object)){
            $object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeanguides WHERE module='$module'"));
        }

        $statusField = $object['status_field'];

        // get the sales stages
        $stagesObj = $db->query("SELECT st.*, stt.stage_name, stt.stage_secondaryname, stt.stage_description FROM spicebeanguidestages st LEFT JOIN spicebeanguidestages_texts stt ON st.id = stt.stage_id AND stt.language = '$current_language' WHERE st.spicebeanguide_id = '" . $object['id'] . "' ORDER BY st.stage_sequence");


        $stages = [];
        $stagePassed = false;
        while ($stage = $db->fetchByAssoc($stagesObj)) {
            // set the stage - for multi stage take the first or the one that is active if it is not the first
            if (!isset($stages[$stage['stage']]) || $stage['stage'] . $stage['secondary_stage'] == $focus->$statusField) {
                $stages[$stage['stage']] = $stage;
                $stages[$stage['stage']]['stage_description'] = html_entity_decode($stage['stage_description']);
                $stages[$stage['stage']]['stage_label'] = html_entity_decode($stage['stage_label']);
                $stages[$stage['stage']]['pastactive'] = $stagePassed;
                $stages[$stage['stage']]['statusfield'] = $object['status_field'];

                // perform checks
                $stages[$stage['stage']]['checks'] = [];
                $stages[$stage['stage']]['checkcontent'] = '';
                $checks = $db->query("SELECT sc.*, sct.text FROM spicebeanguidestages_checks sc LEFT JOIN spicebeanguidestages_check_texts sct on sc.id = sct.stage_check_id AND sct.language='$current_language' WHERE sc.spicebeanguide_id = '" . $object['id'] . "' AND sc.stage_id = '" . $stage['id'] . "' ORDER BY sc.check_sequence");
//                if (!empty($beanid)) {
                while ($check = $db->fetchByAssoc($checks)) {
                    // BEGIN CR1000278: implement namespace for class containing stage checks
                    // keep file include for BWC
                    if(!empty($beanid)){
                        if (!empty($check['check_include']) && file_exists($check['check_include'])) {
                            require_once($check['check_include']);
                            if(class_exists($check['check_class'])){
                                $checkClass = new $check['check_class']();
                                $checkMethod = $check['check_method'];
                                $checkResult = $checkClass->$checkMethod($focus);
                            }
                        }
                        // CR1000278 new syntax: namespace class method is in check_method column
                        elseif(!empty($check['check_method'])) {
                            $checkResult = $this->runCheckResults($check['check_method'], $focus);
                        }
                    }

                    // prepare results
                    $stages[$stage['stage']]['checks'][] = [
                        'checkid' => $check['id'],
                        'name' => $check['text'],
                        'label' => $check['check_label'],
                        'result' => $checkResult
                    ];
                    // END
                }
            }
        }

        $retStages = [];
        foreach ($stages as $stage => $stageData) {
            $retStages[] = [
                'stage' => $stage,
                'stagedata' => $stageData
            ];
        }
        return $retStages;
    }

    /**
     * read namespace class method dynamically from string and call method
     * return results for stage check;
     * @param $method
     * @param $params
     * @return stdClass
     */
    public function runCheckResults($method, $params){
        $checkResult = false;
        // check if static call or not
        if(strpos($method, '::') > 0){
            try{
                $checkResult = $method($params);
            } catch(Exception  $e){
                $checkResult = false;
            }
        } else if(strpos($method, '->') > 0){
            try{
                $funcArray = explode('->', $method);
                $obj = new $funcArray[0]();
                $checkResult = $obj->{$funcArray[1]}($params);
            } catch(Exception  $e){
                $checkResult = false;
            }
        }
        return $checkResult;
    }
}
