<?php
namespace SpiceCRM\modules\Dashboards\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class DashboardManagerController{

    /**
     * selects all global and custom dashlets
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getGlobalAndCustomDashlet(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $dashBoardDashlets = [];
        $dashlets = "SELECT 'global' As `type`, dlts.* FROM sysuidashboarddashlets dlts UNION ";
        $dashlets .= "SELECT 'custom' As `type`, cdlts.* FROM sysuicustomdashboarddashlets cdlts";
        $dashlets = $db->query($dashlets);
        while ($dashBoardDashlet = $db->fetchByAssoc($dashlets)) {
            $dashBoardDashlets[] = $dashBoardDashlet;
        }

        return $res->withJson($dashBoardDashlets);
    }

    /**
     * replaces into the database
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function replaceDashlet(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $columns = [];
        $values = [];
        $params = $req->getParsedBody();
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
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function deleteDashlet(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $id = $db->quote($args['dashletId']);
        $isDeleted = $db->query("DELETE FROM sysuidashboarddashlets WHERE id = '$id'");
        $isDeletedCustom = $db->query("DELETE FROM sysuicustomdashboarddashlets WHERE id = '$id'");
        return $res->withJson($isDeleted && $isDeletedCustom);
    }

    /**
     * selects everything form dashboards
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getAllDashboards(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $dashBoards = [];
        $dashBoardsObj = $db->query("SELECT * FROM dashboards");
        while ($dashBoard = $db->fetchByAssoc($dashBoardsObj))
            $dashBoards[] = $dashBoard;
        return $res->withJson($dashBoards);
    }

    /**
     * Returns dashboard components
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getDashboard(Request $req, Response $res, array $args): Response {
        $dashBoardBean = BeanFactory::getBean('Dashboards', $args['id']);
//        $dashBoardBean = $dashBoardBean->retrieve($args['id']);
        return $res->withJson($dashBoardBean->components);
    }

    /**
     * Saves dashboard components
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function addDashboardComponents(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $postbodyitems = $body = $req->getParsedBody();
        //$postParams = $req->getQueryParams();

        $status = true;
        // todo: check if this is right to delete and reinsert all records .. might be nices to check what exists and update ...
        $db->query("DELETE FROM dashboardcomponents WHERE dashboard_id = '{$args['dashboardId']}'");
        foreach ($postbodyitems as $postbodyitem) {
            // $db->query("UPDATE sysuidashboardcomponents SET position='".json_encode($postbodyitem['position'])."', name='".$postbodyitem['name']."', component='".$postbodyitem['component']."' WHERE id = '".$postbodyitem['id']."'");
            $sql = "INSERT INTO dashboardcomponents (id, dashboard_id, name, component, componentconfig, position, dashlet_id) values('";
            $sql .= $postbodyitem['id'] . "', '{$args['dashboardId']}', '" . $postbodyitem['name'] . "', '" . $postbodyitem['component'];
            $sql .= "', '" . $db->quote(json_encode($postbodyitem['componentconfig']));
            $sql .= "', '" . $db->quote(json_encode($postbodyitem['position']));
            $sql .= "', '" . $postbodyitem['dashlet_id'] . "')";
            if( !$db->query($sql) ) throw ( new Exception( $db->last_error ))->setFatal(true);
        }
        return $res->withJson(['status' => $status]);
    }
}