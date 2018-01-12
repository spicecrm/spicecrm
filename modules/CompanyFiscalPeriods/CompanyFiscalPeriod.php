<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
        
require_once('data/SugarBean.php');

class CompanyFiscalPeriod extends SugarBean {
    public $module_dir = 'CompanyFiscalPeriods';
    public $object_name = 'CompanyFiscalPeriod';
    public $table_name = 'companyfiscalperiods';
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


    public function save($notify = false, $fts_index_bean = true){
        //set name
        $this->name = $this->fiscal_year."-".$this->fiscal_month;

        return parent::save($notify, $fts_index_bean);
    }


}