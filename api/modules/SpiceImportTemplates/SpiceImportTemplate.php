<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceImportTemplates;

use SpiceCRM\data\SpiceBean;

class SpiceImportTemplate extends SpiceBean {

    public function get_summary_text(){
        return $this->name;
    }

    public function bean_implements($interface){
        switch($interface){
            case 'ACL':return true;
        }
        return false;
    }    
}
