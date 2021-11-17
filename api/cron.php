<?php

use SpiceCRM\includes\SpiceCronJobs\SpiceCronJobs;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\UploadStream;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Administration\Administration;

error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_WARNING & ~E_CORE_WARNING);

register_shutdown_function(function () {
    SpiceCronJobs::shutdownHandler();
});

require_once 'vendor/autoload.php';
require_once('include/utils.php');
require_once('sugar_version.php');

global $overCLI;
$overCLI = substr(php_sapi_name(), 0, 3) == 'cli';

if (!$overCLI) {
    sugar_die("CLI only.");
}

if (!SpiceConfig::getInstance()->configExists()) {
    sugar_die("No system config found.");
}

date_default_timezone_set('UTC');

/**
 * ------- load initial classes -------
 */
SpiceConfig::getInstance()->loadConfigFromDB();
SpiceDictionaryHandler::loadMetaDataFiles();
UploadStream::register();
SpiceModules::getInstance()->loadModules();
SpiceDictionaryHandler::loadMetaDataDefinitions();
$system_config = (new Administration())->retrieveSettings();

/**
 * ----- Run the Job Tasks -------
 */
$spiceCronJobs = new SpiceCronJobs();
$spiceCronJobs->runJobs($argv[1]);

if (session_id()) session_destroy();

SpiceUtils::spiceCleanup(true);