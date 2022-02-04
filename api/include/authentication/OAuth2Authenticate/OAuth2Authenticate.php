<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\OAuth2Authenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\modules\Users\User;

class OAuth2Authenticate
{
    private $ssl_verifyhost = false;
    private $ssl_verifypeer = false;
    /**
     * based on oauth2 pattern
     * issuer
     * client_id
     * scope
     * redirect_uri
     * token_endpoint
     * userinfo_endpoint
     * login_url
     * client_secret
     * discovery_document_url
     */
    private $config;

    public function __construct($config)
    {
        $this->config = json_decode($config);
    }

    /**
     * Fetches the OAuth access token using the authorization code.
     *
     * @param string $authCode
     * @return string
     * @throws Exception
     */
    public function fetchAccessToken(string $authCode): string
    {
        $payload = [
            'grant_type' => 'authorization_code',
        ];

        $curl = curl_init();
        $curlOptions = [// todo customize the params
            CURLOPT_URL => $this->config->token_endpoint,
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Bearer ' . $authCode,
            ]
        ];

        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'oauth_fetch_token');
        $result = curl_exec($curl);
        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        // todo process the result

        return '';
    }

    /**
     * Fetches the user profile from the OAuth server.
     *
     * @param string $accessToken
     * @return array|null
     * @throws Exception
     */
    public function fetchUserProfile(string $accessToken): ?object
    {
        if (empty($this->config->userinfo_endpoint)) return null;

        $curl = curl_init();

        $curlOptions = [
            CURLOPT_URL => $this->config->userinfo_endpoint,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Bearer ' . $accessToken,
            ]
        ];

        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'oauth_fetch_profile');

        $result = curl_exec($curl);
        $info = curl_getinfo($curl);

        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        if ($info['http_code'] == 200) {
            $body = substr($result, $info['header_size']);
            return json_decode($body);
        }

        return null;
    }

    /**
     * Authenticates the OAuth user with SpiceCRM.
     * The user name has to be equal to the email address used for the OAuth authentication.
     *
     * @param string $accessToken
     * @return User
     * @throws NotFoundException
     * @throws UnauthorizedException
     * @throws Exception
     */
    public function authenticate(string $accessToken): User
    {
        /**
         * @var $user User
         */
        $user = BeanFactory::getBean('Users');
        $userProfile = $this->fetchUserProfile($accessToken);
        $user->findByUserName($userProfile->email);

        if (!$user || !$user->id) {
            throw new UnauthorizedException('User not found');
        }

        return $user;
    }
}