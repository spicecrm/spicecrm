<?php

namespace SpiceCRM\modules\Users\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;

class UserSignatureController{

    public function GetUserSignature($req, $res, $args){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $signature = $db->fetchByAssoc($db->query("SELECT * FROM users_signatures WHERE user_id='{$args['id']}'"));

        return $res->withJson([
            'signature'      => $signature['signature'],
            'signature_html' => $signature['signature_html']
        ]);


    }
    public function SetUserSignature($req, $res, $args){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $signatures = json_decode(file_get_contents('php://input'), true);

        $signature = $db->fetchByAssoc($db->query("SELECT id FROM users_signatures WHERE user_id='{$args['id']}'"));
        if ($signature)
            $db->query("UPDATE users_signatures SET signature = '{$signatures['signature']}', signature_html = '{$signatures['signature_html']}' WHERE user_id='{$signature['id']}'");
        else
            $db->query("INSERT INTO users_signatures (id, deleted, user_id, signature, signatire_html) VALUES('" . create_guid() . "', 0, '{$args['id']}', '{$signatures['signature']}', '{$signatures['signature_html']}')");

        return $res->withJson(['status' => 'success']);
    }

    /**
     * return the signature content for the current user
     * @return mixed
     * @throws \Exception
     */
    public function getCurrentUserSignature()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $userData = $db->fetchByAssoc($db->query("SELECT email_signature FROM users WHERE id='{$current_user->id}'"));

        return $userData['email_signature'];
    }
}