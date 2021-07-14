<?php
namespace SpiceCRM\includes\SugarObjects\api\controllers;

use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class PersonsController
{
    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function convertToVCARD(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean($args['module'], $args['id']);
        if (!$bean) {
            throw new NotFoundException('Bean not found');
        }
        $content = $bean->getVCardContent();
        return $res->withHeader('Content-Type', 'text/x-vcard', 'charset=utf-8')
            ->write($content);
    }
}
