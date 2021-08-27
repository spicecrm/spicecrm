<?php
namespace SpiceCRM\includes\ErrorHandlers;

class SessionExpiredException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 401;

    /**
     * SessionExpiredException constructor.
     * @param null $message
     * @param null $errorCode
     *
     */
    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_SESSION_EXPIRED';
        parent::__construct( isset( $message ) ? $message : 'Session Expired', $errorCode );
    }

}
