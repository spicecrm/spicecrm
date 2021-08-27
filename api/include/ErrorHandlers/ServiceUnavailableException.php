<?php
namespace SpiceCRM\includes\ErrorHandlers;

class ServiceUnavailableException extends Exception {

    protected $isFatal = true;
    protected $httpCode = 503;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_TO_MANY_REQUESTS';
        parent::__construct( isset( $message ) ? $message : 'Service Unavailable', $errorCode );
    }

}
