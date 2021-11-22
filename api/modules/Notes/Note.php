<?php
namespace SpiceCRM\modules\Notes;

use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\modules\Mailboxes\Handlers\OutlookAttachment;

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

// Note is used to store customer information.
class Note extends SugarBean {

	var $module_dir = "Notes";
	var $table_name = "notes";
	var $object_name = "Note";

	function __construct() {
		parent::__construct();
	}

	function safeAttachmentName() {


		//get position of last "." in file name
		$file_ext_beg = strrpos($this->filename, ".");
		$file_ext = "";

		//get file extension
		if($file_ext_beg !== false) {
			$file_ext = substr($this->filename, $file_ext_beg + 1);
		}

		//check to see if this is a file with extension located in "badext"
		foreach(SpiceConfig::getInstance()->config['upload_badext'] as $badExt) {
			if(strtolower($file_ext) == strtolower($badExt)) {
				//if found, then append with .txt and break out of lookup
				$this->name = $this->name . ".txt";
				$this->file_mime_type = 'text/';
				$this->filename = $this->filename . ".txt";
				break; // no need to look for more
			}
		}

	}

    /**
     * @param Email $email
     * @param OutlookAttachment $attachment
     */
    public static function saveEmailAttachmentFromOutlook(Email $email, OutlookAttachment $attachment) {
        $attachment_id = create_guid();
        $filepath = 'upload://' . $attachment_id;
        touch($filepath);

        $note = new Note();
        $note->id = $attachment_id;
        $note->new_with_id = true;

        $byteContent = base64_decode($attachment->content);
        file_put_contents($filepath, $byteContent);

        $note->parent_id = $email->id;
        $note->parent_type = $email->module_dir;
        $note->file_mime_type = $attachment->fileMimeType;
        $note->name = $attachment->fileName;
        $note->file_name = $attachment->fileName;
        $note->assigned_user_id = $attachment->userId;
        return $note->save(false);
    }

	/**
	 * overrides SugarBean's method.
	 * If a system setting is set, it will mark all related notes as deleted, and attempt to delete files that are
	 * related to those notes
	 * @param string id ID
	 */
	function mark_deleted($id) {

		if($this->parent_type == 'Emails') {
			if(isset(SpiceConfig::getInstance()->config['email_default_delete_attachments']) && SpiceConfig::getInstance()->config['email_default_delete_attachments'] == true) {
				$removeFile = "upload://$id";
				if(file_exists($removeFile)) {
					if(!unlink($removeFile)) {
						LoggerManager::getLogger()->error("*** Could not unlink() file: [ {$removeFile} ]");
					}
				}
			}
		}

		// delete note
		parent::mark_deleted($id);
	}

	function deleteAttachment($isduplicate="false"){
		if($this->ACLAccess('edit')){
			if($isduplicate=="true"){
				return true;
			}
			$removeFile = "upload://{$this->id}";
		}

		if(file_exists($removeFile)) {
			if(!unlink($removeFile)) {
				LoggerManager::getLogger()->error("*** Could not unlink() file: [ {$removeFile} ]");
			}else{
				$this->filename = '';
				$this->file_mime_type = '';
				$this->file = '';
				$this->save();
				return true;
			}
		} else {
			$this->filename = '';
			$this->file_mime_type = '';
			$this->file = '';
			$this->save();
			return true;
		}
		return false;
	}



	function fill_in_additional_list_fields() {
		$this->fill_in_additional_detail_fields();
	}


	function bean_implements($interface) {
		switch($interface) {
			case 'ACL':return true;
            case 'FILE' : return true;
		}
		return false;
	}

}
