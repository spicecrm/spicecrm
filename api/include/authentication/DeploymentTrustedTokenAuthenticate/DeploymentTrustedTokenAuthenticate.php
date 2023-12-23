<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\DeploymentTrustedTokenAuthenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\Users\User;

class DeploymentTrustedTokenAuthenticate implements AuthenticatorI
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
     * @throws UnauthorizedException | Exception
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        $db = DBManagerFactory::getInstance();

        $decodedToken = base64_decode($authData->token->access_token);
        [$systemId, $headerToken] = explode('::', $decodedToken);

        $dbToken = $db->fetchOne("SELECT token, expire_date FROM systemdeploymentsystems_tokens WHERE system_id = '$systemId'");

        if (!$dbToken || $dbToken['token'] != $headerToken) {
            throw new UnauthorizedException('Invalid Token', 'InvalidToken');
        }
        $dbTokenExpire = TimeDate::getInstance()->fromString($dbToken['expire_date']);

        if ($dbTokenExpire < TimeDate::getInstance()->now()) {
            throw new UnauthorizedException('Expired Token', 'ExpiredToken');
        }

        //try to find user via email
        /** @var User $userObj */
        $userObj = BeanFactory::getBean("Users", '1');

        return new AuthResponse($userObj->user_name);
    }
}