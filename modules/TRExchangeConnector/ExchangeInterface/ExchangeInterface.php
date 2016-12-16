<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */


namespace TRBusinessConnector\ExchangeInterface;

class ExchangeInterface  extends \TRBusinessConnector\BaseInterface\BaseInterface {
    
    protected $api;
    protected $converter;
    protected $functionNamespacePrefix = 'TRBusinessConnector\\ExchangeInterface\\ExchangeFunction\\';
    protected $functionRepository = array();
    protected $status;
    
    
    public static function getInstance() {
        
        static $instance;
        
        if($instance === null) {
            $instance = new self();
        }
        return $instance;
    }
    
    private function __construct() {
        
        global $sugar_config;
        
        $this->api = new \TRBusinessConnector\ExchangeInterface\ExchangeApi\EwsApi();
        $test = new \EWSType_SubscribeType();
        $this->converter = new \TRBusinessConnector\ExchangeInterface\FormatConverter\ExchangeFormatConverter();
        if(isset($sugar_config['TRExchangeInterface']['log_level'])) {
            $logLevel = $sugar_config['TRExchangeInterface']['log_level'];
        } else {
            $logLevel = \Psr\Log\LogLevel::ERROR;
        }
        $this->logger = new \Katzgrau\KLogger\Logger($sugar_config['log_dir'] . DIRECTORY_SEPARATOR . 'TRExchangeSyncLogs/ExchangeInterface', $logLevel);
    }
    
    public function syncContactsFolderItems($server, $impersonatedUser, $syncState) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'SyncFolderItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeContact',
                'mappingRetrieveFunctionName' => 'getContactRetrieveMapping',
                'exchangeResponseProperty' => 'Contact',
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::CONTACTS
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function findSyncContactItems($server, $impersonatedUser, $baseFolderDistinguishedId) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function findAllFoldersInMailbox($server, $mailbox) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function updateContacts($server, $mailbox,$contacts) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'UpdateItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeContact',
                'mappingRetrieveFunctionName' => 'getContactUpdateModelMapping',
                'exchangeResponseProperty' => 'Contact',
                'changeRequestAdditionalProperties' => array(),
                'exchangeItemClass' => 'EWSType_ContactItemType'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function createContacts($server, $mailbox, $folder, $contacts) {
        
        $setFileAs = function($item) {
            $item->FileAsMapping = \EWSType_FileAsMappingType::LAST_COMMA_FIRST;
        };
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'CreateItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeContact',
                'mappingRetrieveFunctionName' => 'getContactCreateModelMapping',
                'exchangeResponseProperty' => 'Contact',
                'createRequestAdditionalProperties' => array(),
                'exchangeItemClass' => 'EWSType_ContactItemType',                
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::CONTACTS,
                'exchangeItemCreatedCallback' => $setFileAs
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function getContacts($server, $mailbox, $folder, $contacts) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'GetItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeContact',
                'mappingRetrieveFunctionName' => 'getContactRetrieveMapping',
                'exchangeResponseProperty' => 'Contact'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function findContacts($server, $mailbox, $offset = 0) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'FindItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeContact',
                'mappingRetrieveFunctionName' => 'getContactRetrieveMapping',
                'exchangeResponseProperty' => 'Contact',                
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::CONTACTS              
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function deleteContacts($server, $mailbox,$items) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'DeleteItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeContact',
                'exchangeResponseProperty' => 'Contact',
                'deleteRequestAdditionalProperties' => array(),
                'exchangeItemClass' => 'EWSType_ContactItemType'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
        
    public function syncTasksFolderItems($server, $impersonatedUser, $syncState) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'SyncFolderItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeTask',
                'mappingRetrieveFunctionName' => 'getTaskRetrieveMapping',
                'exchangeResponseProperty' => 'Task',
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::TASKS
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }

    public function updateTasks($server, $mailbox,$contacts) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'UpdateItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeTask',
                'mappingRetrieveFunctionName' => 'getTaskUpdateModelMapping',
                'exchangeResponseProperty' => 'Task',
                'changeRequestAdditionalProperties' => array(),
                'exchangeItemClass' => 'EWSType_TaskType'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function createTasks($server, $mailbox, $folder, $contacts) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'CreateItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeTask',
                'mappingRetrieveFunctionName' => 'getTaskCreateModelMapping',
                'exchangeResponseProperty' => 'Task',
                'createRequestAdditionalProperties' => array(),
                'exchangeItemClass' => 'EWSType_TaskType',                
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::TASKS
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function getTasks($server, $mailbox, $folder, $tasks) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'GetItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeTask',
                'mappingRetrieveFunctionName' => 'getTaskRetrieveMapping',
                'exchangeResponseProperty' => 'Task'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function findTasks($server, $mailbox, $offset = 0) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'FindItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeTask',
                'mappingRetrieveFunctionName' => 'getTaskRetrieveMapping',
                'exchangeResponseProperty' => 'Task',                
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::TASKS               
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function deleteTasks($server, $mailbox,$items) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'DeleteItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeTask',
                'exchangeResponseProperty' => 'Task',
                'deleteRequestAdditionalProperties' => array(
                    'AffectedTaskOccurrences' => 'AllOccurrences'
                ),
                'exchangeItemClass' => 'EWSType_TaskType'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
        
