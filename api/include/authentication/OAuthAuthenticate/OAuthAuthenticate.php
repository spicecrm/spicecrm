<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\authentication\OAuthAuthenticate;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Users\User;

class OAuthAuthenticate
{
    private $ssl_verifyhost = false;
    private $ssl_verifypeer = false;

    /**
     * Fetches the OAuth access token using the authorization code.
     *
     * @param string $authCode
     * @return string
     * @throws \Exception
     */
    public function fetchAccessToken(string $authCode): string {
        $tokenUrl = SpiceConfig::getInstance()['oauth']['token_path'];
        $payload  = [
            'grant_type' => 'authorization_code',
        ];

        $curl = curl_init();
        $curlOptions = [// todo customize the params
            CURLOPT_URL            => $tokenUrl,
            CURLOPT_POST           => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER         => 1,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HTTPHEADER     => [
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
     * @return array
     * @throws \Exception
     */
    public function fetchUserProfile(string $accessToken): array {
        $profileUrl = SpiceConfig::getInstance()['oauth']['profile_path'];

        $curl = curl_init();
        $curlOptions = [// todo customize the params
            CURLOPT_URL            => $profileUrl,
            CURLOPT_CUSTOMREQUEST  => 'GET',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER         => 1,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_HTTPHEADER     => [
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Bearer ' . $accessToken,
            ]
        ];

        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'oauth_fetch_profile');
        $result = curl_exec($curl);
        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        // todo process the result

        return [];
    }

    /**
     * Authenticates the OAuth user with SpiceCRM.
     * The user name has to be equal to the email address used for the OAuth authentication.
     *
     * @param string $accessToken
     * @param array $userProfile
     * @return User
     * @throws UnauthorizedException
     * @throws \SpiceCRM\includes\ErrorHandlers\NotFoundException
     */
    public function authenticate(string $accessToken, array $userProfile): User {
        /**
         * @var $user User
         */
        $user = BeanFactory::getBean('Users');
        $user->findByUserName($userProfile['email']);

        if (!$user || !$user->id) {
            throw new UnauthorizedException('User not found');
        }

        return $user;
    }
}