<?php
namespace SpiceCRM\includes\SpiceSocket;

use SpiceCRM\KREST\handlers\ModuleHandler;

class SpiceSocketHooks
{
    /**
     * emit a bean update message to frontend through the NodeJs server socket.io
     * @param $bean
     */
    public function updateSocket(&$bean)
    {
        $moduleHandler = new ModuleHandler();

        SpiceSocket::getInstance()->emit(
            'module',
            'update',
            md5("$bean->module_dir:$bean->id"),
            [
                'id' => $bean->id,
                'module' => $bean->module_dir,
                'sessionId' => md5(session_id())
            ]
        );
    }
}
