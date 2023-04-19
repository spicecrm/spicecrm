<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\interfaces;

use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;

interface AuthenticatorI
{
    /**
     * method to authenticate user by token or credentials and return the authenticated user object
     * @param object $authData contains $impersonationUser, $tokenIssuer and based on the $authType $username and $password or $token
     * @param string $authType 'token' | 'credentials'
     * @return AuthResponse
     * @throws UnauthorizedException
     */
    public function authenticate(object $authData, string $authType): AuthResponse;
}