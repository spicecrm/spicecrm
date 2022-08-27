<?php
namespace SpiceCRM\includes\SpiceSocket;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;

class SpiceSocketHooks
{
    /**
     * emit a bean update message to frontend through the NodeJs server socket.io
     * @param $bean
     */
    public function updateSocket(&$bean)
    {
        $moduleHandler = new SpiceBeanHandler();

        SpiceSocket::getInstance()->emit(
            'module',
            'update',
            md5("$bean->_module:$bean->id"),
            [
                'id' => $bean->id,
                'module' => $bean->_module,
                'sessionId' => md5(session_id())
            ]
        );
    }
}
