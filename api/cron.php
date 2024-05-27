<?php

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\DataStreams\StreamFactory;
use SpiceCRM\includes\SpiceCronJobs\SpiceCronJobs;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;

error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_WARNING & ~E_CORE_WARNING & ~E_DEPRECATED);

register_shutdown_function(function () {
    SpiceCronJobs::shutdownHandler();
});

require_once 'vendor/autoload.php';

global $overCLI;
$overCLI = substr(php_sapi_name(), 0, 3) == 'cli';

if (!$overCLI) {
    SpiceUtils::sugarDie("CLI only.");
}

if (!SpiceConfig::getInstance()->configExists()) {
    SpiceUtils::sugarDie("No system config found.");
}

DBManagerFactory::setDBConfig();

SpiceConfig::getInstance()->reloadConfig();

date_default_timezone_set('UTC');

/**
 * ------- load initial classes -------
 */
SpiceConfig::getInstance();
SpiceDictionaryHandler::loadMetaDataFiles();
StreamFactory::initialize();
SpiceModules::getInstance()->loadModules();
//SpiceDictionaryHandler::loadMetaDataDefinitions();
// SpiceDictionaryHandler::getInstance()->loadCachedVardefs();
//$system_config = (new Administration())->retrieveSettings();

SpiceLanguageManager::setCurrentLanguage();
/**
 * ----- Run the Job Tasks -------
 */
$spiceCronJobs = new SpiceCronJobs();
$spiceCronJobs->runJobs($argv[1]);

if (session_id()) session_destroy();

SpiceUtils::spiceCleanup(true);