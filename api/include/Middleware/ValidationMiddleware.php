<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use Slim\Routing\Route;
use Slim\Routing\RouteContext;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\RESTManager;

class ValidationMiddleware
{
    private $validationErrors = [];

    public function __invoke(Request $request, RequestHandler $handler): Response {
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        $routeDefinition = RESTManager::getInstance()->getRoute($route->getIdentifier(), strtolower($request->getMethod()));
        $this->validate($request, $route, $routeDefinition);

        if (!empty($this->validationErrors)) {
            throw new Exception($this->validationErrors);
        }

        return $handler->handle($request);
    }

    private function validate(Request $request, Route $route, array $routeDefinition) {
        $pathParams  = $route->getArguments();
        $queryParams = $request->getQueryParams();
        $bodyParams  = $request->getParsedBody();
        $allParams   = array_merge($queryParams, $pathParams);

        foreach ($allParams as $paramName => $paramValue) {
            if (!isset($routeDefinition['parameters'][$paramName])) {
                // todo 1) entweder verwerfen 2) akzepiteren 3) im debug mode zeigen was genau falsch ist (wenn developer mode, oder eigenes parameter gesetzt ist)
            }

            $this->validateType($paramValue, $routeDefinition['parameters'][$paramName]['type']);
            foreach ($routeDefinition['parameters'][$paramName]['validationOptions'] as $optionType => $optionValue) {
                $this->validateType($paramValue, $optionType, $optionValue);
            }
        }
    }

    private function validateType($value, $type, $parameter = null) {
        $functionName = $type . 'Validation';

        $rc = new \ReflectionClass(self::class);
        if ($rc->hasMethod($functionName)) {
            $this->$functionName($value, $type, $parameter);
        }

        switch ($type) {
            case 'minSize':
                if (strlen($value) < $parameter) {
                    throw new Exception($value . ' is too short.');
                }
                break;
            case 'maxSize':
                if (strlen($value) > $parameter) {
                    throw new Exception($value . ' is too long.');
                }
                break;
        }
    }

    private function minSizeValidation($value, $type, $parameter) {
        if (strlen($value) < $parameter) {
            throw new Exception($value . ' is too short.');
            // todo actually collect all the errors first
        }
    }
}