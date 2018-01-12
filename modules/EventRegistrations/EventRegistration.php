<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
        
require_once('data/SugarBean.php');

class EventRegistration extends SugarBean {
    public $module_dir = 'EventRegistrations';
    public $object_name = 'EventRegistration';
    public $table_name = 'eventregistrations';
    public $new_schema = true;
    
    public $additional_column_fields = Array();

    public $relationship_fields = Array(
    );


    public function __construct(){
        parent::__construct();
    }

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