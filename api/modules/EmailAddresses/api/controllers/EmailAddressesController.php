<?php
namespace SpiceCRM\modules\EmailAddresses\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
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

    /**
     * validate email address domain
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function validateEmailAddressDomain(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody();

        $split = explode('@', $body['text']);


        $invalid_email = !EmailAddress::validateEmailAddressLocalPart($split[0]);

        $invalid_domain = count($split) !== 2 || !EmailAddress::validateEmailAddressDomain($split[1]);

        return $res->withJson([
            'invalid_email' => $invalid_email,
            'invalid_domain' => $invalid_domain
        ]);
    }
}