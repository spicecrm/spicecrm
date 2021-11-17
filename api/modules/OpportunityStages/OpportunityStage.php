<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\OpportunityStages;

use SpiceCRM\data\SugarBean;

class OpportunityStage extends SugarBean {

	var $table_name = "opportunitystages";
	var $module_dir = "OpportunityStages";
	var $object_name = "OpportunityStage";

    function ACLAccess($view, $is_owner = 'not_set'){

        switch($view){
            case 'edit':
            case 'delete':
                return false;
                break;
        }

        return parent::ACLAccess($view, $is_owner);
    }


    /**
     * mainly for KReporter purpose
     *
     */
    function calculateTimeBetweenCurrentStageAndPreviousStage (){
       // current stage

       // next stage
    }

    /**
     * the next stage will be the one found in history with the first higher date_entered value
     */
    function getNextStage(){

    }
}
