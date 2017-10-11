<?php
global $db, $current_language;

$sql = "SELECT sgt.stage, sgt.secondary_stage, sgt.stage_add_data, sgtt.stage_name, sgtt.stage_secondaryname 
FROM spicebeanguides sg, spicebeanguidestages sgt, spicebeanguidestages_texts sgtt 
WHERE sg.id = sgt.spicebeanguide_id AND sgt.id = sgtt.stage_id AND sgtt.language = '$current_language' AND sg.module = 'Opportunities' ORDER BY sgt.stage_sequence";
//var_dump($sql);
$guideTexts = $db->query($sql);

if($guideTexts) {
    $app_list_strings['sales_stage_dom'] = array();
    $app_list_strings['sales_probability_dom'] = array();

    while ($guideText = $db->fetchByAssoc($guideTexts)) {
        //var_dump($guideText);
        $key = trim($guideText['stage'] . ' ' . $guideText['secondary_stage']);

        $app_list_strings['sales_stage_dom'][$key] = $guideText['stage_name'] . ' ' . $guideText['stage_secondaryname'];

        $probData = json_decode(html_entity_decode($guideText['stage_add_data']), true);

        $app_list_strings['sales_probability_dom'][$key] = $probData['probability'];
    }
    //var_dump($app_list_strings['sales_stage_dom']);
}