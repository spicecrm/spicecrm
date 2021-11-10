<?php

namespace SpiceCRM\modules\EmailAddresses\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;

class EmailAddressesJobTasks
{
    /**
     * clean all email addresses from extras
     */
    public function cleanEmailAddresses()
    {
        $emailAddresses = BeanFactory::getBean('EmailAddresses');

        $list = $emailAddresses->get_list('', 'email_address LIKE "%<%"');
        foreach ($list['list'] as $item) {
            try {
                $item->save();
            } catch (Exception $exception) {
                continue;
            }
        }

        return true;
    }
}