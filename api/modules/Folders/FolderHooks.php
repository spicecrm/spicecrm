<?php

namespace SpiceCRM\modules\Folders;

use SpiceCRM\includes\Logger\LoggerManager;

class FolderHooks
{
    public function beforeDelete( &$bean, $event, $arguments )
    {
        LoggerManager::getLogger()->fatal("Delete Hook of Folder");
        $childFolders = $bean->get_linked_beans('child_folders');
        foreach( $childFolders as $folder ) {
            $folder->mark_deleted( $folder->id );
        }
    }
}
