<?php

namespace SpiceCRM\modules\Mailboxes\Handlers;

use SpiceCRM\includes\authentication\GoogleAuthenticate\GoogleAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\GoogleOAuth\GoogleOAuthImpersonation;
use SpiceCRM\data\BeanFactory;
use Swift_TransportException;

class GmailHandler extends TransportHandler
{
    use GmailApiTrait;

    private $accessToken;
    private $userName;
    private $client;

    private $ssl_verifyhost = false;
    private $ssl_verifypeer = false;

    private $newMailCount = 0;

    const API_URL = 'https://gmail.googleapis.com';

    protected $incoming_settings = [
        'gmail_email_address',
    ];

    protected $outgoing_settings = [
        'gmail_email_address',
    ];

    protected function initTransportHandler()
    {


        $this->userName = $this->mailbox->gmail_user_name ?? $this->mailbox->gmail_email_address;

        $googleAuthController = new GoogleAuthenticate();
        $this->accessToken = (array)$googleAuthController->getTokenByUserName($this->userName);
        $this->accessToken['expires_at'] = time() + (int)$this->accessToken['expires_in'];
        $this->accessToken['user_id'] = $this->userName;
        unset($googleAuthController);

        if ($this->accessToken->result === false) {
            LoggerManager::getLogger()->fatal('Gmail Oauth Token Error: ' . $this->accessToken->error);
        }
    }

    public function testConnection($testEmail)
    {
        $status = $this->checkConfiguration($this->outgoing_settings);
        if (!$status['result']) {
            $response = [
                'result' => false,
                'errors' => 'No Gmail API connection set up. Missing values for: '
                    . implode(', ', $status['missing']),
            ];
            return $response;
        }

        try {
            $this->sendMail(Email::getTestEmail($this->mailbox, $testEmail));
            $response['result'] = true;
        } catch (Swift_TransportException $e) {
            $response['errors'] = $e->getMessage();
            LoggerManager::getLogger()->info($e->getMessage());
            $response['result'] = false;
        } catch (\Exception $e) {
            $response['errors'] = $e->getMessage();
            LoggerManager::getLogger()->info($e->getMessage());
            $response['result'] = false;
        }

        return $response;
    }

    public function fetchEmails($pageToken = null)
    {
        global $timedate;
        $db = DBManagerFactory::getInstance();

        $messageIdList = $this->fetchMessageList($pageToken);

        if (is_array($messageIdList->messages)) {
            foreach ($messageIdList->messages as $messageId) {
                // check if the email exists. On purpose do not check the deleted flag since it might have been deleted on CRM and then shoudl not be reloaded
                if ($db->fetchByAssoc($db->query("SELECT id FROM emails WHERE external_id = '{$messageId->id}' AND mailbox_id='{$this->mailbox->id}'"))) continue;

                if ($this->newMailCount >= 100) {
                    break;
                }

                $message = $this->fetchMessage($messageId->id);

                if (!$this->emailExists($this->extractMessageId($message->payload->headers))) {
                    $gmailMessage = new GmailMessage($this, $message, $this->mailbox->id);
                    $email = $gmailMessage->mapGmailToBean();
                    $email->save();
                    $email->processEmail();
                    ++$this->newMailCount;
                }
            }
        }

        if ($messageIdList->nextPageToken) {
            $this->fetchEmails($messageIdList->nextPageToken);
        }

        // check if all emails have been fetched ... we have less than the targeted max number of 100
        if ($this->newMailCount < 100) {
            $this->mailbox->last_checked = $timedate->nowDB();
            $this->mailbox->save();
        }

        return ['new_mail_count' => $this->newMailCount];
    }

    /**
     * checks internally if an email exists based ont eh message id and the mailbox
     *
     * @param $messageId
     * @return bool
     */
    private function emailExists($messageId)
    {
        $email = BeanFactory::getBean('Emails');
        if ($email->retrieve_by_string_fields(['message_id' => $messageId, 'mailbox_id' => $this->mailbox->id])) {
            return true;
        }

        return false;
    }

