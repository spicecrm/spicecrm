<?php

namespace SpiceCRM\modules\AccountCCDetails\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class AccountCCDetailsController
{
    public function getAllMaintainedForAccount(Request $req, Response $res, array $args): Response {
       $companyCodeIDs = DBManagerFactory::getInstance()->fetchAll("SELECT companycode_id FROM accountccdetails WHERE account_id='{$args['id']}' AND deleted = 0");

       $ccIDS = [];
       foreach ($companyCodeIDs as $companyCodeID) {
           $ccIDs[] = $companyCodeID['companycode_id'];
       }
        return $res->withJson($ccIDs);
    }
}