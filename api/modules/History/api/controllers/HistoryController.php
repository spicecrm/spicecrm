<?php

namespace SpiceCRM\modules\History\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class HistoryController
{

    /**
     * @deprecated db solution
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function loadHistory(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $getParams = $req->getQueryParams();
        $start = $getParams['start'] ?: 0;
        $limit = $getParams['limit'] ?: 5;

        $queryArray = [];
        $modules = ['Calls', 'Meetings', 'Tasks', 'Notes', 'Emails'];

        $filterObjects = json_decode($getParams['objects']);

        foreach ($modules as $module) {

            // check if a filter applies
            if ($filterObjects && is_array($filterObjects) && count($filterObjects) > 0) {
                if (in_array($module, $filterObjects) === false)
                    continue;
            }

            // get the query
            $seed = BeanFactory::getBean($module);
            if ($seed && SpiceACL::getInstance()->checkAccess($module, 'list') && method_exists($seed, 'get_history_query')) {
                $query = $seed->get_history_query($args['parentmodule'], $args['parentid'], $getParams['own']);
                if (is_array($query)) {
                    $queryArray = array_merge($queryArray, $query);
                } elseif (!empty($query)) {
                    $queryArray[] = $query;
                }
            }
        }

        //echo implode(' UNION ALL ', $queryArray);
        //return;

        $objects = $db->limitQuery('select id, module from (' . implode(' UNION ', $queryArray) . ') unionresult order by sortdate DESC', $start, $limit);

        $count = 0;
        if ($getParams['count']) {
            $historyCount = $db->fetchByAssoc($db->query('select count(id) itemcount from (' . implode(' UNION ', $queryArray) . ') unionresult'));
            $count = $historyCount['itemcount'];
        }

        while ($object = $db->fetchByAssoc($objects)) {

            $bean = BeanFactory::getBean($object['module'], $object['id']);

            foreach ($bean->field_defs as $fieldname => $fielddata) {
                if ($bean->$fieldname)
                    $object['data'][$fieldname] = $bean->$fieldname;
            }

            $aclActions = ['detail', 'edit', 'delete'];
            foreach ($aclActions as $aclAction) {
                $object['data']['acl'][$aclAction] = $bean->ACLAccess($aclAction);
            }

            $retArray[] = $object;
        }

        return $res->withJson([
                'items' => $retArray,
                'count' => $count,
        ]);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function loadFTSHistory(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();

        $activitiyHandler = new SpiceFTSActivityHandler();
        $results = $activitiyHandler->loadActivities('History', $args['parentid'], $postBody['start'], $postBody['limit'], $postBody['searchterm'], $postBody['own'], json_decode($postBody['objects'], true));

        return $res->withJson($results);
    }

}
