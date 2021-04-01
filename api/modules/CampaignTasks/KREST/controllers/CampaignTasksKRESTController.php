<?php
namespace SpiceCRM\modules\CampaignTasks\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class CampaignTasksKRESTController
{
    function getCampaignTaskItems($req, $res, $args)
    {
        global $timedate;

        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'detail', true))
            throw (new ForbiddenException("Forbidden for details in module CampaignTasks."))->setErrorCode('noModuleDetails');

        $getParams = $req->getQueryParams();
        $now = $timedate->nowDb();
        $campaignLog = BeanFactory::getBean('CampaignLog');
        $list = $campaignLog->get_list(
            "planned_activity_date DESC",
            "campaigntask_id = '{$args['campaignid']}' AND IFNULL(planned_activity_date, '$now') <= '$now' AND activity_type != 'completed'",
            $getParams['offset'] ?: 0,
            $getParams['limit'] ?: 10,
            $getParams['limit'] ?: -1);

        // get a KREST Handler
        $KRESTModuleHandler = new ModuleHandler();

        // empty items structure for the return
        $items = [];

        foreach ($list['list'] as $item) {
            $seed = BeanFactory::getBean($item->target_type, $item->target_id);
            $items[] = [
                'campaignlog_id' => $item->id,
                'campaignlog_activity_type' => $item->activity_type,
                'campaignlog_activity_date' => $item->activity_date,
                'campaignlog_related_id' => $item->related_id,
                'campaignlog_planned_activity_date' => $item->planned_activity_date,
                'campaignlog_target_type' => $item->target_type,
                'campaignlog_hits' => $item->hits,
                // tbd
                'data' => $KRESTModuleHandler->mapBeanToArray($item->target_type, $seed)
            ];
        }

        return $res->withJson(['items' => $items, 'row_count' => $list['row_count']]);
    }

    /**
     * activates the campaiugn tasks and writes the campaign log entries
     *
     * @param $req
     * @param $res
     * @param $args
     * @throws Exception
     */
    function activateCampaignTask($req, $res, $args)
    {
        // ACL Check
        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module CampaignTasks."))->setErrorCode('noModuleEdit');

        // load the campaign task
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['campaigntaskid']);

        $status = 'targeted';
        switch($campaignTask->campaigntask_type){
            case 'Mail':
                $status = 'sent';
                break;
            case 'Feedback':
                $status = 'queued';
                break;
        }

        // activate the campaigntask
        $campaignTask->activate($status);
        return $res->withJson(['success' => true, 'id' => $args['campaigntaskid']]);
    }


    function exportCampaignTask($req, $res, $args)
    {
        // ACL Check
        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'export', true))
            throw (new ForbiddenException("Forbidden to export for module CampaignTasks."));

        // load the campaign task
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['campaignid']);

        // activate the campaigntask
        $campaignTask->export();

    }

    /**
     * send a test email to the test prospect lists in the campaign task
     *
     * @param $req
     * @param $res
     * @param $args
     */
    function sendCampaignTaskTestEmail($req, $res, $args)
    {
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['campaigntaskid']);
        return $res->withJson($campaignTask->sendTestEmail());
    }

    /**
     * queus the emails to be sent
     *
     * @param $req
     * @param $res
     * @param $args
     */
    function queueCampaignTaskEmail($req, $res, $args)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['campaigntaskid']);
        $campaignTask->activate('queued');
        return $res->withJson(['success' => true]);
    }

    /**
     * queus the emails to be sent
     *
     * @param $req
     * @param $res
     * @param $args
     */
    public function liveCompileEmailBody($req, $res, $args) {
    $params = $req->getParsedBody();
    $emailTemplate = BeanFactory::getBean('EmailTemplates');
    $emailTemplate->body_html = $params['html'];
    $bean = BeanFactory::getBean($args['module'], $args['parent']);
    $parsedTpl = $emailTemplate->parse($bean);

    return $res->withJson(['html' => from_html(wordwrap($parsedTpl['body_html'], true))]);
    }

    function getExportReports($req, $res, $args)
    {
        $retArray = [];

        $report = BeanFactory::getBean('KReports');
        $reports = $report->get_full_list('name', "report_module = 'CampaignTasks' AND ( integration_params LIKE '%\"kexcelexport\":1%' OR integration_params LIKE '%\"kcsvexport\":1%')");
        foreach($reports as $report){
            $integrationPramns = json_decode(html_entity_decode($report->integration_params));
            $retArray[] = [
                'id' => $report->id,
                'name' => $report->name,
                'description' => $report->description,
                'xls' => $integrationPramns->activePlugins->kexcelexport == 1 ? true : false,
                'csv' => $integrationPramns->activePlugins->kcsvexport == 1 ? true : false
            ];
        }

        return $res->withJson($retArray);
    }
}
