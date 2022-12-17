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



use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;

$current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

if(!$current_user->is_admin) die('you are not an admin');

$objects = $db->query("SELECT * FROM spiceacltypes");
while($object = $db->fetchByAssoc($objects)){

    $sysmoduleRecord = $db->fetchByAssoc($db->query("SELECT id FROM sysmodules WHERE module = '{$object['module']}' UNION SELECT id FROM syscustommodules WHERE module = '{$object['module']}'"));
    if($sysmoduleRecord && $sysmoduleRecord['id'] != $object['id']){
        $db->query("UPDATE spiceacltypes SET id='{$sysmoduleRecord['id']}' WHERE id='{$object['id']}'");
        $db->query("UPDATE spiceacltypefields SET spiceacltype_id='{$sysmoduleRecord['id']}' WHERE spiceacltype_id='{$object['id']}'");
        $db->query("UPDATE spiceacltypeactions SET spiceacltype_id='{$sysmoduleRecord['id']}' WHERE spiceacltype_id='{$object['id']}'");
        $db->query("UPDATE spiceaclobjects SET spiceacltype_id='{$sysmoduleRecord['id']}' WHERE spiceacltype_id='{$object['id']}'");
        // $db->query("UPDATE spiceaclobjects_hash SET spiceacltype_id='{$sysmoduleRecord['id']}' WHERE spiceacltype_id='{$object['id']}'");
    }
}

// rename fields and tables
$db->query("ALTER TABLE 'spiceaclobjects'	CHANGE COLUMN 'sysacltype_id' 'sysmodule_id' VARCHAR(60) NULL DEFAULT NULL");
$db->query("ALTER TABLE 'spiceacltypeactions'	CHANGE COLUMN 'sysacltype_id' 'sysmodule_id' VARCHAR(60) NULL DEFAULT NULL");
$db->query("ALTER TABLE 'spiceacltypefields'	CHANGE COLUMN 'sysacltype_id' 'sysmodule_id' VARCHAR(60) NULL DEFAULT NULL");
$db->query("ALTER TABLE 'spiceaclobjectvalues'	CHANGE COLUMN 'spiceacltypefield_id' 'spiceaclmodulefield_id' VARCHAR(60) NULL DEFAULT NULL");
$db->query("RENAME TABLE 'spiceacltypefields' TO 'spiceaclmodulefields'");
$db->query("RENAME TABLE 'spiceacltypeactions' TO 'spiceaclmoduleactions'");