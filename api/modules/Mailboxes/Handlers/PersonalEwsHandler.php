<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use SpiceCRM\includes\SpiceCRMExchange\ModuleHandlers\SpiceCRMExchangeEmails;
use SpiceCRM\includes\SpiceCRMExchange\SpiceCRMExchangeConnector;
use SpiceCRM\modules\Mailboxes\Mailbox;
use SpiceCRM\includes\authentication\AuthenticationController;

class PersonalEwsHandler extends TransportHandler
{
    private $ewsEmail;

    public function __construct(Mailbox $mailbox) {
        parent::__construct($mailbox);
    }

    /**
     * returns the mailbox name
     *
     * @return string
     */
    public function getMailboxName(){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        return "Exchange ({$current_user->user_name})";
    }

    protected function initTransportHandler() {
        return true;
    }

    public function testConnection($testEmail) {
        return ['result' => true];
    }

    protected function composeEmail($email) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $this->ewsEmail = new SpiceCRMExchangeEmails($current_user, $email, $this->mailbox);
        return $this->ewsEmail->composeEmail($email);
    }

    protected function dispatch($message) {
        return $this->ewsEmail->dispatch($message);
    }

    public function checkConnection() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $connector = new SpiceCRMExchangeConnector($current_user);
        return $connector->checkConnection();
    }
}
