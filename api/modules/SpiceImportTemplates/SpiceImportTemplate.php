<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceImportTemplates;

use SpiceCRM\data\SugarBean;

class SpiceImportTemplate extends SugarBean {
    public $module_dir = 'SpiceImportTemplates';
    public $object_name = 'SpiceImportTemplate';
    public $table_name = 'spiceimporttemplates';
    public $new_schema = true;
    
    public $additional_column_fields = [];

    public $relationship_fields = [
    ];


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
