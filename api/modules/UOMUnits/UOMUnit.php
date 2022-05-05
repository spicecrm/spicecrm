<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\UOMUnits;

use SpiceCRM\data\SugarBean;

class UOMUnit extends SugarBean {

    public function get_summary_text(){
        return $this->label;
    }

}
