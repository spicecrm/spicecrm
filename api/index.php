<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

// require the autoloader
require_once 'vendor/autoload.php';

use Fig\Http\Message\StatusCodeInterface;
use Slim\Factory\AppFactory;
use DI\Container;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\UploadStream;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponseFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Administration\Administration;
use SpiceCRM\modules\SpiceACL\SpiceACL;

require_once('include/utils.php');
require_once('sugar_version.php'); // provides $sugar_version, $sugar_db_version

register_shutdown_function([SpiceUtils::class, 'spiceCleanup']);

//set some basic php settings ensure they are proper if not set in the php.ini as it shoudl have been
error_reporting(E_ERROR);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('session.use_cookies', '0');
date_default_timezone_set('UTC');

// header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Content-Type: application/json');


$RESTManager = SpiceCRM\includes\RESTManager::getInstance();

try {
    $slimContainer = new Container();
    AppFactory::setContainer($slimContainer);
    $app = AppFactory::create(new SpiceResponseFactory());

    $app->addBodyParsingMiddleware();
    $app->mode = 'production';

    //determine base path
    $appBasePath = \SpiceCRM\includes\utils\SpiceUtils::determineAppBasePath();
    if ($appBasePath !== null) {
        $app->setBasePath($appBasePath);
    } else {
        throw new \Exception("Unable to determine App Base Path");
    }

    if (SpiceConfig::getInstance()->configExists()) {

        //enable error output when in developer mode
        if (SpiceConfig::getInstance()->config['developerMode'] == true) {
            ini_set('display_errors', 1);
        }
        SpiceConfig::getInstance()->loadConfigFromDB();

        // load the core dictionary files
        SpiceDictionaryHandler::loadMetaDataFiles();

        $GLOBALS['timedate'] = TimeDate::getInstance();
        $RESTManager->authenticate();

        // register the upload stream handler
        UploadStream::register();

        // load the modules first
        SpiceModules::getInstance()->loadModules();

        // load the metadata from the database
        SpiceDictionaryHandler::loadMetaDataDefinitions();

        if (!empty(SpiceConfig::getInstance()->config['session_dir'])) {
            session_save_path(SpiceConfig::getInstance()->config['session_dir']);
        }



        $system_config = new Administration();
        $system_config->retrieveSettings();


        $RESTManager->initialize($app);

        // run the request
        $RESTManager->app->run();

        // cleanup
        AuthenticationController::getInstance()->cleanup();
    } else {
        $RESTManager->app=$app;
        $app->addRoutingMiddleware();
        //no config, fire spiceinstaller
        require "include/SpiceInstaller/REST/extensions/spiceinstaller.php";

        $errorHandler = function (
            \Psr\Http\Message\ServerRequestInterface $request,
            \Throwable $exception,
            bool $displayErrorDetails,
            bool $logErrors,
            bool $logErrorDetails
        ) use ($app) {
            $response = $app->getResponseFactory()->createResponse();

            if ($exception instanceof \Slim\Exception\HttpNotFoundException) {
                $message = 'not found';
                $code = 404;
            } elseif ($exception instanceof \Slim\Exception\HttpMethodNotAllowedException) {
                $message = 'not allowed';
                $code = 403;
            } else {
                $message = $exception->getMessage();
                $code = $exception->getCode();
                if (!is_integer($code) || $code < StatusCodeInterface::STATUS_CONTINUE || $code > 599) {
                    $code = 500;
                }
            }

            $response->withHeader('Content-Type', 'text/plain');
            $response->getBody()->write($message);
            return $response->withStatus($code);
        };


//        $app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($req) {
//            $handler = $this->notFoundHandler; // handle using the default Slim page not found handler
//            return $handler->handle($req);
//        });

        $errorMiddleware = $app->addErrorMiddleware(true, true, true);
        $errorMiddleware->setDefaultErrorHandler($errorHandler);
        $RESTManager->initRoutes();
        $app->run();
        die();
    }
} catch (Exception $e) {
    $RESTManager->outputError($e);
}
