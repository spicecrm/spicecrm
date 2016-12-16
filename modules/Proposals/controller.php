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

require_once('include/MVC/Controller/SugarController.php');

class ProposalsController extends SugarController
{

    public function action_save(){
        require_once('include/upload_file.php');
        require_once('include/utils.php');

        $GLOBALS['log']->debug('PROPOSALS PERFORMING NOTES SAVE');
        $do_final_move = 1;

//        echo('<pre>'.print_r($_FILES, true));
//        echo('<pre>'.print_r($_REQUEST, true));
//        die();

        //check on deleted files
        if(isset($_FILES)) {
            foreach ($_FILES as $thisUploadFile => $thisUploadFileData) {

                // set the variables
                $thisID = $thisUploadFile . 'id';
                $thisName = $thisUploadFile . 'name';
                $thisType = $thisUploadFile . '_mime_type';
                $thisOldID = 'old_' . $thisUploadFile.'id';
                $thisOldName = 'old_' . $thisUploadFile.'name';
                $thisDelete = 'delete' . $thisUploadFile;

//die('<pre>'.print_r($thisUploadFile, true));

                $upload_file = new UploadFile($thisUploadFile);

                //check if we have to delete
                if($_REQUEST[$thisDelete] > 0 && !empty($_REQUEST[$thisOldID])){
                    $upload_file->unlink_file($_REQUEST[$thisOldID]);
                    $do_final_move = false;
                    $this->bean->$thisID = "";
                    $this->bean->$thisName = "";
                    $this->bean->$thisType = "";
                }
                elseif ($upload_file->confirm_upload()) {
                    // populate the ID
                    $fileID = create_guid();
                    $this->bean->$thisID = $fileID;
                    $linkFiles[$thisUploadFile] = $this->$thisUploadFile;

                    // populate the name
                    $this->bean->$thisName = $thisUploadFileData['name'];

                    // populate the type
                    $this->bean->$thisType = $thisUploadFileData['type'];


                    //$do_final_link = 1;
                } else if (isset($_REQUEST[$thisOldName])) {
                    $this->bean->$thisName = $_REQUEST[$thisOldName];
                }

                //notify change for other user
                $check_notify = false;
                if (!empty($_POST['assigned_user_id']) &&
                    (empty($this->bean->fetched_row) || $this->bean->fetched_row['assigned_user_id'] != $_POST['assigned_user_id']) &&
                    ($_POST['assigned_user_id'] != $GLOBALS['current_user']->id)
                ) {
                    $check_notify = true;
                }

                //save bean
                $this->bean->save($check_notify);

                if ($do_final_move) {
                    $upload_file->final_move($this->bean->$thisID);
                } else if (!empty($_REQUEST[$thisOldID])) {
                    $upload_file->duplicate_file($_REQUEST[$thisOldID], $this->bean->$thisID, $this->bean->$thisName);
                }
            }
        }




    }




}
