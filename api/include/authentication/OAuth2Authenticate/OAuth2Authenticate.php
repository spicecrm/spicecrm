<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\OAuth2Authenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\modules\Users\User;

class OAuth2Authenticate implements AuthenticatorI
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
     */
    private $config;
    /**
     * holds the issuer key
     */
    public $issuer;

    public function __construct($issuer = null)
    {
        $this->issuer = $issuer;
        $this->loadConfig($issuer);
    }

    private function loadConfig($issuer) {

        if (empty($issuer)) return;

        $db = DBManagerFactory::getInstance();
        $service = $db->fetchOne("SELECT config FROM sysauthconfig WHERE issuer = '$issuer'");

        if (empty($service)) return;

        $this->config = json_decode($service['config']);
    }

    /**
     * Fetches the OAuth access token using the authorization code.
     *
     * @param string $authCode
     * @return object|null
     * @throws Exception
     */
    public function fetchAccessToken(string $authCode): ?object
    {
        $payload = http_build_query([
            'grant_type' => 'authorization_code',
            'code' => $authCode,
            'client_secret' => $this->config->client_secret,
            'client_id' => $this->config->client_id,
            'redirect_uri' => $this->config->redirect_uri,
        ]);

        return $this->tokenPostRequest($payload);
    }

    /**
     * Fetches the OAuth access token using the authorization code.
     *
     * @param string $refreshToken
     * @throws Exception
     */
    public function refreshToken(string $refreshToken)
    {
        $payload = http_build_query([
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_secret' => $this->config->client_secret,
            'client_id' => $this->config->client_id,
            'redirect_uri' => $this->config->redirect_uri,
        ]);

        $token = $this->tokenPostRequest($payload);

        $_SESSION['OAuth2TokenObject'] = $token;
    }

    /**
     * set a token post request
     * @param string $params
     * @return null
     * @throws Exception
     */
    private function tokenPostRequest(string $params)
    {
        $curl = curl_init();

        $curlOptions = [
            CURLOPT_URL => $this->config->token_endpoint,
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $params,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json'
            ]
        ];

        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'oauth_fetch_token');

        $result = curl_exec($curl);
        $info = curl_getinfo($curl);

        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        if ($info['http_code'] != 200) {
            return null;
        }

        $body = substr($result, $info['header_size']);
        $body = json_decode($body);
        $body->valid_until = time() + (int) $body->expires_in;
        return $body;
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
                'User-Agent: curl/7.64.1',
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
            $body = json_decode(
                substr($result, $info['header_size'])
            );

            // the method name must be same as the issuer
            if (method_exists(OAuth2FetchProfileHandlers::class, $this->issuer)) {
                return OAuth2FetchProfileHandlers::{$this->issuer}($body);
            } else {
                return $body;
            }
        }

        return null;
    }

    /**
     * Authenticates the OAuth user with SpiceCRM.
     * The username has to be equal to the email address used for the OAuth authentication.
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws NotFoundException | UnauthorizedException | Exception
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        /** @var $user User */
        $user = BeanFactory::getBean('Users');
        $userProfile = $this->fetchUserProfile($authData->token->access_token);
        $user->findByUserName($userProfile->email);

        if (empty($user->id)) {
            throw new UnauthorizedException('User not found');
        }

        return new AuthResponse($user->user_name);
    }

    /**
     * save the token to the session after successful authentication and the session was created
     * @return void
     */
    public static function afterSuccessfulAuthentication(object $authData)
    {
        $_SESSION['OAuth2TokenObject'] = $authData->token;
    }
}