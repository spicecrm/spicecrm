<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\OpportunityStages;

use SpiceCRM\data\SpiceBean;

class OpportunityStage extends SpiceBean {

    /**
     * @deprecated
     */
    public $amount_usdollar;

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
