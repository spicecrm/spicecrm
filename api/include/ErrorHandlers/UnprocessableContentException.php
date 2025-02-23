<?php
namespace SpiceCRM\includes\ErrorHandlers;

class UnprocessableContentException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 422;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_UNPROCESSABLE_CONTENT';
        parent::__construct( isset( $message ) ? $message : 'unprocessable Content', $errorCode );
    }

}
