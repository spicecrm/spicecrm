<?php

namespace SpiceCRM\includes\PageBuilder\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class PageBuilderController
{
    /**
     * get page builder custom elements
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getCustomElements(Request $req, Response $res, array $args): Response
    {
        $sections = []; $items = [];
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT * FROM page_builder_custom_elements ORDER BY name");

        while ($element = $db->fetchByAssoc($query)) {
            switch ($element['type']) {
                case 'section':
                    $sections[] = $element;
                    break;
                case 'item':
                    $items[] = $element;
                    break;
            }
        }

        return $res->withJson(['sections' => $sections, 'items' => $items]);
    }

    /**
     * add page builder custom elements
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function addCustomElements(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        $element = [
            'id' => $params['id'],
            'name' => $params['name'],
            'type' => $params['type'],
            'content' => $params['content'],
        ];

        $db = DBManagerFactory::getInstance();
        $db->insertQuery('page_builder_custom_elements', $element);

        return $res->withJson(true);
    }

    /**
     * delete page builder custom elements
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function deleteCustomElements(Request $req, Response $res, array $args): Response
    {
        $id = $args['id'];
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM page_builder_custom_elements WHERE id = '$id'");

        return $res->withJson(true);
    }
}
