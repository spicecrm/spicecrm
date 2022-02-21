<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\resource\Observers;

use SpiceCRM\includes\utils\SpiceUtils;

/**
 * WebResourceObserver.php
 * This is a subclass of ResourceObserver to provide notification handling
 * for web clients.
 */
class WebResourceObserver extends ResourceObserver {

    function __construct($module) {
       parent::__construct($module);
    }

    /**
     * notify
     * Web implementation to notify the browser
     * @param msg String message to possibly display
     *
     */
    public function notify($msg = '') {
       echo $msg;
       SpiceUtils::spiceCleanup(true);
    }
	
}
