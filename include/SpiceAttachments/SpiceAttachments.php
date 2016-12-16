<?php

class SpiceAttachments {

    public static function getAttachmentsForBean($beanName, $beanId,$lastN = 10) {
        global $current_user, $db, $beanFiles, $beanList;
        $attachments = array();

        if ($GLOBALS['db']->dbType == 'mssql'){
            $attachmentsRes = $db->query("SELECT TOP $lastN qn.*,u.user_name FROM spiceattachments AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND qn.deleted = 0 ORDER BY qn.trdate DESC");
        }else{
            $attachmentsRes = $db->limitQuery("SELECT qn.*,u.user_name FROM spiceattachments AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND qn.deleted = 0 ORDER BY qn.trdate DESC", 0, $lastN);
        }

        if ($GLOBALS['db']->dbType == 'mssql' || $db->getRowCount($attachmentsRes) > 0) {
			while ( $thisAttachment = $db->fetchByAssoc($attachmentsRes)) {
				$attachments[]=array(
							'id' => $thisAttachment['id'],
							'user_id' => $thisAttachment['user_id'],
							'user_name' => $thisAttachment['user_name'],
							'date' => $GLOBALS['timedate']->to_display_date_time($thisAttachment['trdate']),
							'text' => nl2br($thisAttachment['text']),
							'filename' => $thisAttachment['filename'],
							'url' => "index.php?module=SpiceThemeController&action=attachment_download&id=".$thisAttachment['id']
						);
			}
		}

		return json_encode($attachments);
	}

	public static function getAttachmentsForBeanHashFiles($beanName, $beanId,$lastN = 10) {
		global $current_user, $db, $beanFiles, $beanList;
		$attachments = array();

		if ($GLOBALS['db']->dbType == 'mssql'){
			$attachmentsRes = $db->query("SELECT TOP $lastN qn.*,u.user_name FROM spiceattachments AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND qn.deleted = 0 ORDER BY qn.trdate DESC");
		}else{
			$attachmentsRes = $db->limitQuery("SELECT qn.*,u.user_name FROM spiceattachments AS qn LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}' AND qn.deleted = 0 ORDER BY qn.trdate DESC", 0, $lastN);
		}

		if ($GLOBALS['db']->dbType == 'mssql' || $db->getRowCount($attachmentsRes) > 0) {
			while ( $thisAttachment = $db->fetchByAssoc($attachmentsRes)) {
				$file = base64_encode(file_get_contents("upload://".$thisAttachment['id']));
				$attachments[]=array(
					'id' => $thisAttachment['id'],
					'user_id' => $thisAttachment['user_id'],
					'user_name' => $thisAttachment['user_name'],
					'date' => $GLOBALS['timedate']->to_display_date_time($thisAttachment['trdate']),
					'text' => nl2br($thisAttachment['text']),
					'filename' => $thisAttachment['filename'],
					'file' => $file
				);
			}
		}

		return json_encode($attachments);
	}

	public static function getAttachmentsCount($lastN = 10){
        global $current_user, $db;
        $attachmentsRec = $db->fetchByAssoc($db->query("SELECT count(*) AS noteCount FROM spiceattachments WHERE bean_id='{$_REQUEST['record']}' AND bean_type='{$_REQUEST['module']}'  AND deleted = 0"));

        return $attachmentsRec['noteCount'];
	}

	public static function saveAttachment($beanName, $beanId, $post) {
		global $current_user, $db;
		$guid = create_guid();

		require_once('include/upload_file.php');
		$upload_file = new UploadFile('file');
		if (isset($_FILES['file']) && $upload_file->confirm_upload()) {
			$filename = $upload_file->get_stored_file_name();
			$file_mime_type = $upload_file->mime_type;
			$upload_file->final_move($guid);
		}

		$db->query("INSERT INTO spiceattachments (id, bean_type, bean_id, user_id, trdate, filename, text, deleted, file_mime_type) VALUES ('{$guid}', '{$beanName}', '{$beanId}', '".$current_user->id."', '" . gmdate('Y-m-d H:i:s') . "', '{$filename}', '{$_POST['text']}', 0, '{$file_mime_type}')");
		$attachments[]=array(
				'id' => $guid,
				'user_id' => $current_user->id,
				'user_name' => $current_user->user_name,
				'date' => $GLOBALS['timedate']->to_display_date_time(gmdate('Y-m-d H:i:s')),
				'text' => nl2br($_POST['text']),
				'filename' => $filename,
				'url' => "index.php?module=SpiceThemeController&action=attachment_download&id=".$guid
		);
		return json_encode($attachments);
	}

	public static function saveAttachmentHashFiles($beanName, $beanId, $post) {
		global $current_user, $db, $sugar_config;
		$guid = create_guid();

		require_once('include/upload_file.php');
		$upload_file = new UploadFile('file');
		$decodedFile = base64_decode($post['file']);
		$upload_file->set_for_soap($post['filename'], $decodedFile);

		$ext_pos = strrpos($upload_file->stored_file_name, ".");
		$upload_file->file_ext = substr($upload_file->stored_file_name, $ext_pos + 1);
		if (in_array($upload_file->file_ext, $sugar_config['upload_badext'])) {
			$upload_file->stored_file_name .= ".txt";
			$upload_file->file_ext = "txt";
		}

		$filename = $upload_file->get_stored_file_name();
		$file_mime_type = $upload_file->getMimeSoap($filename);
		$upload_file->final_move($guid);

		$db->query("INSERT INTO spiceattachments (id, bean_type, bean_id, user_id, trdate, filename, text, deleted, file_mime_type) VALUES ('{$guid}', '{$beanName}', '{$beanId}', '".$current_user->id."', '" . gmdate('Y-m-d H:i:s') . "', '{$filename}', '{$post['text']}', 0, '{$file_mime_type}')");
		$file = base64_encode(file_get_contents("upload://".$guid));
		$attachments[]=array(
			'id' => $guid,
			'user_id' => $current_user->id,
			'user_name' => $current_user->user_name,
			'date' => $GLOBALS['timedate']->to_display_date_time(gmdate('Y-m-d H:i:s')),
			'text' => nl2br($post['text']),
			'filename' => $filename,
			'file' => $file
		);
		return json_encode($attachments);
	}
	public static function deleteAttachment($attachmentId) {
		global $current_user, $db;
		$db->query("UPDATE spiceattachments SET deleted = 1 WHERE id='{$attachmentId}'" . (!$current_user->is_admin ? " AND user_id='".$current_user->id."'":""));
	}
}