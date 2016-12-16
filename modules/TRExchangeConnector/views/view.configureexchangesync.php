<?php

/* 
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

class TRExchangeConnectorViewConfigureexchangesync extends SugarView {
    
    public function display() {
        return $this->ss->display('modules/TRExchangeConnector/tpls/configureexchangesync.tpl');
    }
}