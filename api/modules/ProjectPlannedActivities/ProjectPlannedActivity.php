<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
namespace SpiceCRM\modules\ProjectPlannedActivities;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;


class ProjectPlannedActivity extends SugarBean {
    public $module_dir = 'ProjectPlannedActivities';
    public $object_name = 'ProjectPlannedActivity';
    public $table_name = 'projectplannedactivities';


    public function __construct(){
        parent::__construct();
    }

    public function get_summary_text(){
        if($this->projectactivitytype_id){
            return $this->project_name . '/'. $this->projectwbs_name . '/' . $this->assigned_user_name . '/' . $this->name;
        } else {
            return $this->project_name . '/'. $this->projectwbs_name . '/' . $this->assigned_user_name . '/' . $this->activity_type . '/' . $this->activity_level;
        }
    }

    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $bean =  parent::retrieve($id, $encode, $deleted, $relationships);

        if($bean){
            $this->consumed = 0;
            $activitySeed = BeanFactory::getBean('ProjectActivities');

            $activities = $this->db->query("SELECT activity_start, activity_end FROM projectactivities WHERE projectplannedactivity_id='{$bean->id}' AND deleted = 0");
            while($activity = $this->db->fetchByAssoc($activities)){
                $duration = (strtotime($activity['activity_end']) - strtotime($activity['activity_start'])) / 3600;
                $this->consumed += $duration;
            }
            $this->ratio = $this->effort > 0 ? round($this->consumed / $this->effort, 2) : 0;

            // set project_name
            $wbs = BeanFactory::getBean('ProjectWBSs', $this->projectwbs_id);
            if($wbs){
                // todo: workaround needs to be fixed
                $project = BeanFactory::getBean('Projects', $wbs->project_id);
                $this->project_name = $project->name;
                unset($wbs);
            }
        }

        return $this;
    }

}
