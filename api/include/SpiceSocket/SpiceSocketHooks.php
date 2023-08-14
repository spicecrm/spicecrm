<?php
namespace SpiceCRM\includes\SpiceSocket;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\SpiceBean;

class SpiceSocketHooks
{
    /**
     * emit a bean update message to frontend through the NodeJs server socket.io
     * @param $bean
     */
    public function updateSocket(SpiceBean &$bean)
    {
        $moduleHandler = new SpiceBeanHandler();

        SpiceSocket::getInstance()->emit(
            'module',
            $bean->systemUpdate ? 'systemupdate' : 'update',
            md5("$bean->_module:$bean->id"),
            [
                'id' => $bean->id,
                'module' => $bean->_module,
                'sessionId' => md5(session_id())
            ]
        );
    }
}
