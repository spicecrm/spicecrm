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
namespace SpiceCRM\includes\SpiceNotes;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * Class SpiceNotes
 *
 * manages user notes attached to beans
 *
 * @package SpiceCRM\includes\SpiceNotes
 */
class SpiceNotes {

    /**
     * returns the notes for a bean
     *
     * @param $beanName
     * @param $beanId
     * @param int $lastN
     * @return false|string
     */
    public static function getQuickNotesForBean($beanName, $beanId,$lastN = 10) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $quicknotes = [];

        if (DBManagerFactory::getInstance()->dbType == 'mssql'){
            $quicknotesRes = $db->query("SELECT TOP $lastN qn.*,u.user_name, u.user_image FROM spicenotes AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND (qn.user_id = '".$current_user->id."' OR qn.trglobal = '1') AND qn.deleted = 0 ORDER BY qn.trdate DESC");
        }else{
            $quicknotesRes = $db->limitQuery("SELECT qn.*,u.user_name, u.user_image FROM spicenotes AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND (qn.user_id = '".$current_user->id."' OR qn.trglobal = '1') AND qn.deleted = 0 ORDER BY qn.trdate DESC", 0, $lastN);
        }

        if (DBManagerFactory::getInstance()->dbType == 'mssql' || $db->getRowCount($quicknotesRes) > 0) {
			while ( $thisQuickNote = $db->fetchByAssoc($quicknotesRes)) {
				$quicknotes[]= [
							'id' => $thisQuickNote['id'],
							'user_id' => $thisQuickNote['user_id'],
							'user_name' => $thisQuickNote['user_name'],
							'user_image' => $thisQuickNote['user_image'],
							'own' => ($thisQuickNote['user_id']==$current_user->id || $current_user->is_admin) ? '1' : '0',
							'date' => $thisQuickNote['trdate'],
							'text' => nl2br($thisQuickNote['text']),
							'global' => $thisQuickNote['trglobal'] ? true : false
                ];
			}
		}
		return $quicknotes;
	}

    /**
     * returns the count
     *
     * @param $beanName
     * @param $beanId
     * @param int $lastN
     * @return mixed
     */
	public static function getQuickNotesCount($beanName, $beanId,$lastN = 10){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $quicknotesRec = $db->fetchByAssoc($db->query("SELECT count(*) AS noteCount FROM spicenotes WHERE bean_id='{$beanId}' AND bean_type='{$beanName}'  AND (user_id = '".$current_user->id."' OR trglobal = '1') AND deleted = 0"));

        return $quicknotesRec['noteCount'];
	}

    /**
     * adds a new note
     *
     * @param $beanName
     * @param $beanId
     * @param $data
     * @return false|string
     */
	public static function saveQuickNote($beanName, $beanId, $data) {
		$current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
		$guid = SpiceUtils::createGuid();
		$db->query( sprintf('INSERT INTO spicenotes ( id, bean_type, bean_id, user_id, trdate, trglobal, text, deleted ) VALUES ( "%s", "%s", "%s", "%s", "%s", "%s", "%s", 0 )', $guid, $db->quote( $beanName ), $db->quote( $beanId ), $current_user->id, gmdate('Y-m-d H:i:s'), $data['global'] ? 1:0, $db->quote( $data['text'] )));
		$quicknotes[]= [
				'id' => $guid,
				'user_id' => $current_user->id,
				'user_name' => $current_user->user_name,
				'user_image' => $current_user->user_image,
				'date' => gmdate('Y-m-d H:i:s'),
				'text' => nl2br($data['text']),
				'global' => $data['global'] ? true : false
        ];
		return $quicknotes;
	}

    /**
     * updates a quick note
     *
     * @param $beanName
     * @param $beanId
     * @param $noteId
     * @param $data
     * @return bool
     */
	public static function editQuickNote($beanName, $beanId, $noteId, $data) {
		$current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
		$db->query("UPDATE spicenotes SET text = '{$data['text']}', trglobal = '{$data['global']}' WHERE id = '{$noteId}'" . (!$current_user->is_admin ? " AND user_id='".$current_user->id."'":""));
		return true;
	}

    /**
     * deletes a note with a given id
     *
     * @param $noteId
     * @return false|string
     */
	public static function deleteQuickNote($noteId) {
		$current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
		$db->query("UPDATE spicenotes SET deleted = 1 WHERE id='{$noteId}'" . (!$current_user->is_admin ? " AND user_id='".$current_user->id."'":""));
		return ['status' => 'success'];
	}
}
