<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\GoogleAuthenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Users\User;
use SpiceCRM\extensions\modules\GoogleCalendar\GSuiteUserConfig;

class GoogleAuthenticate implements AuthenticatorI
{

    /**
     * saveToken
     * Verifies the token
     * Starts the user session
     * Saves Google OAuth data in session
     * Authenticates the user in Spice
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws UnauthorizedException | Exception | NotFoundException
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        $payload = $this->verifyIdToken($authData->token->access_token);

        if (session_id() == '') {
            @session_start();
        }

        //try to find user via email
        /** @var User $userObj */
        $userObj=BeanFactory::getBean("Users");

        if(!$userObj->findByUserName($payload->email)){
            throw new UnauthorizedException('User not found');
        }

        return new AuthResponse($userObj->user_name);
    }

    /**
     * helper function
     *
     * @param $data
     * @return string
     */
    private function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * verifyIdToken
     *
     * Google ID Token verification using cURL
     *
     * A valid response looks like:
     *
     * {
     * "azp": "272196069173.apps.googleusercontent.com",
     * "aud": "272196069173.apps.googleusercontent.com",
     * "sub": "110248495921238986420",
     * "hd": "okta.com",
     * "email": "aaron.parecki@okta.com",
     * "email_verified": true,
     * "at_hash": "0bzSP5g7IfV3HXoLwYS3Lg",
     * "exp": 1524601669,
     * "iss": "https://accounts.google.com",
     * "iat": 1524598069
     * }
     * @param $params
     * @return array
     * @throws Exception
     */
    private function verifyIdToken($oauthToken)
    {
        $apiUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
        $apiUrl .= $oauthToken;

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $apiUrl,
        ]);

        $result = json_decode(curl_exec($curl));

        curl_close($curl);

        if (!$result) {
            LoggerManager::getLogger()->warn("unable to verify google id token".$result);
            throw new UnauthorizedException('Cannot verify Google ID Token');
        }

        if ($result->error_description != '') {
            throw new UnauthorizedException($result->error_description);
        }

        return $result;
    }

    /**
     * requests the token
     * @param $userid
     * @return mixed|void
     * @throws Exception
     */
    function getTokenByUserId($userid)
    {
        $userObj = BeanFactory::getBean('Users', $userid, ['relationships' => false]);

        // subscription renewal is possible only for active users, check if user still active
        if($userObj->status == "Active") {
            return $this->getTokenByUserName($userObj->user_name);
        }
        LoggerManager::getLogger()->error('googleauth', "Trying to get token of an inactive user with user id: {$userid} and user_name: {$userObj->user_name}");
    }

    /**
     * requests the token with a given username
     *
     * @return mixed
     */
    function getTokenByUserName($username)
    {

        $apiUrl = "https://oauth2.googleapis.com/token";
        $params = [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $this->createJWTAssertion($username)
        ];

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $apiUrl,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => $params
        ]);

        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        if (isset($response->error)) {
            if ($response->error && $response->error_description) {
                throw new Exception($response->error . ': ' . $response->error_description);
            }
            throw new Exception("unable to get token");
        }

        return $response;
    }

    /**
     * creates the JWT Assertion from the json string
     *
     * @return string
     */
    private function createJWTAssertion($username, $scope = ['https://www.googleapis.com/auth/calendar'])
    {
        $serviceuserkey = SpiceConfig::getInstance()->config['googleapi']['serviceuserkey'];
        $serviceuserdetails = json_decode(preg_replace('/\n|\r\n|\\\n/', '', $serviceuserkey));
        $privateKeyFormatReplace = [
            '-----BEGIN PRIVATE KEY-----' => "-----BEGIN PRIVATE KEY-----\n",
            '-----END PRIVATE KEY-----' => "\n-----END PRIVATE KEY-----\n"
        ];
        $private_key = str_replace(array_keys($privateKeyFormatReplace), $privateKeyFormatReplace, $serviceuserdetails->{'private_key'});

        //{Base64url encoded JSON header}
        $jwtHeader = $this->base64url_encode(json_encode([
            "alg" => "RS256",
            "typ" => "JWT"
        ]));

        //{Base64url encoded JSON claim set}
        $now = time();
        $jwtClaim = $this->base64url_encode(json_encode([
            "iss" => $serviceuserdetails->{'client_email'},
            "scope" => SpiceConfig::getInstance()->config['googleapi']['serviceuserscope'],
            "aud" => "https://oauth2.googleapis.com/token",
            "exp" => $now + 3600,
            "iat" => $now,
            "sub" => $username
        ]));

        $data = $jwtHeader . "." . $jwtClaim;

        // Signature
        $Sig = '';
        openssl_sign($data, $Sig, $private_key, 'SHA256');
        $jwtSign = $this->base64url_encode($Sig);

        $jwtAssertion = $data . "." . $jwtSign;

        return $jwtAssertion;
    }

    /**
     * getToken
     *
     * Returns the Google OAuth data from session
     *
     * @param array $params
     * @return mixed
     */
    public function getToken()
    {
        return $_SESSION['google_oauth'];
    }


}