<?php
namespace SpiceCRM\modules\Dashboards;

use SpiceCRM\data\SugarBean;

/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/
class Dashboard extends SugarBean
{

    var $object_name = "Dashboard";
    var $module_dir = 'Dashboards';
    var $table_name = "dashboards";


    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $bean = parent::retrieve($id, $encode, $deleted, $relationships);

        if (!$bean)
            return $bean;

        $dashBoard['components'] = [];
        $dashBoardComponents = $this->db->query("SELECT * FROM dashboardcomponents WHERE dashboard_id = '$id'");
        $components = [];
        while ($dashBoardComponent = $this->db->fetchByAssoc($dashBoardComponents)) {
            $dashBoardComponent['position'] = json_decode(html_entity_decode($dashBoardComponent['position']), true);
            $dashBoardComponent['componentconfig'] = json_decode(html_entity_decode($dashBoardComponent['componentconfig']), true);
            switch ($dashBoardComponent['component']) {
                case 'ReporterVisualizationDashlet';
                case 'ReporterPresentationDashlet';
                    $dashBoardComponent['module'] = 'KReports';
                    break;
                default:
                    $dashletId = $dashBoardComponent['dashlet_id'];
                    if ($dashletId) {
                        $dashletconfig = $this->db->fetchByAssoc($this->db->query("SELECT icon, acl_action, label, module, componentconfig FROM sysuidashboarddashlets WHERE id = '{$dashletId}' UNION SELECT icon, acl_action, label, module, componentconfig FROM sysuicustomdashboarddashlets WHERE id = '{$dashletId}'"));
                        $dashBoardComponent['dashletconfig'] = json_decode(html_entity_decode($dashletconfig['componentconfig'], ENT_QUOTES), true);
                        $dashBoardComponent['module'] = $dashletconfig['module'];
                        $dashBoardComponent['label'] = $dashletconfig['label'];
                        $dashBoardComponent['icon'] = $dashletconfig['icon'];
                        $dashBoardComponent['acl_action'] = $dashletconfig['acl_action'];
                    }
                    break;
            }

            $components[] = $dashBoardComponent;
        }

        $this->components = json_encode($components);

        return $this;
    }

    function mark_deleted($id)
    {

        // mark the dashboard components as deleted
        $this->db->query("UPDATE dashboardcomponents SET deleted = 1 WHERE dashboard_id ='$id'");

        // parent mark deleted
        return parent::mark_deleted($id);
    }

}
