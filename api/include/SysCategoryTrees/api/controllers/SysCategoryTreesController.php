<?php

namespace SpiceCRM\includes\SysCategoryTrees\api\controllers;

use Psr\Http\Message\RequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;

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
        $return = [];
        $rows = $db->query("SELECT * FROM syscategorytreenodes WHERE syscategorytree_id = '{$args['id']}'");
        while ($row = $db->fetchByAssoc($rows)) {
            $row['favorite'] = $row['favorite'] ? true : false;
            $row['selectable'] = $row['selectable'] ? true : false;
            $return[] = $row;
        }
        return $res->withJson($return);
    }

    public function postTreeNodes(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $postbody = $req->getParsedBody();

        foreach ($postbody as $node){
            $node['favorite'] = $node['favorite'] ? 1 : 0;
            $node['selectable'] = $node['selectable'] ? 1 : 0;
            $db->upsertQuery('syscategorytreenodes', ['id' => $node['id']], $node, true);
        }
        return $res->withJson(['status' => 'success']);
    }

}