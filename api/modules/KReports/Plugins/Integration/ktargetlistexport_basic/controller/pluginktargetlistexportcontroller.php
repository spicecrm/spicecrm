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


use SpiceCRM\data\BeanFactory;

class pluginktargetlistexportcontroller {

    /**
     * can only create a new target list
     * @param $requestdata
     * @return bool
     */
    public function action_export_to_targetlist($requestdata) {

        $thisReport = BeanFactory::getBean('KReports', $requestdata['record']);

        // check if we have set dynamic Options
        if (isset($requestParams['whereConditions'])) {
            $thisReport->whereOverride = json_decode(html_entity_decode(base64_decode($requestParams['whereConditions'])), true);
        }

        $thisReport->createTargeList($requestdata['targetlist_name']);

        return true;
    }
    
}
