<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\Projects;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\utils\SpiceUtils;

class Project extends SpiceBean {
    // calculated information
    public $total_estimated_effort;
    public $total_actual_effort;
    public $estimated_start_date;
    public $estimated_end_date;


    /**
     * add some calculated values on retrieve
     * @param int $id
     * @param false $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return Project|null
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $bean =  parent::retrieve($id, $encode, $deleted, $relationships);

        // calculations
        if($bean){
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

        return $bean;
    }




    /**
     *
     */
    function get_summary_text()
    {
        return $this->name;
    }



    function bean_implements($interface){
        switch($interface){
            case 'ACL':return true;
        }
        return false;
    }



}

