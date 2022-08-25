<?php

namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;

class TenantMiddleware
{
    /**
     * prevent using the update/insert routes for tenant user that did not accept the legal notice
     * @throws ForbiddenException
     */
    public function __invoke(Request $request, RequestHandler $handler): ResponseInterface
    {
        $authController = AuthenticationController::getInstance();

        if (!$authController->systemTenantLegalNoticeAccepted) {
            throw new ForbiddenException('Tenant user did not accept the legal notice.', 'noLegalNoticeAccepted');
        }
        return $handler->handle($request);
    }
}
