<?php

namespace SpiceCRM\modules\EmailTrackingActions\api\controllers;


use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\extensions\modules\LandingPages\LandingPage;
use SpiceCRM\extensions\modules\NewsletterLogs\NewsletterLog;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\CampaignLog\CampaignLog;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTrackingActions\EmailTracking;

class EmailTrackingActionsController
{
    /** handles tracking url logging and redirect
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function handleTrackingLink(Request $req, Response $res, array $args): Response
    {
        $data = EmailTracking::decodeTrackingID($args['key']);

        if (!$data) {
            throw new BadRequestException('Failed to decrypt key');
        }

        $trackingLink = BeanFactory::getBean('EmailTrackingLinks', $data['EmailTrackingLinks']);
        $this->logTrackingAction($data, 'clicked');

        return $res->withHeader('Location', $trackingLink->url)
            ->withStatus(302);
    }

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
        $data = EmailTracking::decodeTrackingID($args['key']);

        if ($data) {
            $this->logTrackingAction($data, 'opened', false);
        }

        // return an image - 1x1 transparent pixel
        //$res->getBody()->write(base64_decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="));
        $res->getBody()->write(base64_decode("R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="));
        return $res->withHeader('Content-Type', 'image/gif');
    }

    /**
     * handles logging of email opening
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException|Exception
     */
    public function handleUnsubscribe(Request $req, Response $res, array $args): Response
    {
        $data = EmailTracking::decodeTrackingID($args['key']);

        if (!$data) {
            throw new BadRequestException('Failed to decrypt key');
        }

        $this->logTrackingAction($data, 'unsubscribe');

        // get the email seed
        /** @var Email | CampaignLog | NewsletterLog $seed */
        $seed = BeanFactory::getBean($data['ParentType'], $data['ParentId']);

        if (!$seed) {
            new NotFoundException('Email or CampaignLog or NewsletterLog not found');
        }

        $this->setEmailToOptedOut($seed);

        // unsubscribe from all newsletters if subscribed
        $this->unsubscribeFromNewsletters($seed);

        $redirectUrl = SpiceConfig::getInstance()->get('emailtracking.unsubscribe_redirect_url');

        if ($seed->_module == 'Emails') {
            $redirectUrl = $seed->getMailbox()->unsubscribe_redirect_url ?: $redirectUrl;
        }

        if (!empty($redirectUrl)) {
            return $res->withHeader('Location', $redirectUrl)->withStatus(302);
        }

        // load the unsub landingpage content
        /** @var LandingPage $landingPage */
        $landingPage = BeanFactory::getBean('LandingPages', SpiceConfig::getInstance()->get('emailtracking.unsubscribelandingpage'));
        if($landingPage && SpiceConfig::getInstance()->get('emailtracking.unsubscribelandingpage') && $landingPage->retrieve(SpiceConfig::getInstance()->get('emailtracking.unsubscribelandingpage'))) {
            $lpContent = $landingPage->parse($seed);
        } else {
            $lpContent['content'] = 'unsubscribed';
        }


        $res->getBody()->write($lpContent['content']);
        return $res->withHeader('Content-Type', 'text/html');
    }

