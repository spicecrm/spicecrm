<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\UOMUnits;

use SpiceCRM\data\SugarBean;

class UOMUnit extends SugarBean {
    public $module_dir = 'UOMUnits';
    public $object_name = 'UOMUnit';
    public $table_name = 'uomunits';
    public $new_schema = true;

    public function get_summary_text(){
        return $this->label;
    }

}
