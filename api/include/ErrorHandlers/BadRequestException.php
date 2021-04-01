<?php
namespace SpiceCRM\includes\ErrorHandlers;

class BadRequestException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 400;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_BAD_REQUEST';
        parent::__construct( isset( $message ) ? $message : 'Bad Request', $errorCode );
    }

}
