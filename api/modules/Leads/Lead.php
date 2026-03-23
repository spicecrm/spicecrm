<?php
namespace SpiceCRM\modules\Leads;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\includes\GenerativeAI\GenerativeAIAgent;
use SpiceCRM\includes\DataStreams\wrappers\UploadStream;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceBeans\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SugarObjects\templates\person\Person;
use SpiceCRM\includes\utils\SpiceFileUtils;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;

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

/*********************************************************************************

 * Description:  TODO: To be written.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

// Lead is used to store profile information for people who may become customers.
class Lead extends Person {

	function fill_in_additional_list_fields()
	{
		parent::fill_in_additional_list_fields();
		$this->_create_proper_name_field();

	}

	function bean_implements($interface){
		switch($interface){
			case 'ACL':return true;
		}
		return false;
	}

	function save($check_notify = false, $fts_index_bean = true) {
		if(empty($this->status))
			$this->status = 'New';
		// call save first so that $this->id will be set
		$value = parent::save($check_notify, $fts_index_bean);
		return $value;
	}

    /**
     * generate lead by AI prompt
     * @param string $promptId
     * @param array{file: string, filename: string, mime: string, md5: string} $file
     * @return SpiceBean
     * @throws Exception
     * @throws \Exception
     */
    public function generateLeadByAIPrompt(string $promptId, array $file): SpiceBean
    {
        $agent = new GenerativeAIAgent($promptId, 'en_us');
        $lead = BeanFactory::newBean('Leads');
        $lead->id = SpiceUtils::createGuid();
        $lead->new_with_id = true;

        $attachment = SpiceAttachments::saveAttachmentHashFiles('Leads', $lead->id, $file)[0];
        $file['md5'] = $attachment['filemd5'];

        if (empty($file['mime'])) {
            $file['mime'] = SpiceFileUtils::getMimeSoap(UploadStream::getFilePath($file['md5']));
        }

        $initializeEmail = function ($file) {
            /** @var Email $email */
            $email = BeanFactory::newBean('Emails');
            $decodedFile = $email->initializeForMimeFile($file);
            return [$email, $decodedFile];
        };

        $emailAfterConvert = function ($email, $agent) use ($file) {
            $moduleHandler = new SpiceBeanHandler();
            $email->save();
            $agent->appendInput(json_encode($moduleHandler->mapBean($email)));
            unset($file['file']);
        };

        if ($file['mime'] === 'message/rfc822') {
            [$email, $decodedFile] = $initializeEmail($file);
            $email->convertEMLToEmail($file['md5'], $decodedFile, 'Leads', $lead->id);
            $emailAfterConvert($email, $agent);
        } else if (str_starts_with($file['mime'], 'application/vnd.ms-outlook') || $file['mime'] === 'application/x-msg') {
            [$email,] = $initializeEmail($file);
            $email->convertMsgToEmail($file['md5'], 'Leads', $lead->id);
            $emailAfterConvert($email, $agent);
        } else {
            unset($file['file']);
            $agent->appendInput((object) $file);
        }

        unset($file['file']);

        $result = $agent->submit();
        $data = json_decode($result->parts[0]->text, true)[0];
        $data['id'] = $lead->id;

        $lead->populateFromRow($data);
        $lead->save();

        return $lead;
    }
}

