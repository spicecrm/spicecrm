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

require_once('modules/KReports/KReportRESTHandler.php');


class KReportsCoreController
{
    public function getAllWhereOperators(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getAllWhereOperators());
    }

    public function getWhereFunctions(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getWhereFunctions());
    }

    public function getEnumOptions(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($restHandler->getEnumOptions($getParams['path'], $getParams['grouping'], json_decode(html_entity_decode($getParams['operators']), true)));
    }

    public function getVizColors(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getVizColors());
    }




    public function getPresentation(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getPresentation($args['id'], $req->getQueryParams()));
    }

    public function getPresentationWithDynamicoptions(Request $req, Response $res, array $args): Response{
        $requestParams = $req->getQueryParams();
        $postBody = $req->getParsedBody();
        if(!is_array($requestParams))
            $requestParams = [];
        if(is_array($postBody))
            $requestParams = array_merge($requestParams, $postBody);
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getPresentation($args['id'], $requestParams));
    }


    public function getVisualization(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getVisualization($args['id'], $req->getQueryParams()));
    }

    public function getVisualizationWithDynamicoptions(Request $req, Response $res, array $args): Response{
        $requestParams = $req->getQueryParams();
        $postBody = $req->getParsedBody();
        if(!is_array($requestParams))
            $requestParams = [];
        if(is_array($postBody))
            $requestParams = array_merge($requestParams, $postBody);
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getVisualization($args['id'], $requestParams));
    }







}
