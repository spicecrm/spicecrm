<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceImports\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
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
        /* @var SpiceImport $import */
        $import = BeanFactory::getBean('SpiceImports');
        $importList = $import->get_list("date_entered", "spiceimports.status = 'q' and spiceimports.deleted = '0'", 0 , 5);
        $success = true;
       // if(!$importList['list']) echo 'nothing to import';
        /* @var SpiceImport $thisImport */
        foreach($importList['list'] as $thisImport) {
            $thisImport->objectimport = (object)json_decode( $thisImport->data,true );
            $result = $thisImport->process();
            $success = ( $success && $result['status'] == 'imported' );
        }
        return $success;
    }
}