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

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\extensions\modules\QuestionnaireEvaluations\QuestionnaireEvaluation;
use SpiceCRM\extensions\modules\Workflows\WorkflowScheduler;
use SpiceCRM\extensions\modules\WorkflowTasks\WorkflowTaskScheduler;

/**
 * Set up an array of Jobs with the appropriate metadata
 * 'jobName' => array (
 * 		'X' => 'name',
 * )
 * 'X' should be an increment of 1
 * 'name' should be the EXACT name of your function
 *
 * Your function should not be passed any parameters
 * Always  return a Boolean. If it does not the Job will not terminate itself
 * after completion, and the webserver will be forced to time-out that Job instance.
 * DO NOT USE sugar_cleanup(); in your function flow or includes.  this will
 * break Jobs.  That function is called at the foot of cron.php
 */

/**
 * This array provides the Jobs admin interface with values for its "Job"
 * dropdown menu.
 */
$job_strings = [
	//0 => 'refreshJobs',
	//1 => 'pollMonitoredInboxes',
	// 2 => 'runMassEmailCampaign',
    // 5 => 'pollMonitoredInboxesForBouncedCampaignEmails',
	3 => 'pruneDatabase',
	4 => 'trimTracker',
	/*4 => 'securityAudit()',*/
    12 => 'sendEmailReminders',
    14 => 'cleanJobQueue',
	// 20 => 'fullTextIndex',
    22 => 'sendCampaignTaskEmails',
    23 => 'fetchEmails',
    24 => 'processEmails',
    25 => 'processSpiceImports',
    26 => 'cleanSysLogs',
    27 => 'cleanSysFTSLogs',
    28 => 'workflowHandler',
    29 => 'schedulerTest',
	30 => 'fullTextIndexBulk',
	31 => 'generateQuestionnaireEvaluations',
    32 => 'sendEmailScheduleEmails',
];

function workflowHandler(){
    $schedulerHandler = new WorkflowTaskScheduler();
    $schedulerHandler->runScheduledTasks();

    $workflowHandler = new WorkflowScheduler();
    $workflowHandler->rundScheduledWorkflows();
    return true;
}

/**
 * Job 0 refreshes all job jobs at midnight
 * DEPRECATED
 */
function refreshJobs() {
	return true;
}


/**
 * Job 1
 * Deprectaed
 */
function pollMonitoredInboxes() {

	return true;
}

/**
 * Job 2
 * Deprectad
 */
function runMassEmailCampaign() {

	return true;
}

/**
 *  Job 3
 */
function pruneDatabase() {
	LoggerManager::getLogger()->info('----->Scheduler fired job of type pruneDatabase()');
	$backupDir	= sugar_cached('backups');
	$backupFile	= 'backup-pruneDatabase-GMT0_'.gmdate('Y_m_d-H_i_s', strtotime('now')).'.php';

	$db = DBManagerFactory::getInstance();
	$tables = $db->getTablesArray();
    $queryString = [];

	if(!empty($tables)) {
		foreach($tables as $kTable => $table) {
			// find tables with deleted=1
			$columns = $db->get_columns($table);
			// no deleted - won't delete
			if(empty($columns['deleted'])) continue;

// CR1000452
//			$custom_columns = [];
//			if(array_search($table.'_cstm', $tables)) {
//			    $custom_columns = $db->get_columns($table.'_cstm');
//			    if(empty($custom_columns['id_c'])) {
//			        $custom_columns = [];
//			    }
//			}

			$qDel = "SELECT * FROM $table WHERE deleted = 1";
			$rDel = $db->query($qDel);

			// make a backup INSERT query if we are deleting.
			while($aDel = $db->fetchByAssoc($rDel)) {
				// build column names

				$queryString[] = $db->insertParams($table, $columns, $aDel, null, false);

// CR1000452
//				if(!empty($custom_columns) && !empty($aDel['id'])) {
//                    $qDelCstm = 'SELECT * FROM '.$table.'_cstm WHERE id_c = '.$db->quoted($aDel['id']);
//                    $rDelCstm = $db->query($qDelCstm);
//
//                    // make a backup INSERT query if we are deleting.
//                    while($aDelCstm = $db->fetchByAssoc($rDelCstm)) {
//                        $queryString[] = $db->insertParams($table, $custom_columns, $aDelCstm, null, false);
//                    } // end aDel while()
//
//                    $db->query('DELETE FROM '.$table.'_cstm WHERE id_c = '.$db->quoted($aDel['id']));
//                }
			} // end aDel while()
			// now do the actual delete
			$db->query('DELETE FROM '.$table.' WHERE deleted = 1');
		} // foreach() tables

		if(!file_exists($backupDir) || !file_exists($backupDir.'/'.$backupFile)) {
			// create directory if not existent
			mkdir_recursive($backupDir, false);
		}
		// write cache file

		write_array_to_file('pruneDatabase', $queryString, $backupDir.'/'.$backupFile);
		return true;
	}
	return false;
}


