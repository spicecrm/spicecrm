<?php

namespace SpiceCRM\includes\SysCategoryTrees\api\controllers;

use Psr\Http\Message\RequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;
use SpiceCRM\includes\TimeDate;

class SysCategoryTreesController
{

    /**
     * returns the maintained trees
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    public function getTrees(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $return = [];
        $rows = $db->query('SELECT * FROM syscategorytrees');
        while ($row = $db->fetchByAssoc($rows)) {
            $return[] = $row;
        }
        return $res->withJson($return);
    }

    public function addTree(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $postbody = $req->getParsedBody();
        $db->insertQuery('syscategorytrees', ['id' => $args['id'], 'name' => $postbody['name']]);
        return $res->withJson(['status' => 'success']);
    }

    public function getTreeNodes(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();

        $params = $req->getQueryParams();

        $return = [];
        $where = "syscategorytree_id = '{$args['id']}'";
        if(!$params['all']){
            $dbNow = TimeDate::getInstance()->nowDb();
            $where .= " AND deleted = 0 AND node_status = 'a' AND valid_from <= '{$dbNow}' AND valid_to >= '{$dbNow}'";
        }
        $rows = $db->query("SELECT * FROM syscategorytreenodes WHERE $where");
        while ($row = $db->fetchByAssoc($rows)) {
            $row['favorite'] = $row['favorite'] == 1 ? true : false;
            $row['selectable'] = $row['selectable'] == 1 ? true : false;
            $row['parent_id'] = $row['parent_id'] ?: '';

            // decode the json and send as object
            $row['add_params'] = json_decode(html_entity_decode($row['add_params'])) ?: null;

            $return[] = $row;
        }
        return $res->withJson($return);
    }

    public function postTreeNodes(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $postbody = $req->getParsedBody();

        foreach ($postbody as $node){
            // convert the boolean fields
            $node['favorite'] = $node['favorite'] ? 1 : 0;
            $node['selectable'] = $node['selectable'] ? 1 : 0;

            // set teh dates to start day and end day
            $node['valid_from'] = substr($node['valid_from'], 0, 10) . ' 00:00:00' ;
            $node['valid_to'] = substr($node['valid_to'], 0, 10) . ' 23:59:59' ;

            $node['add_params'] = json_encode($node['add_params']);

            // run the query
            $db->upsertQuery('syscategorytreenodes', ['id' => $node['id']], $node, true);
        }
        return $res->withJson(['status' => 'success']);
    }

}