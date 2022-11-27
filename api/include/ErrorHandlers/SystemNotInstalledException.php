<?php
namespace SpiceCRM\includes\ErrorHandlers;

/**
 * throws a an exception with http code 503 with error code "crmNotInstalled" which is caught with the frontend
 */
class SystemNotInstalledException extends Exception {

    protected $isFatal = true;
    protected $httpCode = 503;

    function __construct( $message = null, $errorCode = 'crmNotInstalled' ) {
        parent::__construct( 'CRM is not installed yet.', $errorCode );
    }

}
