<?php

class SpiceReminders {

    public static function setReminder($beanId, $beanModule, $reminderDate) {
        global $current_user, $db;
        $GLOBALS['disable_date_format'] = false;
        $dbReminderDate = $GLOBALS['timedate']->to_db_date($reminderDate, false);
        if ($GLOBALS['db']->dbType == 'mysql')
        $db->query("INSERT INTO spicereminders SET user_id = '$current_user->id', bean='$beanModule', bean_id = '$beanId', reminder_date='$dbReminderDate' ON DUPLICATE KEY UPDATE reminder_date='$dbReminderDate'");
        else {
            $reminderRecordObj = $db->query("SELECT * FROM spicereminders WHERE user_id='$current_user->id' AND bean_id='$beanId'");
            if ($reminderRecord = $db->fetchByAssoc($reminderRecordObj))
                $db->query("UPDATE spicereminders SET reminder_date='$dbReminderDate'WHERE user_id='$current_user->id' AND bean_id='$beanId'");
            else
                $db->query("INSERT INTO spicereminders (user_id, bean, bean_id, reminder_date) VALUES ('$current_user->id','$beanModule', '$beanId', '$dbReminderDate' )");
        }
        //$thisDate = $reminderDate;
        return SpiceReminders::getReminders(5);
    }

    public static function getReminder($beanId){
        global $current_user, $db;
        $reminderObj = $db->query("SELECT * FROM spicereminders WHERE user_id='$current_user->id' AND bean_id='$beanId'");
        //if($db->getRowCount($reminderObj) > 0)
        if ($reminderRow = $db->fetchByAssoc($reminderObj)) {
            // $reminderRow = $db->fetchByAssoc($reminderObj);
            if ($GLOBALS['db']->dbType == 'mssql')
                $reminderRow['reminder_date'] = str_replace('.000', '', $reminderRow['reminder_date']);
            return $GLOBALS['timedate']->to_display_date($reminderRow['reminder_date'], false) ; //. SugarThemeRegistry::current()->getImage('close_inline');
        }
        else
            return '';
    }

    public static function getReminderIcon(){
        return SugarThemeRegistry::current()->getImage('jscalendar');
    }

    public static function removeReminder($beanId){
        global $current_user, $db;
        $db->query("DELETE FROM spicereminders WHERE user_id='$current_user->id' AND bean_id='$beanId'");
    }

    public static function getReminders($lastN = 10){
        global $current_user, $db;
        $favArray = array();
        $lastNObj = $db->limitQuery("SELECT * FROM spicereminders WHERE user_id='$current_user->id' ORDER BY reminder_date ASC ",0,$lastN);
        while ($lastNRow = $db->fetchByAssoc($lastNObj)) {
            if ($GLOBALS['db']->dbType == 'mssql')
                $lastNRow['reminder_date'] = str_replace('.000', '', $lastNRow['reminder_date']);

			$thisBean = BeanFactory::getBean($lastNRow['bean'], $lastNRow['bean_id']);
            $favArray[] = array(
                'bean_id' => $lastNRow['bean_id'],
                'bean' => $lastNRow['bean'],
                'summary' => (strlen($thisBean->get_summary_text()) > 15 ? substr($thisBean->get_summary_text(), 0, 13) . '...' : $thisBean->get_summary_text()),
                'reminder_date' => $GLOBALS['timedate']->to_display_date($lastNRow['reminder_date'], false),
                'icon' => SugarThemeRegistry::current()->getImage($lastNRow['bean'])
            );
			$thisBean = null;
			unset($thisBean);
        }
        return $favArray;
    }
	
	public static function getReminderCount($lastN = 10){
        global $current_user, $db;
        $count = 0;
        $lastNObj = $db->limitQuery("SELECT * FROM spicereminders WHERE user_id='$current_user->id' ORDER BY reminder_date ASC ",0,$lastN);
        while ($lastNRow = $db->fetchByAssoc($lastNObj)) {
            $count++;
        }
        return $count;
    }
}