<?php

namespace SpiceCRM\includes\marketing\api\controllers;


use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\Emails\Email;

class MarketingAutomationController
{
    /**
     * handles logging of email opening
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function handleTrackingPixel(Request $req, Response $res, array $args): Response
    {
        $decrypted = $this->decryptBlowfish(base64_decode($args['key']));

        if (!$decrypted) {
            throw new BadRequestException('Failed to decrypt key');
        }

        $chunks = array_chunk(preg_split('/(:|:)/', $decrypted), 2);
        $data = array_combine(array_column($chunks, 0), array_column($chunks, 1));
        $this->logTrackingAction($data, 'opened');

        return $res->withJson(true);
    }

    /** handles logging of a clicked link
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function handleTrackingUrl(Request $req, Response $res, array $args): Response
    {
        $decrypted = $this->decryptBlowfish(base64_decode($args['key']));

        if (!$decrypted) {
            throw new BadRequestException('Failed to decrypt key');
        }

        $chunks = array_chunk(preg_split('/(:|:)/', $decrypted), 2);
        $data = array_combine(array_column($chunks, 0), array_column($chunks, 1));

        $this->logTrackingAction($data, 'clicked');
        if(array_key_exists('Event', $data) && !empty($data['Event'])){
            //Email::handleEvent($data[4]);
        }
        return $res->withJson(true);
    }

    /**
     * sets the optin status of a recipient's email address to opted in
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function handleSubscription(Request $req, Response $res, array $args): Response
    {
        $decrypted = $this->decryptBlowfish(base64_decode($args['key']));

        if (!$decrypted) {
            throw new BadRequestException('Failed to decrypt key');
        }

        $data = explode(':', $decrypted);
        $recipient = BeanFactory::getBean($data[0], $data[1]);
        $emailAddresses = $recipient->get_linked_beans('email_addresses');
        foreach ($emailAddresses as $address) {
            if ($address->primary_address != 1) continue;
            if(!empty($address->opt_in_status)) {
                throw new BadRequestException('Erroneous email opt-in status');
            } else {
                if(EmailAddress::setOptInStatus($recipient, $address, 'opted_in')) {
                    return $res->withJson(true);
                } else {
                    throw new BadRequestException('could not set the opt-in status for this address');
                }

            }
        }

        return $res->withJson(true);
    }

    /**
     * sets the optin status of a recipient's email address to opted out
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function handleUnsubscription(Request $req, Response $res, array $args): Response
    {
        $decrypted = $this->decryptBlowfish(base64_decode($args['key']));

        if (!$decrypted) {
            throw new BadRequestException('Failed to decrypt key');
        }

        $data = explode(':', $decrypted);
        $recipient = BeanFactory::getBean($data[0], $data[1]);
        $emailAddresses = $recipient->get_linked_beans('email_addresses');
        foreach ($emailAddresses as $address) {
            if ($address->primary_address != 1) continue;
            if(!empty($address->opt_in_status)) {
                throw new BadRequestException('Erroneous email opt-in status');
            } else {
                if(EmailAddress::setOptInStatus($recipient, $address, 'opted_out')) {
                    return $res->withJson(true);
                } else {
                    throw new BadRequestException('could not set the opt-in status for this address');
                }

            }
        }

        return $res->withJson(true);
    }

    /**
     * decrypts the key
     * @param $key
     */
    private function decryptBlowfish($key)
    {
        $blowfishkey = '2fs5uhnjcnpxcpg9';
        $method = 'blowfish';
        return openssl_decrypt($key, $method, $blowfishkey);
    }

    /**
     * saves the tracking action, only if it's not already saved
     * @param $data
     * @param $action
     */
    private function logTrackingAction($data, $action)
    {
        $trackedAction = BeanFactory::getBean('EmailTrackingActions');
        if (!$trackedAction->retrieve_by_string_fields(['parent_type' => 'Emails', 'parent_id' => $data['Emails'], 'action' => $action], true, false)) {
            $trackedAction = BeanFactory::newBean('EmailTrackingActions');
            $trackedAction->parent_type = 'Emails';
            $trackedAction->parent_id = $data['Emails'];
            $trackedAction->action = $action;
            //check if the link is here
            if(array_key_exists('TrackingLinks', $data) && !empty($data['TrackingLinks'])) {
                $trackedAction->trackinglink_id = $data['TrackingLinks'];
            }
            //register event
            if(array_key_exists('Event', $data) && !empty($data['Event'])) {
                $trackedAction->event = $data['Event'];
            }
            $trackedAction->save();
        }


    }


}