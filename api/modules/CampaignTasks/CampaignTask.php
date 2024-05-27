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

namespace SpiceCRM\modules\CampaignTasks;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\ErrorHandlers\MessageInterceptedException;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SugarObjects\templates\person\Person;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;
use SpiceCRM\modules\OutputTemplates\OutputTemplate;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\modules\Users\User;
use SpiceCRM\includes\ErrorHandlers\Exception;

class CampaignTask extends SpiceBean
{

    public function get_summary_text()
    {
        return $this->name;
    }

    public function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    /**
     * return exclusion list id
     * @param string $campaignTaskId
     * @param string $type
     * @return array
     * @throws Exception
     */
    public static function getListIdsByType(string $campaignTaskId, string $type): array
    {
        $db = DBManagerFactory::getInstance();
        return array_column(
            $db->fetchAll("SELECT pl.id FROM prospect_lists pl INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = pl.id WHERE plc.campaigntask_id = '$campaignTaskId' and pl.list_type = '$type' and pl.deleted != 1  and plc.deleted != 1 ") ?: [],
            'id'
        );
    }

    /**
     * get all targets count
     * @return int
     * @throws Exception
     */
    public function getAllTargetsCount(): int
    {
        return (int) $this->getTargetCount() + $this->getTargetsFilterEntries(true);
    }
    /**
     * merge targets arrays to remove duplicates by key (bean.id)
     * @return array|int
     * @throws Exception
     */
    private function getAllTargetsEntries()
    {
        return array_merge(
            $this->getTargetsEntries(),
            $this->getTargetsFilterEntries()
        );
    }

    /**
     * remove entries from campaign log for passed status
     * created entries in campaign log with passed status
     * set campaign task to activated
     * @param string $status
     * @return array
     * @throws Exception
     */
    function activate(string $status = 'targeted', $additionalParams = []): array
    {
        $this->preActivateCheck();

        $delQuery = "DELETE FROM campaign_log WHERE campaign_id='$this->campaign_id' AND campaigntask_id='$this->id' AND activity_type='$status'";
        $this->db->query($delQuery);


        $guidSQL = $this->db->getGuidSQL();
        $currentDate = $this->db->now();

        // handle additional params
        $addQueryCols = '';
        $addQueryValues = '';
        if(!empty($additionalParams)){
            $addQueryCols = ", ".implode(", ", array_keys($additionalParams));
            $addQueryValues = ", "."'".implode("', '", array_values($additionalParams))."'";
        }

        $chunks = array_chunk($this->getAllTargetsEntries(), 500);

        foreach ($chunks as $chunkTargets) {

            $query = "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted, date_modified, assigned_user_id $addQueryCols) VALUES ";

            foreach ($chunkTargets as $target) {

                $query .= "($guidSQL, $currentDate, '$this->campaign_id', '$this->id', $guidSQL, '{$target['prospect_list_id']}', '{$target['related_id']}', '{$target['related_type']}', '$status', 0, $currentDate, '$this->assigned_user_id' $addQueryValues),";
            }

            # remove the last comma from the query
            $query = substr($query, 0, -1);

            $this->db->query($query, true);
        }

        $this->activated = true;
        $this->status = 'Active';
        $this->save();

        return ['success' => true, 'id' => $this->id];
    }

    /**
     * pre activate check for all types
     * @return void
     * @throws Exception
     */
    private function preActivateCheck()
    {
        switch ($this->campaigntask_type) {
            case 'Email':
                if (empty($this->mailbox_id)) throw (new Exception('Mailbox required'))->setLbl('MSG_MAILBOX_REQUIRED');
                if (empty($this->email_subject)) throw (new Exception('Email subject required'))->setLbl('MSG_EMAIL_TEMPLATE_SUBJECT_REQUIRED');
                if (empty($this->email_body)) throw (new Exception('Email body required'))->setLbl('MSG_EMAIL_TEMPLATE_BODY_REQUIRED');
                break;
            case 'EventWithCampaign':

                if ($this->getEventTargetsCount() == 0) {
                    throw (new Exception("No processable event targets "))->setLbl('MSG_NO_PROCESSABLE_TARGETS');
                }
                return;
            case 'Event':
            case 'NewsLetter':
            case 'Telesales':
            case 'Mail':
            case 'mailmerge':
            case 'Feedback':
            case 'Print':
            case 'Web':
            case 'Radio':
            case 'Television':
                break;
        }

        if ($this->getAllTargetsCount() == 0) {
            throw (new Exception('No processable targets'))->setLbl('MSG_NO_PROCESSABLE_TARGETS');
        }
    }

