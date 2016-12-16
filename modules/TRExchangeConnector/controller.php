<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

require_once 'modules/TRExchangeConnector/TRBusinessConnectorAutoloader.php';

use \TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDefRepository;

class TRExchangeConnectorController extends SugarController {

    public function action_configureexchangesync() {
        $this->view = 'configureexchangesync';
    }

    public function action_getsynclist() {

        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $userId = $_REQUEST['userId'];

        $syncDefRepository = new SyncDefRepository();
        $syncDefList = $syncDefRepository->getSyncDefListForUserId($userId);

        echo json_encode(array_map(function($syncDef) {
                    return $syncDef->getArrayForJson();
                }, $syncDefList));
        exit;
    }

    public function action_getsyncusers() {

        global $current_user, $db;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $syncDefRepository = new SyncDefRepository();
        $syncUserIds = $syncDefRepository->getSyncUserIds();

        $idInClause = "users.id IN ('" . implode("','", $syncUserIds) . "')";
        $thisUser = new User();

        $filter = array(
            'first_name' => 'first_name',
            'last_name' => 'last_name',
            'user_name' => 'user_name'
        );
        $query = $thisUser->create_new_list_query('', $idInClause, $filter);
        $result = $db->query($query);

        $list = array();
        while ($row = $db->fetchByAssoc($result)) {
            $list[] = array(
                'id' => $row['id'],
                'name' => (!empty($row['first_name']) ? $row['first_name'] . ' ' : '') . $row['last_name'] . ' (' . $row['user_name'] . ')'
            );
        }
        echo json_encode($list);
        exit;
    }

    public function action_getaddusers() {

        global $current_user, $db;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $syncDefRepository = new SyncDefRepository();
        $syncUserIds = $syncDefRepository->getSyncUserIds();
	
	if($syncUserIds) {
        	$idInClause = "users.id NOT IN ('" . implode("','", $syncUserIds) . "')";
	} else {
		$idInClause = '';
	}
        $thisUser = new User();

        $filter = array(
            'first_name' => 'first_name',
            'last_name' => 'last_name',
            'user_name' => 'user_name'
        );
        $query = $thisUser->create_new_list_query('', $idInClause, $filter);
        $result = $db->query($query);

        $list = array();
        while ($row = $db->fetchByAssoc($result)) {
            $list[] = array(
                'id' => $row['id'],
                'name' => (!empty($row['first_name']) ? $row['first_name'] . ' ' : '') . $row['last_name'] . ' (' . $row['user_name'] . ')'
            );
        }
        echo json_encode($list);
        exit;
    }
    
    public function action_getservers() {
        
        global $sugar_config, $current_user;
        
        if (!is_admin($current_user)) {
            die('no access');
        }

        if (is_array($sugar_config['TRExchangeInterface']['server'])) {
            $servers = $sugar_config['TRExchangeInterface']['server'];
        } else {
            $servers = array($sugar_config['TRExchangeInterface']['server']);
        }
        
        $serverList = array_map(function($server) {return array('url' => $server);}, $servers);
        echo json_encode($serverList);
        exit;
    }

    public function action_testsyncconnectivity() {

        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $syncId = $_REQUEST['syncId'];

        $syncDefRepository = new SyncDefRepository();
        $syncDef = $syncDefRepository->get($syncId);

        if (!$syncDef) {
            echo json_encode([
                'success' => false,
                'message' => 'SyncDef not found'
            ]);
            exit;
        }

        $exchangeInterface = TRBusinessConnector\ExchangeInterface\ExchangeInterface::getInstance();
        try {
            switch ($syncDef->getSyncType()) {
                case 'Contacts':
                    $result = $exchangeInterface->syncContactsFolderItems($syncDef->getServer(), $syncDef->getUpn(), null);
                    break;
                case 'Tasks':
                    $result = $exchangeInterface->syncContactsFolderItems($syncDef->getServer(), $syncDef->getUpn(), null);
                    break;
                case 'CalendarItems':
                    $result = $exchangeInterface->syncContactsFolderItems($syncDef->getServer(), $syncDef->getUpn(), null);
                    break;
                default:
                    break;
            }
            $return = array(
                'success' => true,
                'message' => 'Sync request was successful'
            );
        } catch (Exception $ex) {
            $return = array(
                'success' => false,
                'message' => "Sync request returned error message:\n" . $ex->getMessage()
            );
        }
        echo json_encode($return);
        exit;
    }
    