///**
// * Job 4
// */

//function securityAudit() {
//	// do something
//	return true;
//}

function trimTracker()
{
    global  $timedate;
	LoggerManager::getLogger()->info('----->Scheduler fired job of type trimTracker()');
	$db = DBManagerFactory::getInstance();

	$admin = BeanFactory::getBean('Administration');
	$admin->retrieveSettings('tracker');
	require('modules/Trackers/config.php');
	$trackerConfig = $tracker_config;

    require_once('include/utils/db_utils.php');
    $prune_interval = !empty($admin->settings['tracker_prune_interval']) ? $admin->settings['tracker_prune_interval'] : 30;
	foreach($trackerConfig as $tableName=>$tableConfig) {

		//Skip if table does not exist
		if(!$db->tableExists($tableName)) {
		   continue;
		}

	    $timeStamp = DBManagerFactory::getInstance()->convert("'". $timedate->asDb($timedate->getNow()->get("-".$prune_interval." days")) ."'" ,"datetime");
		if($tableName == 'tracker_sessions') {
		   $query = "DELETE FROM $tableName WHERE date_end < $timeStamp";
		} else {
		   $query = "DELETE FROM $tableName WHERE date_modified < $timeStamp";
		}

	    LoggerManager::getLogger()->info("----->Scheduler is about to trim the $tableName table by running the query $query");
		$db->query($query);
	} //foreach
    return true;
}

/* Job 5
 * Deprecated
 */
function pollMonitoredInboxesForBouncedCampaignEmails() {


	return true;
}




/**
 * Job 12
 */
function sendEmailReminders(){
	LoggerManager::getLogger()->info('----->Scheduler fired job of type sendEmailReminders()');
	require_once("modules/Activities/EmailReminder.php");
	$reminder = new EmailReminder();
	return $reminder->process();
}



/*
 * Job 20 .. rzun the full text indexer
 */

/**
 * @deprecated
 * @return bool
 */
/*
function fullTextIndex(){
    // no date formatting
    global $disable_date_format;
    $disable_date_format = true;

    // determine package size
    $packagesize = \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['fts']['schedulerpackagesize'] ?: 5000;

//    require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
    $ftsHandler = new \SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler();
    $ftsHandler->indexBeans($packagesize, true );
    return true;
}
*/

/*
 * Job 30 (20B) .. run the bulk text indexer
 */

function fullTextIndexBulk(){
    // no date formatting


    // determine package size
    $packagesize = SpiceConfig::getInstance()->config['fts']['schedulerpackagesize'] ?: 5000;

//    require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
    SpiceFTSHandler::getInstance()->bulkIndexBeans($packagesize, null, true );
    return true;
}

function cleanJobQueue($job)
{
    $td = TimeDate::getInstance();
    // soft delete all jobs that are older than cutoff
    $soft_cutoff = 7;
    if(isset(SpiceConfig::getInstance()->config['schedulerjobs']['soft_lifetime'])) {
        $soft_cutoff = SpiceConfig::getInstance()->config['schedulerjobs']['soft_lifetime'];
    }
    $soft_cutoff_date = $job->db->quoted($td->getNow()->modify("- $soft_cutoff days")->format(TimeDate::DB_DATETIME_FORMAT));
    $job->db->query("UPDATE {$job->table_name} SET deleted=1 WHERE status='done' AND date_modified < ".$job->db->convert($soft_cutoff_date, 'datetime'));
    // hard delete all jobs that are older than hard cutoff
    $hard_cutoff = 21;
    if(isset(SpiceConfig::getInstance()->config['schedulerjobs']['hard_lifetime'])) {
        $hard_cutoff = SpiceConfig::getInstance()->config['schedulerjobs']['hard_lifetime'];
    }
    $hard_cutoff_date = $job->db->quoted($td->getNow()->modify("- $hard_cutoff days")->format(TimeDate::DB_DATETIME_FORMAT));
    $job->db->query("DELETE FROM {$job->table_name} WHERE status='done' AND date_modified < ".$job->db->convert($hard_cutoff_date, 'datetime'));
    return true;
}
/**
 * Job 22
 * sendCampaignTaskEmails
 */
function sendCampaignTaskEmails(){
    $campaignTask = BeanFactory::getBean('CampaignTasks');
    return $campaignTask->sendQueuedEmails();
}

/**
 * Job 23
 * fetchEmails
 */
function fetchEmails() {
    require_once(__DIR__ . '/../../vendor/autoload.php');

    $mailboxes = BeanFactory::getBean('Mailboxes')
        ->get_full_list(
            'mailboxes.name',
            'inbound_comm=1 AND active=1'
        );

    foreach ($mailboxes as $mailbox) {
        $mailbox->initTransportHandler();

        $mailbox->transport_handler->fetchEmails();
    }

    // return true so the job gets set as properly
    return true;
}

/**
 * Job 24
 * processEmails
 */
