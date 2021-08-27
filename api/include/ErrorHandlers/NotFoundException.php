<?php
namespace SpiceCRM\includes\ErrorHandlers;

class NotFoundException extends Exception {

    protected $isFatal = false;
    protected $lookedFor;
    protected $httpCode = 404;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_NOT_FOUND';
        parent::__construct( isset( $message ) ? $message : 'Not Found', $errorCode );
    }

    protected function extendResponseData() {
        if ( isset( $this->lookedFor )) $this->responseData['lookedFor'] = $this->lookedFor;
    }

    public function setLookedFor( $lookedFor ) {
        $this->lookedFor = $lookedFor;
        return $this;
    }

}