    public function action_disablesync() {
        
        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $syncId = $_REQUEST['syncId'];

        $syncDefRepository = new SyncDefRepository();
        $syncDef = $syncDefRepository->get($syncId);

        if (!$syncDef) {
            echo json_encode([
                'success' => false,
                'message' => 'SyncDef not found'
            ]);
            exit;
        }

        $syncDef->setDeleted(!$syncDef->getDeleted());
        $syncDefRepository->save($syncDef);
        echo json_encode([
            'success' => true,
            'message' => 'Activated flag toggled succesfully'
        ]);
        exit;
    }

    public function action_resetsync() {
        
        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $syncId = $_REQUEST['syncId'];
        $clearLogs = $_REQUEST['clearLogs'];

        $syncDefRepository = new SyncDefRepository();
        $syncDef = $syncDefRepository->get($syncId);

        if (!$syncDef) {
            echo json_encode([
                'success' => false,
                'message' => 'SyncDef not found'
            ]);
            exit;
        }
        
        $syncDef->reset();
        
        if($clearLogs) {
            $syncStateRepository = new \TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncStateRepository();
            $syncStateRepository->purgeSyncState($syncDef);
        }

        $syncDefRepository->save($syncDef);
        echo json_encode([
            'success' => true,
            'message' => 'Sync resetted successfully'
        ]);
        exit;
    }

    public function action_createsyncs() {
        
        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $userId = $_REQUEST['userId'];
        $upn = $_REQUEST['upn'];
        $server = $_REQUEST['server'];

        if (empty($userId) || empty($upn) || empty($server)) {
            echo json_encode([
                'success' => false,
                'message' => 'Parameters missing'
            ]);
            exit;
        }
        
        $syncTypes = array('Contacts', 'Tasks', 'CalendarItems');
        $syncDefRepository = new SyncDefRepository();
        foreach($syncTypes as $syncType) {
            $newSyncDef = new TRBusinessConnector\Sync\ExchangeSync\SyncDef\SyncDef();
            $newSyncDef->setUpn($upn);
            $newSyncDef->setUserId($userId);
            $newSyncDef->setSyncType($syncType);
            $newSyncDef->setServer($server);
            if($syncType === 'CalendarItems') {
                $newSyncDef->setStartAfter(new \SugarDateTime());
            }
            $newSyncDef->setDeleted(true);
            $syncDefRepository->save($newSyncDef);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Syncs created successfully'
        ]);
        exit;
    }

    public function action_deletesyncs() {
        
        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }

        $userId = $_REQUEST['userId'];

        if (empty($userId)) {
            echo json_encode([
                'success' => false,
                'message' => 'Parameters missing'
            ]);
            exit;
        }
        
        $syncDefRepository = new SyncDefRepository();
        $syncStateRepository = new \TRBusinessConnector\Sync\ExchangeSync\SyncState\SyncStateRepository();
        $syncDefList = $syncDefRepository->getSyncDefListForUserId($userId);
        foreach($syncDefList as $syncDef) {
            $syncStateRepository->purgeSyncState($syncDef);
            $syncDefRepository->deletePermanently($syncDef);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Sync deleted successfully'
        ]);
        exit;
    }
    
    public function action_encryptpassword() {
        
        global $current_user;

        if (!is_admin($current_user)) {
            die('no access');
        }
        
        $password = $_REQUEST['password'];
        echo json_encode(
            array(
                'encryptedPassword' => blowfishEncode(blowfishGetKey('encrypt_field'), $password)
            )
        );
        exit;
    }
    
    public function action_updatesync() {
        
        global $current_user, $timedate;

        if (!is_admin($current_user)) {
            die('no access');
        }
        
        $updateData = get_object_vars(json_decode(file_get_contents('php://input')));

        if (empty($updateData)) {
            echo json_encode([
                'success' => false,
                'message' => 'Input missing'
            ]);
            exit;
        }
        
        $syncDefRepository = new SyncDefRepository();
        $syncDef = $syncDefRepository->get($updateData['id']);
        
        if (empty($syncDef)) {
            echo json_encode([
                'success' => false,
                'message' => 'Syncdef not found'
            ]);
            exit;
        }
        
        foreach($updateData as $property => $value) {
            switch($property) {
                case 'startAfter':
                    $setter = 'set' . ucfirst($property);                    
                    $syncDef->$setter($timedate->fromUser($value));
                    break;
                case 'server':
                    $setter = 'set' . ucfirst($property);                    
                    $syncDef->$setter($value);
                    break;
                default:
                    break;
            }
        }
        $syncDefRepository->save($syncDef);
        
        echo json_encode($syncDef);
        exit;
    }
    
    
}
