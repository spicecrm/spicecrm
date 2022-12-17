<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\Soap\SpiceSoap;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\UploadStream;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

// ensure error reporting and display_errors is set properly
error_reporting(E_ERROR);
ini_set('display_errors', 0);

$GLOBALS['soapstart'] = microtime(true);

chdir('../..');
require_once 'vendor/autoload.php';

if(!SpiceConfig::getInstance()->configExists()){
    throw new \SpiceCRM\includes\ErrorHandlers\SystemNotInstalledException();
}

DBManagerFactory::setDBConfig();

SpiceConfig::getInstance()->reloadConfig();

// register the upload stream handler
UploadStream::register();

// load the modules first
SpiceModules::getInstance()->loadModules();

// load the vardefs
SpiceDictionaryHandler::loadCachedVardefs();

if (!empty(SpiceConfig::getInstance()->config['session_dir'])) {
    session_save_path(SpiceConfig::getInstance()->config['session_dir']);
}

// start the
$location = '/soap';

$url = SpiceConfig::getInstance()->config['site_url'].$location;
$service = new SpiceSoap($url);
$service->registerClass('\SpiceCRM\includes\Soap\SpiceSoapRegistry');
$service->register();
$service->registerImplClass('\SpiceCRM\includes\Soap\SpiceSoapServiceImpl');

// set the service object in the global scope so that any error, if happens, can be set on this object
global $service_object;
$service_object = $service;

$service->serve();
