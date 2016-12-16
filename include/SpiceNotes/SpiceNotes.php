<?php

class SpiceNotes {

    public static function getQuickNotesForBean($beanName, $beanId,$lastN = 10) {
        global $current_user, $db, $beanFiles, $beanList;
        $quicknotes = array();

        if ($GLOBALS['db']->dbType == 'mssql'){
            $quicknotesRes = $db->query("SELECT TOP $lastN qn.*,u.user_name FROM spicenotes AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND (qn.user_id = '".$current_user->id."' OR qn.trglobal = '1') AND qn.deleted = 0 ORDER BY qn.trdate DESC");
        }else{
            $quicknotesRes = $db->limitQuery("SELECT qn.*,u.user_name FROM spicenotes AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND (qn.user_id = '".$current_user->id."' OR qn.trglobal = '1') AND qn.deleted = 0 ORDER BY qn.trdate DESC", 0, $lastN);
        }

        if ($GLOBALS['db']->dbType == 'mssql' || $db->getRowCount($quicknotesRes) > 0) {
			while ( $thisQuickNote = $db->fetchByAssoc($quicknotesRes)) {
				$quicknotes[]=array(
							'id' => $thisQuickNote['id'],
							'user_id' => $thisQuickNote['user_id'],
							'user_name' => $thisQuickNote['user_name'],
							'own' => ($thisQuickNote['user_id']==$current_user->id || $current_user->is_admin) ? '1' : '0',
							'date' => $GLOBALS['timedate']->to_display_date_time($thisQuickNote['trdate']),
							'text' => nl2br($thisQuickNote['text']),
							'global' => $thisQuickNote['trglobal']
						);
			}
		}

		return json_encode($quicknotes);
	}

	public static function getQuickNotesCount($beanName, $beanId,$lastN = 10){
        global $current_user, $db;
        $quicknotesRec = $db->fetchByAssoc($db->query("SELECT count(*) AS noteCount FROM spicenotes WHERE bean_id='{$beanId}' AND bean_type='{$beanName}'  AND (user_id = '".$current_user->id."' OR trglobal = '1') AND deleted = 0"));

        return $quicknotesRec['noteCount'];
	}

	public static function saveQuickNote($beanName, $beanId, $data) {
		global $current_user, $db;
		$guid = create_guid();
		$db->query("INSERT INTO spicenotes (id, bean_type, bean_id, user_id, trdate, trglobal, text, deleted) VALUES ('{$guid}', '{$beanName}', '{$beanId}', '".$current_user->id."', '" . gmdate('Y-m-d H:i:s') . "', {$data['global']}, '{$data['text']}', 0)");
		$quicknotes[]=array(
				'id' => $guid,
				'user_id' => $current_user->id,
				'user_name' => $current_user->user_name,
				'date' => $GLOBALS['timedate']->to_display_date_time(gmdate('Y-m-d H:i:s')),
				'text' => nl2br($data['text']),
				'global' => $data['global']
		);
		return json_encode($quicknotes);
	}

	public static function editQuickNote($beanName, $beanId, $noteId, $data) {
		global $current_user, $db;
		$db->query("UPDATE spicenotes SET text = '{$data['text']}', trglobal = '{$data['global']}' WHERE id = '{$noteId}'" . (!$current_user->is_admin ? " AND user_id='".$current_user->id."'":""));
		return true;
	}
	public static function deleteQuickNote($noteId) {
		global $current_user, $db;
		$db->query("UPDATE spicenotes SET deleted = 1 WHERE id='{$noteId}'" . (!$current_user->is_admin ? " AND user_id='".$current_user->id."'":""));
	}
}