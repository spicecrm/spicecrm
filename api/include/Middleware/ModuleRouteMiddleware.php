<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use Slim\Routing\RouteContext;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;

class ModuleRouteMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response {
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        $beanName = $route->getArgument('beanName');

        if (method_exists(BeanFactory::class, 'moduleExists')
            && !BeanFactory::moduleExists($beanName)) {
            throw (new NotFoundException('Module not found.'))
                ->setLookedFor(['module' => $beanName])
                ->setErrorCode('noModule');
        }
        return $handler->handle($request);
    }
}