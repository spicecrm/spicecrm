<?php

namespace SpiceCRM\includes\authentication\GoogleAuthenticate;


use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\Logger\SpiceLogger;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Users\User;

class GoogleAuthenticate
{

    /**
     * saveToken
     *
     * Verifies the token
     * Starts the user session
     * Saves Google OAuth data in session
     * Authenticates the user in Spice
     *
     * @param array $params
     * @return array|bool|false
     */
    public function authenticate($oauthToken)
    {
        $payload = $this->verifyIdToken($oauthToken);

        if (session_id() == '') {
            @session_start();
        }

        //todo clarify should we leave this here?
        // $_SESSION['google_oauth']['id_token'] = $oauthToken;
        // $_SESSION['google_oauth']['access_token'] = $accesToken; //do we need accessToken?

        //populate session with google return values
        /*
        foreach ($payload as $key => $value) {
            if (in_array($key, $this->session_params)) {
                $_SESSION['google_oauth'][$key] = $value;
            }
        }
        */

        //try to find user via email
        /** @var User $userObj */
        $userObj=BeanFactory::getBean("Users");
        if($userObj->findByUserName($payload->email)){
            return $userObj;
        } else {
            throw new UnauthorizedException('User not found');
        }
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
     * @throws \Exception
     */
    private function verifyIdToken($oauthToken)
    {
        $apiUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=';
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
     *
     * @return mixed
     */
    function getTokenByUserId($userid)
    {
        $userObj = BeanFactory::getBean('Users', $userid);
        return $this->getTokenByUserName($userObj->name);
    }

    /**
     * requests the token with a given username
     *
     * @return mixed
     */
    function getTokenByUserName($username)
    {

        $apiUrl = "https://www.googleapis.com/oauth2/v4/token";
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
                throw new \Exception($response->error . ': ' . $response->error_description);
            }
            throw new \Exception("unable to get token");
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
        $serviceuserdetails = json_decode($serviceuserkey);
        $private_key = $serviceuserdetails->{'private_key'};

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
            "aud" => "https://www.googleapis.com/oauth2/v4/token",
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