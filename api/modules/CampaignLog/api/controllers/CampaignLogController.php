<?php

namespace SpiceCRM\modules\CampaignLog\api\controllers;

use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;

class CampaignLogController{

    /**
     * gets campaign logs by status
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function getCampaignLogByStatus(Request $req, Response $res, array $args): Response
    {
        $timedate = TimeDate::getInstance();
        // ACL Check
        /* todo: check what ACL we need to check
        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'edit', true)) {
            http_response_code(403);
            echo('not authorized for module ' . 'CampaignTasks');
            exit;
        }
        */

        $campaignLog = BeanFactory::getBean('CampaignLog', $args['id']);

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
                    $campaignLog->planned_activity_date = null;
                    break;
            }

            $campaignLog->activity_type = $status;
            $campaignLog->activity_date = $timedate->nowDb();
            $campaignLog->save();

            return $res->withJson(['success' => true, 'id' => $args['id']]);
        } else {
            return $res->withJson(['success' => false]);
        }
    }
}