<?php
namespace SpiceCRM\modules\Contacts\KREST\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceCRMExchange\ModuleHandlers\SpiceCRMExchangeContacts;
use SpiceCRM\includes\authentication\AuthenticationController;

class ContactsController
{
    public function __construct() {
    }

    public function ewsSync($req, $res, $args) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $contact = BeanFactory::getBean('Contacts', $args['id']);

        $ewsContact = new SpiceCRMExchangeContacts($current_user, $contact);

        try {
            $response   = $ewsContact->createOnExchange();
            return $res->withJson($response);
        } catch (Exception $e) {
            return $res->withJson($e->getMessage(), $e->getCode());
        }
    }

    public function ewsDelete($req, $res, $args) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $contact = BeanFactory::getBean('Contacts', $args['id']);

        $ewsContact = new SpiceCRMExchangeContacts($current_user, $contact);
        $response   = $ewsContact->deleteOnExchange();

        return $res->withJson($response);
    }
}
