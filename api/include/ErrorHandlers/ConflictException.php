<?php
namespace SpiceCRM\includes\ErrorHandlers;


class ConflictException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 409;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_CONFLICT';
        parent::__construct( isset( $message ) ? $message : 'Conflict', $errorCode );
    }

    protected function extendResponseData() {
        if ( isset( $this->conflicts )) $this->responseData['conflicts'] = $this->conflicts;
    }

    public function setConflicts( $conflicts ) {
        $this->conflicts = $conflicts;
        return $this;
    }

}
