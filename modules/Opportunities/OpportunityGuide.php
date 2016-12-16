<?php
global $db, $current_language;

$ss = new Sugar_Smarty();

// get the sales stages
$stagesObj = $db->query("SELECT st.*, stt.sales_stage_name, stt.sales_stage_secondaryname, stt.sales_stage_description FROM syscsalesstages st , syscsalesstages_texts stt WHERE st.id = stt.sales_stage_id AND stt.language = '$current_language' ORDER BY st.sales_stage_sequence");
$stages = array();
$stagePassed = false;
while ($stage = $db->fetchByAssoc($stagesObj)) {
    $stages[$stage['sales_stage']] = $stage;
    $stages[$stage['sales_stage']]['sales_stage_description'] = html_entity_decode($stage['sales_stage_description']);
    $stages[$stage['sales_stage']]['pastactive'] = $stagePassed;

    // perform checks
    $stages[$stage['sales_stage']]['checks'] = array();
    $stages[$stage['sales_stage']]['checkcontent'] = '';
    $checks = $db->query("SELECT sc.*, sct.text FROM syscsalesstages_checks sc LEFT JOIN syscsalesstages_check_texts sct on sc.id = sct.salesstages_check_id AND sct.language='$current_language' WHERE sc.sales_stage_id = '".$stage['id']."' ORDER BY sc.check_sequence");
    while($check = $db->fetchByAssoc($checks)){
        if(file_exists($check['check_include'])){
            require_once ($check['check_include']);
            $checkClass = new $check['check_class']();
            $checkmethod = $check['check_method'];
            $checkResult = $checkClass->$checkmethod($GLOBALS['FOCUS']);
            $stages[$stage['sales_stage']]['checks'][$check['id']] = array(
                'name' => $check['text'],
                'result' => $checkResult
            );
        }

        $checkSS = new Sugar_Smarty();
        $checkSS->assign('checkResults', $stages[$stage['sales_stage']]['checks']);
        $stages[$stage['sales_stage']]['checkcontent'] = $checkSS->fetch('modules/Opportunities/tpls/guideCheckResults.tpl');

    }

    if($stage['sales_stage'].$stage['secondary_sales_stage'] == $GLOBALS['FOCUS']->sales_stage)
        $stagePassed = true;
}

$ss->assign('sales_stages', $stages);
$ss->assign('active_sales_stage', $GLOBALS['FOCUS']->sales_stage);

echo $ss->fetch('modules/Opportunities/tpls/guide.tpl');