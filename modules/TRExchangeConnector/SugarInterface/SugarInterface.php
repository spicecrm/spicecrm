<?php
/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface;

class SugarInterface extends \TRBusinessConnector\BaseInterface\BaseInterface {

    protected $functionNamespacePrefix = 'TRBusinessConnector\\SugarInterface\\SugarFunction\\';
    
    public function __construct() {        
        
        $this->api = new \TRBusinessConnector\SugarInterface\SugarApi\SugarApi();
        $this->converter = new FormatConverter\SugarFormatConverter();
    }
    
    public function getContactsByIdsForUser($idsToRetrieve, $user) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function getContactsForExchangeSyncForUser($user, $lastSyncDate, $startAfter = null, $offset = 0) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function saveOrUpdateContactsFromExchangeSyncForUser($contacts, $user) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function getTasksForExchangeSyncForUser($user, $lastSyncDate, $startAfter = null, $offset = 0) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function saveOrUpdateTasksFromExchangeSyncForUser($contacts, $user) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
        
    public function getTasksByIdsForUser($idsBeanPairsToRetrieve, $user) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function getCalendarItemsForExchangeSyncForUser($user, $lastSyncDate, $startAfter = null, $offset = 0) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function saveOrUpdateCalendarItemsFromExchangeSyncForUser($contacts, $user) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
        
    public function getCalendarItemsByIdsForUser($idsBeanPairsToRetrieve, $user) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }    
}
