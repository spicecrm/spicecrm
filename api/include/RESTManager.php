<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes;

/**
 * @OA\Info(title="SpiceCRM Api", version="0.1")
 */

use Slim\App;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Response;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\Middleware\AdminOnlyAccessMiddleware;
use SpiceCRM\includes\Middleware\ErrorMiddleware;
use SpiceCRM\includes\Middleware\ExceptionMiddleware;
use SpiceCRM\includes\Middleware\LoggerMiddleware;
use SpiceCRM\includes\Middleware\ModuleRouteMiddleware;
use SpiceCRM\includes\Middleware\RequireAuthenticationMiddleware;
use SpiceCRM\includes\Middleware\TransactionMiddleware;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainLoader;
use SpiceCRM\includes\SpiceSwagger\SpiceSwaggerGenerator;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\utils\RESTRateLimiter;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Contacts\Contact;
use Throwable;

class RESTManager
{
    /**
     * the instance for the singleton pattern
     *
     * @var null
     */
    private static $_instance = null;

    /**
     * the SLIM app
     * @var null
     */
    public $app = null;
    /**
     * All extensions registered in the API.
     *
     * @var array
     */
    public $extensions = [];
    /**
     * All routes registered in the API.
     *
     * @var array
     */
    private $routes = [];
    /**
     * Used during route registration to decide if a route is custom or not.
     *
     * @var bool
     */
    private $isCustomExtension = false;

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    /**
     * Returns an instance of the RESTManager singleton.
     *
     * @return RESTManager|null
     */
    public static function getInstance(): ?RESTManager {
        if (!is_object(self::$_instance)) {
            self::$_instance = new RESTManager();
        }
        return self::$_instance;
    }