    /**
     * get event targets query
     * @param bool $countOnly
     * @param string|null $status
     * @return string
     */
    private function getEventTargetsQuery(bool $countOnly = false, ?string $status = ''): string
    {
        $filter = '';
        $sysModuleFilters = new SysModuleFilters();

        if(!empty($this->module_filter)){
            $filter = $sysModuleFilters->generateWhereClauseForFilterId($this->module_filter);
            $filter = !empty($filter) ? "AND $filter" : "";
        }

        $campaign = BeanFactory::getBean('Campaigns', $this->campaign_id, ['relationships' => false]);

        if (!$countOnly) {
            $current_date = TimeDate::getInstance()->nowDb();
            $guidSQL = $this->db->getGuidSQL();
            $target_tracker_key = $this->db->getGuidSQL();
            $query = "SELECT $guidSQL, '$current_date', '$campaign->id', '$this->id', $target_tracker_key, eventregistrations.parent_id, eventregistrations.parent_type,'$status',0, '$current_date', '{$this->assigned_user_id}', eventregistrations.id, 'EventRegistrations'";
        } else {
            $query = "SELECT COUNT(*)";
        }

        $query .= " FROM events INNER JOIN eventregistrations ON eventregistrations.event_id = events.id ";
        return $query . " WHERE events.id = '$campaign->event_id' AND events.deleted != 1 AND eventregistrations.deleted != 1 $filter ";

    }

    /**
     * get event targets count
     * @return int
     */
    private function getEventTargetsCount(): int
    {
        return (int) $this->db->getOne(
            $this->getEventTargetsQuery(true)
        );
    }

    public function activateFromEvent($status)
    {
        $this->preActivateCheck();

        $sysModuleFilters = new SysModuleFilters();

        // delete old campaignLog
        $campaignLog = BeanFactory::getBean('CampaignLog');
        $deleteWhere = ['campaign_id' => $this->campaign_id, 'campaigntask_id' => $this->id, 'activity_type' => $status];
        $campaignLog->db->deleteQuery($campaignLog->_tablename, $deleteWhere);

        $campaign = BeanFactory::getBean('Campaigns', $this->campaign_id, ['relationships' => false]);

        $filter = '';
        if(!empty($this->module_filter)){
            $filter = $sysModuleFilters->generateWhereClauseForFilterId($this->module_filter);
            $filter = !empty($filter) ? "AND $filter" : "";
        }

        # create campaign log entries
        $insert_query = "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key, target_id, target_type, activity_type, deleted, date_modified, assigned_user_id, source_id, source_type) ";
        $insert_query .= $this->getEventTargetsQuery(false, $status);

        if($success = $this->db->query($insert_query)){
            // set to activated
            $this->activated = true;
            $this->status = 'Active';
            $this->save();

            // set eventregistrationstatus if any value set
            if(!empty($this->eventregistration_status)){
                $eventReg = BeanFactory::getBean('EventRegistrations');
                $where = "event_id = '$campaign->event_id' ".$filter;
                $registrations = $eventReg->get_full_list('', $where);
                foreach($registrations as $registration){
                    $registration->registration_status = $this->eventregistration_status;
                    $registration->save(); // update and index
                }
            }
        }

        return $success;
    }

    /**
     * fetch targets modules
     * @param array $prospectLists
     * @return array
     */
    private function fetchTargetsModules(array $prospectLists): array
    {
        $listsString = implode(',', array_map(function ($e) {return "'$e'";}, $prospectLists));
        $query = $this->db->query("SELECT DISTINCT plp.related_type FROM prospect_lists_prospects plp WHERE plp.prospect_list_id IN ($listsString) AND deleted != 1");

        $modules = [];

        while($module = $this->db->fetchByAssoc($query)) {
            $modules[] = $module['related_type'];
        }

        return $modules;
    }

