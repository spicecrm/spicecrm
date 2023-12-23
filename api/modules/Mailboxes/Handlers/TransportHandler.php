<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Mailboxes\Handlers;

use DOMDocument;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\includes\TimeDate;
use Exception;
use SpiceCRM\includes\Logger\SpiceLogger;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;
use SpiceCRM\modules\EmailTrackingActions\EmailTracking;
use SpiceCRM\modules\Mailboxes\MailboxLogTrait;
use SpiceCRM\modules\Mailboxes\Mailbox;
use SpiceCRM\extensions\modules\TextMessages\TextMessage;

class DispatchResponse {
   public bool $result = false;

   public function __construct(bool $result, array $optionalParams = [])
   {
       $this->result = $result;
       foreach ($optionalParams as $property => $value) $this->$property = $value;
   }
}

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
     * Gets username (email address) defined in the mailbox
     * @return string|null
     */
    abstract public function getUsername(): ?string;

    /**
     * Performs a check on the connection to the message (email/text message) server.
     * It usually involves sending a test message.
     * Some APIs may have other possibilities to check if the connection can be established.
     *
     * @param $testEmail
     * @return mixed
     */
    abstract public function testConnection($testEmail);

    public function sendMail(Email $email, $noSecurityCheck = false )
    {
        $timedate = TimeDate::getInstance();

        if ($this->mailbox->active == false) {
            return [
                'result'  => false,
                'message' => 'Message not sent. Mailbox inactive.',
            ];
        }

        /** @var EmailTemplate $emailTemplate */
        $emailTemplate = BeanFactory::newBean('EmailTemplates');

        # add the header to the email content
        if (!empty($this->mailbox->mailbox_header)) {

            $parsedHtml = $this->parseTemplateBodyOnly($emailTemplate, $email, $this->mailbox->mailbox_header);

            if (strpos($email->body, '<body>')) {
                $email->body = str_replace('<body>', "<body><header>{$parsedHtml}</header>", $email->body);
            } else {
                $email->body = "<header>{$parsedHtml}</header>" . $email->body;
            }
        }

        # add the footer to the email content
        if (!empty($this->mailbox->mailbox_footer)) {

            $parsedHtml = $this->parseTemplateBodyOnly($emailTemplate, $email, $this->mailbox->mailbox_footer);

            if (strpos($email->body, '</body>')) {
                $email->body = str_replace('</body>', "<footer>{$parsedHtml}</footer></body>", $email->body);
            } else {
                $email->body = "<footer>{$parsedHtml}</footer>" . $email->body;
            }
        }

        if ($this->mailbox->stylesheet != '') {
            $email->addStylesheet($this->mailbox->stylesheet);
        }
        $message = $this->composeEmail($email, $noSecurityCheck );

        // set the date sent
        $email->date_sent = $timedate->nowDb();

        return (array) $this->dispatch( $message );
    }

    /**
     * parse template body only
     * @param EmailTemplate $emailTemplate
     * @param Email $email
     * @param string $content
     * @return mixed
     */
    private function parseTemplateBodyOnly(EmailTemplate $emailTemplate, Email $email, string $content)
    {
        $emailTemplate->body_html = $content;
        $parsedContent = $emailTemplate->parse($email)['body_html'];
        $doc = new DOMDocument();
        $doc->loadHTML($parsedContent);

        # remove <!DOCTYPE
        $doc->removeChild($doc->doctype);

        # remove <html><body></body></html>
        $doc->replaceChild($doc->firstChild->firstChild->firstChild, $doc->firstChild);

        return $doc->saveHTML();
    }

    /**
     * Maps an Email Bean into a format needed by a given transport handler.
     *
     * @param $email
     * @return mixed
     */
    abstract protected function composeEmail($email);

    /**
     * returns the biody with a tracking pixel if the mailbox sets it
     *
     * @param Email $email
     * @return mixed|string
     */
    protected function trackedBody($email){
        $body = $email->body;
        [$parentType, $parentId] = $email->getTrackingParentData();
        if($this->mailbox->track_mailbox){
            $pixel = EmailTracking::getTrackingPixel("ParentType:$parentType:ParentId:$parentId");
            $body = EmailTracking::attachElementToBody($pixel, $body);
        }

        # prevent misinterpretation of the style tag css class selectors
        return str_replace(["\n.", "\r."], ["\n .", "\r ."], $body);
    }

    /**
     * Handles the sending of a message that is already in a format needed by a given transport handler.
     *
     * @param $message
     * @return DispatchResponse
     */
    abstract protected function dispatch($message): DispatchResponse;

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

        // set the setting values
        if($mailboxSettings = json_decode($this->mailbox->settings, true)){
            foreach($mailboxSettings as $settingKey => $settingValue){
                $this->mailbox->$settingKey = $settingValue;
            }
        }

        // check required parameters
        foreach ($settings as $setting) {
            if (!isset($this->mailbox->$setting) || empty($this->mailbox->$setting)) {
                $response['result'] = false;
                array_push($response['missing'], $setting);
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

    /**
     * Is a White List defined?
     * @return boolean
     */
    public function whiteListing(): bool
    {
        return isset( trim( $this->mailbox->whitelist )[0] );
    }

    /**
     * Can handle *one* address (as string) or a *list* of addresses (as array).
     * @param $addressOrAddresses
     * @return boolean
     */
    protected function isWhiteListed( string $destinationAddress ): bool
    {
        # Parse the (comma separated) content of the field "whitelist" and build an array
        $whiteAddresses = empty( $this->mailbox->whitelist ) ? [] : explode(',', $this->mailbox->whitelist );
        # Check, if the destination address is one of the addresses in the array (ignoring space characters in case it is a phone number) and return true;
        foreach ( $whiteAddresses as $address ) {
            if ( mb_strtolower( str_replace(' ', '', $address )) === mb_strtolower( str_replace( ' ', '', $destinationAddress ))) return true;
        }
        return false;
    }
}
