<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\AccountCCDetails;

use SpiceCRM\data\SugarBean;

class AccountCCDetail extends SugarBean
{
    function get_summary_text()
    {
        return $this->companycode_name;
    }
}
