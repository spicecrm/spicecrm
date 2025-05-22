<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\Projects;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\utils\SpiceUtils;

class Project extends SpiceBean {
    // calculated information
    public $total_estimated_effort;
    public $total_actual_effort;
    public $estimated_start_date;
    public $estimated_end_date;

    /**
     * Retrieves and calculates detailed view information for the object, including
     * planned and actual efforts, estimated start and end dates. Efforts are aggregated
     * using linked WBS elements, and start/end dates are derived based on those elements.
     *
     * @return void
     */
    public function retrieveViewDetails(): void
    {
        parent::retrieveViewDetails();

        // calculate planned & actual efforts using wbs elements
        $this->total_estimated_effort = 0;
        $this->total_actual_effort = 0;
        $wbsElements = $this->get_linked_beans('projectwbss');
        foreach($wbsElements as $wbs){
            // handle planned efforts
            if(is_string($wbs->planned_effort)) $wbs->planned_effort = intval($wbs->planned_effort);
            $this->total_estimated_effort += $wbs->planned_effort;
            // handle actual efforts
            if(is_string($wbs->consumed_effort)) $wbs->consumed_effort = intval($wbs->consumed_effort);
            $this->total_actual_effort += $wbs->consumed_effort;
        }

        // calculate start and end dates according to earliest WBS element start date and lastest WBS end date
        if(count($wbsElements) > 0) {
            $this->estimated_start_date = SpiceUtils::getMinDate($wbsElements, 'date_start');
            $this->estimated_end_date = SpiceUtils::getMaxDate($wbsElements, 'date_end');
        }
    }
}

