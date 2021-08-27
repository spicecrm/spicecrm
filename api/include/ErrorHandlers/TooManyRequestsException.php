<?php
namespace SpiceCRM\includes\ErrorHandlers;

class TooManyRequestsException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 429;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_TO_MANY_REQUESTS';
        parent::__construct( isset( $message ) ? $message : 'Too Many Requests', $errorCode );
    }

    public function setRetryAfter( $seconds ) {
        $this->setHttpHeader( 'Retry-After', $seconds );
        return $this;
    }

}
