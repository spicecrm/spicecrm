<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\ExchangeInterface\ExchangeFunction;

class ExportItems extends ExchangeBaseFunction {
    
    protected $exchangeFunctionName = 'ExportItems';
    protected $itemsToExport = array();
    
    public function createParameters($callParameters) {
        
        $parameters = array();
        list($targetMailbox, $itemsToExport) = $callParameters;
        $this->itemsToExport = $itemsToExport;        
        $useImpersonation = true;
        
        $exportItemRequest = new \stdClass();
        $exportItemRequest->ItemIds = array_map(array($this, 'createItemIdFromModel'), $itemsToExport);
        
        if($useImpersonation) {
            $parameters['impersonatedUser'] = $targetMailbox;
        } else {
            $parameters['impersonatedUser'] = NULL;
        }
        $parameters['request'] = $exportItemRequest;
        return $parameters;
    }
    
    protected function retrieveResults($result) {
        
        return array_map(null, $this->itemsToExport, $result->ResponseMessages->ExportItemsResponseMessage);
    }
    
}