    /**
     * get campaign target lists
     * @return array
     */
    private function getCampaignTargetLists(): array
    {
        $query = $this->db->query("
            SELECT pl.id, pl.name, pl.list_type, pl.is_generated_by_system FROM prospect_list_campaigntasks plc INNER JOIN prospect_lists pl ON pl.id = plc.prospect_list_id 
            WHERE pl.list_type != 'test' AND campaigntask_id = '$this->id' AND plc.deleted != 1 AND pl.deleted != 1 ORDER BY pl.name"
        );

        $lists = [];

        while($list = $this->db->fetchByAssoc($query)) {
            $lists[] = $list;
        }
        return $lists;
    }

    /**
     * generate targets fts search body for
     * @param string $modules
     * @param string $limit
     * @param string $offset
     * @param array $targetsIds
     * @param string|null $searchTerm
     * @param object|null $sort
     * @return array
     */
    private function generateTargetsSearchBody(string $modules, string $limit, string $offset, array $targetsIds, ?string $searchTerm, ?object $sort): array
    {
        $addFilter = [
            'bool' => [
                'must' => [
                    [
                        'terms' => [
                            "id" => array_keys($targetsIds)
                        ]
                    ],
                ],
            ]
        ];

        return [
            'modules' => $modules,
            'addFilter' => $addFilter,
            'searchterm' => $searchTerm,
            'records' => $limit,
            'start' => $offset,
            'useGlobalFilter' => false,
            'sort' => !$sort || !$sort->sortfield ? [] : ['sortfield' => $sort->sortfield, 'sortdirection' => $sort->sortdirection]
        ];
    }

    /**
     * get targets ids for the provided list ids
     * @param array $listIds
     * @param string|null $status
     * @return array
     */
    private function getListsTargets(array $listIds, ?string $status): array
    {
        $listIdsString = implode(',', array_map(function ($e) {return "'$e'";}, $listIds));

        // overwrite sql_mode=only_full_group_by on the server
        $this->db->query("SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))");

        $query = $this->db->query("
            SELECT related_id, GROUP_CONCAT(prospect_list_id) AS listsIds, st.status, st.date_modified AS status_date_changed FROM prospect_lists_prospects plp
            LEFT JOIN campaigntask_targets_status st on plp.related_id = st.prospect_id and st.campaigntask_id = '$this->id'
            WHERE prospect_list_id IN ($listIdsString) AND deleted != 1 GROUP BY related_id"
        );

        $targets = [];
        while($target = $this->db->fetchByAssoc($query)) {
            if (!$this->statusMatch($status, $target['status'])) continue;
            $targets[$target['related_id']] = $target;
        }

        return $targets;
    }

    /**
     * get campaign targets
     * @param string $modules
     * @param int $limit
     * @param int $offset
     * @param string|null $status
     * @param array|null $prospectListIds
     * @param string|null $searchTerm
     * @param object|null $sort
     * @return array
     */
    public function getTargets(string $modules, int $limit, int $offset, ?string $status, ?array $prospectListIds, ?string $searchTerm, ?object $sort): array
    {
        $response = [
            'prospectlists' => $this->getCampaignTargetLists(),
            'prospects' => [],
            'count' => 0
        ];

        $prospectListIds = $prospectListIds ?: array_column($response['prospectlists'], 'id');
        $listsTargets = $this->getListsTargets($prospectListIds, $status);

        $postBody = $this->generateTargetsSearchBody($modules, $limit, $offset, $listsTargets, $searchTerm, $sort);

        $searchRes = SpiceFTSHandler::getInstance()->search($postBody);

        $beanHandler = new SpiceBeanHandler();

        foreach ($searchRes as $module => $moduleRes) {

            # sum total count from each module
            $response['count'] += $moduleRes['total']['value'];

            foreach ($moduleRes['hits'] as $target) {

                $target['listsIds'] = $listsTargets[$target['_id']]['listsIds'];
                $target['status'] = $listsTargets[$target['_id']]['status'];
                $target['status_date_changed'] = $listsTargets[$target['_id']]['status_date_changed'];

                $response['prospects'][] = $this->generateTargetArray($target, $module, $beanHandler);
            }
        }

        return $response;
    }

    /**
     * check if the given status matches the target status
     * @param string|null $status
     * @param array|false $targetStatus
     * @return bool
     */
    private function statusMatch(?string $status, $targetStatus): bool
    {
        return empty($status) || ($status == 'unchecked' && !$targetStatus) || $status == $targetStatus;
    }

