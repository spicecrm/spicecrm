<?php
namespace SpiceCRM\includes\SpiceSocket;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceSocketHooks
{
    /**
     * emit a bean update message to frontend through the NodeJs server socket.io
     * @param $bean
     */
    public function updateSocket(SpiceBean &$bean)
    {

        $moduleDetails = SpiceModules::getInstance()->getModuleDetails($bean->_module);

        if ($moduleDetails['socket_disabled'] == 1) {
            return;
        }

        // check if we have a current user - if not do not try to get a session but create a random guid and session
        // if not also declare it a systemupdate
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        SpiceSocket::getInstance()->emit(
            'module',
            $bean->systemUpdate || !$current_user->id ? 'systemupdate' : 'update',
            md5("$bean->_module:$bean->id"),
            [
                'id' => $bean->id,
                'module' => $bean->_module,
                'sessionId' => $current_user->id ? md5(session_id()) : md5(SpiceUtils::createGuid())
            ]
        );
    }
}
