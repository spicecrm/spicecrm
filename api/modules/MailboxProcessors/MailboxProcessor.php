<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\MailboxProcessors;

use SpiceCRM\data\SpiceBean;

/**
 * this class is necessary to ensure the use of mailbox_processors defined in vardefs as a table name
 * Letting automatic SpiceBean logic take over would result in this bean using table mailboxprocessors which is not defined
 */
class MailboxProcessor extends SpiceBean {


}