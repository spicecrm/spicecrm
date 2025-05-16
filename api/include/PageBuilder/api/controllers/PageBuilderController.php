<?php

namespace SpiceCRM\includes\PageBuilder\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\extensions\includes\mjml\MJMLHandler;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\OutputTemplates\handlers\pdf\ChromeLocalPdfHandler;

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

        try {
            $parsedHtml = $this->parseForThumbnail($params);
            $thumbnail = ChromeLocalPdfHandler::getScreenshot($parsedHtml, 'body > *');
            $element['image'] = 'data:image/png;base64,' . $thumbnail;

        } catch (\Throwable $th) {
            # no action needed
        }

        $db = DBManagerFactory::getInstance();
        $db->insertQuery('page_builder_custom_elements', $element);

        return $res->withJson(['image' => $element['image']]);
    }

    /**
     * wrap the element content in a body element and parse it to prepare for the thumbnail
     * @param array $params
     * @return string
     */
    private function parseForThumbnail(array $params): string
    {
        $handler = new MJMLHandler();

        $body = '{"tagName": "mjml", "children": [{"tagName": "body", "children": ['. $params['content'] .']}]}';
        $xml = $handler->json2xml(json_decode($body, true));
        $html = $handler->xmlToHtml($xml)['html'];

        # append the stylesheet if exists
        if ($params['stylesheet']) {
            return str_replace('</head>', "<style>{$params['stylesheet']}</style></head>", $html);
        } else {
            return $html;
        }
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
