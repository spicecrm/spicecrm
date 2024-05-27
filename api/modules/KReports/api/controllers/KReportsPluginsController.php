<?php
/*********************************************************************************
 * This file is part of KReporter. KReporter is an enhancement developed
 * by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 *
 * This Version of the KReporter is licensed software and may only be used in
 * alignment with the License Agreement received with this Software.
 * This Software is copyrighted and may not be further distributed without
 * witten consent of aac services k.s.
 *
 * You can contact us at info@kreporter.org
 ********************************************************************************/


namespace SpiceCRM\modules\KReports\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\KReports\KReportPluginManager;
require_once('modules/KReports/KReportRESTHandler.php');


class KReportsPluginsController
{
    public function processPluginAction(Request $req, Response $res, array $args): Response{
        $pluginManager = new KReportPluginManager();
        $getParams = $req->getQueryParams();
        $postBody = $req->getParsedBody();

        //if(!$postBody) $postBody = [];

        //Only return if not null! In case of empty we get a null line in exports (csv, xlsx) and excel can't open file properly
        //echo json_encode($pluginManager->processPluginAction($args['plugin'], 'action_' . $args['action'], array_merge($getParams,$postBody)));
        $resultsPluginAction = $pluginManager->processPluginAction($args['plugin'], 'action_' . $args['action'], array_merge($getParams,$postBody));
        if(!empty($resultsPluginAction)){
            if(is_array($resultsPluginAction)){
                $resultsPluginAction = json_encode($resultsPluginAction);
            }
            $res->getBody()->write($resultsPluginAction);
            return $res->withStatus(200);
        }
        return $res->withStatus(500);
    }



}
