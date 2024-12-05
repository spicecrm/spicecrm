<?php
namespace SpiceCRM\includes\SpiceBeanGuides\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceBeanGuides\SpiceBeanGuideRestHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceBeanGuidesController
{
    /**
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getBeanStages(Request $req, Response $res, $args): Response
    {
        $restHandler = new SpiceBeanGuideRestHandler();

        $fields = "id, name, status_field, systextid, module, is_default";
        $guide = DBManagerFactory::getInstance()->fetchOne("SELECT $fields, 'custom' as scope FROM spicebeancustomguides WHERE id = '{$args['guideId']}' UNION SELECT $fields, 'global' as scope FROM spicebeanguides  WHERE id = '{$args['guideId']}'");
        $bean = BeanFactory::getBean($args['module'], $args['beanid']);

        return $res->withJson($restHandler->getBeanGuideStages($guide, $bean));
    }
}