<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\UserAccessLogs\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use Slim\Psr7\Request;

class UserAccessLogController
{
    /**
     * returns the user access log
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getUserAccessLog(Request $req, Response $res, array $args): Response {

        $params = $req->getQueryParams();
        $db = DBManagerFactory::getInstance();

        $whereArray = []; $whereClause = [];
        if($params['filter']) $whereArray[] = "(login_name LIKE '%{$params['filter']}%' OR ipaddress LIKE '%{$params['filter']}%')";
        if($params['failedonly']) $whereArray[] = "action = 'loginfail'";
        if($params['date_end']) $whereArray[] = "date_entered <= '{$params['date_end']}'";
        if(count($whereArray) > 0) $whereClause = ' WHERE ' . join(" AND ", $whereArray) . ' ';

        $recordsObj = $db->limitQuery("SELECT * FROM useraccesslogs $whereClause ORDER BY date_entered DESC", 0, $params['limit'] ?: 250);
        $records = [];
        while($record = $db->fetchByAssoc($recordsObj)){
            $records[] = $record;
        }

        return $res->withJson($records);
    }

}