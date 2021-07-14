<?php
namespace SpiceCRM\includes\Middleware;

use DateTime;
use ReflectionMethod;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use Slim\Routing\RouteContext;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\Middleware\Validation\ValidatorFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;

class ValidationMiddleware
{
    private $request;
    private $route;
    private $routeDefinition  = [];
    private $validationErrors = [];
    // todo figure out what to do with multienums
    // todo maybe a phone number type?
    private $allowedTypes = [
        self::TYPE_STRING, self::TYPE_ENUM, self::TYPE_GUID, self::TYPE_DATETIME, self::TYPE_BOOL,
        self::TYPE_NUMERIC, self::TYPE_ALPHANUMERIC, self::TYPE_EMAIL, self::TYPE_JSON, self::TYPE_BASE64,
        self::TYPE_MODULE, self::TYPE_ARRAY, self::TYPE_DATE, self::TYPE_EXTENSION, self::TYPE_OBJECT,
        self::TYPE_COMPLEX,
    ];
    private $allowedValidationOptions = [
        self::VOPT_MIN_SIZE, self::VOPT_MAX_SIZE, self::VOPT_FUNCTION, self::VOPT_REGEX,
        self::VOPT_INVERSE_REGEX,
    ];
    private $exemptedParameters = [
        'XDEBUG_SESSION_START', 'PHP_AUTH_DIGEST_RAW'
    ];

    const ANONYMOUS_ARRAY = '#anonymous#array#';

    const TYPE_STRING       = 'string';
    const TYPE_ENUM         = 'enum';
    const TYPE_GUID         = 'guid';
    const TYPE_DATETIME     = 'datetime';
    const TYPE_BOOL         = 'bool';
    const TYPE_NUMERIC      = 'numeric';
    const TYPE_ALPHANUMERIC = 'alphanumeric';
    const TYPE_EMAIL        = 'email';
    const TYPE_JSON         = 'json';
    const TYPE_BASE64       = 'base64';
    const TYPE_MODULE       = 'module';
    const TYPE_ARRAY        = 'array';
    const TYPE_DATE         = 'date';
    const TYPE_EXTENSION    = 'extension';
    const TYPE_OBJECT       = 'object';
    const TYPE_COMPLEX      = 'complex';

    const VOPT_MIN_SIZE      = 'minSize';
    const VOPT_MAX_SIZE      = 'maxSize';
    const VOPT_FUNCTION      = 'function';
    const VOPT_REGEX         = 'regex';
    const VOPT_INVERSE_REGEX = 'inverseRegex';

    public function __invoke(Request $request, RequestHandler $handler): Response {
        $this->request = $request;
        $routeContext = RouteContext::fromRequest($request);
        $this->route = $routeContext->getRoute();
        $this->routeDefinition = RESTManager::getInstance()->getRoute($this->route->getIdentifier(), strtolower($request->getMethod()));
        $this->validate();
        $this->reactToErrors();

        return $handler->handle($request);
    }

    /**
     * Validates the request by checking the presence of all required parameters and
     * valdating them against their definitions.
     */
    private function validate(): void {
        $this->checkParameterPresence();

        $this->validatePresentParameters();
    }

    /**
     * Collects the parameters from the path, query and post body and combines them in one array.
     *
     * @param bool $withBody
     * @return array
     */
    private function getAllParams($withBody = true): array {
        $allParams   = [];
        $pathParams  = $this->route->getArguments();
        $queryParams = $this->request->getQueryParams();
        $bodyParams  = $this->request->getParsedBody();

        if (is_array($pathParams)) {
            $allParams = array_merge($allParams, $pathParams);
        }
        if (is_array($queryParams)) {
            $allParams = array_merge($allParams, $queryParams);
        }
        if (is_array($bodyParams) && $withBody) {
            $allParams = array_merge($allParams, $bodyParams);
        }

        return $allParams;
    }

    /**
     * Checks if all required parameters are present in the request.
     * todo make it recursive
     */
    private function checkParameterPresence(): void {
        $pathParams  = $this->route->getArguments();
        $queryParams = $this->request->getQueryParams();
        $bodyParams  = $this->request->getParsedBody();

        foreach ($this->routeDefinition['parameters'] as $paramName => $paramDefinition) {
            if (!isset($paramDefinition['required'])
                || (isset($paramDefinition['required']) && $paramDefinition['required'] == false)) {
                continue;
            }
            if ($paramDefinition['in'] == 'body' && $paramName == self::ANONYMOUS_ARRAY) {
                if (!is_array($bodyParams)) {
                    $this->validationErrors[self::ANONYMOUS_ARRAY][] = self::ANONYMOUS_ARRAY . ' is not set';
                }
                continue;
            }
            if ($paramDefinition['in'] == 'path' && !array_key_exists($paramName, $pathParams)) {
                $this->validationErrors[$paramName][] = $paramName . ' is not set';
            }
            if ($paramDefinition['in'] == 'query' && !array_key_exists($paramName, $queryParams)) {
                $this->validationErrors[$paramName][] = $paramName . ' is not set';
            }
            if ($paramDefinition['in'] == 'body' && !array_key_exists($paramName, $bodyParams)) {
                $this->validationErrors[$paramName][] = $paramName . ' is not set';
            }
        }
    }