    /**
     * Initializes the RESTManager.
     *
     * @param App $app
     * @throws ErrorHandlers\TooManyRequestsException
     */
    public function initialize(App $app)
    {
        // link the app and the request params
        $this->app = $app;

        $this->initGlobals();
        $this->initRateLimiter();

        $this->app->options('/{routes:.+}', function ($request, $response, $args) {
            return $response;
        });
        $this->app->add(TransactionMiddleware::class);

        $this->app->add(function ($req, $next) {
            return $next->handle($req)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        });

        $this->initErrorHandling();

        // if we are still installing skip the restlogger
        if (!($_GET['installer'])) {
            $this->initLogging();
        }


        $this->app->addRoutingMiddleware();

        $this->initExtensions();

        $this->initRoutes();

        // Catch-all route to serve a 404 Not Found page if none of the routes match
        // NOTE: make sure this route is defined last
        $app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($req, $res) {
            throw new HttpNotFoundException($req);
        });
    }

    /**
     * Registers the routes from the extensions
     *
     * @param array $routeArray
     * @param string|null $extension
     */
    public function registerRoutes(array $routeArray, string $extension = null): void {
        foreach ($routeArray as $route) {
            $route['extension'] = $extension;
            $route['custom']    = $this->isCustomExtension;
            $this->routes[$route['method'].':'.$route['route']] = $route;
        }
    }

    /**
     * Check on function getallheaders! Not all PHP distributions have this function
     * Example: Nginx, PHP-FPM or any other FastCGI method of running PHP
     *
     * @return array|false
     */
    private function getallheaders()
    {
        if (!function_exists('getallheaders')) {
            $headers = [];
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
            return $headers;
        } else {
            return getallheaders();
        }
    }

    /**
     * Registers an extension.
     *
     * @param string $extension
     * @param string $version
     * @param array|null $config
     * @param array $routes
     */
    public function registerExtension(string $extension, string $version, ?array $config = [], array $routes = []): void {
        $this->extensions[$extension] = [
            'version' => $version,
            'config' => $config,
        ];

        if (!empty($routes)) {
            $this->registerRoutes($routes, $extension);
        }
    }

    /**
     * Excludes the given path from authentication.
     *
     * @param $path
     * @deprecated delete this once all the calls to this function are removed
     */
    public function excludeFromAuthentication($path)
    {
    }

    /**
     * Makes a given path accessible only for admins.
     *
     * @param $path
     * @deprecated delete this once all the calls to this function are removed
     */
    public function adminAccessOnly($path) {
    }

    /**
     * Returns all headers converted to lower case.
     *
     * @return array
     */
    private function getHeaders(): array {
        $retHeaders = [];
        $headers = $this->getallheaders();
        foreach ($headers as $key => $value) {
            $retHeaders[strtolower($key)] = $value;
        }
        return $retHeaders;
    }

    /**
     * Authenticates the user based on the headers or post parameters.
     *
     * @throws UnauthorizedException
     */
    public function authenticate() {
        // set SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1 in .htaccessfile

        // get the headers
        $headers = $this->getHeaders();

        $token = null;
        $tokenIssuer = null;
        $user = null;
        $pass = null;

        if (!empty($headers['oauth-token'])) {
            $token = $headers['oauth-token'];
            $tokenIssuer = $headers['oauth-issuer'];
            if(empty($tokenIssuer)) {
                $tokenIssuer="SpiceCRM";
            }
        } elseif (!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW'])) {
            $user = $_SERVER['PHP_AUTH_USER'];
            $pass = $_SERVER['PHP_AUTH_PW'];
        } elseif (!empty($_GET['PHP_AUTH_DIGEST_RAW'])) {
            $auth = explode(':', base64_decode(str_replace('Basic ', '', $_GET['PHP_AUTH_DIGEST_RAW'])));
            $user = $auth[0];
            $pass = $auth[1];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            list($user, $pass) = explode(':', base64_decode(substr($_SERVER['REDIRECT_HTTP_AUTHORIZATION'], 6)));
        }

        /*
         * if we have a user or a token try to authenticate
         * otherwise we continue unauthenticated
         */
        if($user || $token) {
            $authController = AuthenticationController::getInstance();
            $impersonationUser = @SpiceConfig::getInstance()->config['system']['impersonation_enabled'] === true ? $_GET['impersonationuser'] : null;
            return $authController->authenticate($user, $pass, $token, $tokenIssuer, $impersonationUser);
        }
    }

    /**
     * Initialize Error Handling
     * Each thrown Exception is caught here and is available in $exception.
     */
    private function initErrorHandling() {
        $this->app->add(ErrorMiddleware::class);
        $this->app->add(ExceptionMiddleware::class);
        $this->app->addErrorMiddleware(true, true, true);
    }

    /**
     * kind of deprecated... only use outside of slim
     *
     * todo should be moved to some error handler/logger class. if it's even still necessary at all.
     * @param $exception
     * @return string
     */
    public function outputError($exception): string {
        $inDevMode = (isset(SpiceConfig::getInstance()->config['developerMode'])
                    and SpiceConfig::getInstance()->config['developerMode']);

        if (is_object($exception)) {
            if (is_a( $exception, Exception::class)) {
                if ($exception->isFatal()) {
                    LoggerManager::getLogger()->fatal($exception->getMessageToLog() . ' in '
                        . $exception->getFile() . ':' . $exception->getLine() );
                }
                $responseData = $exception->getResponseData();
                if (get_class( $exception ) === Exception::class) {
                    $responseData['line']  = $exception->getLine();
                    $responseData['file']  = $exception->getFile();
                    $responseData['trace'] = $exception->getTrace();
                }
                $httpCode = $exception->getHttpCode();
            } else {
                if ($inDevMode) {
                    $responseData = [
                        'message' => $exception->getMessage(),
                        'line'    => $exception->getLine(),
                        'file'    => $exception->getFile(),
                        'trace'   => $exception->getTrace(),
                    ];
                } else {
                    $responseData['error'] = ['message' => 'Application Error.'];
                }
                $httpCode = $exception->getCode();
            }
        } else {
            LoggerManager::getLogger()->fatal($exception);
            $responseData['error'] = ['message' => $inDevMode ? 'Application Error.' : $exception];
            $httpCode = 500;
        }

        http_response_code($httpCode ? $httpCode : 500);
        $json = json_encode(['error' => $responseData], JSON_PARTIAL_OUTPUT_ON_ERROR);
        if (!$json) {
            echo json_encode(['error' => 'Error while JSON encoding of an exception: '
                . json_last_error_msg() . '... with exception message: ' . $exception->getMessage()]);
        } else {
            echo $json;
        }

        exit;

    }

    /**
     * Generates the swagger definition of the API;
     * @param string $node
     * @param array|null $extensions
     * @param array|null $modules
     * @return string
     */
    public function getSwagger(?array $extensions, ?array $modules, string $node = "/"): string {
        $swaggerGenerator = new SpiceSwaggerGenerator($this->routes, $this->extensions, $extensions, $modules, $node);
        return $swaggerGenerator->generateSwaggerFile();
    }

    /**
     * Initializes the logger middleware. It logs the traffic into the sysapilog table.
     */
    private function initLogging(): void {
        $this->app->add(LoggerMiddleware::class);
    }


    /**
     * Sets general global settings.
     */
    private function initGlobals(): void {
        // some general global settings
        // disable fixup format added to pürevent fixup format in sugarbean .. invalidates float based on user settings
        global $disable_fixup_format;
        $disable_fixup_format = true;

        if (isset(SpiceConfig::getInstance()->config['sessionMaxLifetime'])) {
            ini_set('session.gc_maxlifetime', SpiceConfig::getInstance()->config['sessionMaxLifetime']);
        }

        // handle the error reporting for the REST APOI accoridng to the Config Settings
        if (isset(SpiceConfig::getInstance()->config['krest']['error_reporting'])) {
            error_reporting(SpiceConfig::getInstance()->config['krest']['error_reporting']);
        }

        if (isset(SpiceConfig::getInstance()->config['krest']['display_errors'])) {
            ini_set('display_errors', SpiceConfig::getInstance()->config['krest']['display_errors']);
        }
    }

    /**
     * Add the rate limiter if necessary.
     *
     * @throws ErrorHandlers\TooManyRequestsException
     */
    private function initRateLimiter() {
        // check if the rate Limiter is active
        if (@SpiceConfig::getInstance()->config['krest']['rateLimiting']['active']) {
            $this->app->add(
                function ($request, $next) {
                    RESTRateLimiter::check($request->getMethod());
                    return $next->handle($request);
                }
            );
        }
    }

    /**
     * Initializes extensions and routes.
     * todo in the route definition save an info if a route is custom or core
     */
    private function initExtensions() {
        // check if we have extension in the local path
        $checkRootPaths = ['include', 'modules', 'custom/modules', 'custom/include'];
        foreach ($checkRootPaths as $checkRootPath) {
            $KRestDirHandle = opendir("./$checkRootPath");
            if ($KRestDirHandle) {
                while (($KRestNextDir = readdir($KRestDirHandle)) !== false) {
                    if ($KRestNextDir != '.' && $KRestNextDir != '..' && is_dir("./$checkRootPath/$KRestNextDir")) {

                        $this->initExtensionsInFolder("./$checkRootPath/$KRestNextDir");

//                        $KRestSubDirHandle = opendir("./$checkRootPath/$KRestNextDir/api/extensions");
//                        if ($KRestSubDirHandle) {
//                            while (false !== ($KRestNextFile = readdir($KRestSubDirHandle))) {
//                                if (preg_match('/.php$/', $KRestNextFile)) {
//                                    $this->isCustomExtension = (bool) strpos($checkRootPath, 'custom');
//                                    require_once("./$checkRootPath/$KRestNextDir/api/extensions/$KRestNextFile");
//                                }
//                            }
//                        }
                    }
                }
            }
        }

        $this->initExtensionsInFolder('.');
        $this->initExtensionsInFolder('./custom');
    }

    private function initExtensionsInFolder(string $folderPath) {
        $apiExtensionPath = $folderPath . '/api/extensions';
        $krestExtensionPath = $folderPath . '/KREST/extensions';
        if (file_exists($apiExtensionPath)) {
            $extensionPath = $apiExtensionPath;
        } elseif (file_exists($krestExtensionPath)) {
            $extensionPath = $krestExtensionPath;
        } else {
            return;
        }

        $this->isCustomExtension = (bool) strpos($extensionPath, 'custom');
        $dirHandle = opendir($extensionPath);
        if ($dirHandle) {
            while (false !== ($nextFile = readdir($dirHandle))) {
                if (preg_match('/.php$/', $nextFile)) {
                    require_once ($extensionPath . '/' . $nextFile);
                }
            }
        }
    }

    /**
     * Initializes the routes, by iterating over the $routes array and registering them with the slim app.
     */
    public function initRoutes(): void {
        foreach ($this->routes as $route) {
            if (isset($route['method']) && isset($route['route']) && isset($route['class'])
                && isset($route['function'])) {

                if (isset($route['options']['noAuth']) && $route['options']['noAuth'] == false
                    && AuthenticationController::getInstance()->isAuthenticated()===false) {
                    continue;
                }

                $routeObject = $this->app->{$route['method']}($route['route'], [new $route['class'](), $route['function']]);

                if (isset($route['options']['adminOnly']) && $route['options']['adminOnly'] == true) {
                    $routeObject->add(AdminOnlyAccessMiddleware::class);
                }

                if (isset($route['options']['moduleRoute']) && $route['options']['moduleRoute'] == true) {
                    $routeObject->add(ModuleRouteMiddleware::class);
                }

                if (isset($route['options']['validate']) && $route['options']['validate'] == true) {
                    $routeObject->add(ValidationMiddleware::class);
                }

                if (isset($route['options']['middleware']) && is_array($route['options']['middleware'])) {
                    foreach ($route['options']['middleware'] as $middlewareClass) {
                        if (class_exists($middlewareClass)) {
                            $routeObject->add($middlewareClass);
                        }
                    }
                }

//                $this->app->{$route['method']}($route['route'], [new $route['class'](), $route['function']]);

//                if (isset($route['options']['noAuth']) && $route['options']['noAuth'] == true) {
//                    $this->app->{$route['method']}($route['route'], [new $route['class'](), $route['function']]);
//                } else {
//                    $this->app->{$route['method']}($route['route'], [new $route['class'](), $route['function']])
//                        ->add(RequireAuthenticationMiddleware::class);
//                }
            }
        }
    }


    public function getRoutes(): array {
        return array_values($this->routes);
    }

    public function getRoute($routeIdentifier, $method) {
        $routes = $this->app->getRouteCollector()->getRoutes();

        if (isset($routes[$routeIdentifier])) {
            $routeKey = $method . ':' . $routes[$routeIdentifier]->getPattern();

            $route = $this->routes[$routeKey];

            foreach ($route['parameters'] as $paramName => $paramDefinition) {
                if ($paramDefinition['type'] == 'enum' && is_string($paramDefinition['options'])) {
                    $domainLoader = new SpiceDictionaryDomainLoader();
                    $route['parameters'][$paramName]['options'] = $domainLoader->loadValidationValuesForDomain($paramDefinition['options']);
                }
            }

            return $route;
        }
    }

    /**
     * Performs a check if the given is string is a name of a extension registered in the system.
     *
     * @param string $searchedExtension
     * @return bool
     */
    public function extensionExists(string $searchedExtension): bool {
        foreach ($this->extensions as $extensionName => $extension) {
            if ($extensionName == $searchedExtension) {
                return true;
            }
        }

        return false;
    }
}