    /**
     * generate target array from the db entry
     * @param array $target
     * @param string $module
     * @param SpiceBeanHandler $beanHandler
     * @return array
     */
    private function generateTargetArray(array $target, string $module, SpiceBeanHandler $beanHandler): array
    {
        $bean = BeanFactory::getBean($module, $target['_id']);

        return [
            'id' => $target['_id'],
            'module' => $module,
            'prospectlists' => explode(',', $target['listsIds']),
            'data' => $beanHandler->mapBeanToArray($module, $bean, false),
            'status' => $target['status'],
            'status_date_changed' => $target['status_date_changed'],
        ];
    }

    /**
     * send test emails
     * @return int[]
     * @throws Exception
     * @throws MessageInterceptedException
     */
    function sendTestEmails()
    {
        # set the current user to the one assigned to the task. fallback set the admin user
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $user = BeanFactory::getBean('Users', $this->assigned_user_id ?: '1');
        AuthenticationController::getInstance()->setCurrentUser($user);

        [$sentCount, $testCount] = 0;

        $res = $this->db->query("SELECT plp.related_id, plp.related_type FROM prospect_list_campaigntasks plc INNER JOIN prospect_lists pl ON pl.list_type = 'test' AND plc.campaigntask_id = '{$this->id}' AND plc.prospect_list_id = pl.id INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = pl.id WHERE plc.deleted = 0 AND pl.deleted = 0 AND plp.deleted = 0");

        while ($row = $this->db->fetchByAssoc($res)) {

            $bean = BeanFactory::getBean($row['related_type'], $row['related_id']);

            if (!$bean || !$bean->hasEmails()) continue;

            $email = $this->sendEmail($bean, false, true);
            $testCount++;
            if ($email->status == 'sent') $sentCount++;
        }

        # reset the current user for the system after parsing
        AuthenticationController::getInstance()->setCurrentUser($current_user);

        if ($testCount == 0) throw (new Exception("No test targets found"))->setLbl('LBL_NO_TEST_TARGETS');
        if ($sentCount == 0) throw (new Exception("Could not send any test email"))->setLbl('MSG_NO_TEST_EMAILS_SENT');

        return ['sent' => $sentCount, 'total' => $testCount];
    }

    /**
     * send queued emails for email campaign tasks there the log entry is set to queued
     * @return bool
     * @throws MessageInterceptedException
     */
    function sendQueuedEmails($addBeans = []){
        // set the admin user
        /** @var User $admin */
        $admin = BeanFactory::getBean('Users', '1');
        AuthenticationController::getInstance()->setCurrentUser($admin);
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // get the queued emails
        $queuedEmails = $this->db->limitQuery("SELECT campaign_log.id, target_type, target_id, campaigntask_id FROM campaign_log, campaigntasks WHERE campaign_log.deleted = 0 AND campaign_log.campaigntask_id = campaigntasks.id AND campaigntasks.campaigntask_type = 'Email' AND activity_type = 'queued' AND campaigntask_id <> '' ORDER by activity_date DESC", 0, 50);

        while($queuedEmail = $this->db->fetchByAssoc($queuedEmails)){
            /// load the campaign task if we have a new one
            if($queuedEmail['campaigntask_id'] != $this->id){
                $this->retrieve($queuedEmail['campaigntask_id']);

                // set the current user to the one assigned to the task .. if none assigned go back to the admin
                if($current_user->id != $this->assigned_user_id){
                    /** @var User $user */
                    $user = BeanFactory::getBean('Users', $this->assigned_user_id ?: '1');
                    AuthenticationController::getInstance()->setCurrentUser($user);
                    $current_user = AuthenticationController::getInstance()->getCurrentUser();
                }
            }

            /** @var Person $seed */
            $seed = BeanFactory::getBean($queuedEmail['target_type'], $queuedEmail['target_id']);
            $campaignLog = BeanFactory::getBean('CampaignLog', $queuedEmail['id']);
            $campaignLog->activity_type = "error";

            # do pre send checks before sending the email
            if (!$seed) {
                $campaignLog->activity_comment = 'LBL_ERROR_LOADING_RECORD';

            } else if (empty($seed->email1)) {

                $campaignLog->activity_comment = 'ERR_NO_PRIMARY_EMAIL';

            } else if ($this->disable_inactive_check != 1 && $seed->is_inactive) {

                $campaignLog->activity_comment = 'LBL_IS_INACTIVE';

            } else if ($this->disable_marketing_agreement_check != 1 && $seed->gdpr_marketing_agreement == 'r') {

                $campaignLog->activity_comment = 'ERR_MARKETING_AGREEMENT_REJECTED';

            } else if ($this->disable_opt_out_check != 1 && method_exists($seed, 'getPrimaryEmailAddressData') && $seed->getPrimaryEmailAddressData()->opt_in_status == 'opted_out') {

                $campaignLog->activity_comment = 'LBL_OPTED_OUT';

                # try to send the email after the pre send checks
            } else {

                $email = $this->sendEmail($seed, $this->save_emails == 1, false, ['CampaignLog' => $campaignLog]);

                if ($email->status == 'sent') {
                    $campaignLog->activity_type = 'sent';
                }

                if ($this->save_emails == 1) {
                    $campaignLog->related_id = $email->id;
                    $campaignLog->related_type = 'Emails';
                } else {
                    $campaignLog->external_id = $email->message_id;
                }
            }

            $campaignLog->save();
        }

        // set the assigned user back to the admin
        AuthenticationController::getInstance()->setCurrentUser($admin);

        return true;
    }

