<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceImports\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\modules\SpiceImports\SpiceImport;

class SpiceImportsSchedulerJobTasks
{
    /**
     * Job 25
     * Process SpiceImports Schedules
     */
    public function processSpiceImports(): bool {
        //for testing
//        echo 'importing';
        $success = true;
        $importIDs = DBManagerFactory::getInstance()->fetchAll("SELECT id FROM spiceimports WHERE status in ('p', 'q') and deleted = '0'");
        foreach($importIDs as $importID) {
            $thisImport = BeanFactory::getBean('SpiceImports', $importID['id']);
            $thisImport->objectimport = (object) json_decode( $thisImport->data, true);
            $result = $thisImport->process();
            $success = ( $success && $result['status'] == 'imported' );
        }
        return $success;
    }
}