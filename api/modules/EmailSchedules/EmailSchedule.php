<?php
namespace SpiceCRM\modules\EmailSchedules;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\utils\SpiceUtils;

class EmailSchedule extends SugarBean
{
    public $module_dir = 'EmailSchedules';
    public $object_name = 'EmailSchedule';
    public $table_name = 'emailschedules';

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
     * generate and send email to seed
     * @param $seed
     * @param $id
     * @param bool $saveEmail
     * @return bool|SugarBean
     */
    public function sendEmail($seed, $id, $saveEmail = false)
    {
        // workaround to print out the assigned user name in the template
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $emailSchedule = BeanFactory::getBean('EmailSchedules', $id);
        // retrieve the assigned user to the email schedules to be parsed
        $current_user->retrieve($emailSchedule->assigned_user_id);

        // create a seed template, fill with the values from the schedule and parse it
        $template = BeanFactory::getBean('EmailTemplates');
        $template->subject = $emailSchedule->email_subject;
        $template->body_html = $emailSchedule->email_body;
        $template->style = $emailSchedule->email_stylesheet_id;

        // parse the template
        $parsedTemplate = $template->parse($seed);

        // create a new seed email bean
        $email = BeanFactory::getBean('Emails');
        $email->mailbox_id = $emailSchedule->mailbox_id;
        $email->name = $emailSchedule->email_subject;
        $email->body = $parsedTemplate['body_html'];
        $primaryAddress = $seed->email1;

        if(empty($primaryAddress)) {
            // reset the current user to admin
            $current_user->retrieve('1');
            return false;
        }

        $email->addEmailAddress('to', $seed->email1);
        $mailbox = BeanFactory::getBean('Mailboxes', $emailSchedule->mailbox_id);
        $email->addEmailAddress('from', $mailbox->imap_pop3_username);

        $email->setAttachments(
            SpiceAttachments::cloneAttachmentsForBean('Emails', $email->id, 'EmailSchedules', $id, $saveEmail)
        );

        // clone the attachments
        $email->id = SpiceUtils::createGuid();
        $email->new_with_id = true;
        // save or only send the email
        if($saveEmail){
            $email->parent_type = $seed->module_dir;
            $email->parent_id = $seed->id;
            $email->to_be_sent = true;
            $email->save();
        } else {
            $email->sendEmail();
        }
        // reset the current user to admin
        $current_user->retrieve('1');
        return $email;
    }

    /**
     * retrieve, then send queued emails, log them as sent
     * called from _AddJobsHere.php
     * @return bool
     */
    public function sendQueuedEmails()
    {
        $openEmailSchedules = $this->db->query("SELECT id from emailschedules WHERE email_schedule_status = 'open' AND deleted = 0 ORDER by date_modified DESC");
        while ($openEmailSchedule = $this->db->fetchByAssoc($openEmailSchedules)) {
            $status = $this->sendEmailScheduleEmails($openEmailSchedule['id']);
            $this->updateEmailScheduleStatus($openEmailSchedule['id'], $status);
        }
        return true;
    }

    /**
     * send the email to selected beans of the schedule
     * @param $emailScheduleId
     * @return string
     */
    private function sendEmailScheduleEmails($emailScheduleId)
    {
        $queuedEmails = $this->db->query("SELECT bean_module, bean_id, id from emailschedules_beans WHERE emailschedule_status = 'queued' AND emailschedule_id = '$emailScheduleId' AND deleted = 0 ORDER by date_modified DESC limit 250");
        $status = 'done';

        while ($queuedEmail = $this->db->fetchByAssoc($queuedEmails)) {
            $seed = BeanFactory::getBean($queuedEmail['bean_module'], $queuedEmail['bean_id']);

            if (empty($seed)) {
                $this->updateEmailScheduleBeanStatus($queuedEmail['id'], 'error');
                $status = 'record_not_loaded';
            } else {
                $email = $this->sendEmail($seed, $emailScheduleId, true);
                if ($email == false) {
                    $this->updateEmailScheduleBeanStatus($queuedEmail['id'], 'error');
                    $status = 'done_with_errors';
                } else {
                    $this->updateEmailScheduleBeanStatus($queuedEmail['id'], 'sent', $email->id);
                }
            }
        }
        return $status;
    }

    /**
     * update the email schedule bean record status and set the email id if defined
     * @param $emailScheduleId
     * @param $status
     * @param null $emailId
     */
    private function updateEmailScheduleBeanStatus($id, $status, $emailId = null)
    {
        $emailIdSet = $emailId == null ? "" : ", email_id = '$emailId'";
        $this->db->query("UPDATE emailschedules_beans SET emailschedule_status = '$status' $emailIdSet WHERE id='$id'");
    }

    /**
     * update the email schedule status
     * @param $emailScheduleId
     * @param $status
     */
    private function updateEmailScheduleStatus($emailScheduleId, $status)
    {
        $this->db->query("UPDATE emailschedules SET email_schedule_status = '$status' WHERE id='$emailScheduleId'");
    }
}
