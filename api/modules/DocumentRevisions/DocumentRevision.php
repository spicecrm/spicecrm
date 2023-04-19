<?php
namespace SpiceCRM\modules\DocumentRevisions;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\TimeDate;
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


class DocumentRevision extends SpiceBean {

	function __construct() {
		parent::__construct();
		$this->disable_row_level_security = true; //no direct access to this module.
	}

	function save($check_notify = false, $fts_index_bean = true){
        $timedate = TimeDate::getInstance();

	    // if this is new issue a revision number and set the status to created
        if(empty($this->revision)){
            $this->revision = $this->getNextDocumentRevision();
        }

        if($this->documentrevisionstatus == 'r' && $this->documentrevisionstatus != $this->fetched_row['documentrevisionstatus']){
            $this->archiveAllRevisions();

            $current_date = $this->db->now();
            $guidSQL = $this->db->getGuidSQL();
            // load and update the document
            $document = BeanFactory::getBean('Documents', $this->document_id);
            $document->revision = $this->revision;
            $document->revision_date = $timedate->nowDb();
            $document->file_name = $this->file_name;
            $document->file_md5 = $this->file_md5;
            $document->file_mime_type = $this->file_mime_type;
            // create entries for user_documentrevisions to track who read/accepted them later on
            if ($document->acceptance_required = "1"){
                $orgBeans = $document->get_linked_beans('orgunits', 'OrgUnits');
                foreach ($orgBeans as $orgBean){
                    $users = $orgBean->get_linked_beans('users', 'User');
                    foreach ($users as $user){
                        $insert_query = "INSERT INTO users_documentrevisions (id,date_entered, deleted, user_id, document_revision_id,acceptance_status)";
                        $insert_query .= " SELECT $guidSQL, $current_date, '0', '$user->id', '$this->id', '0'";

                        $this->db->query($insert_query);
                    }
                }
            }
            $document->save();
        }

        return parent::save($check_notify, $fts_index_bean);
	}

	function get_summary_text()
	{
		return $this->document_name . ' / ' . $this->revision;
	}

    /**
     * determine the next document revision
     *
     * @param $doc_revision_id
     * @return null
     */
	function getNextDocumentRevision(){

	    $res = $this->db->fetchByAssoc($this->db->query("SELECT max(revision) maxrevision FROM $this->_tablename WHERE document_id ='$this->document_id' AND deleted = 0"));
	    if($res){
	        return (int)$res['maxrevision'] + 1;
        }

	    return 0;
	}

    /**
     * find all revisions that have a status released and set them to active
     */
	private function archiveAllRevisions(){
        $active = $this->get_full_list("", "document_id='{$this->document_id}' AND {$this->_tablename}.documentrevisionstatus = 'r'");
	    foreach($active as $activeDocument){
	        $activeDocument->documentrevisionstatus = 'a';
	        $activeDocument->save();
        }
    }

}

