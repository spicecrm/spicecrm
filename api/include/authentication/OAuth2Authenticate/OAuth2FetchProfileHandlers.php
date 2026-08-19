<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\OAuth2Authenticate;

use Exception;

class OAuth2FetchProfileHandlers
{
    /**
     * @important the method name must be same as the issuer
     * handle the fetch profile response and return an object with the email address
     *
     * @param object $response
     * @return object|null
     */
    public static function linkedin(object $response): ?object
    {
        return (object) ['email' => $response->elements[0]->{'handle~'}->emailAddress];
    }
}