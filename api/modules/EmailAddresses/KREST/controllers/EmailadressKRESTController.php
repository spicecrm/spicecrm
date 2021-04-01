<?php
namespace SpiceCRM\modules\EmailAddresses\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\modules\EmailAddresses\EmailAddressRestHandler;

class EmailadressKRESTController{

    /**
     * searches for emails
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */

    public function searchMailAdress ($req,$res,$args){
        $emailAddress = BeanFactory::getBean('EmailAddresses');
        return $res->withJson($emailAddress->search($args['searchterm']));

    }

    /**
     * get the parsed body of an email
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function getMailText($req,$res,$args){
        $result = EmailAddressRestHandler::searchBeans($req->getParsedBody());
        return $res->withJson($result);

    }
}