    /**
     * send the email to the recipient
     * @param SpiceBean $seed
     * @param bool $saveEmail
     * @param bool $test
     * @param array $addBeans
     * @return Email with status sent or send_error
     * @throws MessageInterceptedException
     */
    private function sendEmail(SpiceBean $seed, bool $saveEmail = false, bool $test = false, array $addBeans = []): Email
    {
        /** @var EmailTemplate $emailTemplate */
        $emailTemplate = BeanFactory::getBean('EmailTemplates');
        /** @var Email $email */
        $email = BeanFactory::getBean('Emails');
        $mailbox = BeanFactory::getBean('Mailboxes', $this->mailbox_id);

        if(!empty($this->email_template_id)){
            $emailTemplate->retrieve($this->email_template_id);
        } else {
            $emailTemplate->subject = $this->email_subject;
            $emailTemplate->body_html = $this->email_body;
            $emailTemplate->style = $this->email_stylesheet_id;
        }
        $parsedHtml = $emailTemplate->parse($seed, ['campaignTask' => $this->id], $addBeans);

        $email->id = SpiceUtils::createGuid();
        $email->new_with_id = true;
        $email->mailbox_id = $this->mailbox_id;
        $email->name = $test ? ('[TEST] ' . $this->email_subject) : $this->email_subject;
        $email->body = $parsedHtml['body_html'];

        $email->addEmailAddress('to', $seed->email1);
        $email->addEmailAddress('from', $mailbox->imap_pop3_username);

        $categories = SpiceAttachments::getAttachmentCategories('CampaignTasks', true);
        $categoryId = !empty($categories) ? $categories[0]['id'] : null;
        $email->setAttachments(
            SpiceAttachments::cloneAttachmentsForBean('Emails', $email->id, 'CampaignTasks', $this->id, $saveEmail, $categoryId)
        );

        if($saveEmail){
            $email->parent_type = $seed->_module;
            $email->parent_id = $seed->id;
            $email->to_be_sent = true;
            if (isset($addBeans['CampaignLog'])) {
                $email->registerTrackingParentData('CampaignLog', $addBeans['CampaignLog']->id);
            }
            $email->save();

        } else {

            try {
                $email->loadAttachments();
                $result = $email->sendEmail();
            } catch ( MessageInterceptedException $e ) {
                throw $e;
            } catch (\Throwable $e) {
                $result = ['result' => false];
            }

            $email->status = $result['result'] ? 'sent' : 'send_error';
        }

        return $email;
    }

    /**
     * @deprecated because of typo. Use generateServiceFeedbacks from now on
     * @return void
     * @throws Exception
     */
    public function genereateServiceFeedbacks(){
        $this->generateServiceFeedbacks();
    }

