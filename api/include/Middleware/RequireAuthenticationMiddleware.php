<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\RESTManager;

class RequireAuthenticationMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler) {
        if (RESTManager::getInstance()->isAuthenticated() == false) {
            throw new UnauthorizedException();
        }
        return $handler->handle($request);
    }
}
