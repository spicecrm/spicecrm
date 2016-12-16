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

define('sugarEntry', 'ATTACH_DOWNLOAD');
//require('include/entryPoint.php');
global $db;

$local_location =  "upload://{$_REQUEST['id']}";
$query = "SELECT filename name, file_mime_type FROM spiceattachments ";
$query .= "WHERE id= '".$db->quote($_REQUEST['id'])."'";
$rs = $GLOBALS['db']->query($query);
$row = $GLOBALS['db']->fetchByAssoc($rs);
$name = $row['name'];
$mime_type = $row['file_mime_type'];
$download_location = "upload://{$_REQUEST['id']}";
header("Pragma: public");
header("Cache-Control: maxage=1, post-check=0, pre-check=0");
header('Content-type: ' . $mime_type);
header("Content-Disposition: attachment; filename=\"".$name."\";");
// disable content type sniffing in MSIE
header("X-Content-Type-Options: nosniff");
header("Content-Length: " . filesize($local_location));
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 2592000));
set_time_limit(0);

// When output_buffering = On, ob_get_level() may return 1 even if ob_end_clean() returns false
// This happens on some QA stacks. See Bug#64860
while (ob_get_level() && @ob_end_clean());

readfile($download_location);