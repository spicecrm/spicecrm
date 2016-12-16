<?php
require_once 'services/EwsService.php';
//require_once 'services/SugarSubscription.php';
require_once 'services/SugarService.php';

global $db, $current_user;

$businessObjectDefs = array(
    'id',
    'firstname',
    'lastname',
    'primary_address_street',
    'primary_address_city',
    'phone_mobile'
);

$syncObject = new SyncContactItem($businessObjectDefs);

$itemDescription = new stdClass();
$itemDescription->objectName = 'contact';
$itemDescription->principalName = 'thomaskerle@devexchange.local';
$itemDescription->businessObjectDef = $businessObjectDef;
$itemDescription->syncObject = $syncObject;

$syncDescription = new stdClass();
$syncDescription->SugarService = new stdClass();
$syncDescription->SugarService->moduleName = 'contacts';
$syncDescription->EwsService = new stdClass();
$syncDescription->EwsService->PrincipalName = 'thomaskerle@devexchange.local';


$sugarService = new SugarService();
$businessObjectsForSync = $sugarService->getItemsForSync($itemDescription, NULL);

$ewsWrapper = EwsService::initialize('192.168.90.52', 'sugarsync', 'twenty321a');
$ewsWrapper->createOrUpdate($itemDescription, $businessObjectsForSync);
        
exit;
