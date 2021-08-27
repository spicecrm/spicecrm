<?php

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