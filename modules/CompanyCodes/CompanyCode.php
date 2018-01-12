<?php

class CompanyCode extends SugarBean {

    var $new_schema = true;
    var $module_dir = 'CompanyCodes';
    var $object_name = 'CompanyCode';
    var $table_name = 'companycodes';
    var $importable = false;

    function __construct() {
        parent::__construct();
    }

    function get_summary_text() {
        return $this->name;
    }

    function bean_implements($interface) {
        switch ($interface) {
            case 'ACL':return true;
        }
        return false;
    }
}

?>
