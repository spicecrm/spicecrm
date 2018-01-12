<?php

/* * *******************************************************************************
* This file is part of KReporter. KReporter is an enhancement developed
* by aac services k.s.. All rights are (c) 2016 by aac services k.s.
*
* This Version of the KReporter is licensed software and may only be used in
* alignment with the License Agreement received with this Software.
* This Software is copyrighted and may not be further distributed without
* witten consent of aac services k.s.
*
* You can contact us at info@kreporter.org
******************************************************************************* */




if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

class pluginkcsvexportcontroller {

    public function action_export($requestParams) {
        global $sugar_config;

        // 2014-02-24 add config option for memory limit see if we should set the runtime and memory limit
        if (!empty($sugar_config['KReports']['csvmemorylimit']))
            ini_set('memory_limit', $sugar_config['KReports']['csvmemorylimit']);
        if (!empty($sugar_config['KReports']['csvmaxruntime']))
            ini_set('max_execution_time', $sugar_config['KReports']['csvmaxruntime']);


        require_once('modules/KReports/KReport.php');
        $thisReport = BeanFactory::getBean('KReports', $requestParams['record']);


        // check if we have set dynamic Options
        if (isset($requestParams['dynamicoptions']))
            $thisReport->whereOverride = json_decode(html_entity_decode($requestParams['dynamicoptions']), true);

        
        $dynamicolsOverride = '';
        if (isset($requestParams['dynamicols']) && $requestParams['dynamicols'] != '')
            $dynamicolsOverride = html_entity_decode($requestParams['dynamicols'], ENT_QUOTES, 'UTF-8');

        // force Download
        //$filename = "kreporter.csv";
        $filename = preg_replace("/(\W)/", "", $thisReport->name. "_" . date("Ymd_His"));
        $filename.= ".csv";
        header('Content-type: application/ms-excel');
        header('Content-Disposition: attachment; filename=' . $filename);

        $output = $thisReport->createCSV($dynamicolsOverride);

        if ($requestParams['rawResult'])
            return $output;
        else
            echo $output;
    }

}
