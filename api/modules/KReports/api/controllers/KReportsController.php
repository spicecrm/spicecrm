<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\KReports\KReport;
use SpiceCRM\modules\SpiceACL\SpiceACL;


class KReportsController
{
    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function saveLayout(Request $req, Response $res, array $args): Response{
        $postBody = $req->getParsedBody();
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->saveStandardLayout($args['id'], $postBody['layout']));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getSnapshots(Request $req, Response $res, array $args): Response{
        $thisReport = new KReport();
        $thisReport->retrieve($args['id']);
        $requestParams = $req->getQueryParams();
        return $res->withJson($thisReport->getSnapshots($requestParams['withoutActual']));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function deleteSnapshot(Request $req, Response $res, array $args): Response{
        $thisReport = new KReport();
        $thisReport->retrieve($args['id']);
        $response = $thisReport->deleteSnapshot($args['snapshotid']);
        return $res->withJson($response);
    }


    /**
     * @param $req
     * @param $res
     * @param $args
     * @return array
     * @throws ForbiddenException
     */
    public function getPublishedKReports(Request $req, Response $res, array $args): Response{
        if (!SpiceACL::getInstance()->checkAccess('KReports', 'list', true))
            throw (new ForbiddenException("Forbidden to list in module KReports."))->setErrorCode('noModuleList');
        $db = DBManagerFactory::getInstance();
        $list = [];
        $type = $db->quote($args['type']);
        $params = $req->getQueryParams();
        $searchKey = $params['searchKey'] ? $db->quote($params['searchKey']) : '';
        $offset = $params['offset'] ? $db->quote($params['offset']) : 0;
        $limit = $params['limit'] ? $db->quote($params['limit']) : 40;
        $where = "deleted=0 AND integration_params LIKE '%\"$type\":\"on\"%' AND (integration_params LIKE '%\"kpublishing\":1%' OR integration_params LIKE '%\"kpublishing\":\"1\"%')";
        if ($searchKey != '') {
            $where .= " AND name LIKE '%$searchKey%'";
        }
        $query = "SELECT id, name, description, report_module, integration_params FROM kreports WHERE $where LIMIT $limit OFFSET $offset";
        $query = $db->query($query);
        while ($row = $db->fetchByAssoc($query)) $list[] = $row;
        return $res->withJson($list);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getDLists(Request $req, Response $res, array $args): Response{
        $restHandler = new \KReporterRESTHandler();
        return $res->withJson($restHandler->getDLists());
    }

    /**
     * load report categories for the ui loadtasks
     * @return array
     */
    public function getReportCategories() {
        $db = DBManagerFactory::getInstance();
        $list = [];
        if($db->tableExists('kreportcategories')) {
            $query = $db->query("SELECT * FROM kreportcategories WHERE deleted <> 1");
            while ($row = $db->fetchByAssoc($query)) $list[] = $row;
        }
        return $list;
    }
}
