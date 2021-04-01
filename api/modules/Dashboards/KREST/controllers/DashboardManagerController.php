<?php
namespace SpiceCRM\modules\Dashboards\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use Slim\Routing\RouteCollectorProxy;

class DashboardManagerController{

    /**
     * selects all global and custom dashlets
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws Exception
     */

    public function GetGlobalAndCustomDashlet($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $dashBoardDashlets = [];
        $dashlets = "SELECT 'global' As `type`, dlts.* FROM sysuidashboarddashlets dlts UNION ";
        $dashlets .= "SELECT 'custom' As `type`, cdlts.* FROM sysuicustomdashboarddashlets cdlts";
        $dashlets = $db->query($dashlets);
        while ($dashBoardDashlet = $db->fetchByAssoc($dashlets))
            $dashBoardDashlets[] = $dashBoardDashlet;
        return $res->withJson($dashBoardDashlets);
    }

    /**
     * replaces into the database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws Exception
     */

    public function ReplaceDashlet($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $columns = [];
        $values = [];
        $params = $body = $req->getParsedBody();
        $table = $params['type'] == 'global' ? 'sysuidashboarddashlets' : 'sysuicustomdashboarddashlets';
        foreach ($params as $column => $value) {
            if ($column != 'type') {
                $columns[] = $db->quote($column);
                $values[] = "'" . $db->quote($value) . "'";
            }
        }
        $columns = implode(',',$columns);
        $values = implode(',',$values);

        $isAdded = $db->query("REPLACE INTO $table ($columns) VALUES ($values)");
        return $res->withJson($isAdded);
    }

    /**
     * deletes a dashlet depending on the id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws Exception
     */

    public function DeleteDashlet($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $id = $db->quote($args['id']);
        $isDeleted = $db->query("DELETE FROM sysuidashboarddashlets WHERE id = '$id'");
        $isDeletedCustom = $db->query("DELETE FROM sysuicustomdashboarddashlets WHERE id = '$id'");
        return $res->withJson($isDeleted && $isDeletedCustom);
    }

    /**
     * selects everything form dashboards
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws Exception
     */

    public function GetAllDashboards($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $dashBoards = [];
        $dashBoardsObj = $db->query("SELECT * FROM dashboards");
        while ($dashBoard = $db->fetchByAssoc($dashBoardsObj))
            $dashBoards[] = $dashBoard;
        return $res->withJson($dashBoards);
    }

    /**
     * gets an dashboard id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws Exception
     */

    public function GetDashboardID($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $dashBoardBean = BeanFactory::getBean('Dashboards', $args['id']);
        $dashBoardBean = $dashBoardBean->retrieve($args['id']);
        return $res->withJson($dashBoardBean->components);
    }

    /**
     * Inserts into an dashboard component
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws Exception
     */

    public function InsertINtoDashboardComponent($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $postbodyitems = $body = $req->getParsedBody();
        //$postParams = $req->getQueryParams();
        //$postbodyitems = json_decode($postBody, true);

        $status = true;
        // todo: check if this is right to delete and reinsert all records .. might be nices to check what exists and update ...
        $db->query("DELETE FROM dashboardcomponents WHERE dashboard_id = '{$args['id']}'");
        foreach ($postbodyitems as $postbodyitem)
        {
            // $db->query("UPDATE sysuidashboardcomponents SET position='".json_encode($postbodyitem['position'])."', name='".$postbodyitem['name']."', component='".$postbodyitem['component']."' WHERE id = '".$postbodyitem['id']."'");
            $sql = "INSERT INTO dashboardcomponents (id, dashboard_id, name, component, componentconfig, position, dashlet_id) values('";
            $sql .= $postbodyitem['id'] . "', '{$args['id']}', '" . $postbodyitem['name'] . "', '" . $postbodyitem['component'];
            $sql .= "', '" . $db->quote(json_encode($postbodyitem['componentconfig']));
            $sql .= "', '" . $db->quote(json_encode($postbodyitem['position']));
            $sql .= "', '" . $postbodyitem['dashlet_id'] . "')";
            if( !$db->query($sql) ) throw ( new Exception( $db->last_error ))->setFatal(true);
        }
        return $res->withJson(['status' => $status]);
    }
}