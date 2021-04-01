<?php
namespace SpiceCRM\includes\Logger\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\includes\Logger\LogViewer;
use SpiceCRM\includes\Logger\RESTLogViewer;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Slim\Routing\RouteCollectorProxy;

class LogViewController{

    /**
     * get the lines of the crmlogger
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function CRMLogGetLines($req, $res, $args){
        $viewer = new LogViewer();
        $lines = $viewer->getLines($req->getQueryParams());
        return $res->withJson([
            'currentLogLevel' => @SpiceConfig::getInstance()->config['logger']['level'],
            'count' => count($lines),
            'lines' => $lines,
            'SpiceLogger' => @SpiceConfig::getInstance()->config['logger']['default'] === '\SpiceCRM\includes\Logger\SpiceLogger'
        ]);

    }

    /**
     * get the logs within a timeframe
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function CRMLogWithTime($req, $res, $args){
        $viewer = new LogViewer();
        $lines =  $viewer->getLinesOfPeriod( $args['begin'], $args['end'], $req->getQueryParams() );
        return $res->withJson([
            'currentLogLevel' => @SpiceConfig::getInstance()->config['logger']['level'],
            'count' => count( $lines ),
            'lines' => $lines,
            'SpiceLogger' => @SpiceConfig::getInstance()->config['logger']['default'] === '\SpiceCRM\includes\Logger\SpiceLogger'
        ]);
    }

    /**
     * get the full line logs
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function CRMLogFullLine($req, $res, $args){
        $viewer = new LogViewer();
        $line = $viewer->getFullLine( $args['lineId'] );
        return $res->withJson([
            'currentLogLevel' => @SpiceConfig::getInstance()->config['logger']['level'],
            'line' => $line
        ]);

    }

    /**
     * get the log from all user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function CRMLogGetAllUser($req, $res, $args){
        $response = [];
        $viewer = new RESTLogViewer();
        $response['list'] = $viewer->getAllUser();
        $response['count'] = count( $response['list'] );
        return $res->withJson( $response );

    }



    /**
     * get the lines of the spice logger
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceLogGetLines($req, $res, $args){
        $viewer = new RESTLogViewer();
        $lines = $viewer->getLines($req->getQueryParams());
        return $res->withJson([
            'count' => count($lines),
            'lines' => $lines
        ]);
    }

    /**
     * get the logs within a timeframe
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceLogWithTime($req, $res, $args){
        $viewer = new RESTLogViewer();
        $lines =  $viewer->getLinesOfPeriod( $args['begin'], $args['end'], $req->getQueryParams() );
        return $res->withJson([
            'count' => count($lines),
            'lines' => $lines
        ]);
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceLogFullLine($req, $res, $args){
        $viewer = new RESTLogViewer();
        $line = $viewer->getFullLine( $args['lineId'] );
        return $res->withJson([
            'line' => $line
        ]);
    }

    /**
     * get the log routes
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceLogRoutes($req, $res, $args){
        $viewer = new RESTLogViewer();
        $routes = $viewer->getRoutes();
        return $res->withJson([
            'routes' => $routes
        ]);
    }

    /**
     * get the spice log from all users
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceLogGetAllUser($req, $res, $args){
        $response = [];
        $viewer = new RESTLogViewer();
        $response['list'] = $viewer->getAllUser();
        $response['count'] = count( $response['list'] );
        return $res->withJson( $response );
    }

}