    /**
     * send queued emails for email campaign tasks thewre the log entry is set to queued
     * @return bool
     */
    public function generateServiceFeedbacks(){
        $queuedFeedbacks = $this->db->query("SELECT campaign_log.id, target_type, target_id, campaigntask_id FROM campaign_log, campaigntasks WHERE campaign_log.deleted = 0 AND campaign_log.campaigntask_id = campaigntasks.id AND campaigntasks.campaigntask_type = 'Feedback' AND activity_type = 'queued' AND campaigntask_id <> '' ORDER by activity_date DESC");
        while($queuedFeedback = $this->db->fetchByAssoc($queuedFeedbacks)){
            /// load the campaign task if we have a new one
            if($queuedFeedback['campaigntask_id'] != $this->id){
                $this->retrieve($queuedFeedback['campaigntask_id']);
            };

            // check that the target is a contact
            if($queuedFeedback['target_type'] != 'Contacts'){
                $campaignLog = BeanFactory::getBean('CampaignLog', $queuedFeedback['id']);
                $campaignLog->activity_type = 'error';
                $campaignLog->save();
                continue;
            }


                // load the bean and send the email
            $seed = BeanFactory::getBean($queuedFeedback['target_type'], $queuedFeedback['target_id']);
            if($seed){
                $feedback = BeanFactory::getBean('ServiceFeedbacks');
                $feedback->contact_id = $seed->id;
                $feedback->servicefeedback_status = 'created';
                $feedback->questionnaire_id = $this->questionnaire_id;
                $feedback->parent_type = 'CampaignTasks';
                $feedback->parent_id = $this->id;
                $feedback->save();

                $campaignLog = BeanFactory::getBean('CampaignLog', $queuedFeedback['id']);
                $campaignLog->activity_type = $feedback->servicefeedback_status;
                $campaignLog->related_id = $feedback->id;
                $campaignLog->related_type = 'ServiceFeedbacks';
                $campaignLog->save();

            } else {
                $campaignLog = BeanFactory::getBean('CampaignLog', $queuedFeedback['id']);
                $campaignLog->activity_type = 'error';
                $campaignLog->save();
            }
        }
        return true;
    }

    /**
     * returns an array of beans linked to the prospect lists
     * take care as this instantiates beans for each record and thus might take some time and resources
     * default limit is 100 records
     *
     * @param int $start
     * @param int $limit
     * @return array
     * @throws Exception
     */
    public function getProspectBeans(int $start = 0, int $limit = 100): array
    {
        $beans = [];

        $targets = $this->getTargetsEntries($start, $limit);

        foreach ($targets as $target) {
            $seed = BeanFactory::getBean($target['related_type'], $target['related_id']);
            if ($seed) $beans[] = $seed;
        }

        return $beans;
    }

    /**
     * get targets entries
     * @param int $start
     * @param int $limit
     * @return array ['related_id' => string, 'related_type' => string, 'prospect_list_id' => string]
     * @throws Exception
     */
    public function getTargetsEntries(int $start = 0, int $limit = 1000000): array
    {
        $entries = [];

        $query = $this->buildTargetsEntriesQuery();

        $records = $this->db->limitQuery($query, $start, $limit);

        while($entry = $this->db->fetchByAssoc($records)){
            if($entries[$entry['related_id']]) continue;
            $entries[$entry['related_id']] = $entry;
        }

        return $entries;
    }

    /**
     * build targets entries query
     * @param bool $countOnly
     * @return string
     * @throws Exception
     */
    private function buildTargetsEntriesQuery(bool $countOnly = false): string
    {
        $exclusionListIds = self::getListIdsByType($this->id, 'exclude');

        $query = 'SELECT ' . ($countOnly ? 'COUNT(distinct plp.related_id) ' : "plp.related_id, plp.related_type, plp.prospect_list_id ");
        $query .= "FROM prospect_lists pl INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = pl.id ";
        $query .= "INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = pl.id ";
        $query .= "WHERE plc.campaigntask_id='$this->id' AND pl.deleted=0 AND plc.deleted=0 AND plp.deleted=0 ";
        $query .= "AND pl.list_type != 'test' AND pl.list_type != 'exclude' AND pl.list_type not like 'exempt%'";

        if (!empty($exclusionListIds)) {
            $exclusionListIds = implode("','", $exclusionListIds);
            $query .= " AND NOT EXISTS(SELECT id FROM prospect_lists_prospects WHERE prospect_list_id in ('$exclusionListIds') AND plp.related_id = related_id AND deleted != 1)";
        }

        return $query;
    }

