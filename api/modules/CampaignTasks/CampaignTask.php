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

use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;
use SpiceCRM\modules\OutputTemplates\OutputTemplate;
use SpiceCRM\modules\UserPreferences\UserPreference;

class CampaignTask extends SugarBean
{
    public $module_dir = 'CampaignTasks';
    public $object_name = 'CampaignTask';
    public $table_name = 'campaigntasks';
    public $new_schema = true;

    public $additional_column_fields = [];

    public $relationship_fields = [];


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
     * remove entries from campign log for passed status
     * created entries in campign log with passed status
     * set campaign task to activated
     * set camapign task status to Active
     * @todo find another way to bild query so that sql_mode workaround may be removed
     * @param string $status
     */
    function activate($status = 'targeted')
    {
        $db = DBManagerFactory::getInstance();
        $thisId = $db->quote($this->id);
        $sysModuleFilters = new \SpiceCRM\includes\SysModuleFilters\SysModuleFilters();

        // disable ONLY_FULL_GROUP_BY if this is set
        $this->db->query("SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))");

        // set the group by mode off on MySQL
        if($this->db->dbType == 'mysql') {
            $this->db->query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
        }

        $delete_query = "DELETE FROM campaign_log WHERE campaign_id='" . $this->campaign_id . "' AND campaigntask_id='" . $this->id . "' AND activity_type='$status'";
        $this->db->query($delete_query);

        $current_date = $this->db->now();
        $guidSQL = $this->db->getGuidSQL();

        $insert_query = "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted, date_modified";
        $insert_query .= ') ';
        $insert_query .= "SELECT {$guidSQL}, $current_date, '{$this->campaign_id}' campaign_id,  plc.campaigntask_id , {$guidSQL}, plp.prospect_list_id, plp.related_id, plp.related_type,'$status',0, $current_date";
        $insert_query .= "FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id";
        $insert_query .= " INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = prospect_lists.id";
        $insert_query .= " WHERE plc.campaigntask_id='$thisId'";
        $insert_query .= " AND prospect_lists.deleted=0";
        $insert_query .= " AND plc.deleted=0";
        $insert_query .= " AND plp.deleted=0";
        $insert_query .= " AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%' GROUP BY plp.related_id";
        $this->db->query($insert_query);

        $prospect_list_filters = "SELECT plf.module, plf.module_filter, plf.prospectlist_id FROM prospect_list_filters plf";
        $prospect_list_filters .= " INNER JOIN prospect_list_campaigntasks plc ON plf.prospectlist_id = plc.prospect_list_id";
        $prospect_list_filters .= " WHERE plc.campaigntask_id = '$thisId' AND plc.deleted = 0";
        $prospect_list_filters = $this->db->query($prospect_list_filters);

        while ($row = $this->db->fetchByAssoc($prospect_list_filters)) {
            $where = $sysModuleFilters->generateWhereClauseForFilterId($row['module_filter']);
            $seed = BeanFactory::getBean($row['module']);
            $insert_query = "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted, date_modified)";
            $insert_query .= " SELECT {$guidSQL}, $current_date, '{$this->campaign_id}',  '$thisId' , {$guidSQL}, '{$row['prospectlist_id']}', id, '{$row['module']}','$status',0, $current_date";
            $insert_query .= " FROM {$seed->table_name}";
            $insert_query .= " WHERE deleted=0 AND NOT EXISTS (SELECT target_id FROM campaign_log WHERE campaign_log.target_id = {$seed->table_name}.id) AND $where";
            $this->db->query($insert_query);
        }

        // set to activated
        $this->activated = true;
        $this->status = 'Active';
        $this->save();

    }