function processEmails() {
    require_once(__DIR__ . '/../../vendor/autoload.php');

    $mailboxes = BeanFactory::getBean('Mailboxes')
        ->get_full_list(
            'mailboxes.name',
            'inbound_comm=1 AND active=1'
        );

    foreach ($mailboxes as $mailbox) {
        // todo that will most likely need some criteria
        if ($mailbox->load_relationship('emails')) {
            $emails = $mailbox->emails->getBeans();

            foreach ($emails as $email) {
                $email->processEmail();
            }
        }
    }
}

/**
 * Job 25
 * Process SpiceImports Schedules
 */
function processSpiceImports(){
    echo 'importing';
    $import = BeanFactory::getBean('SpiceImports');
    $importList = $import->get_list("date_entered", "spiceimports.status = 'q'", 0 , 5);
    foreach($importList['list'] as $thisImport){

        $thisImport->process();
    }
}

/**
 * Job 26
 * Clean SysLogs
 */

function cleanSysLogs(){
    $defaultInterval = "7 DAY";
    $q = "DELETE FROM syslogs WHERE date_entered < DATE_SUB(now(), INTERVAL ".(isset(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) && !empty(SpiceConfig::getInstance()->config['logger']['db']['clean_interval']) ? SpiceConfig::getInstance()->config['logger']['db']['clean_interval'] : $defaultInterval).")";
    DBManagerFactory::getInstance()->query($q);
    return true;
}

/**
 * Job 27
 * Clean sysftslogs
 */

function cleanSysFTSLogs(){
    $defaultInterval = "14 DAY";
    $q = "DELETE FROM sysftslog WHERE date_created < DATE_SUB(now(), INTERVAL ".(isset(SpiceConfig::getInstance()->config['fts']['log_clean_interval']) && !empty(SpiceConfig::getInstance()->config['fts']['clean_interval']) ? SpiceConfig::getInstance()->config['fts']['log_clean_interval'] : $defaultInterval).")";
    DBManagerFactory::getInstance()->query($q);
    return true;
}

/**
 * Job 29
 * Test Job, does nothing, for testing of scheduler
 */

function schedulerTest() {
    echo "Scheduler Test (function schedulerTest() executed, nothing else is done.\n";
    LoggerManager::getLogger()->debug('Scheduler Test');
    return true;
}

/**
 * Job 31
 * Generate missing QuestionnaireEvaluations
 */

function generateQuestionnaireEvaluations()
{
    $db = DBManagerFactory::getInstance();
    echo "Generating non existing QuestionnaireEvaluations for ServiceFeedbacks with linked Questionnaires.\n";
    // in future: "FROM questionnaireparticipations instead "FROM servicefeedbacks"
    $result = $db->query('SELECT DISTINCT sf.id FROM servicefeedbacks sf LEFT JOIN questionnaireevaluations qe ON sf.questionnaireevaluation_id = qe.id WHERE NOT ISNULL(NULLIF(sf.questionnaire_id,\'\')) AND ( ISNULL(NULLIF(sf.questionnaireevaluation_id,\'\')) OR qe.deleted = 1 ) AND sf.deleted = 0');
    while ( $row = $db->fetchByAssoc( $result )) {
        QuestionnaireEvaluation::generateEvaluation('ServiceFeedbacks', $row['id'] );
    }
    return true;
}

/**
 * Job 32
 * sendEmailScheduleEmails
 */
function sendEmailScheduleEmails(){
    $emailSchedule = BeanFactory::getBean('EmailSchedules');
    return $emailSchedule->sendQueuedEmails();
}

// check if we have extension in the local path
$checkRootPaths = ['include', 'modules', 'custom/modules'];
foreach ($checkRootPaths as $checkRootPath) {
    $dirHandle = opendir("./$checkRootPath");
    if ($dirHandle) {
        while (($nextDir = readdir($dirHandle)) !== false) {
            if ($nextDir != '.' && $nextDir != '..' && is_dir("./$checkRootPath/$nextDir") && file_exists("./$checkRootPath/$nextDir/ScheduledTasks")) {
                $subDirHandle = opendir("./$checkRootPath/$nextDir/ScheduledTasks");
                if ($subDirHandle) {
                    while (false !== ($nextFile = readdir($subDirHandle))) {
                        if (preg_match('/.php$/', $nextFile)) {
                            require_once("./$checkRootPath/$nextDir/ScheduledTasks/$nextFile");
                        }
                    }
                }
            }
        }
    }
}

if (file_exists('modules/Jobs/ScheduledTasks/scheduledtasks.php')) {
    require('modules/Jobs/ScheduledTasks/scheduledtasks.php');
}

if (file_exists('custom/modules/Jobs/_AddJobsHere.php')) {
	require('custom/modules/Jobs/_AddJobsHere.php');
}

if (file_exists('custom/modules/Jobs/Ext/ScheduledTasks/scheduledtasks.ext.php'))
{
	require('custom/modules/Jobs/Ext/ScheduledTasks/scheduledtasks.ext.php');
}
