<?php

namespace SpiceCRM\modules\CampaignLog\KREST\controllers;

use SpiceCRM\data\BeanFactory;

class CampaignLogController{

    /**
     * gets campaign logs by status
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function GetCampaignLogByStatus($req,$res,$args){
        global $timedate;
        // ACL Check
        /* todo: check what ACL we need to check
        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'edit', true)) {
            http_response_code(403);
            echo('not authorized for module ' . 'CampaignTasks');
            exit;
        }
        */

        $campaignLog = BeanFactory::getBean('CampaignLog', $args['campaignlogid']);

        $status = $args['status'];

        $postParams = $req->getQueryParams();

        if ($campaignLog) {

            switch($status){
                case 'attempted':
                    $campaignLog->planned_activity_date = $postParams['planned_activity_date'];
                    $campaignLog->hits += 1;
                    break;
                case 'called':
                    $campaignLog->related_id = $postParams['call_id'];
                    $campaignLog->related_type = 'Calls';
                    $campaignLog->hits += 1;
                    $campaignLog->planned_activity_date = undefined;
                    break;
            }

            $campaignLog->activity_type = $status;
            $campaignLog->activity_date = $timedate->nowDb();
            $campaignLog->save();

            return $res->withJson(['success' => true, 'id' => $args['campaignlogid']]);
        } else {
            return $res->withJson(['success' => false]);
        }
    }
}