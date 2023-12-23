<?php

namespace SpiceCRM\modules\ProspectLists;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;

class ProspectListHooks {
    public function addToUnsubscribeGroup(&$bean, $event, $arguments){
// todo make a check if the person is already in the unsubscribe list or not  if yes remove him from the list
    }
}