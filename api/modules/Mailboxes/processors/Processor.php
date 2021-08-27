<?php
namespace SpiceCRM\modules\Mailboxes\processors;

use SpiceCRM\modules\Emails\Email;

abstract class Processor {
    public $email;

    public function __construct(Email $email) {
        $this->email = $email;
    }
}
