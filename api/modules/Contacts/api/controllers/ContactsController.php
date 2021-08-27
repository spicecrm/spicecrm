<?php
namespace SpiceCRM\modules\Contacts\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\includes\SpiceCRMExchange\ModuleHandlers\SpiceCRMExchangeContacts;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class ContactsController
{
    public function __construct() {
    }

    public function ewsSync(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $contact = BeanFactory::getBean('Contacts', $args['id']);

        try {
            $ewsContact = new SpiceCRMExchangeContacts($current_user, $contact);
            $response   = $ewsContact->createOnExchange();
            return $res->withJson($response);
        } catch (Exception $e) {
            return $res->withJson(['message' => $e->getMessage(), 'code' => $e->getCode()]);
        }
    }

    public function ewsDelete(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $contact = BeanFactory::getBean('Contacts', $args['id']);

        $ewsContact = new SpiceCRMExchangeContacts($current_user, $contact);
        $response   = $ewsContact->deleteOnExchange();

        return $res->withJson($response);
    }
}
