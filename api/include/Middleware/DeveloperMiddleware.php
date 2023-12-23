<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * sets the developer mode
 */
class DeveloperMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response {
        if (SpiceUtils::getStackTrace()) {
            ini_set('display_errors', 1);
        }

        // invoke the request
        return $handler->handle($request);
    }
}
