<?php

namespace SpiceCRM\modules\Meetings\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;

class MeetingsController
{

    static function setStatus(Request $req, Response $res, array $args): Response
    {
        $timedate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        // acl check if user can edit - must be adming or current user
        if (!$current_user->is_admin && $current_user->id != $args['userid'])
            throw (new ForbiddenException("only allowed for admins or assigned user"));

        // update directly on the db
        $db->query("UPDATE meetings_users SET accept_status='{$args['value']}', date_modified='{$timedate->nowDb()}' WHERE deleted = 0 AND meeting_id='{$args['id']}' AND user_id='{$args['userid']}'");

        // CR1000356 re-index meeting
        if($bean = BeanFactory::getBean('Meetings', $args['id'], ['encode' => false])){
            SpiceFTSHandler::getInstance()->indexBean($bean);

// for exchange: send status to exchange => setInvitationStatusOnExchange() doesn't work... access denied...
// No documentation found to make it work.... Removed for now
//            if($bean->load_relationship('users')){
//                if(class_exists('\SpiceCRM\extensions\includes\SpiceCRMExchange\ModuleHandlers\SpiceCRMExchangeMeetings')){
//                    // check if user has a calendar exchange subscription & Meetings to be synced
//                    $userexchangesyncconfig = new \SpiceCRM\extensions\includes\SpiceCRMExchange\Connectivity\SpiceCRMExchangeUserSyncConfig($current_user->id);
//                    $syncmeetings = false;
//                    $userconfig = $userexchangesyncconfig->getConfig();
//                    foreach($userconfig as $idx => $cnf){
//                        if($cnf['sysmodule_name'] != 'Meetings'){
//                            continue;
//                        }
//                        if($cnf['exchangesubscription']){
//                            $syncmeetings = true;
//                            break;
//                        }
//                    }
//
//                    // trigger set invitation status
//                    if($syncmeetings){
//                        file_put_contents('ews.log', '$cnf => '.print_r($cnf, true)."\n", FILE_APPEND);
//                        $exchangeMeetingHandler = new \SpiceCRM\extensions\includes\SpiceCRMExchange\ModuleHandlers\SpiceCRMExchangeMeetings($current_user, $bean, true);
//                        // overwrite connector with current user (else assigned user  of event will be used as impersonated user
//                        $exchangeMeetingHandler->connector = new \SpiceCRM\extensions\includes\SpiceCRMExchange\SpiceCRMExchangeConnector($current_user);
//                        $exchangeMeetingHandler->setInvitationStatusOnExchange($bean, $args['status']);
//                    }
//
//
//                }
//            }
        }

        // return
        return $res->withJson(['status' => 'success']);
    }
}
