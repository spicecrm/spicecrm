<?php

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCronJobs\SpiceCronJobs;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\UploadStream;
use SpiceCRM\includes\utils\SpiceUtils;
//use SpiceCRM\modules\Administration\Administration;

error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_WARNING & ~E_CORE_WARNING);

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
UploadStream::register();
SpiceModules::getInstance()->loadModules();
//SpiceDictionaryHandler::loadMetaDataDefinitions();
SpiceDictionaryHandler::getInstance()->loadCachedVardefs();
//$system_config = (new Administration())->retrieveSettings();

/**
 * ----- Run the Job Tasks -------
 */
$spiceCronJobs = new SpiceCronJobs();
$spiceCronJobs->runJobs($argv[1]);

if (session_id()) session_destroy();

SpiceUtils::spiceCleanup(true);