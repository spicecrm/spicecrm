<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\DeploymentTrustedTokenAuthenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
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
        $linkData = $db->fetchOne("SELECT * FROM systemdeploymentsystems_link WHERE trusted_token = '{$authData->token->access_token}'");

        if (!$linkData) {
            throw new UnauthorizedException('Invalid Token', 'InvalidToken');
        }

        //try to find user via email
        /** @var User $userObj */
        $userObj = BeanFactory::getBean("Users", '1');

        return new AuthResponse($userObj->user_name);
    }
}