<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\OrgCharts;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * a module to haneld org charts and assignment of org units
 */
class OrgChart extends SpiceBean
{
    /**
     * create an initial orgunit if the chart is new
     *
     * @param $check_notify
     * @param $fts_index_bean
     * @return int|string
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        if($this->isNew()){
            if(!$this->id){
                $this->id = SpiceUtils::createGuid();
                $this->new_with_id = true;
            }

            $unit = BeanFactory::getBean('OrgUnits');
            $unit->name = 'new';
            $unit->orgchart_id = $this->id;
            $unit->assigned_user_id = $this->assigned_user_id;
            $unit->save();
        }

        // save the parent
        return parent::save($check_notify, $fts_index_bean);
    }
}