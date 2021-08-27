<?php
namespace SpiceCRM\includes\SpiceUI;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\authentication\AuthenticationController;

class SpiceUIRESTHelper{
    static function checkAdmin()
    {
        if (!AuthenticationController::getInstance()->getCurrentUser()->is_admin)
            // set for cors
            // header("Access-Control-Allow-Origin: *");
            throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
    }
}
