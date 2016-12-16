<?php
global $db, $current_language;

$ss = new Sugar_Smarty();

// get the object
$object = $db->fetchByAssoc($db->query("SELECT * FROM spicebeanguides WHERE module='". $GLOBALS['FOCUS']->module_dir ."'"));

$statusField = $object['status_field'];

// get the sales stages
$stagesObj = $db->query("SELECT st.*, stt.stage_name, stt.stage_secondaryname, stt.stage_description FROM spicebeanguidestages st , spicebeanguidestages_texts stt WHERE st.spicebeanguide_id = '".$object['id']."' AND st.id = stt.stage_id AND stt.language = '$current_language' ORDER BY st.stage_sequence");
$stages = array();
$stagePassed = false;
while ($stage = $db->fetchByAssoc($stagesObj)) {
    // set the stage - for multi stage take the first or the one that is active if it is not the first
    if(!isset($stages[$stage['stage']]) || $stage['stage'].$stage['secondary_stage'] == $GLOBALS['FOCUS']->$statusField){
        $stages[$stage['stage']] = $stage;
        $stages[$stage['stage']]['stage_description'] = html_entity_decode($stage['stage_description']);
        $stages[$stage['stage']]['pastactive'] = $stagePassed;

        // perform checks
        $stages[$stage['stage']]['checks'] = array();
        $stages[$stage['stage']]['checkcontent'] = '';
        $checks = $db->query("SELECT sc.*, sct.text FROM spicebeanguidestages_checks sc LEFT JOIN spicebeanguidestages_check_texts sct on sc.id = sct.stage_check_id AND sct.language='$current_language' WHERE sc.spicebeanguide_id = '" . $object['id'] . "' AND sc.stage_id = '" . $stage['id'] . "' ORDER BY sc.check_sequence");
        while ($check = $db->fetchByAssoc($checks)) {
            if (file_exists($check['check_include'])) {
                require_once($check['check_include']);
                $checkClass = new $check['check_class']();
                $checkmethod = $check['check_method'];
                $checkResult = $checkClass->$checkmethod($GLOBALS['FOCUS']);
                $stages[$stage['stage']]['checks'][$check['id']] = array(
                    'name' => $check['text'],
                    'result' => $checkResult
                );
            }

            $checkSS = new Sugar_Smarty();
            $checkSS->assign('checkResults', $stages[$stage['stage']]['checks']);
            $stages[$stage['stage']]['checkcontent'] = $checkSS->fetch('include/SpiceBeanGuide/tpls/guideCheckResults.tpl');

        }
    }

    // set the stage /also for multi stage
    if($stage['stage'].$stage['secondary_stage'] == $GLOBALS['FOCUS']->$statusField) {
        $ss->assign('active_stage', $stage['stage']);
        $stagePassed = true;
    }
}

$ss->assign('stages', $stages);

echo $ss->fetch('include/SpiceBeanGuide/tpls/guide.tpl');