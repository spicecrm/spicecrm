<?php

namespace SpiceCRM\modules\OrgUnits;

class OrgUnit extends \SpiceCRM\data\SpiceBean
{
    public function save($check_notify = false, $fts_index_bean = true)
    {
        $response = parent::save($check_notify, $fts_index_bean);

        if($this->orgchart_id != $this->fetched_row['orgchart_id']){
            // update all linked OrgUnits
            $linkedUnits = $this->get_linked_beans('members', 'OrgUnit', [], 0, -99, 0, "orgchart_id != '{$this->orgchart_id}'");
            foreach ($linkedUnits as $linkedUnit){
                $linkedUnit->orgchart_id = $this->orgchart_id;
                $linkedUnit->save();
            }

            // update all linked orgCharts
            $linkedCharts = $this->get_linked_beans('orgcharts', 'OrgChart');
            foreach ($linkedCharts as $linkedChart){
                $linkedChart->orgchart_id = $this->orgchart_id;
                $linkedChart->save();
            }
        }

        return $response;
    }
}