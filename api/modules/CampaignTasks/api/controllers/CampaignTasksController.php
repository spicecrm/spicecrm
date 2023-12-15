<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\CampaignTasks\api\controllers;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceNumberRanges\SpiceNumberRanges;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\CampaignTasks\CampaignTask;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;
use function DI\string;

class CampaignTasksController
{


    /**
     * create inclusion list if not exist
     * @throws \Exception
     */
    public function createInclusionList(Request $req, Response $res, array $args): Response
    {
        $inclusionListId = CampaignTask::getListIdByType($args['id'], 'include');

        if (!empty($inclusionListId)) {
            return $res->withJson(['id' => $inclusionListId]);
        }

        $list = $this->createList($args['id'], 'include');

        return $res->withJson(['id' => $list->id, 'name' => $list->name]);
    }

    /**
     * set campaign task target status
     * handle excluded targets
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function setTargetsStatus(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        $db = DBManagerFactory::getInstance();
        $exclusionListId = CampaignTask::getListIdByType($args['id'], 'exclude');

        if (!$exclusionListId) {
            $list = $this->createList($args['id'], 'exclude');
            $exclusionListId = $list->id;
        }

        foreach ($params['targets'] as $targetId) {

            $existingId = $db->getOne("SELECT id FROM campaigntask_targets_status WHERE campaigntask_id = '{$args['id']}' AND prospect_id = '$targetId'");

            if ($args['status'] == 'excluded') {
                $this->handleExcludedTarget($targetId, $exclusionListId);
            } else {
                $this->revertExcludedTarget($targetId, $exclusionListId);
            }

            $this->updateTargetStatus($db, $existingId, $args['id'], $targetId, $args['status']);
        }

        return $res->withJson(true);
    }

    /**
     * update target status
     * @param $db DBManager
     * @param false|string $existingId
     * @param string $campaignTaskId
     * @param string $targetId
     * @param string $status
     * @return void
     */
    private function updateTargetStatus(DBManager $db, $existingId, string $campaignTaskId, string $targetId, string $status)
    {
        $data = [
            'id' => $existingId ?: SpiceUtils::createGuid(),
            'campaigntask_id' => $campaignTaskId,
            'prospect_id' => $targetId,
            'status' => $status,
            'date_modified' => TimeDate::getInstance()->nowDb(),
        ];

        $db->upsertQuery('campaigntask_targets_status', ['id' => $existingId], $data);
    }

    /**
     * delete excluded target from the exclusion list
     * @param string $targetId
     * @param string|false $excludeListId
     * @return void
     * @throws \Exception
     */
    private function revertExcludedTarget(string $targetId, $excludeListId)
    {
        $db = DBManagerFactory::getInstance();

        if (!$excludeListId) return;

        $db->query("DELETE FROM prospect_lists_prospects WHERE prospect_list_id = '$excludeListId' AND related_id ='$targetId'");
    }

    /**
     * create exclusion list if undefined and add the target to the list
     * @param string $targetId
     * @param string|false $excludeListId
     * @return void
     * @throws \Exception
     */
    private function handleExcludedTarget(string $targetId, $excludeListId)
    {
        $db = DBManagerFactory::getInstance();

        $target = $db->fetchOne("SELECT * FROM prospect_lists_prospects WHERE related_id ='$targetId' AND deleted != 1");
        $target['id'] = SpiceUtils::createGuid();
        $target['prospect_list_id'] = $excludeListId;
        $target['date_modified'] = TimeDate::getInstance()->nowDb();

        $db->insertQuery('prospect_lists_prospects', $target);
    }

    /**
     * create list and link it to the campaign task
     * @param string $campaignTaskId
     * @param string $type
     * @return false|SpiceBean
     * @throws \Exception
     */
    private function createList(string $campaignTaskId, string $type)
    {
        $list = BeanFactory::newBean('ProspectLists');
        $typeLabel = $type == 'exclude' ? 'exclusion' : 'inclusion';
        $list->name = $this->generateExcludeListName($campaignTaskId, $typeLabel);
        $list->list_type = $type;
        $list->assigned_user_id = AuthenticationController::getInstance()->getCurrentUser()->id;
        $list->save();
        $list->load_relationship('campaigntasks');
        $list->campaigntasks->add($campaignTaskId);

        return $list;
    }

    /**
     * @param string $campaignTaskId
     * @param string $type
     * @return string
     */
    private function generateExcludeListName(string $campaignTaskId, string $type): string
    {
        $campaignTask = BeanFactory::getBean('CampaignTasks', $campaignTaskId);
        $name = SpiceNumberRanges::getNextNumberForField('ProspectLists', 'name');
        $name .= " $type $campaignTask->name";
        return $name;
    }

