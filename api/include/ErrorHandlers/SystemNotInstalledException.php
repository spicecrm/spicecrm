<?php
namespace SpiceCRM\includes\ErrorHandlers;

/**
 * throws a specific not installed exception with http code 599 which is unassigned and caught with the frontend
 */
class SystemNotInstalledException extends Exception {

    protected $isFatal = true;
    protected $httpCode = 599;

    function __construct( $message = null, $errorCode = null ) {
        parent::__construct( 'system is not installed', $errorCode );
    }

}
