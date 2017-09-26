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
'LBL_NAME' => 'Job Name',
'LBL_EXECUTE_TIME'			=> 'Ausführungszeit',
'LBL_SCHEDULER_ID' 	=> 'Zeitplaner',
'LBL_STATUS' 	=> 'Status:',
'LBL_RESOLUTION' 	=> 'Lösung:',
'LBL_MESSAGE' 	=> 'Nachrichten',
'LBL_DATA' 	=> 'Daten',
'LBL_REQUEUE' 	=> 'Beim Fehler erneut versuchen',
'LBL_RETRY_COUNT' 	=> 'Maximale Neuverscuhe',
'LBL_FAIL_COUNT' 	=> 'Misserfolg',
'LBL_INTERVAL' 	=> 'Minimum Intervalle zwischen Versuche',
'LBL_CLIENT' 	=> 'Owning client',
'LBL_PERCENT'	=> 'Prozent fertig',
// Errors
'ERR_CALL' 	=> 'Kann Funktion  %s nicht aufrufen',
'ERR_CURL' => 'Kein CURL - kann URL Jobs nicht ausführen',
'ERR_FAILED' => 'Unerwarteter Fehler. Bitte Ihre PHP Log bzw. sugarcrm.log Datei überprüfen.',
'ERR_PHP' => '%s [%d]: %s in %s auf Zeile %d',
'ERR_NOUSER' => 'Kein UserID für diesen Job spezifiziert',
'ERR_NOSUCHUSER' => 'User ID %s nicht gefunden',
'ERR_JOBTYPE' 	=> 'Unbekannter Jobtyp: %s',
'ERR_TIMEOUT' => 'Forced failure on timeout',
'ERR_JOB_FAILED_VERBOSE' => 'Job %1$s (%2$s) in CRON Lauf fehlgeschlagen',
);
?>