    public function syncCalendarItemsFolderItems($server, $impersonatedUser, $syncState) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'SyncFolderItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeCalendarItem',
                'mappingRetrieveFunctionName' => 'getCalendarItemRetrieveMapping',
                'exchangeResponseProperty' => 'CalendarItem',
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::CALENDAR
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }

    public function updateCalendarItems($server, $mailbox,$contacts) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'UpdateItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeCalendarItem',
                'mappingRetrieveFunctionName' => 'getCalendarItemUpdateModelMapping',
                'exchangeResponseProperty' => 'CalendarItem',
                'changeRequestAdditionalProperties' => array(
                    'SendMeetingInvitationsOrCancellations' => \EWSType_CalendarItemUpdateOperationType::SEND_TO_NONE
                ),
                'exchangeItemClass' => 'EWSType_CalendarItemType'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function createCalendarItems($server, $mailbox, $folder, $contacts) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'CreateItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeCalendarItem',
                'mappingRetrieveFunctionName' => 'getCalendarItemCreateModelMapping',
                'exchangeResponseProperty' => 'CalendarItem',
                'createRequestAdditionalProperties' => array(
                    'SendMeetingInvitations' => \EWSType_CalendarItemCreateOrDeleteOperationType::SEND_TO_NONE
                ),
                'exchangeItemClass' => 'EWSType_CalendarItemType',                
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::CALENDAR
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function getCalendarItems($server, $mailbox, $folder, $tasks) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'GetItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeCalendarItem',
                'mappingRetrieveFunctionName' => 'getCalendarItemRetrieveMapping',
                'exchangeResponseProperty' => 'CalendarItem'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function findCalendarItems($server, $mailbox, $offset = 0) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'FindItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeCalendarItem',
                'mappingRetrieveFunctionName' => 'getCalendarItemRetrieveMapping',
                'exchangeResponseProperty' => 'CalendarItem',                
                'distinguishedFolderName' => \EWSType_DistinguishedFolderIdNameType::CALENDAR                
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
    
    public function deleteCalendarItems($server, $mailbox,$items) {
        
        $functionDescription = array(
            'functionName' => __FUNCTION__,
            'functionClassName' => 'DeleteItems',
            'injectedProperties' => array(
                'modelClass' => 'TRBusinessConnector\Model\ExchangeCalendarItem',
                'exchangeResponseProperty' => 'CalendarItem',
                'deleteRequestAdditionalProperties' => array(
                    'SendMeetingCancellations' => \EWSType_CalendarItemUpdateOperationType::SEND_TO_NONE
                ),
                'exchangeItemClass' => 'EWSType_CalendarItemType'
            )
        );
        return $this->callInterfaceFunction($functionDescription, func_get_args());
    }
        
    protected function getFunctionObject($functionObjectDescription) {
        
        if(is_string($functionObjectDescription)) {
            $functionName = ucfirst($functionObjectDescription);
            $functionClassName = $functionName;
            $injectedProperties = array();
        } else {
            list($functionName, $functionClassName, $injectedProperties) = array_values($functionObjectDescription);
        }
        if(array_key_exists($functionName, $this->functionRepository)) {
            $functionObject = $this->functionRepository[$functionName];
        } else {
            $namespacedFunctionClassName = $this->functionNamespacePrefix . $functionClassName;
            $functionObject = new $namespacedFunctionClassName($this->api, $this->converter, $this->logger, $injectedProperties);
            $this->functionRepository[$functionName] = $functionObject;
        }
        return $functionObject;
    }
    
    public function callInterfaceFunction($description, $arguments) {
        
        global $sugar_config;
        
        $functionObject = $this->getFunctionObject($description);
        $server = array_shift($arguments);
        if(!$server) {
            if (is_array($sugar_config['TRExchangeInterface']['server'])) {
                $server = $sugar_config['TRExchangeInterface']['server'][0];
            } else {
                $server = $sugar_config['TRExchangeInterface']['server'];
            }
        }
        $this->api->setServer($server);
        return $functionObject->call($arguments);        
    }
        
    public function emptyFolder($server, $mailbox, $distinguishedFolderId) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
    
    public function exportItems($server, $mailbox, $items) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }

    public function uploadItems($server, $mailbox, $distinguishedFolderId, $items) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }

    public function getFolders($server, $mailbox, $distinguishedFolderId) {
        return $this->callInterfaceFunction(__FUNCTION__, func_get_args());
    }
}
