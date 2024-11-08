<?php

namespace SpiceCRM\includes\SpiceUI\schedulerjobtasks;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceUI\SpiceUIConfHandler;

class SpiceUIConfSchedulerJobTasks
{

    /**
     * creates a backup file of system tables
     * @return bool
     * @throws Exception
     */
    public function createConfigTransferBackup(): bool
    {
        ini_set('memory_limit', '512M');
        SpiceUIConfHandler::createBackupFile();
        return true;
    }

}