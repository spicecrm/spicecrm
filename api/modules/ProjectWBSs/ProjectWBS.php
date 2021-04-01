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

namespace SpiceCRM\modules\ProjectWBSs;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;

class ProjectWBS extends SugarBean
{
    //Sugar vars
    public $table_name = "projectwbss";
    public $object_name = "ProjectWBS";
    public $module_dir = "ProjectWBSs";

    public $project_name;


    public function get_summary_text()
    {
        return "$this->name ($this->project_name)";
    }

    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $seed = parent::retrieve($id, $encode, $deleted, $relationships);

        if ($seed) {
            // get the count of sub WBS elements
            $memberCount = $this->db->fetchByAssoc($this->db->query("SELECT count(id) membercount FROM projectwbss WHERE parent_id = '{$this->id}' AND deleted = 0"));
            $seed->member_count = $memberCount['membercount'];

            // get the total planned efforts on all planned activities (for this WBS)
            $plannedeffort = $this->db->fetchByAssoc($this->db->query("SELECT SUM(effort) plannedeffort FROM projectplannedactivities WHERE projectwbs_id='{$this->id}' AND deleted = 0"));
            $this->planned_effort = $plannedeffort['plannedeffort'] ?: 0;

            // calculate the consumed effort in hours
            $this->consumed_effort = 0;
            // $activitySeed = BeanFactory::getBean('ProjectActivities');
            //$activities = $activitySeed->get_full_list('', "projectwbs_id='{$this->id}'");
            //@deprecated
            //$activities = $this->db->query("SELECT pa.activity_end, pa.activity_start  FROM projectactivities pa INNER JOIN projectplannedactivities ppa ON ppa.id = pa.projectplannedactivity_id WHERE ppa.projectwbs_id='{$this->id}' AND ppa.deleted=0 AND pa.deleted=0");

            //temporarily set
            $activities = $this->db->query("SELECT pa.activity_end, pa.activity_start, pa.id FROM projectactivities pa LEFT JOIN projectplannedactivities ppa ON ppa.id = pa.projectplannedactivity_id WHERE (pa.projectwbs_id='{$this->id}' OR (ppa.projectwbs_id='{$this->id}' AND ppa.deleted=0) ) AND  pa.deleted=0 GROUP BY pa.id");

            // future
            //$activities = $this->db->query("SELECT pa.activity_end, pa.activity_start, pa.id FROM projectactivities pa INNER JOIN projectplannedactivities ppa ON ppa.id = pa.projectplannedactivity_id AND ppa.deleted=0 WHERE ppa.projectwbs_id='{$this->id}' AND  pa.deleted=0 GROUP BY pa.id");

            while($activity =  $this->db->fetchByAssoc($activities)){
                $duration = (strtotime($activity['activity_end']) - strtotime($activity['activity_start'])) / 3600;
                $this->consumed_effort += $duration;
            }
        }

        return $seed;
    }

    public function getList($project_id)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $app_doms = return_app_list_strings_language($GLOBALS['current_language']);
        $td = new TimeDate($current_user);
        $list = [];
        $res = $db->query("SELECT * FROM projectwbss WHERE deleted = 0 AND project_id = '" . $project_id . "'");
        while ($row = $db->fetchByAssoc($res)) {
            $list[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'date_start' => empty($row['date_start']) ? "" : date_format(date_create_from_format($td->get_db_date_format(), $row['date_start']), $current_user->getPreference('datef')),
                'date_end' => empty($row['date_end']) ? "" : date_format(date_create_from_format($td->get_db_date_format(), $row['date_end']), $current_user->getPreference('datef')),
                'status' => $app_doms['wbs_status_dom'][$row['wbs_status']],
                'form_start_date' => empty($row['date_start']) ? "" : date_format(date_create_from_format($td->get_db_date_format(), $row['date_start']), 'D M d Y H:i:s O'),
                'form_end_date' => empty($row['date_end']) ? "" : date_format(date_create_from_format($td->get_db_date_format(), $row['date_end']), 'D M d Y H:i:s O'),
                'ng_status' => ['id' => $row['wbs_status'], 'name' => $app_doms['wbs_status_dom'][$row['wbs_status']]],
                'parent_id' => $row['parent_id']
            ];
        }
        return $list;
    }

    function getMyWBSs()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $mywbss = [];

        $sql = "SELECT pw.id pwid, pa.id paid 
                FROM projects pr, projectwbss pw, projectplannedactivities pa 
                WHERE pr.id = pw.project_id AND pw.id = pa.projectwbs_id AND pa.assigned_user_id = '$current_user->id' AND pw.deleted = 0 AND pa.deleted = 0 AND pw.wbs_status < 2 AND pr.status in ('active', 'Published')
                ORDER BY pw.project_id ASC, pw.name";
        $plannedActivities = $this->db->query($sql);
        while ($plannedActivity = $this->db->fetchByAssoc($plannedActivities)) {
            // why not join this tables inside one query together??? why using beans?
            $pw = BeanFactory::getBean('ProjectWBSs', $plannedActivity['pwid']);
            $pa = BeanFactory::getBean('ProjectPlannedActivities', $plannedActivity['paid']);

            if ($pw && $pa) {
                $mywbss[] = [
                    'id' => $pw->id,
                    'aid' => $pa->id,
                    'name' => $pw->name,
                    'summary_text' => $pw->get_summary_text(),
                    'project_name' => $pw->project_name,
                    'type' => $pa->activity_type,
                    'level' => $pa->activity_level,
                ];
            }
        }

        return $mywbss;

    }

    function saveWBS($data)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!empty($data['id'])) {
            $td = new TimeDate($current_user);
            $this->retrieve($data['id']);
            $this->wbs_status = $data['status'];
            $this->name = $data['name'];
            $this->start_date = date_format(date_create_from_format('Y-m-d\TH:i:s+', $data['start_date']), $td->get_db_date_format());
            $this->end_date = date_format(date_create_from_format('Y-m-d\TH:i:s+', $data['end_date']), $td->get_db_date_format());
            $this->save();
            return ['status' => 'OK'];
        } elseif (!empty($data['name'])) {
            $app_doms = return_app_list_strings_language($GLOBALS['current_language']);
            $this->name = $data['name'];
            $this->project_id = $data['project_id'];
            if (!empty($data['parent_id'])) $this->parent_id = $data['parent_id'];
            $this->save(false);
            return [
                'id' => $this->id,
                'name' => $this->name,
                'parent_id' => $this->parent_id,
                'status' => $app_doms['wbs_status_dom']['0'],
                'ng_status' => ['id' => '0', 'name' => $app_doms['wbs_status_dom']['0']],
                'start_date' => "",
                'end_date' => ""
            ];
        }
    }

    function delete_recursive($id)
    {
        $db = DBManagerFactory::getInstance();
        $this->retrieve($id);
        $this->mark_deleted($id);
        $sql = "SELECT id FROM projectwbss WHERE parent_id = '$id' AND deleted = 0";
        $res = $db->query($sql);
        while ($row = $db->fetchByAssoc($res)) $this->delete_recursive($row['id']);
    }

}
