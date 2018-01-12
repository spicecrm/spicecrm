<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
/*********************************************************************************
 * This file is part of the twentyreasons German language pack.
 * Copyright (C) 2012 twentyreasons business solutions.
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
 ********************************************************************************/
 
$mod_strings = array (
// OOTB Scheduler Job Names:
'LBL_OOTB_WORKFLOW'		=> 'Workflow Aufgaben verarbeiten',
'LBL_OOTB_REPORTS'		=> 'Berichte Aufgaben verarbeiten',
'LBL_OOTB_IE'			=> 'Eingehende Mailkonten überprüfen',
'LBL_OOTB_BOUNCE'		=> 'Unzustellbare Kampagnen E-Mails verarbeiten (Nacht)',
'LBL_OOTB_CAMPAIGN'		=> 'Kampagnen-Massenmails versenden (Nacht)',
'LBL_OOTB_PRUNE'		=> 'Datenbank am 1. des Monats säubern',
'LBL_OOTB_TRACKER'		=> 'Userhistorie am 1. des Monats säubern',
'LBL_UPDATE_TRACKER_SESSIONS' => 'Update tracker_sessions Tabelle',
'LBL_OOTB_SEND_EMAIL_REMINDERS'	=> 'E-Mail Erinnerungsbenachrichtigungen ausführen',
'LBL_OOTB_CLEANUP_QUEUE' => 'Clean Jobs Queue',

// List Labels
'LBL_LIST_JOB_INTERVAL' => 'Intervall:',
'LBL_LIST_LIST_ORDER' => 'Geplante Aufgaben:',
'LBL_LIST_NAME' => 'Geplante Aufgabe:',
'LBL_LIST_RANGE' => 'Bereich:',
'LBL_LIST_REMOVE' => 'Entfernen:',
'LBL_LIST_STATUS' => 'Status:',
'LBL_LIST_TITLE' => 'Aufgaben Liste:',
'LBL_LIST_EXECUTE_TIME' => 'Wird gestartet am:',
// human readable:
'LBL_SUN'		=> 'Sonntag',
'LBL_MON'		=> 'Montag',
'LBL_TUE'		=> 'Dienstag',
'LBL_WED'		=> 'Mittwoch',
'LBL_THU'		=> 'Donnerstag',
'LBL_FRI'		=> 'Freitag',
'LBL_SAT'		=> 'Samstag',
'LBL_ALL'		=> 'Jeden Tag',
'LBL_EVERY_DAY'	=> 'Jeden Tag',
'LBL_AT_THE'	=> 'Am',
'LBL_EVERY'		=> 'alle',
'LBL_FROM'		=> 'Von',
'LBL_ON_THE'	=> 'Um',
'LBL_RANGE'		=> 'an',
'LBL_AT' 		=> 'um',
'LBL_IN'		=> 'in',
'LBL_AND'		=> 'und',
'LBL_MINUTES'	=> 'Minuten',
'LBL_HOUR'		=> 'Stunden',
'LBL_HOUR_SING'	=> 'Stunde',
'LBL_MONTH'		=> 'Monat',
'LBL_OFTEN'		=> 'So oft wie möglich.',
'LBL_MIN_MARK'	=> 'Minuten nach',


// crontabs
'LBL_MINS' => 'min',
'LBL_HOURS' => 'h',
'LBL_DAY_OF_MONTH' => 'Datum',
'LBL_MONTHS' => 'Monat',
'LBL_DAY_OF_WEEK' => 'Tag',
'LBL_CRONTAB_EXAMPLES' => 'Das oben stehende verwendet standard Crontab Notation.',
'LBL_CRONTAB_SERVER_TIME_PRE' => 'Die cron Spezifikationen laufen über die Server Zeitzone (',
'LBL_CRONTAB_SERVER_TIME_POST' => '). Bitte die Zeitplaner Ausführungszeit definieren.',
// Labels
'LBL_ALWAYS' => 'Immer',
'LBL_CATCH_UP' => 'Ausführen wenn versäumt',
'LBL_CATCH_UP_WARNING' => 'Deaktivieren, wenn der Lauf dieses Jobs mehr als einen Moment dauert.',
'LBL_DATE_TIME_END' => 'Enddatum &  Zeit',
'LBL_DATE_TIME_START' => 'Startdatum & Zeit',
'LBL_INTERVAL' => 'Intervall',
'LBL_JOB' => 'Job',
'LBL_JOB_URL' => 'Job URL',
'LBL_LAST_RUN' => 'Letzte erfolgreiche Durchführung',
'LBL_MODULE_NAME' => 'Schedulers',
'LBL_MODULE_TITLE' => 'Geplante Aufgaben',
'LBL_NAME' => 'Job Name',
'LBL_NEVER' => 'Nie',
'LBL_NEW_FORM_TITLE' => 'Neuer Termin',
'LBL_PERENNIAL' => 'andauernd',
'LBL_SEARCH_FORM_TITLE' => 'Geplante Aufgabe Suche',
'LBL_SCHEDULER' => 'Geplante Aufgabe:',
'LBL_STATUS' => 'Status',
'LBL_TIME_FROM' => 'Aktiv von',
'LBL_TIME_TO' => 'Aktiv bis',
'LBL_WARN_CURL_TITLE' => 'cURL Warnung:',
'LBL_WARN_CURL' => 'Warnung:',
'LBL_WARN_NO_CURL' => 'In diesem System sind die cURL Bibliotheken im PHP Modul nicht aktiviert (--with-curl=/pfad/zu/curl_library). Bitte kontaktieren Sie den Administrator zur Lösung dieses Problems. Ohne diese Funktionalität kann der Zeitplaner die Jobs nicht einreihen.',
'LBL_BASIC_OPTIONS' => 'Basis Setup',
'LBL_ADV_OPTIONS'		=> 'Erw. Optionen',
'LBL_TOGGLE_ADV' => 'Erw. Optionen',
'LBL_TOGGLE_BASIC' => 'Basisoptionen',
// Links
'LNK_LIST_SCHEDULER' => 'Geplante Aufgaben',
'LNK_NEW_SCHEDULER' => 'Neue Aufgabe',
'LNK_LIST_SCHEDULED' => 'Geplante Jobs',
// Messages
'SOCK_GREETING' => 'Dies ist die Oberfläche für die Services des Sugar Zeitplaners. <br />[ Verfügbare daemon Kommandos: start|restart|shutdown|status ]<br />Um zu verlassen, tippen Sie  &#39;quit&#39;. Um das Service herunterzufahren &#39;shutdown&#39;.',
'ERR_DELETE_RECORD' => 'Zum Löschen des Plans muss eine Datensatznummer angegeben werden.',
'ERR_CRON_SYNTAX' => 'Ungültige Cron Syntax',
'NTC_DELETE_CONFIRMATION' => 'Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?',
'NTC_STATUS' => 'Zum Entfernen dieses Plans von der Terminplaner Auswahlliste setzen Sie den Status auf inaktiv',
'NTC_LIST_ORDER' => 'Setzen Sie die Reihenfolge, in der dieser Plan in der Terminplaner Auswahlliste erscheinen soll.',
'LBL_CRON_INSTRUCTIONS_WINDOWS' => 'Konfiguration des Windows Terminplaners',
'LBL_CRON_INSTRUCTIONS_LINUX' => 'Konfiguration eines crontab Eintrages',
'LBL_CRON_LINUX_DESC' => 'Fügen Sie diese Zeile Ihrem Crontab hinzu:',
'LBL_CRON_WINDOWS_DESC' => 'Erstellen Sie eine Batch-Datei mt den folgenden Befehlen:',
'LBL_NO_PHP_CLI' => 'Wenn Ihr Host keine PHP-Binary zur Verfügung stellt, können Sie Ihre Jobs mittels wget oder curl starten:<br>for wget: <b>*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;wget --quiet --non-verbose http://translate.sugarcrm.com/soon/latest/cron.php > /dev/null 2>&1</b><br>for curl: <b>*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;curl --silent http://translate.sugarcrm.com/soon/latest/cron.php > /dev/null 2>&1',
// Subpanels
'LBL_JOBS_SUBPANEL_TITLE'	=> 'Aktive Jobs',
'LBL_EXECUTE_TIME'			=> 'Ausführungszeit',

//jobstrings
'LBL_REFRESHJOBS' => 'Aktualisiere Jobs',
'LBL_POLLMONITOREDINBOXES' => 'Checke einlaufende Mail Accounts',
'LBL_PERFORMFULLFTSINDEX' => 'Volltext Suche Index System',

'LBL_RUNMASSEMAILCAMPAIGN' => 'Run Nightly Mass Email Campaigns',
'LBL_POLLMONITOREDINBOXESFORBOUNCEDCAMPAIGNEMAILS' => 'Run Nightly Process Bounced Campaign Emails',
'LBL_PRUNEDATABASE' => 'Prune Database on 1st of Month',
'LBL_TRIMTRACKER' => 'Prune Tracker Tables',
'LBL_SENDEMAILREMINDERS'=> 'E-Mail Erinnerungsbenachrichtigungen ausführen',
'LBL_CLEANJOBQUEUE' => 'Cleanup Job Queue',
    'LBL_FULLTEXTINDEX' => 'Full Text Indexing',
    'LBL_KDEPLOYMENTMWNOTIFICATION' => 'Wartungsfenster: User benachrichtigen'
);
?>
