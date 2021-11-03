<?php

namespace SpiceCRM\modules\EmailAddresses\schedulerjobtasks;

use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\extensions\include\Mailgun\Mailgun;
use SpiceCRM\includes\ErrorHandlers\Exception;

class EmailAddressesJobTasks
{
    /**
     * clean all email addresses from extras
     */
    public function cleanEmailAddresses()
    {
        $emailAddresses = BeanFactory::getBean('EmailAddresses');

        $list = $emailAddresses->get_full_list('', 'email_address LIKE "%<%"');
        foreach ($list['list'] as $item) {
            try {
                $item->save();
            } catch (Exception $exception) {
                continue;
            }
        }

        return true;
    }

    public function mailgunValidateAllEmailAddresses(){
        $mailgun = new Mailgun();
        $mailgun->validateAllEmailAddresses();

        return true;
    }
}