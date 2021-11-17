<?php
namespace SpiceCRM\modules\EmailAddresses\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\modules\EmailAddresses\EmailAddressRestHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class EmailAddressesController
{
    /**
     * searches for emails
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */

    public function searchMailAddress(Request $req, Response $res, array $args): Response {
        $emailAddress = BeanFactory::getBean('EmailAddresses');
        return $res->withJson($emailAddress->search($args['searchterm']));

    }

    /**
     * get the parsed body of an email
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */

    public function getMailText(Request $req, Response $res, array $args): Response {
        $result = EmailAddressRestHandler::searchBeans($req->getParsedBody());
        return $res->withJson($result);

    }

    public function searchParentBeanMailAddress(Request $req, Response $res, array $args): Response {
        $seed = BeanFactory::getBean($args['parentmodule'], $args['parentid']);
        if(!$seed){
            throw new NotFoundException('record not found');
        }


        $emailAddress = BeanFactory::getBean('EmailAddresses');
        return $res->withJson($emailAddress->searchForParentBean($seed));
    }

}