<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Agreements;

use SpiceCRM\data\SpiceBean;

class Agreement extends SpiceBean {
    
    public $valid_from;
    public $valid_to;

    public $is_valid = false;

    /**
     * checks if the agreement's validation is expired
     */
    public function isValid(){

        $today = gmdate('Y-m-d');

        if(!$this->valid_from == null && !$this->valid_to == null) { //checking whether the date fields are not empty

            //condition if the start/end of validation lies in the future or lies in the past
            if($today >= $this->valid_from && $today <= $this->valid_to) {
                $this->is_valid = true;
            } else {
                $this->is_valid = false;
            };
        } elseif ($this->valid_from == null && !$this->valid_to == null){
            if($today <= $this->valid_to) {
                $this->is_valid = true;
            } else {
                $this->is_valid = false;
            };
        } elseif (!$this->valid_from == null && $this->valid_to == null){
            if($today >= $this->valid_from) {
                $this->is_valid = true;
            } else {
                $this->is_valid = false;
            };
        }
    }

    public function fill_in_additional_detail_fields()
    {

        $this->isValid();

        parent::fill_in_additional_detail_fields();
    }
};