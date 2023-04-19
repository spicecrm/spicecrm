<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\interfaces;

use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;

class AuthResponse
{
    /**
     * username of the authenticated user
     * @var string
     */
    public string $username;
    /**
     * id of the tenant
     * @var string|null
     */
    public ?string $tenantId;

    /**
     * @param string|null $username required parameter in the response to retrieve the current user later
     * @param array $optionalParams optional further response params need to be declared as a properties in this class
     * @throws UnauthorizedException
     */
    public function __construct(?string $username, array $optionalParams = [])
    {
        if (empty($username)) throw new UnauthorizedException('User not found', 404);

        $this->username = $username;

        foreach ($optionalParams as $property => $value) $this->$property = $value;
    }
}