<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use SpiceCRM\modules\Emails\Email;
use SpiceCRM\includes\TimeDate;
use Exception;
use SpiceCRM\includes\Logger\SpiceLogger;
use SpiceCRM\modules\Mailboxes\MailboxLogTrait;
use SpiceCRM\modules\Mailboxes\Mailbox;
use SpiceCRM\extensions\modules\TextMessages\TextMessage;

abstract class TransportHandler
{
    use MailboxLogTrait;

    protected $mailbox;
    protected $transport_handler;
    protected $logger;
    protected $incoming_settings = [];
    protected $outgoing_settings = [];

    public function __construct(Mailbox $mailbox)
    {
        $this->mailbox = $mailbox;

        $this->initTransportHandler();

        $this->logger = new SpiceLogger();
    }

    /**
     * Initializes the transport handler.
     * It usually involves setting various credentials, urls, api keys, etc needed to communicate.
     * In some cases it also initializes additional classes from libraries that handle the communication.
     *
     * @return mixed
     */
    abstract protected function initTransportHandler();

    /**
     * Performs a check on the connection to the message (email/text message) server.
     * It usually involves sending a test message.
     * Some APIs may have other possibilities to check if the connection can be established.
     *
     * @param $testEmail
     * @return mixed
     */
    abstract public function testConnection($testEmail);

    public function sendMail($email)
    {
        $timedate = TimeDate::getInstance();

        if ($this->mailbox->active == false) {
            return [
                'result'  => 'false',
                'message' => 'Message not sent. Mailbox inactive.',
            ];
        }

        if ($this->mailbox->mailbox_header != '') {
            $email->body = html_entity_decode($this->mailbox->mailbox_header) . $email->body;
        }

        if ($this->mailbox->mailbox_footer != '') {
            $email->body .= html_entity_decode($this->mailbox->mailbox_footer);
        }

        if ($this->mailbox->stylesheet != '') {
            $email->addStylesheet($this->mailbox->stylesheet);
        }

        $message = $this->composeEmail($email);

        // set the date sent
        $email->date_sent = $timedate->nowDb();

        return $this->dispatch($message);
    }

    /**
     * Maps an Email Bean into a format needed by a given transport handler.
     *
     * @param $email
     * @return mixed
     */
    abstract protected function composeEmail($email);

    /**
     * Handles the sending of a message that is already in a format needed by a given transport handler.
     *
     * @param $message
     * @return mixed
     */
    abstract protected function dispatch($message);

    /**
     * checkConfiguration
     *
     * Check existence of configuration settings
     *
     * @param $settings
     * @return array
     */
    protected function checkConfiguration($settings) {
        $response = [
            'result'  => true,
            'missing' => [],
        ];

        foreach ($settings as $setting) {
            if (!isset($this->mailbox->$setting) || $this->mailbox->$setting == '') {
                $response['result'] = false;
                array_push($response['missing'], $setting);
                continue;
            }
        }

        return $response;
    }

    protected function checkEmailClass($object) {
        if (!($object instanceof Email)) {
            throw new Exception('Email is not of Email class.');
        }
    }

    protected function checkTextMessageClass($object) {
        if (!($object instanceof TextMessage)) {
            throw new Exception('TextMessage is not of TextMessage class.');
        }
    }
}
