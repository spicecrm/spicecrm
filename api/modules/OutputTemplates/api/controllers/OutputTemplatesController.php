<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 07.05.2019
 * Time: 13:20
 */
namespace SpiceCRM\modules\OutputTemplates\api\controllers;

use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class OutputTemplatesController
{
    public function compile(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean('OutputTemplates', $args['id']);
        $bean->bean_id = $args['bean_id'];
        return $res->withJson(['content' => $bean->translateBody()]);

    }

    public function previewpdf(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $bean = BeanFactory::getBean('OutputTemplates');

        $bean->id = $body['id'];
        $bean->body = $body['body'];
        $bean->header = $body['header'];
        $bean->footer = $body['footer'];
        $bean->stylesheet_id = $body['stylesheet_id'];

        $bean->margin_left = $body['margin_left'];
        $bean->margin_top = $body['margin_top'];
        $bean->margin_right = $body['margin_right'];
        $bean->margin_bottom = $body['margin_bottom'];
        $bean->page_size = $body['page_size'];
        $bean->page_orientation = $body['page_orientation'];

        $bean->module_name = $body['parentype'];
        $bean->bean_id = $body['parentid'];
        $file = $bean->getPdfContent();
        return $res->withJson(['content' => base64_encode($file)]);
    }

    public function previewhtml(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $bean = BeanFactory::getBean('OutputTemplates');

        $bean->id = $body['id'];
        $bean->body = $body['body'];
        $bean->header = $body['header'];
        $bean->footer = $body['footer'];
        $bean->stylesheet_id = $body['stylesheet_id'];
        $bean->module_name = $body['parentype'];
        $bean->bean_id = $body['parentid'];
        return $res->withJson(['content' => $bean->translateBody()]);

    }

    public function convertToFormat(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean('OutputTemplates', $args['id']);
        $bean->bean_id = $args['bean_id'];
        $file = $bean->getPdfContent();
        $res->getBody()->write($file);
        return $res->withHeader('Content-Type', 'application/pdf');
    }

    public function convertToBase64(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean('OutputTemplates', $args['id']);
        $bean->bean_id = $args['bean_id'];
        $file = $bean->getPdfContent();
        return $res->withJson(['content' => base64_encode($file)]);
    }

    public function getModuleTemplates(Request $req, Response $res, array $args): Response {
        $templates = [];
        $bean = BeanFactory::getBean('OutputTemplates');
        $beans = $bean->get_full_list('name', "module_name='{$args['module']}'");
        foreach ($beans as $bean) {
            $templates[] = [
                'id' => $bean->id,
                'name' => $bean->name,
                'language' => $bean->language
            ];
        };
        return $res->withJson($templates);
    }
}
