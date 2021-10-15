<?php
namespace SpiceCRM\modules\Calls\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;

class CallsController
{

    function setStatus(Request $req, Response $res, array $args): Response
    {
        $timedate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        // acl check if user can edit - must be adming or current user
        if (!$current_user->is_admin && $current_user->id != $args['userid'])
            throw (new ForbiddenException("only allowed for admins or assigned user"));

        // update directly on the db
        $db->query("UPDATE calls_users SET accept_status='{$args['value']}', date_modified='{$timedate->nowDb()}' WHERE deleted = 0 AND call_id='{$args['id']}' AND user_id='{$args['userid']}'");

        // CR1000356 re-index call
        if($bean = BeanFactory::getBean('Calls', $args['id'])){
            SpiceFTSHandler::getInstance()->indexBean($bean);
        }

        // return
        return $res->withJson(['status' => 'success']);
    }
}
