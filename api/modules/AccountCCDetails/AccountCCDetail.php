<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\AccountCCDetails;

use SpiceCRM\data\SugarBean;

class AccountCCDetail extends SugarBean
{
    public $table_name = "accountccdetails";
    public $object_name = "AccountCCDetail";
    public $module_dir = "AccountCCDetails";

    function get_summary_text()
    {
        return $this->companycode_name;
    }
}
