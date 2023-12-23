<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\UOMUnits;

use SpiceCRM\data\SpiceBean;

class UOMUnit extends SpiceBean {

    public function get_summary_text(){
        return $this->label;
    }

}
