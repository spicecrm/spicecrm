<?php
namespace SpiceCRM\modules\SpiceImports\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;

class SpiceImportsSchedulerJobTasks
{
    /**
     * Job 25
     * Process SpiceImports Schedules
     */
    public function processSpiceImports(): bool {
        echo 'importing';
        $import = BeanFactory::getBean('SpiceImports');
        $importList = $import->get_list("date_entered", "spiceimports.status = 'q'", 0 , 5);
        foreach($importList['list'] as $thisImport) {
            $thisImport->process();
        }
    }
}