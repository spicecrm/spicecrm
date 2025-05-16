<?php
namespace SpiceCRM\modules\Dashboards;

use SpiceCRM\data\SpiceBean;

class Dashboard extends SpiceBean
{

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