    public function getCampaignTaskItems(Request $req, Response $res, array $args): Response
    {
        $timedate = TimeDate::getInstance();

        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'detail', true))
            throw (new ForbiddenException("Forbidden for details in module CampaignTasks."))->setErrorCode('noModuleDetails');

        $getParams = $req->getQueryParams();
        $now = $timedate->nowDb();
        $campaignLog = BeanFactory::getBean('CampaignLog');
        $list = $campaignLog->get_list(
            "planned_activity_date DESC",
            "campaigntask_id = '{$args['id']}' AND IFNULL(planned_activity_date, '$now') <= '$now' AND activity_type NOT IN ('completed','converted')",
            $getParams['offset'] ?: 0,
            $getParams['limit'] ?: 10,
            $getParams['limit'] ?: -1);

        // get a KREST Handler
        $KRESTModuleHandler = new SpiceBeanHandler();

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
     * activates the campaign tasks and writes the campaign log entries
     * prospect lists of type test will be ignored
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function activateCampaignTask(Request $req, Response $res, array $args): Response
    {
        // ACL Check
        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module CampaignTasks."))->setErrorCode('noModuleEdit');

        /** @var CampaignTask load the campaign task **/
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);

        $status = 'targeted';
        switch ($campaignTask->campaigntask_type) {
            case 'Mail':
                $status = 'sent';
                break;
            case 'Feedback':
                $status = 'queued';
                break;
        }

        return $res->withJson($campaignTask->activate($status));
    }
    /**
     * activates the campaign tasks and writes the campaign log entries
     * where the source for campaignlog is an event registration
     * prospect lists of type test will be ignored
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function activateEventTask(Request $req, Response $res, array $args): Response
    {
        // ACL Check
        if (!SpiceACL::getInstance()->checkAccess('CampaignTasks', 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module CampaignTasks."))->setErrorCode('noModuleEdit');

        /** @var CampaignTask load the campaign task**/
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);

        $status = 'queued';

        // activate the campaigntask
        $success = $campaignTask->activateFromEvent($status);
        return $res->withJson(['success' => $success, 'id' => $args['id']]);
    }

    /**
     * send a test email to the test prospect lists in the campaign task
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function sendCampaignTaskTestEmail(Request $req, Response $res, array $args): Response
    {
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);
        return $res->withJson($campaignTask->sendTestEmail());
    }

    /**
     * queus the emails to be sent
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function queueCampaignTaskEmail(Request $req, Response $res, array $args): Response
    {
        /** @var CampaignTask load the campaign task **/
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);
        return $res->withJson($campaignTask->activate('queued'));
    }

    /**
     * queus the emails to be sent
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function liveCompileEmailBody(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        /** @var EmailTemplate **/
        $emailTemplate = BeanFactory::getBean('EmailTemplates');
        $emailTemplate->body_html = $params['html'];
        $bean = BeanFactory::getBean($args['parentmodule'], $args['parentid']);

        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);

        # set the current user to the one assigned to the task. fallback set the admin user
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $user = BeanFactory::getBean('Users', $campaignTask->assigned_user_id ?: '1');
        AuthenticationController::getInstance()->setCurrentUser($user);

        $parsedTpl = $emailTemplate->parse($bean);

        # reset the current user for the system after parsing
        AuthenticationController::getInstance()->setCurrentUser($current_user);

        return $res->withJson(['html' => $parsedTpl['body_html'], true]);
    }

    /**
     * returns a list of reports that can be used to export a campaign task target list
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getExportReports(Request $req, Response $res, array $args): Response
    {
        $retArray = [];

        /** @var KReport **/
        $report = BeanFactory::getBean('KReports');
        $reports = $report->get_full_list('name', "report_module = 'CampaignTasks' AND ( integration_params LIKE '%\"kexcelexport\":1%' OR integration_params LIKE '%\"kcsvexport\":1%')");
        foreach ($reports as $report) {
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

    /**
     * returns a mail merge PDF for the given campaign task
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws NotFoundException
     */
    public function mailmergeCampaignTask(Request $req, Response $res, array $args): Response
    {
        $getParam = $req->getQueryParams();

        /** @var CampaignTask $campaignTask load the campaign task */
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);
        if (!$campaignTask) {
            throw new NotFoundException('CampaignTask not found');
        }

        $mailMergeSubject = $campaignTask->email_subject;
        $mailMergeBody = $campaignTask->email_body;


        $mailMergeResult = $campaignTask->mailMerge($getParam['start'], $getParam['limit'], $mailMergeSubject, $mailMergeBody);
        // generate the PDF
        return $res->withJson(['content' => base64_encode($mailMergeResult['pdfcontent']), 'inactiveCount' => $mailMergeResult['inactiveCount']]);
    }

    /**
     * returns the number of targets ina  targetlist
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws NotFoundException
     */
    public function getTargetCount(Request $req, Response $res, array $args): Response
    {
        /** @var CampaignTask $campaignTask */
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);
        if (!$campaignTask) {
            throw new NotFoundException('CampaignTask not found');
        }
        return $res->withJson(['count' => $campaignTask->getTargetCount()]);
    }

    /**
     * gets all targets in a targetist
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws NotFoundException
     */
    public function getTargets(Request $req, Response $res, array $args): Response
    {
        $params = $req->getQueryParams();

        /** @var CampaignTask $campaignTask */
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);

        if (!$campaignTask) {
            throw new NotFoundException('CampaignTask not found');
        }

        $response = $campaignTask->getTargets(
            $params['modules'],
            $params['limit'],
            $params['offset'],
            $params['status'],
            json_decode($params['prospectListIds'] ?? null),
            $params['searchTerm'],
            json_decode($params['sort'])
        );

        return $res->withJson($response);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws \Exception
     */
    public function deactivateCampaignTask(Request $req, Response $res, array $args): Response
    {
        /** @var CampaignTask $campaignTask */
        $campaignTask = BeanFactory::getBean('CampaignTasks', $args['id']);

        if (!SpiceACL::getInstance()->checkAccess($campaignTask, 'deactivate', true)) {
            throw (new ForbiddenException("Forbidden to deactivate in module CampaignTasks."))->setErrorCode('noModuleEdit');
        }

        $campaignTask->deactivate();

        return $res->withJson(['success' => true]);
    }
}
