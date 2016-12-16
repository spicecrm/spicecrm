<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeApi;

require_once 'modules/TRExchangeConnector/ExchangeInterface/ExchangeApi/php-ews/ExchangeWebServices.php';

class EwsApi {
    
    private $ews;
    private $loginData;
    
    public function __construct() {
        
        global $sugar_config;
        
        $this->loginData = array(
            'user' => $sugar_config['TRExchangeInterface']['username'],
            'password' => blowfishDecode(blowfishGetKey('encrypt_field'), $sugar_config['TRExchangeInterface']['password']),
        );
        $this->ews = new \ExchangeWebServices('',
                $this->loginData['user'],
                $this->loginData['password'],
                \ExchangeWebServices::VERSION_2010_SP2);

        $this->prepareEwsTypeClassLoading();

    }
    
    private function prepareEwsTypeClassLoading() {
        
        require_once __DIR__ . DIRECTORY_SEPARATOR . 'php-ews' . DIRECTORY_SEPARATOR . 'EWSType.php';
        require_once __DIR__ . DIRECTORY_SEPARATOR . 'php-ews' . DIRECTORY_SEPARATOR . 'NTLMSoapClient.php';        
        require_once __DIR__ . DIRECTORY_SEPARATOR . 'php-ews' . DIRECTORY_SEPARATOR . 'NTLMSoapClient' . DIRECTORY_SEPARATOR . 'Exchange.php';        
        spl_autoload_register(function($className) {

            $prefix = 'EWSType_';
            $len = strlen($prefix);
            if (strncmp($prefix, $className, $len) !== 0) {
                return false;
            }
            $basePath = __DIR__ . DIRECTORY_SEPARATOR . 'php-ews' . DIRECTORY_SEPARATOR . 'EWSType' . DIRECTORY_SEPARATOR;
            $relativeClass = substr($className, $len);
            $file = $basePath . str_replace('\\', DIRECTORY_SEPARATOR, $relativeClass) . '.php';
            return (file_exists($file) ? require $file : false);
        });        
    }
    
    public function testSubscription($subscription) {
        
        $ei = new \EWSType_ExchangeImpersonationType();
        $sid = new \EWSType_ConnectingSIDType();
        $sid->PrincipalName = 'thomaskerle@devexchange.local';
        $ei->ConnectingSID = $sid;
        
        $this->ews->setImpersonation($ei);
        $result = $this->ews->Subscribe($subscription);
        return $result;
    }
    
    public function testGetEvents($getEvents) {
        
        $ei = new \EWSType_ExchangeImpersonationType();
        $sid = new \EWSType_ConnectingSIDType();
        $sid->PrincipalName = 'thomaskerle@devexchange.local';
        $ei->ConnectingSID = $sid;
        
        $this->ews->setImpersonation($ei);
        $result = $this->ews->GetEvents($getEvents);
        return $result;
    }
    
    public function testSyncFolder($syncState) {
        
        $this->setImpersonation('thomaskerle@devexchange.local');
        
        $syncFolderRequest = new \EWSType_SyncFolderItemsType();
        $syncFolderId = new \EWSType_TargetFolderIdType();
        $distinguishedFolderId = new \EWSType_DistinguishedFolderIdType();
        $distinguishedFolderId->Id = \EWSType_DistinguishedFolderIdNameType::CONTACTS;
        $syncFolderId->DistinguishedFolderId = $distinguishedFolderId;
        $syncFolderRequest->SyncFolderId = $syncFolderId;
        $itemShape = new \EWSType_ItemResponseShapeType();

        
        $itemShape->BaseShape = \EWSType_DefaultShapeNamesType::DEFAULT_PROPERTIES;
        
        $extendedDistinguishedPropertySetField = new \EWSType_PathToExtendedFieldType();
        $extendedDistinguishedPropertySetField->DistinguishedPropertySetId = "PublicStrings";
        $extendedDistinguishedPropertySetField->PropertyName = "SugarGUID";
        $extendedDistinguishedPropertySetField->PropertyType = "String";
        $itemShape->AdditionalProperties->ExtendedFieldURI = array($extendedDistinguishedPropertySetField);
        
        $modifiedDate = new \EWSType_PathToUnindexedFieldType();
        $modifiedDate->FieldURI = "item:LastModifiedTime";
        $itemShape->AdditionalProperties->FieldURI = array($modifiedDate);
        
        $modifiedUser = new \EWSType_PathToUnindexedFieldType();
        $modifiedUser->FieldURI = "item:LastModifiedName";
        
        $itemShape->AdditionalProperties->FieldURI = array(
            $modifiedDate,
            $modifiedUser
        );        
                
        $syncFolderRequest->ItemShape = $itemShape;
        $syncFolderRequest->MaxChangesReturned = 1;
        
        if(!empty($syncState)) {
            $syncFolderRequest->SyncState = $syncState;
        }
        
        $result = $this->ews->SyncFolderItems($syncFolderRequest);        
        
        return $result;
    }
    
    public function setImpersonation($principalName) {
        
        $ei = new \EWSType_ExchangeImpersonationType();
        $sid = new \EWSType_ConnectingSIDType();
//        $sid->PrincipalName = 'thomaskerle@devexchange.local';
        $sid->PrincipalName = $principalName;
        $ei->ConnectingSID = $sid;
        
        $this->ews->setImpersonation($ei);        
    }
    
    public function callFunction($functionName, $parameters) {
        
        $result = $this->ews->{$functionName}($parameters);                
        return $result;

    }

    public function __destruct() {

//        echo "Close connection" . "<br>";
//        if($this->connection) {
//            @saprfc_close($this->connection);
//        }
//        echo "Connection closed" . "<br>";
    }
    // set Status and optionally show Errors
    private function setStatus($status,$statusInfos) {
        $this->status=$status;
        $this->statusInfos=$statusInfos;
        return $this->status;
    }
    
    public function getStatus() {
        return $this->status;
    }

    public function getStatusText() {

        return $this->statusInfo;

    }
    
    public function setServer($server) {
        
        return $this->ews->setServer($server);
    }
}
