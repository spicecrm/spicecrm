<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/


namespace SpiceCRM\modules\Mailboxes\Handlers;

use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\includes\TimeDate;
use Exception;
use SpiceCRM\includes\Logger\SpiceLogger;
use SpiceCRM\modules\EmailTrackingActions\EmailTracking;
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

    public function sendMail($email, $noSecurityCheck = false )
    {
        $timedate = TimeDate::getInstance();

        if ($this->mailbox->active == false) {
            return [
                'result'  => false,
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
        $message = $this->composeEmail($email, $noSecurityCheck );

        // set the date sent
        $email->date_sent = $timedate->nowDb();

        return $this->dispatch( $message );
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

        if($this->mailbox->unsubscribe_header) {
            $trackData = EmailTracking::encodeTrackingID("ParentType:$parentType:ParentId:$parentId");
            $unsubUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.unsubscribeurl'));
            $body = EmailTracking::attachElementToBody("<a href=\"{$unsubUrl}\">unsubscribe</a>", $body);
        }

        # prevent misinterpretation of the style tag css class selectors
        return str_replace(["\n.", "\r."], ["\n .", "\r ."], $body);
    }

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
        # Check, if the destination address is one of the addresses in the array (ignoring space characters) and return true;
        foreach ( $whiteAddresses as $address ) {
            if ( str_replace(' ', '', $address ) === str_replace( ' ', '', $destinationAddress )) return true;
        }
        return false;
    }
}
