<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\CampaignTasks;

use Cassandra\Time;
use Exception;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;
use SpiceCRM\modules\OutputTemplates\OutputTemplate;
use SpiceCRM\modules\UserPreferences\UserPreference;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;

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
     * @return array|false
     * @throws Exception
     */
    public static function getListIdByType(string $campaignTaskId, string $type)
    {
        $db = DBManagerFactory::getInstance();
        return $db->getOne("SELECT pl.id FROM prospect_lists pl INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = pl.id WHERE plc.campaigntask_id = '$campaignTaskId' and pl.list_type = '$type' and pl.deleted != 1  and plc.deleted != 1 ");
    }

    /**
     * remove entries from campaign log for passed status
     * created entries in campaign log with passed status
     * set campaign task to activated
     * @param string $status
     * @return array
     * @throws Exception
     */
    function activate(string $status = 'targeted'): array
    {
        $delQuery = "DELETE FROM campaign_log WHERE campaign_id='$this->campaign_id' AND campaigntask_id='$this->id' AND activity_type='$status'";
        $this->db->query($delQuery);

        # merge targets arrays to remove duplicates by key (bean.id)
        $targets = array_merge(
            $this->getTargetsEntries(),
            $this->getTargetsFilterEntries()
        );

        if (count($targets) == 0) {
            return ['success' => false, 'msg' => 'no targets found'];
        }

        $guidSQL = $this->db->getGuidSQL();
        $currentDate = $this->db->now();

        $chunks = array_chunk($targets, 500);

        foreach ($chunks as $chunkTargets) {

            $query = "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted, date_modified, assigned_user_id) VALUES ";

            foreach ($chunkTargets as $target) {

                $query .= "($guidSQL, $currentDate, '$this->campaign_id', '$this->id', $guidSQL, '{$target['prospect_list_id']}', '{$target['related_id']}', '{$target['related_type']}', '$status', 0, $currentDate, '$this->assigned_user_id'),";
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

    public function activateFromEvent($status)
    {
        $sysModuleFilters = new SysModuleFilters();

        // disable ONLY_FULL_GROUP_BY if this is set
//        $this->db->query("SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))");

        // set the group by mode off on MySQL
//        if($this->db->dbType == 'mysql') {
//            $this->db->query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
//        }

        // delete old campaignLog
        $campaignLog = BeanFactory::getBean('CampaignLog');
        $deleteWhere = ['campaign_id' => $this->campaign_id, 'campaigntask_id' => $this->id, 'activity_type' => $status];
        $campaignLog->db->deleteQuery($campaignLog->_tablename, $deleteWhere);

        // grab campaign
        $campaign = BeanFactory::getBean('Campaigns', $this->campaign_id, ['relationships' => false]);

        // check on filter and build where clause
        if(!empty($this->module_filter)){
            $filter = $sysModuleFilters->generateWhereClauseForFilterId($this->module_filter);
            $filter = !empty($filter) ? "AND $filter" : "";
        }

        // prepare insert query
        $current_date = TimeDate::getInstance()->nowDb();
        $guidSQL = $this->db->getGuidSQL();
        $target_tracker_key = $this->db->getGuidSQL();

        $insert_query = "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key, target_id, target_type, activity_type, deleted, date_modified, assigned_user_id, source_id, source_type)";
        $insert_query .= " SELECT $guidSQL, '$current_date', '$campaign->id', '$this->id', $target_tracker_key, eventregistrations.parent_id, eventregistrations.parent_type,'$status',0, '$current_date', '{$this->assigned_user_id}', eventregistrations.id, 'EventRegistrations'";
        $insert_query .= " FROM events INNER JOIN eventregistrations ON eventregistrations.event_id = events.id ";
        $insert_query .= " WHERE events.id = '$campaign->event_id' AND events.deleted != 1 AND eventregistrations.deleted != 1 $filter ";

        // create campainlog entries
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
            SELECT pl.id, pl.name, pl.list_type FROM prospect_list_campaigntasks plc INNER JOIN prospect_lists pl ON pl.id = plc.prospect_list_id 
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

    function sendTestEmail($emailAddresses = [])
    {
        # set the current user to the one assigned to the task. fallback set the admin user
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $user = BeanFactory::getBean('Users', $this->assigned_user_id ?: '1');
        AuthenticationController::getInstance()->setCurrentUser($user);

        $testCount = 0;
        $res = $this->db->query("SELECT plp.related_id, plp.related_type FROM prospect_list_campaigntasks plc INNER JOIN prospect_lists pl ON pl.list_type = 'test' AND plc.campaigntask_id = '{$this->id}' AND plc.prospect_list_id = pl.id INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = pl.id WHERE plc.deleted = 0 AND pl.deleted = 0 AND plp.deleted = 0");
        while ($row = $this->db->fetchByAssoc($res)) {
            $testCount++;
            $bean = BeanFactory::getBean($row['related_type'], $row['related_id']);
            if ($bean && $bean->hasEmails()) {
                $this->sendEmail($bean, false, true);
            }
        }

        # reset the current user for the system after parsing
        AuthenticationController::getInstance()->setCurrentUser($current_user);

        return $testCount > 0 ? ['status' => 'success'] : ['status' => 'error', 'msg' => 'no targets found'] ;
    }

    /**
     * send queued emails for email campaign tasks thewre the log entry is set to queued
     * @return bool
     */
    function sendQueuedEmails(){
        // set the admin user
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
                    $user = BeanFactory::getBean('Users', $this->assigned_user_id ?: '1');
                    AuthenticationController::getInstance()->setCurrentUser($user);
                    $current_user = AuthenticationController::getInstance()->getCurrentUser();
                }
            };

            // load the bean and send the email
            $seed = BeanFactory::getBean($queuedEmail['target_type'], $queuedEmail['target_id']);
            if($seed && $seed->is_inactive) {
                $campaignLog = BeanFactory::getBean('CampaignLog', $queuedEmail['id']);
                $campaignLog->activity_type = 'inactive';
                $campaignLog->save();
            } else if($seed) {
                $email = $this->sendEmail($seed, true);
                if($email == false){
                    $campaignLog = BeanFactory::getBean('CampaignLog', $queuedEmail['id']);
                    $campaignLog->activity_type = 'noemail';
                    $campaignLog->save();
                } else {
                    $campaignLog = BeanFactory::getBean('CampaignLog', $queuedEmail['id']);
                    $campaignLog->activity_type = 'sent';
                    $campaignLog->related_id = $email->id;
                    $campaignLog->related_type = 'Emails';
                    $campaignLog->save();
                }
            } else {
                $campaignLog = BeanFactory::getBean('CampaignLog', $queuedEmail['id']);
                $campaignLog->activity_type = 'error';
                $campaignLog->save();
            }
        }

        // set the assigned user back to the admin
        AuthenticationController::getInstance()->setCurrentUser($admin);

        return true;
    }

    /**
     * sends the email
     *
     * @param $seed
     * @param false $saveEmail
     * @param false $test
     * @return false|SpiceBean
     */
    function sendEmail($seed, $saveEmail = false, $test = false)
    {
        if(!$seed->email1) {
            return false;
        }

        $emailTemplate = (function(): EmailTemplate {return BeanFactory::getBean('EmailTemplates');})();
        $email = (function(): Email {return BeanFactory::getBean('Emails');})();
        $mailbox = BeanFactory::getBean('Mailboxes', $this->mailbox_id);

        if(!empty($this->email_template_id)){
            $emailTemplate->retrieve($this->email_template_id);
        } else {
            $emailTemplate->subject = $this->email_subject;
            $emailTemplate->body_html = $this->email_body;
            $emailTemplate->style = $this->email_stylesheet_id;
        }
        $parsedHtml = $emailTemplate->parse($seed);

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
            $email->save();
        } else {
            $email->sendEmail();
        }

        return $email;
    }


    /**
     * send queued emails for email campaign tasks thewre the log entry is set to queued
     * @return bool
     */
    function genereateServiceFeedbacks(){
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
        $exclusionListId = (string) self::getListIdByType($this->id, 'exclude');

        $query = 'SELECT ' . ($countOnly ? 'COUNT(distinct plp.related_id) ' : "plp.related_id, plp.related_type, plp.prospect_list_id ");
        $query .= "FROM prospect_lists pl INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = pl.id ";
        $query .= "INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = pl.id ";
        $query .= "WHERE plc.campaigntask_id='$this->id' AND pl.deleted=0 AND plc.deleted=0 AND plp.deleted=0 ";
        $query .= "AND pl.list_type != 'test' AND pl.list_type != 'exclude' AND pl.list_type not like 'exempt%'";

        if ($exclusionListId) {
            $query .= " AND NOT EXISTS(SELECT id FROM prospect_lists_prospects WHERE prospect_list_id = '$exclusionListId' AND plp.related_id = related_id AND deleted != 1)";
        }

        return $query;
    }

    /**
     * get targets filter entries
     * @return array
     */
    public function getTargetsFilterEntries(): array
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

        return $entries;
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
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
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
}
