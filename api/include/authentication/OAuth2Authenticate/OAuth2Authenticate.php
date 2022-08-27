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

namespace SpiceCRM\includes\authentication\OAuth2Authenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
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
     * @return string|null
     * @throws Exception
     */
    public function fetchAccessToken(string $authCode): ?string
    {
        $payload = http_build_query([
            'grant_type' => 'authorization_code',
            'code' => $authCode,
            'client_secret' => $this->config->client_secret,
            'client_id' => $this->config->client_id,
            'redirect_uri' => $this->config->redirect_uri,
        ]);

        $curl = curl_init();
        $curlOptions = [
            CURLOPT_URL => $this->config->token_endpoint,
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
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
        $parsedBody = json_decode($body);

        return $parsedBody->access_token;

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