    /**
     * Validates the request parameters against their definitions.
     */
    private function validatePresentParameters(): void {
        $withBody = true;

        if (isset($this->routeDefinition['options']['excludeBodyValidation'])
            && $this->routeDefinition['options']['excludeBodyValidation'] === true) {
            $withBody = false;
        }
        $allParams = $this->getAllParams($withBody);

        foreach ($allParams as $paramName => $paramValue) {
            if (in_array((string) $paramName, $this->exemptedParameters)) {
                continue;
            }

            if (!isset($this->routeDefinition['parameters'][$paramName]) &&
                !(is_integer($paramName) && isset($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]))) {
                $this->validationErrors[] = 'Unknown parameter: ' . $paramName;
            }

            if (is_numeric($paramName) && isset($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY])) {
                $validator = ValidatorFactory::createValidator(
                    self::ANONYMOUS_ARRAY,
                    $this->request->getParsedBody(),
//                    $this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]
                    $this->getParameterDefinition($paramName)
                );

                try {
                    $validator->validate();
                    break;
                } catch (ValidationException $e) {
                    $this->validationErrors[$e->getParamName()] = $e->getValidationErrors();
                    break;
                }
            }


            $validator = ValidatorFactory::createValidator($paramName, $paramValue, $this->getParameterDefinition($paramName));
            try {
                $validator->validate();
            } catch (ValidationException $e) {
                $this->validationErrors[$e->getParamName()] = $e->getValidationErrors();
            }



//            if ($this->routeDefinition['parameters'][$paramName]['type'] == self::TYPE_OBJECT) {
//                $this->objectValidation($paramName, $paramValue, $this->routeDefinition['parameters'][$paramName]['parameters']);
//            } elseif ($this->routeDefinition['parameters'][$paramName]['type'] == self::TYPE_ARRAY) {
//                $this->arrayValidation($paramName, $paramValue, $this->routeDefinition['parameters'][$paramName]['subtype']);
//            } elseif ((isset($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]) && is_integer($paramName))) {
//                if ($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]['type'] == self::TYPE_OBJECT) {
//                    $this->objectValidation(self::ANONYMOUS_ARRAY . '[' . $paramName . ']', $paramValue, $this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]['parameters']);
//                } elseif ($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]['type'] == self::TYPE_ARRAY) {
//                    $this->arrayValidation(self::ANONYMOUS_ARRAY . '[' . $paramName . ']', $paramValue, $this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]['subtype']);
//                } elseif (isset($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY]['subtype'])) {
//
//                }
//            } else {
//                $this->validateType($paramName, $paramValue, $this->routeDefinition['parameters'][$paramName]['type']);
//            }
//
//            if (isset($this->routeDefinition['parameters'][$paramName]['validationOptions'])) {
//                foreach ($this->routeDefinition['parameters'][$paramName]['validationOptions'] as $optionType => $optionValue) {
//                    $this->validateType($paramName, $paramValue, $optionType, $optionValue);
//                }
//            }
        }
    }

    /**
     * Checks if the parameter has a valid type and runs a specific type validation function.
     *
     * @param string $name
     * @param $value
     * @param $type
     * @param null $parameter
     */
    private function validateType(string $name, $value, $type, $parameter = null): void {
        if ((!in_array($type, $this->allowedTypes)) && (!in_array($type, $this->allowedValidationOptions))) {
            $this->validationErrors[$name][] = 'Unknown parameter type: ' . $type;
        }

        $functionName = $type . 'Validation';

        $rc = new \ReflectionClass(self::class);
        if ($rc->hasMethod($functionName)) {
            $this->$functionName($name, $value, $parameter);
        }
    }

    /**
     * Type validation for arrays.
     * Works for simple indexed arrays.
     * The content of the array is validated against the type set in the subtype parameter.
     *
     * @param string $name
     * @param array $values
     * @param string $subtype
     */
    private function arrayValidation(string $name, array $values, $subtype): void {
        if (is_string($subtype)) {
            foreach ($values as $value) {
                $this->validateType($name, $value, $subtype);
            }
        }

        if (is_array($subtype) && isset($subtype['type'])) {
            $validationFunction = $subtype['type'] . 'Validation';
            $subTypeParams = $subtype['parameters'] ?? $subtype['subtype'];
            foreach ($values as $value) {
                $this->$validationFunction($name . ' array subtype', $value, $subTypeParams);
            }
        }
    }

//    private function objectValidation(string $name, array $values, array $parameters): void {
//        foreach ($values as $valueName => $value) {
//            if ($parameters[$valueName]['type'] == self::TYPE_ARRAY) {
//                $this->validateType($name, $value, $parameters[$valueName]['type'], $parameters[$valueName]['subtype']);
//            } elseif ($parameters[$valueName]['type'] == self::TYPE_OBJECT) {
//                $this->objectValidation($name . '[' . $valueName . ']', $value, $parameters[$valueName]['parameters']);
//            } else {
//                $this->validateType($name . '[' . $valueName . ']', $value, $parameters[$valueName]['type']);
//            }
//
//            foreach ($parameters[$valueName]['validationOptions'] as $optionType => $optionValue) {
//                $this->validateType($name, $value, $optionType, $optionValue);
//            }
//        }
//    }

    private function reactToErrors() {
        /**
         * todo
         * 1) entweder verwerfen
         * 2) akzeptieren
         * 3) im debug mode zeigen was genau falsch ist
         * (wenn developer mode, oder eigenes parameter gesetzt ist)
         */
        if (!empty($this->validationErrors)) {
            throw new ValidationException($this->validationErrors);
        }

        // abdrehbar machen (config)
    }

    private function getParameterDefinition($paramName): array {
        if (is_integer($paramName) && isset($this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY])) {
            return $this->routeDefinition['parameters'][self::ANONYMOUS_ARRAY];
        } elseif (isset($this->routeDefinition['parameters'][$paramName])) {
            return $this->routeDefinition['parameters'][$paramName];
        } else {
            throw new Exception("Parameter {$paramName} is not defined.");
        }
    }
}
