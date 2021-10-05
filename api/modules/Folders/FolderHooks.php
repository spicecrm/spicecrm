<?php

namespace SpiceCRM\modules\Folders;

class FolderHooks
{

    public function FolderHandler(&$bean, $event, $arguments)
    {
        switch ($event) {
            case 'before_delete':
                $childFolders = $bean->get_linked_beans('child_folders');
                foreach( $childFolders as $folder ) {
                    $folder->mark_deleted( $folder->id );
                }
                break;
        }
    }
}
