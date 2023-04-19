<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\ProspectListFilters;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;

class ProspectListFilter extends SpiceBean {

    function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();
        $sysModuleFilters = new SysModuleFilters();
        $this->entry_count = $sysModuleFilters->getCountForFilterId($this->module_filter);
    }
}
