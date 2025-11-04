<?php

namespace SpiceCRM\modules\AccountVATIDs;

use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\modules\Accounts\AccountVIESCheck;

class AccountVATID extends SpiceBean
{

    public function validate(){
        $response = (new AccountVIESCheck())->checkUID($this->name);
        if(!$response){
            $this->vatid_status = 'error';
        } else {
            $this->vatid_status = $response['valid'] ? 'valid' : 'invalid';
            $this->verification_details = json_encode($response);
        }

        return $this;
    }
}