<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\AccountCCDetails;

use SpiceCRM\includes\SpiceBeans\SpiceBean;

class AccountCCDetail extends SpiceBean
{
    function get_summary_text()
    {
        return $this->companycode_name;
    }
}
