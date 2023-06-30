<?php

namespace SpiceCRM\includes\marketing\api\controllers;


use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
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

        return $res->withJson(true);
    }

    /**
     * handle marketing action
     * @throws BadRequestException
     * @throws NotFoundException
     */
    public function handleMarketingAction(Request $req, Response $res, array $args): Response
    {
        $decrypted = $this->decryptBlowfish(base64_decode($args['key']));

        if (!$decrypted) {
            throw new BadRequestException('Failed to decrypt key');
        }
        $chunks = array_chunk(preg_split('/(:|:)/', $decrypted), 2);
        $data = array_combine(array_column($chunks, 0), array_column($chunks, 1));

        if(!array_key_exists('MarketingActions', $data) || empty($data['MarketingActions'])) {
            throw new BadRequestException('Missing url params');
        }

        /** @var Email $email */
        $email = BeanFactory::getBean('Emails', $data['Emails']);
        /** @var SpiceBean $marketingAction */
        $marketingAction = BeanFactory::getBean('MarketingActions', $data['MarketingActions']);

        if (!$email) {
            throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $data['Emails'], 'module' => 'Emails']);
        }
        switch($marketingAction->name) {
            case "optin":
                $this->handleOptin($email);
                break;
            case "optout":
                $this->handleUnsubscription($email);
                break;
            default:
                $email->handleEvent($marketingAction->name);
                break;
        }


        return $res->withJson(['redirectUrl' => $this->getRedirectUrl($marketingAction, $email->id)]);
    }

    /**
     * generate redirect url from the marketing action
     * @param SpiceBean $marketingAction
     * @param string $emailId
     * @return string
     */
    private function getRedirectUrl(SpiceBean $marketingAction, string $emailId): string
    {
        switch ($marketingAction->redirect_type) {
            case 'landing_page':
                $landingPageId = $marketingAction->redirect_url;
                $url = SpiceConfig::getInstance()->config['landingpage']['base_url'];
                return "$url/#/0/$landingPageId/$emailId";
            case 'url':
            default:
            return $marketingAction->redirect_url;
        }
    }

    /**
     * sets the optin status of a recipient's email address to opted in
     * @param $email SpiceBean
     * @return bool
     * @throws BadRequestException
     */
    private function handleOptin($email): bool
    {
        $recipient = BeanFactory::getBean($email->parent_type, $email->parent_id);
        $emailAddresses = $recipient->get_linked_beans('email_addresses');
        foreach ($emailAddresses as $address) {
            if ($address->primary_address != 1) continue;
            if(empty($address->opt_in_status)) {
                throw new BadRequestException('Erroneous email opt-in status');
            } else {
                if(EmailAddress::setOptInStatus($recipient, $address, 'opted_in')) {
                    return true;
                } else {
                    throw new BadRequestException('could not set the opt-in status for this address');
                }

            }
        }

        return true;
    }

    /**
     * sets the optin status of a recipient's email address to opted out
     * @param $email SpiceBean
     * @return bool
     * @throws BadRequestException
     */
    private function handleUnsubscription($email): bool
    {
        $recipient = BeanFactory::getBean($email->parent_type, $email->parent_id);
        $emailAddresses = $recipient->get_linked_beans('email_addresses');
        foreach ($emailAddresses as $address) {
            if ($address->primary_address != 1) continue;
            if(empty($address->opt_in_status)) {
                throw new BadRequestException('Erroneous email opt-in status');
            } else {
                if(EmailAddress::setOptInStatus($recipient, $address, 'opted_out')) {
                    return true;
                } else {
                    throw new BadRequestException('could not set the opt-in status for this address');
                }

            }
        }

        return true;
    }

    /**
     * sets the optin status of the provided email address to 'pending'
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function handleSubscription(Request $req, Response $res, array $args):Response {
        $body = $req->getParsedBody();
        $beanAndAddress = $this->findBeanByPrimaryEmailAddress($body['emailAddress']);
        # what if there is no Bean?
        if ($beanAndAddress['bean']) {
            EmailAddress::setOptInStatus($beanAndAddress['bean'], $beanAndAddress['emailAddress'], 'pending');
        }

        return $res->withJson(['success' => true]);
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
            if(array_key_exists('EmailTrackingLinks', $data) && !empty($data['EmailTrackingLinks'])) {
                $trackedAction->emailtrackinglink_id = $data['EmailTrackingLinks'];
            }

            $trackedAction->save();
        }


    }

    /**
     * finds the bean by searching the primary email address in the email-bean relationship table
     * Delivers an array containing the found bean and the email address instances
     * @param $emailAddress string
     * @return array
     */
    private function findBeanByPrimaryEmailAddress($emailAddress): array {
        $db = DBManagerFactory::getInstance();
        $q = "SELECT * FROM email_addr_bean_rel eabl INNER JOIN email_addresses ea ON ea.id = eabl.email_address_id ";
        $q .= "WHERE ea.email_address = '$emailAddress' and eabl.deleted = 0 and eabl.primary_address = 1";
        $query = $db->query($q);
        while ($row = $db->fetchByAssoc($query)) {
            $result['bean'] =  BeanFactory::getBean($row['bean_module'], $row['bean_id']);
            $result['emailAddress'] =  BeanFactory::getBean('EmailAddresses', $row['email_address_id']);
    }
    return $result;
    }


}