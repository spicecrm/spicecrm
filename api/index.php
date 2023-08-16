<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

// require the autoloader
require_once 'vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\DataStreams\StreamFactory;
use SpiceCRM\includes\Middleware\DeveloperMiddleware;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponseFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\authentication\AuthenticationController;

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
    // check that we have a config
    if(!SpiceConfig::getInstance()->configExists()){
        throw new \SpiceCRM\includes\ErrorHandlers\SystemNotInstalledException();
    }

    DBManagerFactory::setDBConfig();

    SpiceConfig::getInstance()->reloadConfig();

    SpiceLanguageManager::setCurrentLanguage();

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

    // add the developer middleware
    $app->add(DeveloperMiddleware::class);

    // load the metadata from the database
    SpiceDictionaryHandler::getInstance()->loadCachedVardefs();

    // authenticate
    AuthenticationController::getInstance()->authenticate();

    // load the data streams
    StreamFactory::initialize();

    // load the modules first
    SpiceModules::getInstance()->loadModules();

    if (!empty(SpiceConfig::getInstance()->config['session_dir'])) {
        session_save_path(SpiceConfig::getInstance()->config['session_dir']);
    }

    // initialize the REST Manager
    $RESTManager->initialize($app);

    // run the request
    $RESTManager->app->run();

} catch (SpiceCRM\includes\ErrorHandlers\Exception $e) {
    $RESTManager->outputError($e);
}
