<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\CompanyFiscalPeriods;

use SpiceCRM\data\SpiceBean;

class CompanyFiscalPeriod extends SpiceBean {

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
