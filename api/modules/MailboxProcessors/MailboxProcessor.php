<?php

namespace SpiceCRM\modules\MailboxProcessors;

use SpiceCRM\data\SugarBean;

/**
 * this class is necessary to ensure the use of mailbox_processors defined in vardefs as a table name
 * Letting automatic SugarBean logic take over would result in this bean using table mailboxprocessors which is not defined
 */
class MailboxProcessor extends SugarBean {
    public $module_dir  = 'MailboxProcessors';
    public $table_name  = 'mailbox_processors';
    public $object_name = 'MailboxProcessor';
}