<?php
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
namespace SpiceCRM\modules\CampaignLog;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;


class CampaignLog extends SpiceBean {

    function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();

        // fill in target_name
        $target = BeanFactory::getBean($this->target_type, $this->target_id);
        if($target) $this->target_name = $target->get_summary_text();
    }

	static function setStatus($id,$status){
        $db = DBManagerFactory::getInstance();
        $db->query("UPDATE campaign_log SET activity_type = '$status', activity_date = {$db->now()} WHERE id = '$id'");
    }

    /**
     * opt out email the parent email address
     */
    public function optOutParentEmailAddress()
    {
        if (empty($this->target_id) || empty($this->target_type)) return null;

        $parent = BeanFactory::getBean($this->target_type, $this->target_id);

        $emailAddresses = $parent->get_linked_beans('email_addresses');

        foreach ($emailAddresses as $address) {

            if ($address->primary_address != 1 || $address->opt_in_status == 'opted_out') continue;

            EmailAddress::setOptInStatus($parent, $address, 'opted_out');

            break;
        }
    }

    /**
     * rendewrs the content dynamically
     *
     * @return mixed
     */
    public function getBody(){
        // get the seed
        $seed = BeanFactory::getBean($this->target_type, $this->target_id);

        /** @var EmailTemplate $emailTemplate */
        $emailTemplate = BeanFactory::getBean('EmailTemplates');
        $campaignTask= BeanFactory::getBean('CampaignTasks', $this->campaigntask_id);
        if(!empty($campaignTask->email_template_id)){
            $emailTemplate->retrieve($campaignTask->email_template_id);
        } else {
            $emailTemplate->subject = $campaignTask->email_subject;
            $emailTemplate->body_html = $campaignTask->email_body;
            $emailTemplate->style = $campaignTask->email_stylesheet_id;
        }

        $email = BeanFactory::getBean('Emails');
        $mailbox = BeanFactory::getBean('Mailboxes', $campaignTask->mailbox_id);
        $email->id = SpiceUtils::createGuid();
        $email->new_with_id = true;

        $addBeans['Emails'] = $email;

        $parsedContent = $emailTemplate->parse($seed, ['campaignTask' => $this->id], $addBeans);

        return $parsedContent['body_html'];
    }
}
