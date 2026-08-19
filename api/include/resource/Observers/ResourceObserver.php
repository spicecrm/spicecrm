<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\resource\Observers;


/**
 * ResourceObserver.php
 * This class serves as the base class for the notifier/observable pattern used
 * by the resource management framework.
 */
class ResourceObserver
{

    var $module;
    var $limit;

    public function __construct($module)
    {
        $this->module = $module;
    }

    function setLimit($limit) {
        $this->limit = $limit;
    }

    function notify($msg = '') {
        if($this->dieOnError) {
           die($GLOBALS['app_strings']['ERROR_NOTIFY_OVERRIDE']);
        } else {
           echo($GLOBALS['app_strings']['ERROR_NOTIFY_OVERRIDE']);
        }
    }
	
}
