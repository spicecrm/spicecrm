<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;

class AdminOnlyAccessMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler) {
        if (!AuthenticationController::getInstance()->isAdmin()) {
            throw new ForbiddenException('Admin access only.');
        }
        return $handler->handle($request);
    }
}
