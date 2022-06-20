<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * sets the developer mode
 */
class DeveloperMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response {
        if (SpiceConfig::getInstance()->config['developerMode'] === true || SpiceConfig::getInstance()->config['developerMode'] == 1 || (SpiceConfig::getInstance()->config['developerMode'] == 2 && $request->getHeaderLine('developermode') == 1)) {
            ini_set('display_errors', 1);
            SpiceConfig::getInstance()->config['developerMode'] = true;
        }

        // invoke the request
        return $handler->handle($request);
    }
}
