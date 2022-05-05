<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\ProspectListFilters;

use SpiceCRM\data\SugarBean;

class ProspectListFilter extends SugarBean {

    function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();
        $sysModuleFilters = new SpiceCRM\includes\SysModuleFilters\SysModuleFilters();
        $this->entry_count = $sysModuleFilters->getCountForFilterId($this->module_filter);
    }
}
