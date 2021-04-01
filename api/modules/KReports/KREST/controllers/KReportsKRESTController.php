<?php

namespace SpiceCRM\modules\KReports\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class KReportsKRESTController
{
    /**
     * @param $req
     * @param $res
     * @param $args
     * @return array
     * @throws ForbiddenException
     */
    public function getPublishedKReports($req, $res, $args) {
        if (!SpiceACL::getInstance()->checkAccess('KReports', 'list', true))
            throw (new ForbiddenException("Forbidden to list in module KReports."))->setErrorCode('noModuleList');
        $db = DBManagerFactory::getInstance();
        $list = [];
        $type = $db->quote($args['type']);
        $params = $req->getParams();
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
