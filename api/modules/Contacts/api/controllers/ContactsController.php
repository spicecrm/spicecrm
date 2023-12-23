<?php
namespace SpiceCRM\modules\Contacts\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\includes\MicrosoftGraph\ModuleHandlers\MSGraphBeanHandler;
use SpiceCRM\extensions\includes\MicrosoftGraph\services\MSGraphContact;
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

    public function msgraphSync(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $contact = BeanFactory::getBean('Contacts', $args['id']);
        if(!$contact) return $res->withJson(['message' => 'Contact bean not found for id '.$args['id'], 'code' => 404]);

        try {
            $msgraphContact = new MSGraphBeanHandler($current_user, $contact);
            $found= $msgraphContact->getItem();
            if($found->error && $found->error->code == 'ErrorItemNotFound'){
                $response   = $msgraphContact->createItem();
            } else{
                $response   = $msgraphContact->updateItem();
            }
            return $res->withJson($response);
        } catch (Exception $e) {
            return $res->withJson(['message' => $e->getMessage(), 'code' => $e->getCode()]);
        }
    }

    public function msgraphDelete(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $contact = BeanFactory::getBean('Contacts', $args['id']);
        if(!$contact) return $res->withJson(['message' => 'Contact bean not found for id '.$args['id'], 'code' => 404]);

        $msgraphContact = new MSGraphBeanHandler($current_user, $contact);
        $response   = $msgraphContact->deleteItem();

        return $res->withJson($response);
    }
}