    /**
     * handle marketing action
     * @throws BadRequestException
     * @throws NotFoundException
     */
    public function handleMarketingAction(Request $req, Response $res, array $args): Response
    {
        $decrypted = $this->decryptEncryptionKey(base64_decode($args['key']));

        if (!$decrypted) {
            throw new BadRequestException('Failed to decrypt key');
        }
        $chunks = array_chunk(preg_split('/(:|:)/', $decrypted), 2);
        $data = array_combine(array_column($chunks, 0), array_column($chunks, 1));

        if (!array_key_exists('MarketingActions', $data) || empty($data['MarketingActions'])) {
            throw new BadRequestException('Missing url params');
        }

        /** @var Email $email */
        $email = BeanFactory::getBean('Emails', $data['Emails']);
        /** @var SpiceBean $marketingAction */
        $marketingAction = BeanFactory::getBean('MarketingActions', $data['MarketingActions']);

        if (!$email) {
            throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $data['Emails'], 'module' => 'Emails']);
        }
        switch ($marketingAction->name) {
            case "optin":
                $this->setEmailToOptedIn($email);
                break;
            case "optout":
                $this->setEmailToOptedOut($email);
                break;
            default:
                $email->handleEvent($marketingAction->name);
                break;
        }


        return $res->withJson(['redirectUrl' => $this->getRedirectUrl($marketingAction, $email->id)]);
    }

    /**
     * decrypts the key
     * @param $key
     */
    private function decryptEncryptionKey($key)
    {
        $encryptionKey = SpiceConfig::getInstance()->get('emailtracking.encryptionkey') ?? SpiceConfig::getInstance()->config['unique_key'];
        $method = 'DES-EDE3-CBC';
        return openssl_decrypt($key, $method, $encryptionKey);
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
    private function setEmailToOptedIn($email): bool
    {
        return $this->setEmailOptinStatus($email, 'opted_in');
    }

    public function setEmailOptinStatus($bean, string $status): bool
    {
        if($bean->_module === 'Emails'){
            $recipient = BeanFactory::getBean($bean->parent_type, $bean->parent_id);
            $emailAddresses = $recipient->get_linked_beans('email_addresses');
            foreach ($emailAddresses as $address) {
                foreach ($bean->to() as $emailAddress) {
                    if ($address->email_address == $emailAddress['email']) {
                        if (EmailAddress::setOptInStatus($recipient, $address, $status)) {
                            return true;
                        } else {
                            throw new BadRequestException('could not set the opt-in status for this address');
                        }
                    }
                }
            }
        }
        elseif($bean->_module === 'CampaignLog' || $bean->_module === 'NewsletterLogs'){
            $recipient = BeanFactory::getBean($bean->target_type, $bean->target_id);
            $recipient->load_relationship('email_addresses');
            $emailAddress = $this->getEmailAddress($recipient, $bean->email_addr_bean_rel_id);
            if (EmailAddress::setOptInStatus($recipient, $emailAddress, $status)) {
                return true;
            } else {
                throw new BadRequestException('could not set the opt-in status for this address');
            }
        }
        return true;
    }

    public function unsubscribeFromNewsletters($seed){

        $newsletter = BeanFactory::getBean('Newsletters');
        if($seed->_module === 'Emails') {
            $recipient = BeanFactory::getBean($seed->parent_type, $seed->parent_id);
        }
        elseif($seed->_module === 'CampaignLog' || $seed->_module === 'NewsletterLogs'){
            $recipient = BeanFactory::getBean($seed->target_type, $seed->target_id);
        }
        $newsletter->unsubscribeTargetFromAllNewsletters($recipient->id);
    }

    public function getEmailAddress(SpiceBean $person, $emailAddrBeanRelId): ?EmailAddress
    {
        $db = DBManagerFactory::getInstance();
//        $emailAddrBeanRelId = $db->getOne("SELECT email_addr_bean_rel_id from prospect_lists_prospects WHERE prospect_list_id = '$listId' AND related_id ='$person->id' AND deleted = 0");

        // fallback
        if(empty($emailAddrBeanRelId)) {
            return !$person->email1 ? null : BeanFactory::newBean('EmailAddresses')->retrieve_by_string_fields(['email_address' => $person->email1]);
        }

        $q = "SELECT eabr.* FROM email_addr_bean_rel eabr where eabr.id ='{$emailAddrBeanRelId}' and eabr.bean_id ='$person->id' and eabr.deleted = 0";
        $row = $db->fetchOne($q);

        return BeanFactory::getBean('EmailAddresses', $row['email_address_id']);
    }
    /**
     * sets the optin status of a recipient's email address to opted out
     * @param $email SpiceBean
     * @return bool
     * @throws BadRequestException
     */
    private function setEmailToOptedOut($email): bool
    {
        return $this->setEmailOptinStatus($email, 'opted_out');
    }

    /**
     * sets the optin status of the provided email address to 'pending'
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function handleSubscription(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody();
        $beanAndAddress = $this->findBeanByPrimaryEmailAddress($body['emailAddress']);
        # what if there is no Bean?
        if ($beanAndAddress['bean']) {
            EmailAddress::setOptInStatus($beanAndAddress['bean'], $beanAndAddress['emailAddress'], 'pending');
        }

        return $res->withJson(['success' => true]);
    }

    /**
     * saves the tracking action, only if it's not already saved
     * @param $data
     * @param $action
     */
    private function logTrackingAction($data, $action, $once = true)
    {
        $trackedAction = BeanFactory::getBean('EmailTrackingActions');
        if (!$once || !$trackedAction->retrieve_by_string_fields(['parent_type' => $data['ParentType'], 'parent_id' => $data['ParentId'], 'action' => $action], true, false)) {
            $trackedAction = BeanFactory::newBean('EmailTrackingActions');
            $trackedAction->parent_type = $data['ParentType'];
            $trackedAction->parent_id = $data['ParentId'];
            $trackedAction->action = $action;
            $trackedAction->user_agent = $_SERVER['HTTP_USER_AGENT'];
            $trackedAction->ip_address = SpiceUtils::getClientIP();
            //check if the link is here
            if (array_key_exists('EmailTrackingLinks', $data) && !empty($data['EmailTrackingLinks'])) {
                $trackedAction->emailtrackinglink_id = $data['EmailTrackingLinks'];
            }

            $trackedAction->save();

            if($data['ParentType'] && $data['ParentId']) {
                switch ($action) {
                    case 'opened':
                        // set the email to opened
                        $seed = BeanFactory::getBean($data['ParentType'], $data['ParentId']);
                        if ($seed) {
                            switch ($data['ParentType']) {
                                case 'NewsletterLogs':
                                case 'CampaignLog':
                                    $seed->activity_type = 'opened';
                                    $seed->activity_date = TimeDate::getInstance()->nowDb();
                                    break;
                                default;
                                    $seed->status = 'opened';
                                    break;
                            }

                            $seed->save();
                        }
                        break;
                }
            }
        }
    }

    /**
     * finds the bean by searching the primary email address in the email-bean relationship table
     * Delivers an array containing the found bean and the email address instances
     * @param $emailAddress string
     * @return array
     */
    private function findBeanByPrimaryEmailAddress($emailAddress): array
    {
        $db = DBManagerFactory::getInstance();
        $q = "SELECT * FROM email_addr_bean_rel eabl INNER JOIN email_addresses ea ON ea.id = eabl.email_address_id ";
        $q .= "WHERE ea.email_address = '$emailAddress' and eabl.deleted = 0 and eabl.primary_address = 1";
        $query = $db->query($q);
        while ($row = $db->fetchByAssoc($query)) {
            $result['bean'] = BeanFactory::getBean($row['bean_module'], $row['bean_id']);
            $result['emailAddress'] = BeanFactory::getBean('EmailAddresses', $row['email_address_id']);
        }
        return $result;
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws Exception
     *
     */
    public function handleDoubleOptin(Request $req, Response $res, array $args): Response
    {
        $data = EmailTracking::decodeTrackingID($args['key']);

        if (!$data) {
            throw new BadRequestException('Failed to decrypt key');
        }

        // get the email seed
        /** @var Email | CampaignLog  $seed */
        $seed = BeanFactory::getBean($data['ParentType'], $data['ParentId']);

        $this->setEmailToOptedIn($seed);

        $redirectUrl = SpiceConfig::getInstance()->get('emailtracking.double_optin_redirect_url');

        if ($seed->_module == 'Emails') {
            $redirectUrl = $seed->getMailbox()->double_optin_redirect_url ?: $redirectUrl;
        }

        if (!empty($redirectUrl)) {
            return $res->withHeader('Location', $redirectUrl)->withStatus(302);
        }

        // load the optin landingpage content
        /** @var LandingPage $landingPage */
        $landingPage = BeanFactory::getBean('LandingPages', SpiceConfig::getInstance()->get('emailtracking.double_optin_landing_page'));
        $lpContent = $landingPage->parse($seed);

        $res->getBody()->write($lpContent['content']);
        return $res->withHeader('Content-Type', 'text/html');
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws Exception
     *
     */
    public function getPreferences(Request $req, Response $res, array $args): Response
    {
        $data = EmailTracking::decodeTrackingID($args['key']);

        if (!$data) {
            throw new BadRequestException('Failed to decrypt key');
        }
        $return = EmailTracking::getPreferences($data);

        return $res->withJson($return);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws Exception
     *
     */
    public function handlePreferences(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody();
        $data = EmailTracking::decodeTrackingID($args['key']);

        if (!$data) {
            throw new BadRequestException('Failed to decrypt key');
        }
        $return = EmailTracking::handlePreferences($data, $body['preferences']);

        return $res->withJson($return);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws Exception
     *
     */
    public function createPreview(Request $req, Response $res, array $args): Response
    {
        $data = EmailTracking::decodeTrackingID($args['key']);

        if (!$data) {
            throw new BadRequestException('Failed to decrypt key');
        }
        $bean = BeanFactory::getBean($data['ParentType'], $data['ParentId']);
        $res->getBody()->write($bean->body);
        return $res->withHeader('Content-Type', 'text/html');
    }
}