<?php

class SpiceBeanGuideRestHandler
{

    public function getStageDefs($module)
    {
        global $db, $current_language;

        // get the object
        $object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeanguides WHERE module='$module'"));

        $statusField = $object['status_field'];

        // get the sales stages
        $stagesObj = $db->query("SELECT st.*, stt.stage_name, stt.stage_secondaryname, stt.stage_description FROM spicebeanguidestages st , spicebeanguidestages_texts stt WHERE st.spicebeanguide_id = '" . $object['id'] . "' AND st.id = stt.stage_id AND stt.language = '$current_language' ORDER BY st.stage_sequence");
        $stages = array();
        $stagePassed = false;
        while ($stage = $db->fetchByAssoc($stagesObj)) {
            // set the stage - for multi stage take the first or the one that is active if it is not the first
            if (!isset($stages[$stage['stage']]) || $stage['stage'] . $stage['secondary_stage'] == $focus->$statusField) {
                $stages[$stage['stage']] = $stage;
                $stages[$stage['stage']]['stage_description'] = html_entity_decode($stage['stage_description']);


                // perform checks
                $stages[$stage['stage']]['checks'] = array();
                $stages[$stage['stage']]['checkcontent'] = '';
            }
        }

        $retStages = array();
        foreach ($stages as $stage => $stageData) {
            $retStages[] = $stageData;
        }

        return array(
            'statusfield' => $object['status_field'],
            'stages' => $retStages
        );
    }


    public function getStages($module, $beanid = '')
    {
        global $db, $current_language;

        if (!empty($beanid))
            $focus = BeanFactory::getBean($module, $beanid);
        else
            $focus = BeanFactory::getBean($module);

        // get the object
        $object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeanguides WHERE module='" . $focus->module_dir . "'"));

        $statusField = $object['status_field'];

        // get the sales stages
        $stagesObj = $db->query("SELECT st.*, stt.stage_name, stt.stage_secondaryname, stt.stage_description FROM spicebeanguidestages st , spicebeanguidestages_texts stt WHERE st.spicebeanguide_id = '" . $object['id'] . "' AND st.id = stt.stage_id AND stt.language = '$current_language' ORDER BY st.stage_sequence");
        $stages = array();
        $stagePassed = false;
        while ($stage = $db->fetchByAssoc($stagesObj)) {
            // set the stage - for multi stage take the first or the one that is active if it is not the first
            if (!isset($stages[$stage['stage']]) || $stage['stage'] . $stage['secondary_stage'] == $focus->$statusField) {
                $stages[$stage['stage']] = $stage;
                $stages[$stage['stage']]['stage_description'] = html_entity_decode($stage['stage_description']);
                $stages[$stage['stage']]['pastactive'] = $stagePassed;
                $stages[$stage['stage']]['statusfield'] = $object['status_field'];

                // perform checks
                $stages[$stage['stage']]['checks'] = array();
                $stages[$stage['stage']]['checkcontent'] = '';
                $checks = $db->query("SELECT sc.*, sct.text FROM spicebeanguidestages_checks sc LEFT JOIN spicebeanguidestages_check_texts sct on sc.id = sct.stage_check_id AND sct.language='$current_language' WHERE sc.spicebeanguide_id = '" . $object['id'] . "' AND sc.stage_id = '" . $stage['id'] . "' ORDER BY sc.check_sequence");
                if (!empty($beanid)) {
                    while ($check = $db->fetchByAssoc($checks)) {
                        if (file_exists($check['check_include'])) {
                            require_once($check['check_include']);
                            $checkClass = new $check['check_class']();
                            $checkmethod = $check['check_method'];
                            $checkResult = $checkClass->$checkmethod($focus);
                            $stages[$stage['stage']]['checks'][] = array(
                                'checkid' => $check['id'],
                                'name' => $check['text'],
                                'result' => $checkResult
                            );
                        }
                    }
                }
            }
        }

        $retStages = array();
        foreach ($stages as $stage => $stageData) {
            $retStages[] = array(
                'stage' => $stage,
                'stagedata' => $stageData
            );
        }
        return $retStages;
    }
}