    function export()
    {
        $db = DBManagerFactory::getInstance();

        $exportFields = ['name', 'salutation', 'first_name', 'last_name', 'email1', 'primary_address_street', 'primary_address_city'];

        $thisId = $db->quote($this->id);
        $sysModuleFilters = new \SpiceCRM\includes\SysModuleFilters\SysModuleFilters();

        $current_date = $this->db->now();
        $guidSQL = $this->db->getGuidSQL();


        $targets_query = "SELECT plp.related_id recordid, plp.related_type recordmodule FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id";
        $targets_query .= " INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = prospect_lists.id";
        $targets_query .= " WHERE plc.campaigntask_id='$thisId' AND prospect_lists.deleted=0  AND plc.deleted=0  AND plp.deleted=0";
        $targets_query .= " AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%'";

        // go fot the propects lists filters
        $prospect_list_filters = "SELECT plf.module, plf.module_filter, plf.prospectlist_id FROM prospect_list_filters plf";
        $prospect_list_filters .= " INNER JOIN prospect_list_campaigntasks plc ON plf.prospectlist_id = plc.prospect_list_id";
        $prospect_list_filters .= " WHERE plc.campaigntask_id = '$thisId' AND plc.deleted = 0";
        $prospect_list_filters = $this->db->query($prospect_list_filters);

        while ($row = $this->db->fetchByAssoc($prospect_list_filters)) {
            $where = $sysModuleFilters->generateWhereClauseForFilterId($row['module_filter']);
            $seed = BeanFactory::getBean($row['module']);
            $filter_query = " SELECT id recordid, '{$row['module']}' recordmodule FROM {$seed->table_name} WHERE deleted=0 AND $where";
            $targets_query .= " UNION $filter_query";
        }



        // determine the delimiter
        $delimiter = UserPreference::getDefaultPreference('export_delimiter');
        if (!empty(AuthenticationController::getInstance()->getCurrentUser()->getPreference('export_delimiter'))) $delimiter = AuthenticationController::getInstance()->getCurrentUser()->getPreference('export_delimiter');

        // determine the charset
        $supportedCharsets = mb_list_encodings();
        $charsetTo = UserPreference::getDefaultPreference('default_charset');
        if (!empty($postBody['charset'])) {
            if (in_array($postBody['charset'], $supportedCharsets)) $charsetTo = $postBody['charset'];
        } else {
            if (in_array(AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_export_charset'), $supportedCharsets)) $charsetTo = AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_export_charset');
        }

        $fh = @fopen('php://output', 'w');
        $records = $this->db->query($targets_query);
        while($record = $db->fetchByAssoc($records)){
            $seed = BeanFactory::getBean($record['recordmodule'], $record['recordid']);
            if($seed){
                $entryArray = [];
                foreach ($exportFields as $exportField){
                    $entryArray[] = !empty($charsetTo) ? mb_convert_encoding($seed->$exportField, $charsetTo) : $seed->$exportField;
                }
                fputcsv($fh, $entryArray, $delimiter);
            }
        }
        fclose($fh);
    }

    function sendTestEmail($emailAddresses = [])
    {
        $testCount = 0;
        $res = $this->db->query("SELECT plp.related_id, plp.related_type FROM prospect_list_campaigntasks plc INNER JOIN prospect_lists pl ON pl.list_type = 'test' AND plc.campaigntask_id = '{$this->id}' AND plc.prospect_list_id = pl.id INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = pl.id WHERE plc.deleted = 0 AND pl.deleted = 0 AND plp.deleted = 0");
        while ($row = $this->db->fetchByAssoc($res)) {
            $testCount++;
            $bean = BeanFactory::getBean($row['related_type'], $row['related_id']);
            if ($bean && $bean->hasEmails()) {
                $this->sendEmail($bean, false, true);
            }
        }

        return $testCount > 0 ? ['status' => 'success'] : ['status' => 'error', 'msg' => 'no targets found'] ;
    }

    /**
     * send queued emails for email campaign tasks thewre the log entry is set to queued
     * @return bool
     */
    function sendQueuedEmails(){
        $queuedEmails = $this->db->limitQuery("SELECT campaign_log.id, target_type, target_id, campaigntask_id FROM campaign_log, campaigntasks WHERE campaign_log.deleted = 0 AND campaign_log.campaigntask_id = campaigntasks.id AND campaigntasks.campaigntask_type = 'Email' AND activity_type = 'queued' AND campaigntask_id <> '' ORDER by activity_date DESC", 0, 50);
        while($queuedEmail = $this->db->fetchByAssoc($queuedEmails)){
            /// load the campaign task if we have a new one
            if($queuedEmail['campaigntask_id'] != $this->id){
                $this->retrieve($queuedEmail['campaigntask_id']);
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
        return true;
    }

    /**
     * sends the email
     *
     * @param $seed
     * @param false $saveEmail
     * @param false $test
     * @return false|SugarBean
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
            $email->parent_type = $seed->module_dir;
            $email->parent_ide = $seed->id;
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
     * take care as this instantiates beans for each record and thus ight take some time and ressources
     * defaut limit is 100 records
     *
     * @param int $start
     * @param int $limit
     * @return array
     */
    public function getProspectBeans($start = 0, $limit = 100){
        $beans = [];
        $select_query = "SELECT plp.related_id id, max(plp.related_type) module ";
        $select_query .= "FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id ";
        $select_query .= "INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = prospect_lists.id ";
        $select_query .= "WHERE plc.campaigntask_id='{$this->id}' AND prospect_lists.deleted=0 AND plc.deleted=0 AND plp.deleted=0 ";
        $select_query .= "AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%' GROUP BY plp.related_id ";

        $records = $this->db->limitQuery($select_query, $start, $limit);
        while($record = $this->db->fetchByAssoc($records)){
            $seed = BeanFactory::getBean($record['module'],$record['id']);
            if($seed) $beans[] = $seed;
        }

        return $beans;
    }

    /**
     * returns the expected number of targets
     */
    public function getTargetCount(){
        $count_query = "SELECT count(distinct plp.related_id) totalcount ";
        $count_query .= "FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id ";
        $count_query .= "INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = prospect_lists.id ";
        $count_query .= "WHERE plc.campaigntask_id='{$this->id}' AND prospect_lists.deleted=0 AND plc.deleted=0 AND plp.deleted=0 ";
        $count_query .= "AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%'";
        $records = $this->db->fetchByAssoc($this->db->query($count_query));

        return $records ? $records['totalcount'] : 0;
    }

    /**
     * produces a mailmerge PDF for the campaign
     *
     * @return array
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function mailMerge($start = 0, $limit = 100){

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