    private function fetchMessageList($pageToken = null)
    {
        $url = self::API_URL . "/gmail/v1/users/{$this->userName}/messages";
        $url .= '?' . $this->generateSearchParameters($pageToken);

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $url,
            CURLOPT_POST => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type:application/json',
                'Authorization: Bearer ' . $this->accessToken['access_token'],
            ],
        ]);

        $response = curl_exec($curl);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        if ($info->http_code >= 400) {
            LoggerManager::getLogger()->fatal('Gmail fetch message list error: ' . $response);
        }

        return json_decode($response);
    }

    /**
     * fetches a single message
     *
     * @param $messageId
     * @return mixed
     */
    private function fetchMessage($messageId)
    {
        $url = self::API_URL . "/gmail/v1/users/{$this->userName}/messages/{$messageId}";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $url,
            CURLOPT_POST => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type:application/json',
                'Authorization: Bearer ' . $this->accessToken['access_token'],
            ],
        ]);

        $response = curl_exec($curl);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        return json_decode($response);
    }

    /**
     * fetches an attachment from GMail via the API
     *
     * @param $messageId
     * @param $attachmentId
     * @return mixed
     */
    public function fetchAttachment($messageId, $attachmentId)
    {
        $url = self::API_URL . "/gmail/v1/users/{$this->userName}/messages/{$messageId}/attachments/{$attachmentId}";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $url,
            CURLOPT_POST => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type:application/json',
                'Authorization: Bearer ' . $this->accessToken['access_token'],
            ],
        ]);

        $response = curl_exec($curl);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        return json_decode($response);
    }

    /**
     * retrieves the labels for the gmail mailbox
     *
     * @return mixed
     */
    public function getLabels()
    {
        $url = self::API_URL . "/gmail/v1/users/{$this->userName}/labels";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $url,
            CURLOPT_POST => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type:application/json',
                'Authorization: Bearer ' . $this->accessToken['access_token'],
            ],
        ]);

        $response = curl_exec($curl);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        return json_decode($response);
    }

    /**
     * delete an email
     *
     * @param $email
     * @return mixed
     */
    public function deleteEmail($email, $mailboxparams)
    {

        return false;

        if (empty($email->external_id) || !$mailboxparams->gmail_delete_emails) return;

        $url = self::API_URL . "/gmail/v1/users/{$this->userName}/messages/{$email->external_id}/trash";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type:application/json',
                'Authorization: Bearer ' . $this->accessToken['access_token'],
            ],
        ]);

        $response = curl_exec($curl);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        return json_decode($response);
    }

    private function generateSearchParameters($pageToken = null)
    {
        $searchParams = [];

        $searchParams['q'] = 'in:inbox';
        if ($this->mailbox->last_checked) {
            $searchParams['q'] .= ' after:' . date('Y/m/d', strtotime($this->mailbox->last_checked));
        }


        if ($pageToken) {
            $searchParams['pageToken'] = $pageToken;
        }

        return http_build_query($searchParams);
    }

    private function setAuthConfig($configString)
    {
        if (is_string($configString)) {
            if (!$config = json_decode($configString, true)) {
                throw new LogicException('invalid json for auth config');
            }
        }

        $key = isset($config['installed']) ? 'installed' : 'web';
        if (isset($config['type']) && $config['type'] == 'service_account') {
            // application default credentials
            $this->client->useApplicationDefaultCredentials();

            // set the information from the config
            $this->client->setClientId($config['client_id']);
            $this->client->setConfig('client_email', $config['client_email']);
            $this->client->setConfig('signing_key', $config['private_key']);
            $this->client->setConfig('signing_algorithm', 'HS256');
        } elseif (isset($config[$key])) {
            // old-style
            $this->client->setClientId($config[$key]['client_id']);
            $this->client->setClientSecret($config[$key]['client_secret']);
            if (isset($config[$key]['redirect_uris'])) {
                $this->client->setRedirectUri($config[$key]['redirect_uris'][0]);
            }
        } else {
            // new-style
            $this->client->setClientId($config['client_id']);
            $this->client->setClientSecret($config['client_secret']);
            if (isset($config['redirect_uris'])) {
                $this->client->setRedirectUri($config['redirect_uris'][0]);
            }
        }
    }

    private function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function extractMessageId($headers)
    {
        foreach ($headers as $header) {
            if ($header->name == 'Message-ID') {
                return $header->value;
            }
        }
    }
}