    /**
     * get targets filter entries
     * @return array | int
     * @throws Exception
     */
    public function getTargetsFilterEntries(bool $countOnly = false)
    {
        $entries = [];

        $listFilters = "SELECT plf.module, plf.module_filter, plf.prospectlist_id FROM prospect_list_filters plf";
        $listFilters .= " INNER JOIN prospect_list_campaigntasks plc ON plf.prospectlist_id = plc.prospect_list_id";
        $listFilters .= " WHERE plc.campaigntask_id = '$this->id' AND plc.deleted != 1 AND plf.deleted != 1";
        $listFilters = $this->db->query($listFilters);

        $sysModuleFilters = new SysModuleFilters();

        while ($listFilter = $this->db->fetchByAssoc($listFilters)) {
            $seed = BeanFactory::getBean($listFilter['module']);
            $where = $sysModuleFilters->generateWhereClauseForFilterId($listFilter['module_filter']);

            if (empty($where)) {
                throw (new Exception("Module filter {$listFilter['module_filter']} generated empty where"))->setLbl('MSG_MODULE_FILTER_EMPTY_CONDITIONS');
            }

            if ($countOnly) {
                $entries[] = (int) $this->db->getOne("SELECT count(id) FROM $seed->_tablename WHERE deleted != 1 AND $where");
                continue;
            }

            $query = $this->db->query("SELECT id FROM $seed->_tablename WHERE deleted != 1 AND $where");

            while($entry = $this->db->fetchByAssoc($query)) {

                if ($entries[$entry['id']]) continue;

                $entries[$entry['id']] = [
                    'related_id' => $entry['id'],
                    'prospectlist_id' => $listFilter['prospectlist_id'],
                    'related_type' => $listFilter['module'],
                ];
            }
        }

        return $countOnly ? array_sum($entries) : $entries;
    }

    /**
     * get target count
     * @return array|false
     * @throws Exception
     */
    public function getTargetCount()
    {
        $query = $this->buildTargetsEntriesQuery(true);

        return $this->db->getOne($query);
    }

    /**
     * produces a mailmerge PDF for the campaign
     *
     * @return array
     * @throws Exception
     */
    public function mailMerge($start = 0, $limit = 100, $mailMergeSubject = null, $mailMergeBody = null){

        $html = '';
        $inactiveCount = 0;
        foreach ($this->getProspectBeans($start, $limit) as $prospectBean){

            // exclude inactive items from generated pdf
            if($prospectBean->is_inactive == 1) {
                $inactiveCount += 1;
            }
            // generate pdf only with active items
            else {
                /** @var OutputTemplate $outputTemplate */
                $outputTemplate = BeanFactory::getBean('OutputTemplates', $this->output_template_id);

                $style = $outputTemplate->getStyle();
                $header = html_entity_decode( $outputTemplate->header);
                $footer = html_entity_decode( $outputTemplate->footer);

                // set the mailmerge subject and body for rendering pdf template
                $prospectBean->mailmerge_subject = $mailMergeSubject;
                $prospectBean->mailmerge_body = $mailMergeBody;

                $html .= $outputTemplate->translateBody($prospectBean, true);
                $html .= '<div style="page-break-after: always;"></div>';
            }
        }
        $html = "<html><head><style>$style</style></head><body><header>$header</header><footer>$footer</footer><main>$html</main></body></html>";

        $class = SpiceConfig::getInstance()->config['outputtemplates']['pdf_handler_class'];
        if(!$class) $class = '\SpiceCRM\modules\OutputTemplates\handlers\pdf\DomPdfHandler';
        $pdfHandler = new $class($outputTemplate);

        $pdfHandler->process($html);

        // return the pdf and the inactiveCount
        $res = ['pdfcontent' => $pdfHandler->__toString(), 'inactiveCount' => $inactiveCount];
        return $res;
    }

    /**
     * deactivate campaign task and delete the unprocessed log entries
     * @return void
     * @throws Exception
     */
    public function deactivate()
    {
        $this->db->query("DELETE FROM campaign_log WHERE campaign_id='$this->campaign_id' AND campaigntask_id='$this->id' AND activity_type IN ('targeted', 'queued', 'inactive')");

        $this->activated = 0;
        $this->status = 'Inactive';
        $this->save();
    }
}
